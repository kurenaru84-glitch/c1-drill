import type { ExamSection } from "@/lib/exam-types";

const passageBody = `Können Algorithmen uns beim Alltag helfen? Die Antwort lautet: wahrscheinlich ja — wenn wir verstehen, was sie können und was nicht. Denn KI-Systeme erkennen Muster in Daten, treffen aber keine bewussten Entscheidungen.

In vielen Bereichen ist das nützlich: Navigationssysteme schlagen schnellere Routen vor, Übersetzungsprogramme erleichtern die Kommunikation, und medizinische Diagnose-Software kann Ärztinnen und Ärzte bei der Auswertung von Bildern unterstützen. [1] Gleichzeitig entstehen neue Risiken: Wer Daten sammelt, kann auch Daten missbrauchen.

Besonders umstritten ist der Einsatz von KI in der Personalauswahl. Software analysiert Bewerbungsunterlagen und bewertet Kandidatinnen und Kandidaten — oft ohne dass die Betroffenen wissen, nach welchen Kriterien entschieden wird. [2] Kritiker warnen, dass bestehende Vorurteile in den Trainingsdaten verstärkt werden könnten.

Auch im Bildungsbereich wird diskutiert, ob Chatbots Schülerinnen und Schülern bei Hausaufgaben helfen oder ob sie das eigenständige Denken ersetzen. [3] Bildungsexpertinnen betonen deshalb, dass digitale Werkzeuge didaktisch begleitet werden müssen.

Die Europäische Union hat mit der KI-Verordnung erstmals umfassende Regeln geschaffen. Hochriskante Anwendungen — etwa in der Medizin oder im öffentlichen Raum — müssen strenger geprüft werden. [4] Verbraucherschützerinnen halten die Regelungen für einen wichtigen, aber noch nicht ausreichenden Schritt.

Für den Einzelnen bleibt die Frage: Wie gehe ich verantwortungsvoll mit KI um? Experten empfehlen, sensible Daten nicht unreflektiert einzugeben und die Ergebnisse von KI-Programmen kritisch zu prüfen. [5] Nur so lässt sich verhindern, dass wir Technologie blind vertrauen.

Langfristig wird KI unser Leben weiter verändern — ob zum Guten oder Schlechten, hängt von politischen Entscheidungen und unserem eigenen Verhalten ab. [6]`;

const sentenceBank = `a | Allerdings fehlt es an wirksamen Kontrollmechanismen in vielen Ländern außerhalb Europas.
b | Am Ende kommt es darauf an, Technologie als Werkzeug und nicht als Ersatz für Urteilsvermögen zu nutzen.
c | Aus eigener Erfahrung wissen wir, wie schnell man sich auf automatische Vorschläge verlässt.
d | Dabei handelt es sich um eine grundlegende Anforderung an Transparenz und Fairness.
e | Doch selbst die besten Regeln nützen wenig, wenn Bürgerinnen und Bürger nicht informiert sind.
f | In der Praxis zeigt sich jedoch, dass viele Anwendungen bereits heute ohne ausreichende Aufsicht eingesetzt werden.
g | Ohne klare Grenzen droht die Privatsphäre Schritt für Schritt zu verschwinden.
h | Zunächst müssen wir definieren, welche Aufgaben Menschen vorbehalten bleiben sollen.`;

export const telcLesen1: ExamSection = {
  id: "telc-lesen-1",
  provider: "telc",
  skill: "lesen",
  partNumber: 1,
  title: "Leseverstehen Teil 1",
  titleJa: "読解パート1 — 文挿入",
  description: "Satz-Zuordnung (a–h)",
  estimatedMinutes: 15,
  instruction: "Welche Sätze a–h gehören in die Lücken 1–6? Zwei Sätze passen nicht.",
  passage: {
    title: "Künstliche Intelligenz im Alltag — Chance oder Risiko?",
    body: `${passageBody}\n\n---\nSatzbank:\n${sentenceBank}`,
  },
  questions: [
    {
      id: "t-l1-q1",
      number: 1,
      prompt: "Lücke 1 — nach dem Absatz über nützliche KI-Anwendungen",
      options: [
        { id: "a", text: "a — Kontrollmechanismen außerhalb Europas" },
        { id: "b", text: "b — Technologie als Werkzeug nutzen" },
        { id: "c", text: "c — automatische Vorschläge" },
        { id: "d", text: "d — Transparenz und Fairness" },
        { id: "e", text: "e — Bürger nicht informiert" },
        { id: "f", text: "f — Anwendungen ohne Aufsicht" },
        { id: "g", text: "g — Privatsphäre verschwindet" },
        { id: "h", text: "h — Aufgaben für Menschen definieren" },
      ],
      correctOptionId: "f",
      explanation: {
        summary:
          "有用な例の直後に「Gleichzeitig entstehen neue Risiken」。f は「実際には十分な監督なく使われている」というリスクの具体化。",
        wrong: {
          g: "プライバシー全般の警告だが、ここはデータ収集・悪用の文脈。",
          h: "人間に残すタスクの定義は後の段落向き。",
        },
      },
    },
    {
      id: "t-l1-q2",
      number: 2,
      prompt: "Lücke 2 — nach Personalauswahl mit KI",
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
      explanation: {
        summary:
          "採用AIで基準が不明 → d「透明性と公平性への基本的な要求」が論理的に続く。",
        wrong: {
          b: "個人の責ある利用は後半（Lücke 5–6）向き。",
        },
      },
    },
    {
      id: "t-l1-q3",
      number: 3,
      prompt: "Lücke 3 — Bildungsbereich / Chatbots",
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
      explanation: {
        summary: "教育での Chatbot 議論 →「まず人間に残すべきタスクを定義すべき」h が自然。",
      },
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
      explanation: {
        summary: "規制は重要だが不十分 → e「市民が情報を持たなければ最高の規則も無意味」。",
      },
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
      explanation: {
        summary: "批判的に検証する推奨の後、c「自動提案にすぐ頼る」という身近な経験が説得力を加える。",
      },
    },
    {
      id: "t-l1-q6",
      number: 6,
      prompt: "Lücke 6 — Schluss des Textes",
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
        summary: "結論：善悪は政治と個人の行動次第 → b「道具として使い、判断力の代わりにしない」。",
        tip: "telc Lesen 1 は文の論理接続が鍵。前後の接続詞（Gleichzeitig, Deshalb）に注目。",
      },
    },
  ],
};
