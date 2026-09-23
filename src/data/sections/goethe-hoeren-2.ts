import type { ExamSection, PassageParagraph } from "@/lib/exam-types";

const transcriptParagraphs: PassageParagraph[] = [
  {
    original:
      "Moderator: Mikroplastik gilt als unsichtbare Bedrohung. Wo stehen wir, Frau Dr. Meier?",
    translation: "司会：マイクロプラスチックは見えない脅威とされています。現状はどうですか、Meier 博士？",
    studyNotes: {
      chunks: [{ phrase: "gilt als", meaning: "〜とみなされる、〜とされる" }],
      grammar: [],
      vocabulary: [
        { term: "Mikroplastik", meaning: "マイクロプラスチック" },
        { term: "Bedrohung", meaning: "脅威" },
      ],
    },
  },
  {
    original:
      "Meier: Wir finden Mikroplastik heute nicht nur im Meer, sondern auch in Böden, Flüssen – und zunehmend in der Luft. Das ist besorgniserregend, weil wir es einatmen können.",
    translation:
      "Meier：今日では海だけでなく、土、河川——そしてますます空気中にも見つかります。吸入できるので懸念です。",
    studyNotes: {
      chunks: [
        { phrase: "nicht nur … sondern auch", meaning: "〜だけでなく〜も" },
        { phrase: "besorgniserregend", meaning: "懸念すべき" },
      ],
      grammar: [],
      vocabulary: [
        { term: "Böden", meaning: "土壌" },
        { term: "einatmen", meaning: "吸入する" },
      ],
    },
  },
  {
    original:
      "Moderator: Ihre Studie untersuchte Proben aus verschiedenen Kontinenten, auch aus Entwicklungsländern? Meier: Ja, weltweit – nicht nur Industrieländer. Das Problem ist global.",
    translation:
      "司会：研究は各大陸、開発国の試料も？ Meier：はい、世界中です——工業国だけではありません。問題は全球的です。",
    studyNotes: {
      chunks: [{ phrase: "weltweit", meaning: "世界中で" }],
      grammar: [],
      vocabulary: [
        { term: "Proben", meaning: "試料、サンプル" },
        { term: "Entwicklungsländer", meaning: "開発国" },
      ],
    },
  },
  {
    original:
      "Meier: Vollständiger Verzicht ist unrealistisch. Aber Einwegprodukte können wir reduzieren. Besonders problematisch sind Mikrofasern aus synthetischer Kleidung.",
    translation:
      "Meier：完全な断絶は非現実的です。しかし使い捨て製品は減らせます。特に問題なのは合成繊維の衣類から出るマイクロファイバーです。",
    studyNotes: {
      chunks: [
        { phrase: "vollständiger Verzicht", meaning: "完全な断絶・禁止" },
        { phrase: "Einwegprodukte", meaning: "使い捨て製品" },
      ],
      grammar: [],
      vocabulary: [
        { term: "Mikrofasern", meaning: "マイクロファイバー" },
        { term: "synthetisch", meaning: "合成の" },
      ],
    },
  },
  {
    original:
      "Meier: Nein, allein schaffen wir das nicht. Wir brauchen strengere industrielle Vorgaben und Kontrollen. In der EU gibt es bereits Verbote für bestimmte Einwegartikel.",
    translation:
      "Meier：いいえ、個人の行動だけでは解決できません。より厳しい産業規制と監視が必要です。EU では特定の使い捨て製品の禁止がすでにあります。",
    studyNotes: {
      chunks: [
        { phrase: "allein schaffen", meaning: "一人／個人だけで成し遂げる" },
        { phrase: "industrielle Vorgaben", meaning: "産業規制" },
      ],
      grammar: [],
      vocabulary: [
        { term: "Kontrollen", meaning: "監視、検査" },
        { term: "Verbote", meaning: "禁止" },
      ],
    },
  },
  {
    original:
      "Meier: Langfristig unrealistisch. Wir können die Belastung aber deutlich senken.",
    translation: "Meier：長期的には非現実的です。ただし汚染を大幅に減らすことは可能です。",
    studyNotes: {
      chunks: [{ phrase: "die Belastung senken", meaning: "負荷・汚染を下げる" }],
      grammar: [],
      vocabulary: [
        { term: "langfristig", meaning: "長期的に" },
        { term: "deutlich", meaning: "明らかに、大幅に" },
      ],
    },
  },
];

