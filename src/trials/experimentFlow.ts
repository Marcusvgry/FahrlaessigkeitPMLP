import surveyPlugin from "@jspsych/plugin-survey";
import jsPsychHtmlButtonResponse from "@jspsych/plugin-html-button-response";
import jsPsychVideoButtonResponse from "@jspsych/plugin-video-button-response";
import type { JsPsych } from "jspsych";
import { instructionTexts } from "./instructionTexts";
import {
  demographicPagesOne,
  MPMI_ITEMS,
  MANIPULATION_CHECK_CORRECT_ANSWERS,
  MANIPULATION_CHECK_ITEMS_AB,
  MANIPULATION_CHECK_ITEMS_C,
  MANIPULATION_CHECK_PROMPT,
  VIGNETTE_INTRO_HTML,
  NEGLIGENCE_ITEMS,
  NEGLIGENCE_SLIDER_PROMPT_HTML,
  NEGLIGENCE_SLIDER_HTML,
} from "./questionnaires";
import { shuffle } from "../experiment/conditions";
import type { Condition, VideoCondition } from "../experiment/conditions";
import {
  renderVignetteText,
  wrapStimulusHtml,
} from "../stimuli/vignetteRenderer";
import { vignetteTemplates } from "../stimuli/vignettes";

const surveyDefaults = {
  showQuestionNumbers: false,
  pageNextText: "Weiter",
  pagePrevText: "Zurück",
  completeText: "Weiter",
};

/**
 * Feste Vignettenauswahl der Studie: sechs Vignetten, alle ohne Offloading,
 * je dreimal niedrige und dreimal hohe Konsequenz. `templateId` verweist auf die
 * Nummerierung im ursprünglichen Vignettendokument, `number` auf die Nummerierung
 * eins bis sechs der finalen Auswahl. Die Reihenfolge in dieser Liste ist nur die
 * Referenzreihenfolge; dargeboten wird pro Teilnehmenden eine zufällige Permutation.
 */
const STUDY_VIGNETTES: {
  number: number;
  templateId: number;
  cond: Condition;
}[] = [
  { number: 1, templateId: 3, cond: { offloading: "no", consequences: "high" } },
  { number: 2, templateId: 7, cond: { offloading: "no", consequences: "low" } },
  { number: 3, templateId: 12, cond: { offloading: "no", consequences: "low" } },
  {
    number: 4,
    templateId: 13,
    cond: { offloading: "no", consequences: "high" },
  },
  {
    number: 5,
    templateId: 23,
    cond: { offloading: "no", consequences: "high" },
  },
  { number: 6, templateId: 30, cond: { offloading: "no", consequences: "low" } },
];

const VIDEO_PLACEHOLDERS: Record<
  VideoCondition,
  { label: string; src: string }
> = {
  reliability: {
    label: "Video zur Zuverlässigkeit (Platzhalter)",
    src: "videos/pm-zuverlaessigkeit.mp4",
  },
  fallibility: {
    label: "Video zur Fehleranfälligkeit (Platzhalter)",
    src: "videos/pm-fehleranfaelligkeit.mp4",
  },
  neutral: {
    label: "Neutrales Video (Platzhalter)",
    src: "videos/neutral.mp4",
  },
};

type FlowOptions = {
  devMode?: boolean;
};

type SurveyElement = {
  isRequired?: boolean;
  validators?: unknown;
  minSelectedChoices?: number;
  elements?: SurveyElement[];
  [key: string]: any;
};

type SurveyPage = {
  elements?: SurveyElement[];
  [key: string]: any;
};

function relaxSurveyElement(element: SurveyElement): SurveyElement {
  const relaxed: SurveyElement = { ...element };

  if ("isRequired" in relaxed) {
    relaxed.isRequired = false;
  }
  if ("validators" in relaxed) {
    delete relaxed.validators;
  }
  if ("minSelectedChoices" in relaxed) {
    delete relaxed.minSelectedChoices;
  }
  if (Array.isArray(relaxed.elements)) {
    relaxed.elements = relaxed.elements.map(relaxSurveyElement);
  }

  return relaxed;
}

function relaxSurveyPages(pages: SurveyPage[]): SurveyPage[] {
  return pages.map((page) => ({
    ...page,
    elements: page.elements?.map(relaxSurveyElement),
  }));
}

