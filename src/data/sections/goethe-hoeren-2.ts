import type { ExamSection } from "@/lib/exam-types";

const transcript = `Moderator: Mikroplastik gilt als unsichtbare Bedrohung. Wo stehen wir, Frau Dr. Meier?

Meier: Wir finden Mikroplastik heute nicht nur im Meer, sondern auch in Böden, Flüssen – und zunehmend in der Luft. Das ist besorgniserregend, weil wir es einatmen können.

Moderator: Ihre Studie untersuchte Proben aus verschiedenen Kontinenten, auch aus Entwicklungsländern?

Meier: Ja, weltweit – nicht nur Industrieländer. Das Problem ist global.

Moderator: Sollten wir komplett auf Plastik verzichten?

Meier: Vollständiger Verzicht ist unrealistisch. Aber Einwegprodukte können wir reduzieren. Besonders problematisch sind Mikrofasern aus synthetischer Kleidung – beim Waschen gelangen sie ins Abwasser.

Moderator: Reicht individuelles Verhalten?

Meier: Nein, allein schaffen wir das nicht. Wir brauchen strengere industrielle Vorgaben und Kontrollen. In der EU gibt es bereits Verbote für bestimmte Einwegartikel – ein erster Schritt.

Moderator: Kann Mikroplastik vollständig eliminiert werden?

Meier: Langfristig unrealistisch. Wir können die Belastung aber deutlich senken.`;

export const goetheHoeren2: ExamSection = {
  id: "goethe-hoeren-2",
  provider: "goethe",
  skill: "horen",
  partNumber: 2,
  title: "Hören Teil 2",
  titleJa: "聴解パート2 — 正誤判断",
  description: "stimmt / stimmt nicht / nichts gesagt",
  estimatedMinutes: 12,
  instruction:
    "Hören Sie den Text (▶ 再生). Wählen Sie: a stimmt | b stimmt nicht | c dazu wird nichts gesagt",
  transcript,
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
        summary: "Meier は海だけでなく土・河川・空気にも存在すると述べる。「nur im Meer」は誤り。",
        wrong: {
          a: "海以外の場所にも言及がある。",
          c: "明確に否定されている。",
        },
        tip: "Hören Teil 2 最大の罠：only/always/never などの限定語を本文と照合。",
      },
    },
    {
      id: "g-h2-q8",
      number: 8,
      prompt: "Die Forscherin hält die Belastung der Luft durch Mikroplastik für besorgniserregend.",
      options: [
        { id: "a", text: "stimmt" },
        { id: "b", text: "stimmt nicht" },
        { id: "c", text: "dazu wird nichts gesagt" },
      ],
      correctOptionId: "a",
      explanation: {
        summary: "「in der Luft … besorgniserregend, weil wir es einatmen können」と直接述べる。",
        wrong: {
          b: "懸念を表明している。",
          c: "音声で明言。",
        },
      },
    },
    {
      id: "g-h2-q9",
      number: 9,
      prompt: "In der Studie wurden ausschließlich Proben aus Industrieländern untersucht.",
      options: [
        { id: "a", text: "stimmt" },
        { id: "b", text: "stimmt nicht" },
        { id: "c", text: "dazu wird nichts gesagt" },
      ],
      correctOptionId: "b",
      explanation: {
        summary: "「weltweit – nicht nur Industrieländer」。開発国も含む。",
        wrong: {
          a: "ausschließlich と矛盾。",
        },
      },
    },
    {
      id: "g-h2-q10",
      number: 10,
      prompt: "Die Forscherin empfiehlt, auf Einwegplastik vollständig zu verzichten.",
      options: [
        { id: "a", text: "stimmt" },
        { id: "b", text: "stimmt nicht" },
        { id: "c", text: "dazu wird nichts gesagt" },
      ],
      correctOptionId: "c",
      explanation: {
        summary:
          "完全なプラスチック断絶は「unrealistisch」。Einweg を減らすことは言うが、完全禁止の推奨はない → nichts gesagt。",
        wrong: {
          a: "完全断絶の推奨はない。",
          b: "「unrealistisch」と言っているが、選択肢の内容（推奨する）については「言及なし」が正解。",
        },
        tip: "c を選ぶとき：テーマに触れているが、選択肢の具体的な主張はされていない場合。",
      },
    },
    {
      id: "g-h2-q11",
      number: 11,
      prompt: "Mikrofasern aus Kleidung sind eine wichtige Quelle der Belastung.",
      options: [
        { id: "a", text: "stimmt" },
        { id: "b", text: "stimmt nicht" },
        { id: "c", text: "dazu wird nichts gesagt" },
      ],
      correctOptionId: "a",
      explanation: {
        summary: "「Besonders problematisch sind Mikrofasern aus synthetischer Kleidung」。",
        wrong: {
          b: "重要な污染源として明示。",
        },
      },
    },
    {
      id: "g-h2-q12",
      number: 12,
      prompt: "Die Forscherin glaubt, dass individuelles Verhalten allein das Problem lösen kann.",
      options: [
        { id: "a", text: "stimmt" },
        { id: "b", text: "stimmt nicht" },
        { id: "c", text: "dazu wird nichts gesagt" },
      ],
      correctOptionId: "b",
      explanation: {
        summary: "「Nein, allein schaffen wir das nicht」。個人の行動だけでは不十分。",
        wrong: {
          a: "明確に否定。",
        },
      },
    },
    {
      id: "g-h2-q13",
      number: 13,
      prompt: "In einigen Ländern gibt es bereits gesetzliche Beschränkungen für bestimmte Plastikprodukte.",
      options: [
        { id: "a", text: "stimmt" },
        { id: "b", text: "stimmt nicht" },
        { id: "c", text: "dazu wird nichts gesagt" },
      ],
      correctOptionId: "a",
      explanation: {
        summary: "「In der EU gibt es bereits Verbote für bestimmte Einwegartikel」。",
        wrong: {
          b: "EU での禁止措置に言及。",
        },
      },
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
      explanation: {
        summary: "「strengere industrielle Vorgaben und Kontrollen」。",
        wrong: {
          b: "産業規制の強化を要求。",
        },
      },
    },
    {
      id: "g-h2-q15",
      number: 15,
      prompt: "Langfristig sei eine vollständige Eliminierung von Mikroplastik unrealistisch.",
      options: [
        { id: "a", text: "stimmt" },
        { id: "b", text: "stimmt nicht" },
        { id: "c", text: "dazu wird nichts gesagt" },
      ],
      correctOptionId: "a",
      explanation: {
        summary: "「Langfristig unrealistisch」とそのまま述べる。",
        wrong: {
          b: "完全除去の非現実性を認めている。",
        },
      },
    },
  ],
};
