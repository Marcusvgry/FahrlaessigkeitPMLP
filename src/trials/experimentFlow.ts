import surveyPlugin from "@jspsych/plugin-survey";
import jsPsychHtmlButtonResponse from "@jspsych/plugin-html-button-response";
import jsPsychSurveyLikert from "@jspsych/plugin-survey-likert";
import jsPsychHtmlSliderResponse from "@jspsych/plugin-html-slider-response";
import { instructionTexts } from "./instructionTexts";
import {
  demographicPagesOne,
  MPMI_ITEMS,
  MANIPULATION_CHECK_ITEMS,
  MANIPULATION_CHECK_PROMPT,
  VIGNETTE_INTRO_HTML,
  NEGLIGENCE_ITEMS,
  LIKERT_LABELS_1_TO_7,
  LIKERT_LABELS_1_TO_5,
  NEGLIGENCE_SLIDER_PROMPT_HTML,
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

const VIGNETTE_SAMPLE_SIZE = 2;
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
  pilotStudy?: boolean;
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
      <video controls style="width: 100%; max-width: 800px;">
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
  const { devMode = false, pilotStudy = false } = options;
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
    const justificationId = "pilot-justification";
    const justificationHtml = pilotStudy
      ? `
        <div class="pilot-justification" style="margin-top: 1rem;">
          <p>Bitte begründen Sie ihre Entscheidung in wenigen Worten:</p>
          <textarea id="${justificationId}" rows="3" style="width: 100%;"></textarea>
        </div>
      `
      : "";
    const requireMovement = !devMode;

    const questions = NEGLIGENCE_ITEMS.map((statement) => ({
      prompt: `<p style="margin-top: 1rem;">${statement}</p>`,
      labels: LIKERT_LABELS_1_TO_7,
      required: !devMode,
    }));

    let justificationText = "";

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

    // Zweite Seite: Likert-Bewertung UND Slider auf derselben Seite
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

    const sliderHtml = `
      <div style="margin-top: 1rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span>0 (gar nicht fahrlässig)</span>
          <span>100 (sehr fahrlässig)</span>
        </div>
        <style>
          #negligence-slider {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 8px;
            background: #d3d3d3;
            border-radius: 4px;
            outline: none;
            cursor: pointer;
            position: relative;
            z-index: 10;
            touch-action: none;
          }
          #negligence-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px;
            height: 24px;
            background: #444;
            border-radius: 50%;
            cursor: grab;
            position: relative;
            z-index: 11;
          }
          #negligence-slider::-webkit-slider-thumb:active {
            cursor: grabbing;
          }
          #negligence-slider::-moz-range-thumb {
            width: 24px;
            height: 24px;
            background: #444;
            border-radius: 50%;
            cursor: grab;
            border: none;
          }
          #negligence-slider::-moz-range-thumb:active {
            cursor: grabbing;
          }
          .slider-container {
            position: relative;
            padding: 10px 0;
          }
        </style>
        <div class="slider-container">
          <input type="range" id="negligence-slider" name="negligence_slider" min="0" max="100" value="50" oninput="document.getElementById('slider-value').textContent = this.value">
        </div>
        <div style="text-align: center; margin-top: 0.5rem;">
          <strong><span id="slider-value">50</span></strong>
        </div>
      </div>
    `;

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
              html: NEGLIGENCE_SLIDER_PROMPT_HTML + sliderHtml,
            },
          ],
        },
      ],
    };

    // Eindeutiger Key für diesen Slider, um den Wert in window zu speichern
    // (Closures funktionieren nicht zuverlässig zwischen on_load und on_finish)
    const vignetteId = item.vignette.id;
    const sliderKey = `slider_value_${vignetteId}`;
    (window as any)[sliderKey] = 50; // Default-Wert

    timeline.push({
      type: surveyPlugin,
      survey_json: surveyJson,
      on_load: function () {
        // Key hier nochmal definieren, um Closure-Probleme zu vermeiden
        const currentKey = `slider_value_${vignetteId}`;

        const checkSlider = setInterval(() => {
          const slider = document.getElementById(
            "negligence-slider",
          ) as HTMLInputElement;

          if (slider) {
            clearInterval(checkSlider);

            // Initialen Wert sofort speichern
            (window as any)[currentKey] = parseInt(slider.value, 10);

            // Bei jeder Änderung in window speichern
            const updateSliderValue = () => {
              (window as any)[currentKey] = parseInt(slider.value, 10);
              console.log(
                `Slider ${currentKey} updated to:`,
                (window as any)[currentKey],
              );
            };

            slider.addEventListener("input", updateSliderValue);
            slider.addEventListener("change", updateSliderValue);
            slider.addEventListener("mouseup", updateSliderValue);
            slider.addEventListener("touchend", updateSliderValue);
          }
        }, 100);
      },
      on_finish: function (data: any) {
        // Key hier nochmal definieren, um Closure-Probleme zu vermeiden
        const currentKey = `slider_value_${vignetteId}`;
        // Aus window lesen - das überlebt das DOM-Entfernen
        const sliderValue = (window as any)[currentKey];
        console.log(`on_finish reading ${currentKey}:`, sliderValue);
        data.negligence_slider = sliderValue;
        // Aufräumen um Memory Leaks zu vermeiden
        delete (window as any)[currentKey];
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