function hasExactSelections(
  actualSelections: unknown,
  expectedSelections: readonly string[],
): boolean {
  if (!Array.isArray(actualSelections)) {
    return false;
  }

  if (actualSelections.length !== expectedSelections.length) {
    return false;
  }

  const selectedValues = new Set(
    actualSelections.filter(
      (value): value is string => typeof value === "string",
    ),
  );

  return (
    selectedValues.size === expectedSelections.length &&
    expectedSelections.every((value) => selectedValues.has(value))
  );
}

/** Ersetzt im devMode das Video, das lokal noch nicht vorliegt. */
function buildVideoPlaceholderHtml(condition: VideoCondition): string {
  const { label, src } = VIDEO_PLACEHOLDERS[condition];
  return `
    <div class="instructions">
      <div style="border: 2px dashed #999; border-radius: 8px; padding: 4rem 1.5rem; max-width: 1200px; margin: 0 auto; text-align: center;">
        <p style="margin-top: 0;"><strong>Platzhalter statt Video (nur im devMode)</strong></p>
        <p>${label}</p>
        <p style="color: #666;"><code>${src}</code></p>
      </div>
    </div>
  `;
}

export function makeWelcome() {
  return {
    type: jsPsychHtmlButtonResponse,
    css_classes: "instruction-screen",
    data: { trial_tag: "welcome" },
    stimulus: instructionTexts.instruction,
    choices: ["Weiter"],
  };
}

export function makeInformedConsentOne() {
  return {
    type: jsPsychHtmlButtonResponse,
    css_classes: "instruction-screen",
    data: { trial_tag: "informed_consent_one" },
    stimulus: instructionTexts.informedConsentOne,
    choices: ["Weiter"],
  };
}

export function makeInformedConsentTwo() {
  return {
    type: jsPsychHtmlButtonResponse,
    css_classes: "instruction-screen",
    data: { trial_tag: "informed_consent_two" },
    stimulus: instructionTexts.informedConsentTwo,
    choices: ["Weiter"],
  };
}

export function makeConsentAndScreening(options: FlowOptions = {}) {
  const { devMode = false } = options;
  const surveyJson = {
    ...surveyDefaults,
    showTitle: false,
    pages: [
      {
        name: "consent_checkboxes",
        elements: [
          {
            type: "radiogroup",
            name: "juristicalBackground",
            title:
              "Haben Sie eine juristische Ausbildung oder berufliche Tätigkeit im juristischen Bereich (z.B. Studium der Rechtswissenschaften, Tätigkeit bei Gericht, Staatsanwaltschaft, Polizei)?",
            choices: ["Ja", "Nein"],
            isRequired: true,
            colCount: 0,
          },
          {
            type: "checkbox",
            name: "consent_statements",
            title: "    ",
            isRequired: true,
            minSelectedChoices: 3,
            colCount: 1,
            validators: [
              {
                type: "answercount",
                minCount: 3,
                text: "Bitte alle drei Aussagen bestätigen.",
              },
            ],
            choices: [
              "Ich bin mindestens 18 Jahre alt, habe die Informationen zur Studienteilnahme und zum Datenschutz aufmerksam gelesen und willige bezüglich der Teilnahme an der Studie und der damit verbundenen Datenverarbeitung und anonymisierten Datenweitergabe zu wissenschaftlichen Zwecken ein.",
              "Ich bin schriftlich über den Zweck, den Ablauf des Forschungsprojekts, mögliche Vor- und Nachteile sowie mögliche Risiken informiert worden.",
              "Ich wurde darüber aufgeklärt, dass meine Teilnahme freiwillig ist und jederzeit widerrufen werden kann.",
            ],
          },
        ],
      },
    ],
  };

  const survey_json = devMode
    ? { ...surveyJson, pages: relaxSurveyPages(surveyJson.pages) }
    : surveyJson;

  return {
    type: surveyPlugin,
    data: { trial_tag: "consent_screening" },
    survey_json,
    on_finish: (data: any) => {
      if (devMode) {
        data.screen_failed = false;
        return;
      }

      const response = (data.response ?? data.responses ?? {}) as Record<
        string,
        unknown
      >;
      const jur = response.juristicalBackground;
      const hasLawBackground = jur === "Ja";
      const consentChoices =
        (response.consent_statements as string[] | undefined) ?? [];
      const consentGiven = consentChoices.length === 3;
      data.screen_failed = hasLawBackground || !consentGiven;
    },
  };
}