export const goetheHoeren2: ExamSection = {
  id: "goethe-hoeren-2",
  provider: "goethe",
  skill: "horen",
  partNumber: 2,
  title: "Hören Teil 2",
  titleJa: "聴解パート2 — 正誤判断",
  description: "stimmt / stimmt nicht / nichts gesagt",
  estimatedMinutes: 12,
  instruction: "▶ 段落ごとに再生。 a stimmt | b stimmt nicht | c nichts gesagt",
  transcript: { paragraphs: transcriptParagraphs },
  questions: [
    {
      id: "g-h2-q7",
      number: 7,
      prompt: "Mikroplastik wurde bisher nur in Meeresorganismen nachgewiesen.",
      options: [
        { id: "a", text: "stimmt" },
        { id: "b", text: "stimmt nicht" },
        { id: "c", text: "dazu wird nichts gesagt" },
      ],
      correctOptionId: "b",
      explanation: {
        summary: "海以外（土・河川・空気）にも存在。「nur im Meer」は誤り。",
        tip: "only/always/never などの限定語を照合。",
      },
    },
    {
      id: "g-h2-q8",
      number: 8,
      prompt: "Die Forscherin hält die Belastung der Luft für besorgniserregend.",
      options: [
        { id: "a", text: "stimmt" },
        { id: "b", text: "stimmt nicht" },
        { id: "c", text: "dazu wird nichts gesagt" },
      ],
      correctOptionId: "a",
      explanation: { summary: "「in der Luft … besorgniserregend」と明言。" },
    },
    {
      id: "g-h2-q9",
      number: 9,
      prompt: "Ausschließlich Proben aus Industrieländern wurden untersucht.",
      options: [
        { id: "a", text: "stimmt" },
        { id: "b", text: "stimmt nicht" },
        { id: "c", text: "dazu wird nichts gesagt" },
      ],
      correctOptionId: "b",
      explanation: { summary: "「weltweit – nicht nur Industrieländer」。" },
    },
    {
      id: "g-h2-q10",
      number: 10,
      prompt: "Die Forscherin empfiehlt vollständigen Verzicht auf Einwegplastik.",
      options: [
        { id: "a", text: "stimmt" },
        { id: "b", text: "stimmt nicht" },
        { id: "c", text: "dazu wird nichts gesagt" },
      ],
      correctOptionId: "c",
      explanation: {
        summary: "完全断絶は unrealistisch。完全禁止の「推奨」は言及なし → c。",
        tip: "テーマに触れていても、選択肢の具体的主張が未言及なら c。",
      },
    },
    {
      id: "g-h2-q11",
      number: 11,
      prompt: "Mikrofasern aus Kleidung sind eine wichtige Quelle.",
      options: [
        { id: "a", text: "stimmt" },
        { id: "b", text: "stimmt nicht" },
        { id: "c", text: "dazu wird nichts gesagt" },
      ],
      correctOptionId: "a",
      explanation: { summary: "「Besonders problematisch sind Mikrofasern …」。" },
    },
    {
      id: "g-h2-q12",
      number: 12,
      prompt: "Individuelles Verhalten allein löst das Problem.",
      options: [
        { id: "a", text: "stimmt" },
        { id: "b", text: "stimmt nicht" },
        { id: "c", text: "dazu wird nichts gesagt" },
      ],
      correctOptionId: "b",
      explanation: { summary: "「Nein, allein schaffen wir das nicht」。" },
    },
    {
      id: "g-h2-q13",
      number: 13,
      prompt: "Es gibt gesetzliche Beschränkungen für Plastikprodukte.",
      options: [
        { id: "a", text: "stimmt" },
        { id: "b", text: "stimmt nicht" },
        { id: "c", text: "dazu wird nichts gesagt" },
      ],
      correctOptionId: "a",
      explanation: { summary: "EU での Verbote に言及。" },
    },
    {
      id: "g-h2-q14",
      number: 14,
      prompt: "Die Forscherin fordert strengere Kontrollen in der Industrie.",
      options: [
        { id: "a", text: "stimmt" },
        { id: "b", text: "stimmt nicht" },
        { id: "c", text: "dazu wird nichts gesagt" },
      ],
      correctOptionId: "a",
      explanation: { summary: "strengere industrielle Vorgaben und Kontrollen。" },
    },
    {
      id: "g-h2-q15",
      number: 15,
      prompt: "Vollständige Eliminierung ist langfristig unrealistisch.",
      options: [
        { id: "a", text: "stimmt" },
        { id: "b", text: "stimmt nicht" },
        { id: "c", text: "dazu wird nichts gesagt" },
      ],
      correctOptionId: "a",
      explanation: { summary: "「Langfristig unrealistisch」。" },
    },
  ],
};
