import type { ExamSection } from "@/lib/exam-types";

const passageBody = `Laut einer kürzlich in einer medizinischen Fachzeitschrift veröffentlichten Studie leiden in Deutschland über ein Drittel der Erwerbstätigen unter chronischem Schlafmangel. Die Folgen reichen von Konzentrationsstörungen über Reizbarkeit bis hin zu einem erhöhten Risiko für Herz-Kreislauf-Erkrankungen. Dennoch gilt in vielen Unternehmen nach wie vor das Prinzip: Wer früh kommt und spät geht, zeigt Engagement – auch wenn er nachts kaum zur Ruhe kommt.

Die Forscherinnen und Forscher der Universität Heidelberg beobachteten über zwei Jahre hinweg 420 Berufstätige aus verschiedenen Branchen. Die Teilnehmenden führten Schlafprotokolle und gaben regelmäßig Auskunft über ihre Produktivität und ihr subjektives Wohlbefinden. Das Ergebnis war eindeutig: Personen, die regelmäßig weniger als sechs Stunden schliefen, erzielten zwar kurzfristig hohe Arbeitsvolumina, zeigten jedoch mittelfristig deutlich mehr Fehler und mussten Aufgaben häufiger wiederholen.

Besonders betroffen waren Berufstätige mit hoher digitaler Erreichbarkeit. Viele gaben an, abends noch E-Mails zu lesen oder in sozialen Medien aktiv zu sein, was den Einschlafprozess verzögerte. Die Studienleiterin, Professorin Dr. Sabine Keller, betont: „Das Problem ist nicht die Arbeit selbst, sondern die fehlende Grenze zwischen Beruf und Erholung." Sie empfiehlt, mindestens eine Stunde vor dem Schlafengehen auf Bildschirme zu verzichten.

Ein weiterer Aspekt betrifft die Firmenkultur. In Unternehmen, in denen Überstunden stillschweigend erwartet wurden, gaben die Beschäftigten seltener an, unter Schlafproblemen zu leiden – nicht weil sie besser schliefen, sondern weil sie Schwäche verbergen wollten. Die Wissenschaftlerinnen und Wissenschaftler sprechen hier von einem „Schlafstigma", das eine offene Diskussion verhindert.

Gegen Maßnahmen wie flexible Arbeitszeiten oder Mittagsschlaf-Räume bestehen bei manchen Führungskräften Vorbehalte. Sie befürchten Produktivitätsverluste. Die Studie zeigt jedoch das Gegenteil: Betriebe, die bewusst Erholungsphasen ermöglichten, verzeichneten langfristig weniger Krankheitstage und eine höhere Mitarbeiterzufriedenheit.

Die Autorinnen und Autoren schlagen vor, Schlafhygiene stärker in betriebliche Gesundheitsprogramme zu integrieren. Dazu gehören Informationsveranstaltungen, aber auch die Überprüfung von Arbeitsabläufen, die unnötigen Zeitdruck erzeugen. Einzelne Unternehmen gehen bereits voran und haben E-Mail-Sperren nach 19 Uhr eingeführt – ein Schritt, der zunächst auf Widerstand stieß, von vielen Beschäftigten aber inzwischen begrüßt wird.

Privatpersonen können ihrerseits Routinen entwickeln: feste Schlafenszeiten, kühle und dunkle Schlafzimmer, weniger Koffein am Nachmittag. Die Studie macht deutlich, dass ausreichender Schlaf keine Luxusfrage ist, sondern eine Voraussetzung für nachhaltige Leistungsfähigkeit – sowohl im Beruf als auch im Privatleben.`;