export function makeDemographicsSurvey(options: FlowOptions = {}) {
  const { devMode = false } = options;
  const surveyJson = {
    showQuestionNumbers: false,
    title: "Demografische Daten",
    completeText: "Weiter",
    pageNextText: "Weiter",
    pagePrevText: "Zurück",
    pages: [...demographicPagesOne],
  };
  const survey_json = devMode
    ? { ...surveyJson, pages: relaxSurveyPages(surveyJson.pages) }
    : surveyJson;

  return {
    type: surveyPlugin,
    data: { block: "demographics" },
    survey_json,
  };
}

export function makeStudyInstruction() {
  return {
    type: jsPsychHtmlButtonResponse,
    css_classes: "instruction-screen",
    data: { block: "instructions" },
    stimulus: instructionTexts.instructionsStudy,
    choices: ["Weiter"],
  };
}

export function makeQuestionnaireIntro() {
  return {
    type: jsPsychHtmlButtonResponse,
    css_classes: "instruction-screen",
    data: { block: "questionnaire_intro" },
    stimulus: instructionTexts.questionnaireIntro,
    choices: ["Weiter"],
  };
}

export function makePmQuestionnaire(options: FlowOptions = {}) {
  const { devMode = false } = options;
  const ratingElements = MPMI_ITEMS.map((statement, index) => ({
    type: "rating",
    name: `mpmi_${index}`,
    title: statement,
    rateValues: [
      { value: 1, text: "sehr selten" },
      { value: 2, text: "eher selten" },
      { value: 3, text: "gelegentlich" },
      { value: 4, text: "eher oft" },
      { value: 5, text: "sehr oft" },
    ],
    isRequired: !devMode,
  }));

  return {
    type: surveyPlugin,
    css_classes: "mpmi-centered",
    survey_json: {
      ...surveyDefaults,
      showTitle: false,
      pages: [
        {
          name: "mpmi_page",
          elements: ratingElements,
        },
      ],
    },
    data: { block: "mpmi" },
  };
}

export function makeVideoIntro(condition: VideoCondition) {
  const introHtml =
    condition === "neutral"
      ? instructionTexts.videoIntroC
      : instructionTexts.videoIntroAB;
  return {
    type: jsPsychHtmlButtonResponse,
    css_classes: "instruction-screen",
    data: { block: "video_intro", video_condition: condition },
    stimulus: introHtml,
    choices: ["Weiter"],
  };
}

export function makeVideoTrial(
  condition: VideoCondition,
  options: FlowOptions = {},
) {
  const { devMode = false } = options;
  const { src } = VIDEO_PLACEHOLDERS[condition];

  // Die Videodateien werden erst beim Deployment ergänzt. Auf dem Dev-Server
  // würde der Video-Trial deshalb auf ein Video warten, das nie lädt.
  // import.meta.env.DEV ist im Produktions-Build immer false.
  if (devMode || import.meta.env.DEV) {
    return {
      type: jsPsychHtmlButtonResponse,
      css_classes: "instruction-screen",
      data: { block: "video", video_condition: condition, video_skipped: true },
      stimulus: buildVideoPlaceholderHtml(condition),
      choices: ["Weiter"],
    };
  }

  return {
    type: jsPsychVideoButtonResponse,
    css_classes: "instruction-screen",
    data: { block: "video", video_condition: condition },
    stimulus: [src],
    choices: ["Weiter"],
    controls: true,
    response_allowed_while_playing: false,
  };
}

export function makeManipulationCheck(
  jsPsych: JsPsych,
  condition: VideoCondition,
  options: FlowOptions = {},
) {
  const { devMode = false } = options;
  const choices =
    condition === "neutral"
      ? MANIPULATION_CHECK_ITEMS_C
      : MANIPULATION_CHECK_ITEMS_AB;
  const expectedSelections = MANIPULATION_CHECK_CORRECT_ANSWERS[condition];
  const elements = [
    {
      type: "checkbox",
      name: "manipulation_check",
      title: MANIPULATION_CHECK_PROMPT,
      choices,
      isRequired: !devMode,
      colCount: 1,
    },
  ];

  const surveyJson = {
    ...surveyDefaults,
    showTitle: false,
    pages: [
      {
        name: "manipulation_check",
        elements,
      },
    ],
  };

  const survey_json = devMode
    ? { ...surveyJson, pages: relaxSurveyPages(surveyJson.pages) }
    : surveyJson;

  return {
    type: surveyPlugin,
    data: { block: "manipulation_check", video_condition: condition },
    survey_json,
    on_finish: (data: any) => {
      const response = (data.response ?? data.responses ?? {}) as Record<
        string,
        unknown
      >;
      const passed = hasExactSelections(
        response.manipulation_check,
        expectedSelections,
      );

      data.manipulation_check_passed = passed;
      jsPsych.data.addProperties({ manipulation_check_passed: passed });
    },
  };
}

