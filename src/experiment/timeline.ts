import type { JsPsych } from "jspsych";
import {
  makeWelcome,
  makeInformedConsentOne,
  makeInformedConsentTwo,
  makeConsentAndScreening,
  makeStudyInstruction,
  makeDemographicsSurvey,
  makeQuestionnaireIntro,
  makePmQuestionnaire,
  makeVideoIntro,
  makeVideoTrial,
  makeManipulationCheck,
  makeMemoryRecall,
  makeVignetteIntro,
  makeNegligenceDefinition,
  buildVignetteTimeline,
  makeDebriefing,
  makeScreenOutMessage,
} from "../trials/experimentFlow";
import { experimentConfig } from "./config";
import { getVideoConditionLabel, pickVideoCondition } from "./conditions";

export type Timeline = Parameters<JsPsych["run"]>[0];
export const devMode = true; // Set true to bypass required inputs while testing.

export function buildTimeline(_jsPsych: JsPsych): Timeline {
  const timeline: Timeline = [];

  const videoCondition = pickVideoCondition();
  _jsPsych.data.addProperties({
    video_condition: videoCondition,
    condition_group: getVideoConditionLabel(videoCondition),
  });

  const welcome = makeWelcome();
  const informedConsentOne = makeInformedConsentOne();
  const informedConsentTwo = makeInformedConsentTwo();
  const consent = makeConsentAndScreening({ devMode });
  const screenOut = makeScreenOutMessage();

  const mainFlow: Timeline = [
    makeDemographicsSurvey({ devMode }),
    makeQuestionnaireIntro(),
    makePmQuestionnaire({ devMode }),
    makeVideoIntro(videoCondition),
    makeVideoTrial(videoCondition),
    makeManipulationCheck(videoCondition, { devMode }),
    ...(videoCondition === "neutral"
      ? []
      : [makeMemoryRecall(videoCondition, { devMode })]),
    makeVignetteIntro(),
    ...buildVignetteTimeline({ devMode}),
    makeDebriefing(),
  ];

  const wasScreenedOut = () =>
    devMode
      ? false
      : _jsPsych.data.get().select("screen_failed").values.includes(true);

  timeline.push(welcome);
  timeline.push(informedConsentOne);
  timeline.push(informedConsentTwo);
  timeline.push(consent);

  timeline.push({
    timeline: [screenOut],
    conditional_function: () => wasScreenedOut(),
  });

  timeline.push({
    timeline: mainFlow,
    conditional_function: () => !wasScreenedOut(),
  });

  if (experimentConfig.debug) {
    console.debug("[jsPsych] Timeline length", timeline.length);
  }

  return timeline;
}
