import type { ExamSection, PassageParagraph } from "@/lib/exam-types";

const paragraphs: PassageParagraph[] = [
  {
    original:
      "Können Algorithmen uns beim Alltag helfen? Wahrscheinlich ja — wenn wir verstehen, was sie können und was nicht. KI-Systeme erkennen Muster in Daten, treffen aber keine bewussten Entscheidungen.",
    translation:
      "アルゴリズムは日常を助けられるか？おそらくはい——能力と限界を理解していれば。KI はデータのパターンを認識しますが、意識的な判断はしません。",
    studyNotes: {
      chunks: [
        { phrase: "Muster erkennen", meaning: "パターンを認識する" },
        { phrase: "bewusste Entscheidungen", meaning: "意識的な判断" },
      ],
      grammar: [],
      vocabulary: [
        { term: "Algorithmen", meaning: "アルゴリズム" },
        { term: "KI-Systeme", meaning: "AI システム" },
      ],
    },
  },
  {
    original:
      "Navigationssysteme, Übersetzungsprogramme und medizinische Diagnose-Software können nützlich sein. Gleichzeitig entstehen neue Risiken: Wer Daten sammelt, kann auch Daten missbrauchen.",
    translation:
      "ナビ、翻訳、医療画像の解析などは有用です。一方で新たなリスクもあります。データを集める者は、悪用もできます。",
    studyNotes: {
      chunks: [{ phrase: "Daten missbrauchen", meaning: "データを悪用する" }],
      grammar: [],
      vocabulary: [
        { term: "Diagnose-Software", meaning: "診断ソフト" },
        { term: "gleichzeitig", meaning: "同時に、一方で" },
      ],
    },
  },
  {
    original:
      "Besonders umstritten ist KI in der Personalauswahl. Software bewertet Bewerbungen — oft ohne dass Betroffene die Kriterien kennen. Kritiker warnen vor verstärkten Vorurteilen in Trainingsdaten.",
    translation:
      "特に議論を呼ぶのは採用での KI 利用です。応募を評価しますが、基準が本人に知らされないことも。批判者は学習データの偏見が増幅されると警告します。",
    studyNotes: {
      chunks: [
        { phrase: "Personalauswahl", meaning: "人事選考" },
        { phrase: "Trainingsdaten", meaning: "学習用データ" },
      ],
      grammar: [],
      vocabulary: [
        { term: "umstritten", meaning: "議論を呼ぶ" },
        { term: "Vorurteile", meaning: "偏見" },
      ],
    },
  },
  {
    original:
      "Im Bildungsbereich diskutiert man, ob Chatbots beim Denken helfen oder es ersetzen. Bildungsexpertinnen betonen: Digitale Werkzeuge müssen didaktisch begleitet werden.",
    translation:
      "教育では、チャットボットが思考を助けるか代替するかが議論されます。教育専門家は、デジタルツールには教育的な伴走が必要だと強調します。",
    studyNotes: {
      chunks: [{ phrase: "didaktisch begleiten", meaning: "教育的に伴走・支援する" }],
      grammar: [],
      vocabulary: [
        { term: "ersetzen", meaning: "代替する" },
        { term: "Bildungsexpertinnen", meaning: "教育専門家（女性形）" },
      ],
    },
  },
  {
    original:
      "Die EU hat mit der KI-Verordnung umfassende Regeln geschaffen. Hochriskante Anwendungen müssen strenger geprüft werden. Verbraucherschützer halten die Regelungen für wichtig, aber noch nicht ausreichend.",
    translation:
      "EU は AI 規則で包括的なルールを整備しました。高リスク用途はより厳しく審査されます。消費者団体は重要だがまだ不十分と見ています。",
    studyNotes: {
      chunks: [
        { phrase: "KI-Verordnung", meaning: "AI 規則（EU AI Act）" },
        { phrase: "hochriskant", meaning: "高リスクの" },
      ],
      grammar: [],
      vocabulary: [
        { term: "Verbraucherschützer", meaning: "消費者擁護者" },
        { term: "ausreichend", meaning: "十分な" },
      ],
    },
  },
  {
    original:
      "Experten empfehlen, sensible Daten nicht unreflektiert einzugeben und KI-Ergebnisse kritisch zu prüfen. Langfristig hängt es von politischen Entscheidungen und unserem Verhalten ab.",
    translation:
      "専門家は、機密データを無批判に入力せず、AI の結果を批判的に検証することを勧めます。長期的には政治的判断と私たちの行動次第です。",
    studyNotes: {
      chunks: [
        { phrase: "kritisch prüfen", meaning: "批判的に検証する" },
        { phrase: "von … abhängen", meaning: "〜に依存する、〜次第" },
      ],
      grammar: [],
      vocabulary: [
        { term: "unreflektiert", meaning: "無批判に" },
        { term: "sensible Daten", meaning: "機密データ" },
      ],
    },
  },
];