export function makeMemoryRecall(
  condition: VideoCondition,
  options: FlowOptions = {},
) {
  const { devMode = false } = options;
  const introHtml =
    condition === "reliability"
      ? instructionTexts.memoryIntroSuccess
      : instructionTexts.memoryIntroFailure;

  const surveyJson = {
    ...surveyDefaults,
    showTitle: false,
    pages: [
      {
        name: "memory_recall",
        elements: [
          {
            type: "html",
            name: "memory_intro",
            html: introHtml,
          },
          {
            type: "comment",
            name: "memory_example_1",
            title: "Beispiel 1",
            isRequired: !devMode,
            rows: 3,
          },
          {
            type: "comment",
            name: "memory_example_2",
            title: "Beispiel 2",
            isRequired: !devMode,
            rows: 3,
          },
          {
            type: "comment",
            name: "memory_example_3",
            title: "Beispiel 3",
            isRequired: !devMode,
            rows: 3,
          },
        ],
      },
    ],
  };

  const survey_json = devMode
    ? { ...surveyJson, pages: relaxSurveyPages(surveyJson.pages) }
    : surveyJson;

  return {
    type: surveyPlugin,
    data: { block: "memory_recall", video_condition: condition },
    survey_json,
  };
}

export function makeVignetteIntro() {
  return {
    type: jsPsychHtmlButtonResponse,
    css_classes: "instruction-screen",
    data: { block: "vignette_intro" },
    stimulus: instructionTexts.vignetteIntro,
    choices: ["Weiter"],
  };
}

export function makeNegligenceDefinition(options: FlowOptions = {}) {
  const { devMode = false } = options;
  const confirmationText =
    "Ich versichere, die Instruktionen und die Definition von Fahrlässigkeit aufmerksam gelesen zu haben.";

  const surveyJson = {
    ...surveyDefaults,
    showTitle: false,
    pages: [
      {
        name: "negligence_definition",
        elements: [
          {
            type: "html",
            name: "negligence_definition_text",
            html: instructionTexts.negligenceDefinition,
          },
          {
            type: "checkbox",
            name: "negligence_definition_confirmation",
            title: " ",
            isRequired: !devMode,
            minSelectedChoices: 1,
            colCount: 1,
            validators: [
              {
                type: "answercount",
                minCount: 1,
                text: "Bitte bestätigen Sie, dass Sie die Definition aufmerksam gelesen haben.",
              },
            ],
            choices: [confirmationText],
          },
        ],
      },
    ],
  };

  const survey_json = devMode
    ? { ...surveyJson, pages: relaxSurveyPages(surveyJson.pages) }
    : surveyJson;

  return {
    type: surveyPlugin,
    css_classes: "instruction-screen",
    data: { block: "negligence_definition" },
    survey_json,
    on_finish: (data: any) => {
      const response = (data.response ?? data.responses ?? {}) as Record<
        string,
        unknown
      >;
      const selections =
        (response.negligence_definition_confirmation as string[] | undefined) ??
        [];
      data.definition_confirmed = selections.includes(confirmationText);
    },
  };
}