export const goetheLesen2: ExamSection = {
  id: "goethe-lesen-2",
  provider: "goethe",
  skill: "lesen",
  partNumber: 2,
  title: "Lesen Teil 2",
  titleJa: "読解パート2 — 内容理解",
  description: "長文読解・半正解の排除",
  estimatedMinutes: 20,
  instruction: "Wählen Sie bei jeder Aufgabe die richtige Lösung.",
  passage: {
    title: "GESUNDHEIT IM FOKUS",
    subtitle: "Schlafmangel in der Leistungsgesellschaft",
    body: passageBody,
  },
  questions: [
    {
      id: "g-l2-q9",
      number: 9,
      prompt: "In vielen Unternehmen wird noch immer angenommen, dass …",
      options: [
        { id: "a", text: "lange Arbeitszeiten mit wenig Schlaf zusammenhängen." },
        { id: "b", text: "Engagement sich in der Anwesenheitsdauer zeigt." },
        { id: "c", text: "Schlafmangel vor allem junge Mitarbeitende betrifft." },
      ],
      correctOptionId: "b",
      explanation: {
        summary:
          "「早く来て遅く帰る人＝熱意がある」という考え方。Anwesenheitsdauer（在社時間）が Engagement の指標とされる。",
        wrong: {
          a: "テキストは睡眠と労働時間を直接結びつけていない。",
          c: "特定の年齢層への言及はない。",
        },
        tip: "Teil 2 は半正解が多い。a が一見正しそうでも、本文の表現と一字一句合わせる。",
      },
    },
    {
      id: "g-l2-q10",
      number: 10,
      prompt: "Was zeigte die Langzeitstudie?",
      options: [
        { id: "a", text: "Kurzfristige Produktivität steigt bei wenig Schlaf." },
        { id: "b", text: "Wenig Schlaf führt mittelfristig zu mehr Fehlern." },
        { id: "c", text: "Sechs Stunden Schlaf reichen für die meisten Berufe." },
      ],
      correctOptionId: "b",
      explanation: {
        summary: "6時間未満の睡眠者は「mittelfristig deutlich mehr Fehler」。研究の主結論。",
        wrong: {
          a: "短期の高い作業量は認められるが、それが研究の主張ではない。",
          c: "6時間で十分とは書かれていない。",
        },
      },
    },
    {
      id: "g-l2-q11",
      number: 11,
      prompt: "Was erschwert laut Professorin Keller den Einschlafprozess?",
      options: [
        { id: "a", text: "Die fehlende Trennung von Arbeit und Freizeit." },
        { id: "b", text: "Die zunehmende Arbeitsbelastung am Abend." },
        { id: "c", text: "Die Nutzung sozialer Medien am Arbeitsplatz." },
      ],
      correctOptionId: "a",
      explanation: {
        summary: "Keller の核心：「fehlende Grenze zwischen Beruf und Erholung」。",
        wrong: {
          b: "夕方の仕事量増加ではなく、境界の欠如が問題。",
          c: "SNS は「abends」であって職場ではない。",
        },
      },
    },
    {
      id: "g-l2-q12",
      number: 12,
      prompt: "Warum gaben manche Beschäftigte in bestimmten Unternehmen keine Schlafprobleme an?",
      options: [
        { id: "a", text: "Sie fürchteten Nachteile bei Beförderungen." },
        { id: "b", text: "Sie wollten keine Schwäche zeigen." },
        { id: "c", text: "Sie waren tatsächlich weniger betroffen." },
      ],
      correctOptionId: "b",
      explanation: {
        summary: "Schlafstigma：「Schwäche verbergen wollten」。",
        wrong: {
          a: "昇進への影響は言及なし。",
          c: "実際にはよく眠れていない（nicht weil sie besser schliefen）。",
        },
      },
    },
    {
      id: "g-l2-q13",
      number: 13,
      prompt: "Was ist laut Text ein Effekt flexibler Arbeitsmodelle?",
      options: [
        { id: "a", text: "Weniger Krankheitstage" },
        { id: "b", text: "Höhere Überstundenbereitschaft" },
        { id: "c", text: "Stärkere Konkurrenz im Team" },
      ],
      correctOptionId: "a",
      explanation: {
        summary: "「weniger Krankheitstage und höhere Mitarbeiterzufriedenheit」。",
        wrong: {
          b: "残業意欲の増加は記載なし。",
          c: "チーム内競争の強化も記載なし。",
        },
      },
    },
    {
      id: "g-l2-q14",
      number: 14,
      prompt: "Welche Maßnahme wird in einigen Unternehmen bereits umgesetzt?",
      options: [
        { id: "a", text: "E-Mail-Sperren nach Feierabend" },
        { id: "b", text: "Verpflichtende Mittagsschlaf-Räume" },
        { id: "c", text: "Wöchentliche Schlafberatung" },
      ],
      correctOptionId: "a",
      explanation: {
        summary: "「E-Mail-Sperren nach 19 Uhr」が実際に導入されている例。",
        wrong: {
          b: "Mittagsschlaf-Räume は可能な施策の例示で、実施例ではない。",
          c: "週次睡眠相談は存在しない。",
        },
      },
    },
    {
      id: "g-l2-q15",
      number: 15,
      prompt: "Die Autorinnen und Autoren betonen, dass ausreichender Schlaf …",
      options: [
        { id: "a", text: "eine individuelle Luxusfrage ist." },
        { id: "b", text: "Voraussetzung für dauerhafte Leistung ist." },
        { id: "c", text: "nur im Privatleben relevant ist." },
      ],
      correctOptionId: "b",
      explanation: {
        summary: "「Voraussetzung für nachhaltige Leistungsfähigkeit」。",
        wrong: {
          a: "Luxusfrage であることは明確に否定。",
          c: "「sowohl im Beruf als auch im Privatleben」と両方に言及。",
        },
      },
    },
  ],
};