const sentenceBank = `Satzbank (a–h):
a — Kontrollmechanismen außerhalb Europas fehlen
b — Technologie als Werkzeug nutzen, nicht als Urteilsersatz
c — Schnell auf automatische Vorschläge verlassen
d — Anforderung an Transparenz und Fairness
e — Regeln nützen wenig ohne informierte Bürger
f — Anwendungen ohne Aufsicht im Einsatz
g — Privatsphäre droht zu verschwinden
h — Definieren, welche Aufgaben Menschen vorbehalten bleiben`;

export const telcLesen1: ExamSection = {
  id: "telc-lesen-1",
  provider: "telc",
  skill: "lesen",
  partNumber: 1,
  title: "Leseverstehen Teil 1",
  titleJa: "読解パート1 — 文挿入",
  description: "Satz-Zuordnung (a–h)",
  estimatedMinutes: 15,
  instruction: "Welche Sätze a–h passen in Lücken 1–6? Zwei passen nicht.",
  passage: {
    title: "Künstliche Intelligenz im Alltag",
    paragraphs: [
      ...paragraphs,
      {
        original: sentenceBank,
        translation:
          "空所に入る文の選択肢一覧。問題画面で a–h から選びます。",
        studyNotes: {
          chunks: [],
          grammar: [],
          vocabulary: [{ term: "Satzbank", meaning: "選択肢文の一覧" }],
        },
      },
    ],
  },
  questions: [
    {
      id: "t-l1-q1",
      number: 1,
      prompt: "Lücke 1 — nach nützlichen KI-Anwendungen",
      options: [
        { id: "a", text: "a" },
        { id: "b", text: "b" },
        { id: "c", text: "c" },
        { id: "d", text: "d" },
        { id: "e", text: "e" },
        { id: "f", text: "f" },
        { id: "g", text: "g" },
        { id: "h", text: "h" },
      ],
      correctOptionId: "f",
      explanation: { summary: "リスクの具体化：十分な監督なく使われている → f。" },
    },
    {
      id: "t-l1-q2",
      number: 2,
      prompt: "Lücke 2 — Personalauswahl",
      options: [
        { id: "a", text: "a" },
        { id: "b", text: "b" },
        { id: "c", text: "c" },
        { id: "d", text: "d" },
        { id: "e", text: "e" },
        { id: "f", text: "f" },
        { id: "g", text: "g" },
        { id: "h", text: "h" },
      ],
      correctOptionId: "d",
      explanation: { summary: "透明性と公平性への基本的な要求 → d。" },
    },
    {
      id: "t-l1-q3",
      number: 3,
      prompt: "Lücke 3 — Bildungsbereich",
      options: [
        { id: "a", text: "a" },
        { id: "b", text: "b" },
        { id: "c", text: "c" },
        { id: "d", text: "d" },
        { id: "e", text: "e" },
        { id: "f", text: "f" },
        { id: "g", text: "g" },
        { id: "h", text: "h" },
      ],
      correctOptionId: "h",
      explanation: { summary: "人間に残すタスクの定義 → h。" },
    },
    {
      id: "t-l1-q4",
      number: 4,
      prompt: "Lücke 4 — EU KI-Verordnung",
      options: [
        { id: "a", text: "a" },
        { id: "b", text: "b" },
        { id: "c", text: "c" },
        { id: "d", text: "d" },
        { id: "e", text: "e" },
        { id: "f", text: "f" },
        { id: "g", text: "g" },
        { id: "h", text: "h" },
      ],
      correctOptionId: "e",
      explanation: { summary: "市民が情報を持たなければ規則も無意味 → e。" },
    },
    {
      id: "t-l1-q5",
      number: 5,
      prompt: "Lücke 5 — individuelle Verantwortung",
      options: [
        { id: "a", text: "a" },
        { id: "b", text: "b" },
        { id: "c", text: "c" },
        { id: "d", text: "d" },
        { id: "e", text: "e" },
        { id: "f", text: "f" },
        { id: "g", text: "g" },
        { id: "h", text: "h" },
      ],
      correctOptionId: "c",
      explanation: { summary: "自動提案への依存の身近な例 → c。" },
    },
    {
      id: "t-l1-q6",
      number: 6,
      prompt: "Lücke 6 — Schluss",
      options: [
        { id: "a", text: "a" },
        { id: "b", text: "b" },
        { id: "c", text: "c" },
        { id: "d", text: "d" },
        { id: "e", text: "e" },
        { id: "f", text: "f" },
        { id: "g", text: "g" },
        { id: "h", text: "h" },
      ],
      correctOptionId: "b",
      explanation: {
        summary: "道具として使い判断力の代わりにしない → b。",
        tip: "telc Lesen 1 は前後の接続詞（Gleichzeitig など）に注目。",
      },
    },
  ],
};
