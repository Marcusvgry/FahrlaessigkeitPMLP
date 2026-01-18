export const demographicPagesOne = [
  {
    name: "page1",
    title: "Demografische Daten",
    description: "",
    elements: [
      {
        type: "text",
        title: "Wie alt sind Sie?",
        placeholder: "Alter",
        name: "Alter",
        size: 30,
        isRequired: true,
        inputType: "number",
        min: 1,
        max: 100,
      },
      {
        type: "radiogroup",
        title: "Welchem Geschlecht fühlen Sie sich zugehörig?",
        choices: ["weiblich", "männlich", "divers", "keine Angabe"],
        colCount: 0,
        name: "Geschlechtsidentität",
        isRequired: true,
      },
      {
        type: "radiogroup",
        title: "Was ist Ihr höchster Bildungsabschluss?",
        choices: [
          "kein Schulabschluss",
          "Hauptschulabschluss",
          "Realschulabschluss",
          "(Fach-)Abitur",
          "abgeschlossenes Studium",
          "Promotion",
          "Sonstiges",
        ],
        colCount: 1,
        name: "Bildungsabschluss",
        isRequired: true,
      },
      {
        type: "text",
        name: "ProfessionStudy",
        title: "Was ist Ihr aktueller Beruf bzw. Studienfach?",
        isRequired: true,
      },
    ],
  },
];

export const MPMI_ITEMS = [
  "Ich vergesse Verträge, wie etwa ein Probe-Zeitungsabonnement, fristgerecht zu kündigen.",
  "Ich denke daran, Erledigungen zu machen, die in einem bestimmten Zeitfenster ausgeführt werden müssen, z.B. die Wäsche vor Ladenschluss aus der Reinigung zu holen.",
  "Wenn ich von jemandem etwas länger ausgeliehen habe, denke ich bei der nächsten Verabredung daran, es ihm zurückzugeben.",
  "Ich vergesse einen Freund erneut anzurufen, nachdem ich ihn beim ersten Versuch nicht erreicht habe.",
  "Ich bekomme Mahnungen, weil ich vergesse, offene Rechnungen zu begleichen.",
  "Es gelingt mir, von alleine an unerledigte Anrufe zu denken, z.B. wenn ich einen Bekannten anrufen möchte, der heute Geburtstag hat.",
  "Mir fallen Termine, die ich in den nächsten Tagen wahrnehmen muss, rechtzeitig ein, auch wenn ich sie mir nirgends notiert habe.",
  "Ich versäume es, anfallende Briefe oder Emails rechtzeitig abzuschicken, obwohl ich es mir notiert habe.",
  "Ich versuche, mir unerledigte Dinge immer wieder bewusst in Erinnerung zu bringen, damit ich sie nicht vergesse, auch wenn ich gerade etwas ganz anderes mache.",
  "Morgens gehe ich meinen Tagesablauf im Kopf durch, damit ich nicht vergesse, etwas zu erledigen.",
  "Wenn ich mehrere Dinge in einer bestimmten Reihenfolge erledigen muss (z.B. beim Backen), stelle ich mir den Ablauf bildlich vor.",
  "Wenn ich mit etwas fertig bin, überprüfe ich noch einmal, ob ich alles erledigt habe (wie die Herdplatte auszuschalten nach dem Kochen).",
  "Ich mache mir in Gedanken eine Liste mit Dingen, die ich noch zu erledigen habe.",
  "Ich gehe, während ich mit anderen Dingen beschäftigt bin (z.B. Spülen oder Sport machen), gedanklich eine Liste von Dingen durch, die ich noch zu erledigen habe.",
  "Bevor ich einkaufen gehe, stelle ich mir bildlich vor, wo sich die Produkte, die ich brauche, im Regal befinden, damit ich sie beim Vorbeilaufen nicht vergesse einzupacken.",
  "Ich schreibe mir einen Merkzettel mit Dingen, die ich noch zu tun habe.",
  "Ich schreibe mir Einkaufszettel.",
  "Wenn ich am nächsten Morgen etwas mitnehmen muss (wie einen Brief oder ein geliehenes Buch), packe ich es bereits am Abend vorher ein, um es morgens nicht zu vergessen.",
  "Ich führe einen Kalender mit all meinen Terminen.",
  "Ich klebe mir Notizzettel mit Auflistungen von Dingen, die ich noch erledigen muss, an eine offen sichtliche Stelle.",
  "Ich lege mir Dinge an markante Stellen, damit ich dadurch an anstehende Erledigungen erinnert werde (z.B. stelle ich den vollen Müllbeutel vor die Wohnungstür, um nicht zu vergessen, ihn zu entsorgen).",
  "Ich versuche Dinge, die ich regelmäßig tun muss, immer zur selben Zeit zu tun (z.B. ein Medikament abends immer direkt vor dem Zähneputzen einzunehmen).",
];

export const MANIPULATION_CHECK_ITEMS = [
  "Das prospektive Gedächtnis beschreibt die Fähigkeit, sich an geplante Handlungen zu erinnern, die zu einem späteren Zeitpunkt ausgeführt werden sollen.",
  "Die Leistungsfähigkeit des prospektiven Gedächtnisses wird im Alltag häufig überschätzt.",
  "Die Leistungsfähigkeit des prospektiven Gedächtnisses wird im Alltag häufig unterschätzt.",
  "Das prospektive Gedächtnis funktioniert unabhängig von Aufmerksamkeit, Stress oder Ablenkung.",
  "Das prospektive Gedächtnis gilt als fehleranfällig, da es stark von situativen und kognitiven Faktoren abhängt.",
  "Das menschliche Gedächtnis – einschließlich des prospektiven Gedächtnisses – ist grundsätzlich leistungsfähig und stellt eine wichtige kognitive Fähigkeit dar, die den Menschen unter anderem von vielen Tieren unterscheidet.",
  "Wichtige oder persönlich bedeutsame Vorhaben werden im prospektiven Gedächtnis meist zuverlässiger erinnert als weniger wichtige Aufgaben.",
];

export const MANIPULATION_CHECK_PROMPT =
  "Welche Aussagen treffen auf den Inhalt des Videos zu?";

export const VIGNETTE_INTRO_HTML = `
  <p><strong>Bitte beurteilen Sie die folgende Situation.</strong><br/>
  Inwieweit treffen die Aussagen auf die handelnde Person zu?</p>
  <p>1 = trifft überhaupt nicht zu ... 7 = trifft vollständig zu</p>
`;

export const NEGLIGENCE_ITEMS = [
  "Die Person war sich bewusst, dass ihr Verhalten einen Schaden verursachen könnte.",
  "Die Person hat nicht die erforderliche Sorgfalt walten lassen.",
  "Die Person trägt Verantwortung für das entstandene Ergebnis.",
  "Die Person hätte den Schaden vorhersehen können.",
  "Es wäre für die Person einfach möglich gewesen, den Schaden zu verhindern.",
];

export const LIKERT_LABELS_1_TO_7 = ["1", "2", "3", "4", "5", "6", "7"];
export const LIKERT_LABELS_1_TO_5 = [
  "sehr selten",
  "eher selten",
  "gelegentlich",
  "eher oft",
  "sehr oft",
];

export const NEGLIGENCE_SLIDER_PROMPT_HTML = `
  <p><strong>Bitte beurteilen Sie in einem Gesamturteil zu welchem Grad die Person fahrlässig gehandelt hat:</strong></p>
`;
