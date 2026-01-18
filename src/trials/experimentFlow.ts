import surveyPlugin from "@jspsych/plugin-survey";
import jsPsychHtmlButtonResponse from "@jspsych/plugin-html-button-response";
import { instructionTexts } from "./instructionTexts";
import {
  demographicPagesOne,
  MPMI_ITEMS,
  MANIPULATION_CHECK_ITEMS,
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

const VIGNETTE_SAMPLE_SIZE = 15;
const DEFAULT_VIGNETTE_CONDITION: Condition = {
  offloading: "no",
  consequences: "high",
};

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

function buildVideoHtml(condition: VideoCondition): string {
  const { label, src } = VIDEO_PLACEHOLDERS[condition];
  return `
    <div class="instructions">
      <video controls style="width: 100%; max-width: 1200px;">
        <source src="${src}" type="video/mp4" />
        <p>Ihr Browser unterstützt die Videowiedergabe nicht.</p>
      </video>
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

export function makeVideoTrial(condition: VideoCondition) {
  return {
    type: jsPsychHtmlButtonResponse,
    css_classes: "instruction-screen",
    data: { block: "video", video_condition: condition },
    stimulus: buildVideoHtml(condition),
    choices: ["Weiter"],
  };
}

export function makeManipulationCheck(
  condition: VideoCondition,
  options: FlowOptions = {},
) {
  const { devMode = false } = options;
  const elements =
    condition === "neutral"
      ? [
          {
            type: "html",
            name: "manipulation_check_placeholder",
            html: `<div class="instructions"><p>Platzhalter.</p></div>`,
          },
        ]
      : [
          {
            type: "checkbox",
            name: "manipulation_check",
            title: MANIPULATION_CHECK_PROMPT,
            choices: MANIPULATION_CHECK_ITEMS,
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

export function makeNegligenceDefinition() {
  return {
    type: jsPsychHtmlButtonResponse,
    css_classes: "instruction-screen",
    data: { block: "negligence_definition" },
    stimulus: instructionTexts.negligenceDefinition,
    choices: ["Weiter"],
  };
}

export function buildVignetteTimeline(options: FlowOptions = {}) {
  const { devMode = false } = options;
  const randomized = shuffle(vignetteTemplates);
  const selected = randomized.slice(0, VIGNETTE_SAMPLE_SIZE);
  const paired = selected.map((v) => ({
    vignette: v,
    cond: DEFAULT_VIGNETTE_CONDITION,
  }));

  const timeline: any[] = [];

  for (const item of paired) {
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

export function makeDebriefing() {
  return {
    type: jsPsychHtmlButtonResponse,
    css_classes: "instruction-screen",
    data: { block: "debriefing" },
    stimulus: instructionTexts.debriefing,
    choices: ["Weiter zu Prolific"],
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
