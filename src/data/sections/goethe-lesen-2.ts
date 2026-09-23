import type { ExamSection, PassageParagraph } from "@/lib/exam-types";

const paragraphs: PassageParagraph[] = [
  {
    original:
      "Laut einer Studie leiden in Deutschland über ein Drittel der Erwerbstätigen unter chronischem Schlafmangel. Dennoch gilt in vielen Unternehmen: Wer früh kommt und spät geht, zeigt Engagement.",
    translation:
      "研究によると、ドイツの就業者の3分の1以上が慢性的な睡眠不足に悩んでいます。それでも多くの企業では「早く来て遅く帰る人＝熱意がある」と見なされています。",
    studyNotes: {
      chunks: [
        { phrase: "laut einer Studie", meaning: "研究によると" },
        { phrase: "chronischer Schlafmangel", meaning: "慢性的な睡眠不足" },
      ],
      grammar: [],
      vocabulary: [
        { term: "Erwerbstätige", meaning: "就業者" },
        { term: "Engagement", meaning: "熱意、積極性" },
        { term: "dennoch", meaning: "それでも" },
      ],
    },
  },
  {
    original:
      "Die Universität Heidelberg beobachtete 420 Berufstätige über zwei Jahre. Personen mit weniger als sechs Stunden Schlaf erzielten kurzfristig hohe Arbeitsvolumina, zeigten jedoch mittelfristig deutlich mehr Fehler.",
    translation:
      "ハイデルベルク大学が420人を2年間追跡しました。6時間未満の睡眠者は短期では作業量が多いものの、中期では明らかにミスが増えました。",
    studyNotes: {
      chunks: [
        { phrase: "kurzfristig vs. mittelfristig", meaning: "短期的 vs. 中期的" },
        { phrase: "Arbeitsvolumina erzielen", meaning: "作業量を達成する" },
      ],
      grammar: [
        { pattern: "zwar … jedoch …", explanation: "「確かに〜だがしかし〜」の対比（文中に zwar は省略形でも可）。" },
      ],
      vocabulary: [
        { term: "beobachten", meaning: "観察する、追跡する" },
        { term: "Fehler", meaning: "ミス、誤り" },
        { term: "Berufstätige", meaning: "就業者" },
      ],
    },
  },
  {
    original:
      'Professorin Dr. Sabine Keller betont: „Das Problem ist nicht die Arbeit selbst, sondern die fehlende Grenze zwischen Beruf und Erholung." Sie empfiehlt, eine Stunde vor dem Schlafengehen auf Bildschirme zu verzichten.',
    translation:
      "Keller 教授は「問題は仕事そのものではなく、仕事と休息の境界の欠如だ」と強調します。就寝1時間前から画面を避けることを勧めています。",
    studyNotes: {
      chunks: [
        { phrase: "fehlende Grenze", meaning: "欠如している境界" },
        { phrase: "auf etwas verzichten", meaning: "〜を控える、〜を断つ" },
      ],
      grammar: [
        { pattern: "nicht A, sondern B", explanation: "「AではなくB」という対比。" },
      ],
      vocabulary: [
        { term: "Erholung", meaning: "休息、回復" },
        { term: "Schlafengehen", meaning: "就寝" },
        { term: "betonen", meaning: "強調する" },
      ],
    },
  },
  {
    original:
      'In Unternehmen mit stillschweigend erwarteten Überstunden gaben Beschäftigte seltener Schlafprobleme an – nicht weil sie besser schliefen, sondern weil sie Schwäche verbergen wollten. Forscher sprechen von einem „Schlafstigma".',
    translation:
      "残業が暗黙のうちに期待される企業では、睡眠問題を申告する人が少なくなりました。よく眠れていたからではなく、弱さを見せたくなかったからです。研究者はこれを「睡眠のスティグマ」と呼びます。",
    studyNotes: {
      chunks: [
        { phrase: "stillschweigend erwartet", meaning: "暗黙のうちに期待される" },
        { phrase: "Schwäche verbergen", meaning: "弱さを隠す" },
      ],
      grammar: [
        { pattern: "nicht weil …, sondern weil …", explanation: "理由の対比。「〜だからではなく、むしろ〜だから」。" },
      ],
      vocabulary: [
        { term: "Überstunden", meaning: "残業" },
        { term: "Stigma", meaning: "汚名、偏見" },
        { term: "verbergen", meaning: "隠す" },
      ],
    },
  },
  {
    original:
      "Betriebe, die bewusst Erholungsphasen ermöglichten, verzeichneten langfristig weniger Krankheitstage und höhere Mitarbeiterzufriedenheit.",
    translation:
      "意図的に休息の時間を確保した企業は、長期的に病欠日数が減り、従業員満足度が上がりました。",
    studyNotes: {
      chunks: [
        { phrase: "Erholungsphasen ermöglichen", meaning: "休息の時間を確保する" },
        { phrase: "Krankheitstage verzeichnen", meaning: "病欠日数を記録する・減らす" },
      ],
      grammar: [],
      vocabulary: [
        { term: "bewusst", meaning: "意図的に" },
        { term: "langfristig", meaning: "長期的に" },
        { term: "Zufriedenheit", meaning: "満足度" },
      ],
    },
  },
  {
    original:
      "Einzelne Unternehmen haben E-Mail-Sperren nach 19 Uhr eingeführt. Die Studie betont: Ausreichender Schlaf ist eine Voraussetzung für nachhaltige Leistungsfähigkeit – im Beruf und im Privatleben.",
    translation:
      "一部の企業は19時以降のメール制限を導入しました。研究は、十分な睡眠が持続的なパフォーマンスの前提条件であると強調します——仕事でも私生活でも。",
    studyNotes: {
      chunks: [
        { phrase: "E-Mail-Sperren", meaning: "メール送信の制限" },
        { phrase: "Voraussetzung für", meaning: "〜の前提条件" },
      ],
      grammar: [],
      vocabulary: [
        { term: "nachhaltig", meaning: "持続的な" },
        { term: "Leistungsfähigkeit", meaning: "能力、パフォーマンス" },
        { term: "einführen", meaning: "導入する" },
      ],
    },
  },
];

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
    paragraphs,
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
        summary: "在社時間が Engagement の指標とされる。",
        wrong: { a: "睡眠と労働時間は直接結びつけていない。", c: "年齢の言及なし。" },
        tip: "Teil 2 は半正解が多い。本文の表現と一字一句合わせる。",
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
      explanation: { summary: "「mittelfristig deutlich mehr Fehler」が主結論。" },
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
      explanation: { summary: "fehlende Grenze zwischen Beruf und Erholung。" },
    },
    {
      id: "g-l2-q12",
      number: 12,
      prompt: "Warum gaben manche Beschäftigte keine Schlafprobleme an?",
      options: [
        { id: "a", text: "Sie fürchteten Nachteile bei Beförderungen." },
        { id: "b", text: "Sie wollten keine Schwäche zeigen." },
        { id: "c", text: "Sie waren tatsächlich weniger betroffen." },
      ],
      correctOptionId: "b",
      explanation: { summary: "Schlafstigma：Schwäche verbergen wollten。" },
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
      explanation: { summary: "weniger Krankheitstage。" },
    },
    {
      id: "g-l2-q14",
      number: 14,
      prompt: "Welche Maßnahme wird bereits umgesetzt?",
      options: [
        { id: "a", text: "E-Mail-Sperren nach Feierabend" },
        { id: "b", text: "Verpflichtende Mittagsschlaf-Räume" },
        { id: "c", text: "Wöchentliche Schlafberatung" },
      ],
      correctOptionId: "a",
      explanation: { summary: "E-Mail-Sperren nach 19 Uhr が実施例。" },
    },
    {
      id: "g-l2-q15",
      number: 15,
      prompt: "Ausreichender Schlaf ist …",
      options: [
        { id: "a", text: "eine individuelle Luxusfrage." },
        { id: "b", text: "Voraussetzung für dauerhafte Leistung." },
        { id: "c", text: "nur im Privatleben relevant." },
      ],
      correctOptionId: "b",
      explanation: { summary: "Voraussetzung für nachhaltige Leistungsfähigkeit。" },
    },
  ],
};
