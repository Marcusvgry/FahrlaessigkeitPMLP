import type { InstructionTexts } from "../types/d.ts";

export const instructionTexts: InstructionTexts = {
  instruction: `
    <div class="instructions">
      <p>Bitte schließen oder aktualisieren Sie Ihr Browserfenster NICHT, während Sie die Studie durchführen.</p>
      <p>Vielen Dank für Ihr Interesse an der Online-Studie zur Beurteilung der Fahrlässigkeit in Alltagssituationen.</p>
      <p>Bevor Sie sich dazu entscheiden, teilzunehmen, werden Sie über den Ablauf und das Ziel der Untersuchung informiert. Lesen Sie dazu bitte die nachfolgenden Informationen sorgfältig durch.</p>
    </div>
  `,

  informedConsentOne: `
    <div class="instructions">
      <p><strong>Wer führt diese Studie durch und worum geht es?</strong><br>
      Ich bin eine Bachelor-Studentin der Psychologie der Universität Heidelberg. Im Rahmen meiner Abschlussarbeit in der Allgemeinen Psychologie unter der Betreuung von Prof. Dr. Jan Rummel untersuche ich, wie Personen die Fahrlässigkeit von Handlungen in verschiedenen Alltagssituationen beurteilen.</p>

      <p><strong>Wie ist der Ablauf der Studie?</strong><br>
      Bei dieser Studie handelt es sich um eine einmalige Online-Studie mit einer Bearbeitungsdauer von etwa X Minuten. <br>
Zu Beginn werden Sie gebeten, einige allgemeine Angaben zu Ihrer Person zu machen. Anschließend erhalten Sie eine kurze Einführung in den Ablauf der Studie. Im Folgenden wird ihnen ein Fragebogen sowie ein Informationsvideo über das prospektive Gedächtnis vorgelegt . Danach erhalten Sie eine Definition des Begriffs Fahrlässigkeit. <br>
Im letzten Teil der Studie werden Ihnen mehrere kurze Fallvignetten aus unterschiedlichen Alltagssituationen präsentiert. Nach jeder Fallvignette werden Sie gebeten, Einschätzungen zur Fahrlässigkeit der handelnden Person abzugeben.
</p>

      <p><strong>Welche Vorteile hat die Studienteilnahme?</strong><br>
      Durch Ihre Teilnahme leisten Sie einen Beitrag zur psychologischen Forschung und helfen dabei, das Verständnis laienhafter Bewertungen fahrlässigen Handelns in Alltagssituationen zu erweitern. Für die Teilnahme an der Studie erhalten sie eine monetäre Vergütung gemäß den Richtlinien der Plattform Prolific.</p>

      <p><strong>Ergeben sich aus der Teilnahme an der Studie für Sie Risiken oder Nachteile?</strong><br>
      Durch die Teilnahme an der Studie sind keine Risiken oder Nachteile zu erwarten. Es werden keine psychischen Belastungen angenommen, die über alltägliche Erfahrungen hinausgehen. Sollten Sie sich während der Teilnahme dennoch unwohl fühlen, können Sie die Studie jederzeit und ohne Angabe von Gründen abbrechen.</p>

      <p><strong>Wer darf an dieser Studie teilnehmen?</strong><br>
      Teilnahmeberechtigt sind Personen ab 18 Jahren. Für die Studienteilnahme sind gute Deutschkenntisse erforderlich. Bitte nehmen Sie nur teil, wenn Sie Deutsch fließend verstehen. <br>
Personen mit juristischen Vorkenntnissen (z.B. Studium oder berufliche Tätigkeit im juristischen Bereich) sind von der Teilnahme ausgeschlossen, da die Studie laienhafte Bewertungen untersucht.
</p>

      <p><strong>Freiwilligkeit der Teilnahme und Rücktritt</strong><br>
      Die Teilnahme an dieser Studie ist freiwillig. Sie können Ihre Teilnahme jederzeit und ohne Angabe von Gründen abbrechen, ohne dass Ihnen dadurch Nachteile entstehen.
Alle im Rahmen dieser Studie erhobenen Daten werden vertraulich behandelt und in anonymisierter Form für wissenschaftliche Zwecke ausgewertet. Die erhobenen demografischen Angaben erlauben keine Rückschlüsse auf Ihre Identität. <br>
Da die Datenerhebung anonym erfolgt, ist ein nachträglicher Widerruf der Nutzung bereits erhobener Daten nach Abschluss der Teilnahme nicht mehr möglich. Bei Fragen zur Studie können Sie sich jederzeit an die Studienleitung wenden.
</p>
    </div>
  `,

  informedConsentTwo: `
    <div class="instructions">
      <p><strong>Verwendung der Daten</strong><br>
      Um die in der Studie erhobenen Daten zu schützen, werden sie anonymisiert gespeichert und verarbeitet und selbstverständlich vertraulich behandelt, sodass eine Zuordnung Ihrer Daten zu Ihrer Person für Dritte und Forschende zu keinem Zeitpunkt möglich ist. Die verschlüsselten Daten werden ausschließlich für unser wissenschaftliches Projekt verwendet sowie auf dem öffentlich zugänglichen Open-Science-Portal OSF (https://osf.io) bereitgestellt. <br>
      <strong> Rückschlüsse auf Ihre Identität sind nicht möglich. </strong> Die vollständig anonymisierten Daten können zu Forschungszwecken weiterverwendet werden. Dazu werden die vollständig anonymisierten Daten mindestens 10 Jahre nach der Auswertung, bzw. nachdem die Ergebnisse veröffentlicht worden sind, aufbewahrt. Veröffentlichte Forschungsergebnisse und auf Open-Science-Portalen bereitgestellte Studiendaten stehen für die weitere Nutzung zeitlich unbegrenzt zur Verfügung. <br>
      Mit der Publikation der anonymisierten Daten folgt diese Studie den Empfehlungen der Deutschen Forschungsgemeinschaft (DFG) und der Deutschen Gesellschaft für Psychologie (DGPs) zur Qualitätssicherung in der Forschung.</p>

      <p><strong>Kontaktadressen für Fragen</strong><br>
      Als teilnehmende Person können Sie jederzeit Fragen über alle Angelegenheiten im Zusammenhang mit der Studie stellen. Bei Rückfragen stehe ich Ihnen gerne per E-Mail zur Verfügung.
      Für Ihre Bereitschaft und Ihre Unterstützung bedanke ich mich im Voraus!</p>
      <p><a>leonie.pitz@stud.uni-heidelberg.de</a><br>
      <a>jan.rummel@psychologie.uni-heidelberg.de</a></p>
    </div>
  `,

  instructionsStudy: `
    <div class="instructions">
      <p>Im Folgenden erhalten Sie einen Fragebogen, den Sie bitte ausfüllen. Dabei geht es um Ihre persönliche Wahrnehmung, es gibt kein Richtig oder Falsch. Anschließend wird Ihnen ein Video gezeigt. Bitte sehen Sie sich dieses aufmerksam und vollständig an. Im Anschluss daran werden Ihnen einige Verständnisfragen gestellt und nach persönlichen Beispielen aus Ihrem Alltag gefragt. In dem letzten Teil der Studie werden Ihnen mehrere kurze Fallvignetten aus unterschiedlichen Alltagssituationen präsentiert. In diesen wird jeweils das Verhalten einer handelnden Person geschildert.</p>
      <p>Bitte lesen Sie jede Fallbeschreibung aufmerksam durch und geben Sie anschließend Ihre persönliche Einschätzung ab. Es gibt dabei keine richtigen oder falschen Antworten. Uns interessiert ausschließlich Ihre subjektive Einschätzung. </p>
      <p> Um sicherzustellen, dass alle Teilnehmenden von einem vergleichbaren Begriffsverständis ausgehen, wird Ihnen davor eine kurze Definition des Begriffs Fahrlässigkeit vorgestellt. Bitte lesen Sie diese aufmerksam durch, bevor Sie mit der Bearbeitung der Fallvignetten beginnen.</p>
    </div>
  `,

  questionnaireIntro: `
    <div class="instructions">
      <p>Im Folgenden sehen Sie einen Fragebogen, in dem es um Ihre persönlichen Erfahrungen geht. Es gibt kein richtig oder falsch. Ihre eigenen Erlebnisse und Wahrnehmungen sind entscheidend. Bitte beantworten Sie die Fragen so ehrlich wie möglich.</p>
      <p>
      Wenn Sie sich bei einer Frage unsicher sind oder keine eindeutige Antwort haben, kreuzen Sie bitte das an, was am besten auf Ihre Situation zutrifft. Nehmen Sie sich Zeit, über Ihre Erfahrungen nachzudenken, bevor Sie antworten.
      </p>
    </div>
  `,

  videoIntroAB: `
    <div class="instructions">
      <p>Jetzt wird Ihnen ein kurzes Informationsvideo bezüglich des prospektiven Gedächtnisses vorgespielt. Bitte schauen sie sich dieses aufmerksam bis zum Ende an. Danach werden Ihnen ein paar Verständnisfragen zu dem Inhalt des Videos gestellt. Anschließend werden sie gebeten, sich an Beispiele aus ihrem Leben zu erinnern und aufzuschreiben.</p>
    </div>
  `,

  videoIntroC: `
    <div class="instructions">
      <p>Jetzt wird Ihnen ein kurzes Informationsvideo bezüglich ……..vorgespielt. Bitte schauen sie sich dieses aufmerksam bis zum Ende an. Danach werden Ihnen ein paar Verständnisfragen zu dem Inhalt des Videos gestellt.</p>
    </div>
  `,

  memoryIntroSuccess: `
    <div class="instructions">
      <p>Im Folgenden geht es um persönliche Erfahrungen aus Ihrem Alltag. Bitte beschreiben Sie Situationen, in denen Sie sich eine Handlung für einen späteren Zeitpunkt vorgenommen haben. Die Handlung konnte zunächst nicht sofort ausgeführt werden, Sie haben sich jedoch später selbstständig daran erinnert und sie wie geplant umgesetzt.</p>
      <p><strong>Beispiel:</strong> Sie nehmen sich morgens vor, nach der Arbeit noch einkaufen zu gehen. Obwohl Sie tagsüber nicht daran denken, erinnern Sie sich auf dem Heimweg rechtzeitig daran und erledigen den Einkauf.</p>
    </div>
  `,

  memoryIntroFailure: `
    <div class="instructions">
      <p>Im Folgenden geht es um persönliche Erfahrungen aus Ihrem Alltag. Bitte beschreiben Sie Situationen, in denen Sie sich eine Handlung für einen späteren Zeitpunkt vorgenommen haben. Die Handlung konnte zunächst nicht sofort ausgeführt werden, und später haben Sie <strong> nicht mehr daran gedacht</strong>, sodass die Handlung <strong>nicht oder zu spät</strong> umgesetzt wurde.</p>
      <p><strong>Beispiel:</strong> Sie nehmen sich morgens vor, nach der Arbeit noch einkaufen zu gehen. Im Laufe des Tages denken Sie nicht mehr daran und erinnern sich erst zu Hause – oder gar nicht mehr –, sodass der Einkauf nicht stattfindet.</p>
    </div>
  `,

  vignetteIntro: `
    <div class="instructions">
      <p>Zuletzt werden ihnen mehrere kurze Fallvignetten aus unterschiedlichen Alltagssituationen präsentiert. In diesen wird jeweils das Verhalten einer handelnden Person geschildert.</p>
      <p>Bitte lesen Sie jede Fallbeschreibung aufmerksam durch und geben Sie anschließend Ihre persönliche Einschätzung ab. Es gibt dabei keine richtigen oder falschen Antworten. Uns interessiert ausschließlich Ihre subjektive Einschätzung.</p>
      <p>Um sicherzustellen, dass alle Teilnehmenden von einem vergleichbaren Begriffsverständis ausgehen, finden Sie im Folgenden eine kurze Definition des Begriffs Fahrlässigkeit. Bitte lesen Sie diese aufmerksam durch, bevor Sie mit der Bearbeitung der Fallvignetten beginnen.</p>
      <p><em>Definition von Fahrlässigkeit:</em> <br>
      Fahrlässigkeit bezeichnet ein Handeln oder auch Unterlassen einer Handlung ohne Schädigungsabsicht. Die fahrlässige Person handelt oder unterlässt eine Handlung bewusst und willentlich und verursacht dadurch einen Schaden. Sie verfügt über relevantes Wissen zur Risikobeurteilung (oder sollte vernünftigerweise darüber verfügen) und unterlässt es dennoch, die gebotene Sorgfalt zur Vermeidung eines vorhersehbaren Schadens anzuwenden.</p>
    </div>
  `,

  negligenceDefinition: `
    <div class="instructions">
      <p><em>Definition von Fahrlässigkeit:</em> <br>
      Fahrlässigkeit bezeichnet ein Handeln oder auch Unterlassen einer Handlung ohne Schädigungsabsicht. Die fahrlässige Person handelt oder unterlässt eine Handlung bewusst und willentlich und verursacht dadurch einen Schaden. Sie verfügt über relevantes Wissen zur Risikobeurteilung (oder sollte vernünftigerweise darüber verfügen) und unterlässt es dennoch, die gebotene Sorgfalt zur Vermeidung eines vorhersehbaren Schadens anzuwenden.</p>
    </div>
  `,

  debriefing: `
    <div class="instructions">
      <p>Vielen Dank für Ihre Teilnahme an dieser Online-Studie.</p>
      <p>In dieser Untersuchung ging es darum zu erfassen, wie Menschen Handlungen und deren Folgen beurteilen, insbesondere im Hinblick auf Fahrlässigkeit. Zu diesem Zweck haben alle Teilnehmenden ein Informationsvideo zur Funktionsweise des prospektiven Gedächtnisses (PM) gesehen.</p>
      <p>Dabei erhielten unterschiedliche Gruppen <strong>keine oder unterschiedliche, jeweils korrekte Informationen </strong> zur Funktionsweise des PM. Keine der dargestellten Informationen war falsch; allerdings hat <strong>keine Gruppe alle verfügbaren Informationen</strong> erhalten. Dieses Vorgehen wurde bewusst gewählt, um zu untersuchen, <strong>wie unterschiedliche Wissensstände Fahrlässigkeitsurteile beeinflussen.</strong></p>
      <p>Eine vollständige Aufklärung über diese Aufteilung erfolgte erst jetzt, da eine frühere Information die Urteilsbildung hätte beeinflussen können. Ihre Antworten tragen dazu bei, besser zu verstehen, welche Rolle Wissen und Informationsverfügbarkeit bei der Bewertung menschlichen Handelns spielen.</p>
      <p>Zur Vollständigkeit hier alle Informationen: ...</p>
      <p>Ihre Teilnahme war freiwillig, alle Angaben werden anonym ausgewertet. Wenn Sie Fragen zur Studie haben oder Ihre Daten nachträglich zurückziehen möchten, können Sie sich jederzeit an die Studienleitung wenden.</p>
      <p>Vielen Dank für Ihre Unterstützung.</p>
    </div>
  `,
};