export function buildVignetteTimeline(options: FlowOptions = {}) {
  const { devMode = false } = options;
  const templatesById = new Map(vignetteTemplates.map((v) => [v.id, v]));

  const paired = shuffle(
    STUDY_VIGNETTES.map(({ number, templateId, cond }) => {
      const vignette = templatesById.get(templateId);
      if (!vignette) {
        throw new Error(
          `Vignette mit der Template-ID ${templateId} existiert nicht in vignetteTemplates.`,
        );
      }
      return { vignetteNumber: number, vignette, cond };
    }),
  );

  const timeline: any[] = [];

  for (const [index, item] of paired.entries()) {
    const position = index + 1;
    const text = renderVignetteText(item.vignette, item.cond);
    const stim = wrapStimulusHtml(text);

    // Erste Seite: Nur die Vignette anzeigen
    timeline.push({
      type: jsPsychHtmlButtonResponse,
      css_classes: "instruction-screen",
      stimulus: stim,
      choices: ["Weiter zur Bewertung"],
      data: {
        vignette_id: item.vignette.id,
        vignette_number: item.vignetteNumber,
        position,
        domain: item.vignette.domain,
        offloading: item.cond.offloading,
        consequences: item.cond.consequences,
        version: `${item.cond.offloading}_${item.cond.consequences}`,
        measure: "vignette_display",
      },
    });

    // Zweite Seite: Likert-Bewertung UND Slider
    const likertElements = NEGLIGENCE_ITEMS.map((statement, index) => ({
      type: "rating",
      name: `likert_${index}`,
      title: statement,
      rateMin: 1,
      rateMax: 7,
      minRateDescription: "trifft überhaupt nicht zu",
      maxRateDescription: "trifft vollständig zu",
      isRequired: !devMode,
    }));

    const surveyJson = {
      ...surveyDefaults,
      showTitle: false,
      pages: [
        {
          name: "vignette_rating",
          elements: [
            {
              type: "html",
              name: "likert_intro",
              html: VIGNETTE_INTRO_HTML,
            },
            ...likertElements,
            {
              type: "html",
              name: "slider_section",
              html: NEGLIGENCE_SLIDER_PROMPT_HTML + NEGLIGENCE_SLIDER_HTML,
            },
          ],
        },
      ],
    };

    const vignetteId = item.vignette.id;
    const sliderKey = `slider_value_${vignetteId}`;
    (window as any)[sliderKey] = 50; // Default-Wert initialisieren

    timeline.push({
      type: surveyPlugin,
      survey_json: surveyJson,
      on_load: () => {
        const checkSlider = setInterval(() => {
          const slider = document.getElementById(
            "negligence-slider",
          ) as HTMLInputElement;
          const completeButton = document.querySelector(
            ".sd-btn--action.sd-navigation__complete-btn",
          ) as HTMLButtonElement;

          if (slider) {
            clearInterval(checkSlider);

            // Wert bei jeder Änderung speichern
            const updateSliderValue = () => {
              (window as any)[sliderKey] = parseInt(slider.value, 10);
            };
            slider.addEventListener("input", updateSliderValue);
            slider.addEventListener("change", updateSliderValue);
            slider.addEventListener("mouseup", updateSliderValue);
            slider.addEventListener("touchend", updateSliderValue);

            // Button erst aktivieren wenn Slider bewegt wurde (außer im devMode)
            if (completeButton && !devMode) {
              completeButton.disabled = true;

              const markSliderMoved = () => {
                completeButton.disabled = false;
              };

              slider.addEventListener("mousedown", markSliderMoved);
              slider.addEventListener("touchstart", markSliderMoved);
              slider.addEventListener("change", markSliderMoved);
            }
          }
        }, 100);
      },
      on_finish: (data: any) => {
        // Wert aus window lesen (überlebt DOM-Entfernung)
        const finalValue = (window as any)[sliderKey];
        data.response.negligence_slider = finalValue;
        delete (window as any)[sliderKey]; // Aufräumen
      },
      data: {
        vignette_id: item.vignette.id,
        vignette_number: item.vignetteNumber,
        position,
        domain: item.vignette.domain,
        offloading: item.cond.offloading,
        consequences: item.cond.consequences,
        version: `${item.cond.offloading}_${item.cond.consequences}`,
        measure: "combined_rating",
      },
    });
  }

  return timeline;
}

export function makeDebriefing(condition: VideoCondition) {
  const stimulus =
    condition === "neutral"
      ? instructionTexts.debriefingC
      : instructionTexts.debriefingAB;

  return {
    type: jsPsychHtmlButtonResponse,
    css_classes: "instruction-screen",
    data: { block: "debriefing" },
    stimulus,
    choices: ["Studie abschließen"],
  };
}

export function makeScreenOutMessage() {
  return {
    type: jsPsychHtmlButtonResponse,
    css_classes: "instruction-screen",
    data: { block: "screen_out" },
    stimulus:
      '<div class="instructions"><p>Vielen Dank f\u00fcr Ihr Interesse. Leider k\u00f6nnen Sie an dieser Studie nicht teilnehmen, da Sie juristische Vorkenntnisse besitzen.</p></div>',
    choices: ["Schlie\u00dfen"],
  };
}
