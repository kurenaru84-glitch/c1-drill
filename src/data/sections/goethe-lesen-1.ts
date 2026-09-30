import type { ExamSection, PassageParagraph } from "@/lib/exam-types";

const paragraphs: PassageParagraph[] = [
  {
    original:
      "In Deutschland entstehen täglich neue Start-ups – viele mit dem Anspruch, gesellschaftliche Probleme zu lösen. Eines davon ist GreenBowl: ein Unternehmen, das frische, regionale Mahlzeiten in wiederverwendbaren Behältern anbietet.",
    translation:
      "ドイツでは毎日新しいスタートアップが生まれ、多くは社会問題の解決を目指しています。GreenBowl もそのひとつで、再利用可能な容器で新鮮な地域の食事を提供する企業です。",
    studyNotes: {
      chunks: [
        { phrase: "mit dem Anspruch", meaning: "〜を目指して・〜という志向で" },
        { phrase: "wiederverwendbare Behälter", meaning: "再利用可能な容器" },
      ],
      grammar: [
        { pattern: "eines davon ist …", explanation: "「その中のひとつは〜」という指示表現。" },
      ],
      vocabulary: [
        { term: "Start-ups", meaning: "スタートアップ" },
        { term: "Anspruch", meaning: "志向、要求水準" },
        { term: "regional", meaning: "地域の" },
      ],
    },
  },
  {
    original:
      "In über 30 Städten können Kundinnen und Kunden vegetarische und vegane Gerichte bestellen, die direkt an den Arbeitsplatz oder nach Hause geliefert werden. Die Zutaten stammen überwiegend von Bauern aus der Umgebung, damit die Lieferketten kurz und transparent bleiben.",
    translation:
      "30以上の都市で、ベジタリアン・ヴィーガン料理を職場や自宅まで直接配達できます。食材は主に近隣の農家から仕入れ、サプライチェーンを短く透明に保っています。",
    studyNotes: {
      chunks: [
        { phrase: "stammen von", meaning: "〜に由来する、〜から来る" },
        { phrase: "damit … bleiben", meaning: "〜が〜のままであるように（目的）" },
      ],
      grammar: [
        { pattern: "damit + Nebensatz", explanation: "目的を表す damit（= damit … können/bleiben）。" },
      ],
      vocabulary: [
        { term: "Lieferkette", meaning: "サプライチェーン" },
        { term: "transparent", meaning: "透明な、見える化された" },
        { term: "Zutaten", meaning: "食材" },
      ],
    },
  },
  {
    original:
      "Nach jeder Lieferung werden die Edelstahlbehälter zurückgenommen, gereinigt und erneut wiederverwendet. Auf diese Weise entsteht nahezu kein Verpackungsmüll.",
    translation:
      "配達のたびにステンレス容器を回収・洗浄し、再び使います。こうして包装ゴミはほぼ発生しません。",
    studyNotes: {
      chunks: [
        { phrase: "zurückgenommen werden", meaning: "回収される（受動態）" },
        { phrase: "auf diese Weise", meaning: "この方法で、こうして" },
      ],
      grammar: [],
      vocabulary: [
        { term: "Edelstahl", meaning: "ステンレス" },
        { term: "erneut", meaning: "再び" },
        { term: "Verpackungsmüll", meaning: "包装ゴミ" },
      ],
    },
  },
  {
    original:
      "GreenBowl arbeitet mit lokalen Köchinnen und Köchen zusammen, sodass jede Region ihre eigenen Spezialitäten anbieten kann. Trotz dieser Vielfalt gelten einheitliche Qualitätsstandards in allen Partnerküchen.",
    translation:
      "地域の料理人と協力し、各地域が独自の料理を提供できます。多様性があっても、すべての提携厨房で統一された品質基準が適用されます。",
    studyNotes: {
      chunks: [
        { phrase: "sodass", meaning: "その結果〜（結果・目的の接続）" },
        { phrase: "trotz dieser Vielfalt", meaning: "この多様性にもかかわらず" },
      ],
      grammar: [
        { pattern: "trotz + Genitiv", explanation: "「〜にもかかわらず」。trotz dieser Vielfalt。" },
      ],
      vocabulary: [
        { term: "einheitlich", meaning: "統一された" },
        { term: "Spezialitäten", meaning: "名物料理" },
        { term: "Partnerküchen", meaning: "提携厨房" },
      ],
    },
  },
  {
    original:
      "Das Unternehmen finanziert sich auch durch Kooperationen mit Firmen, denen Mitarbeitenden vergünstigte Mittagsangebote bereitstellen wollen.",
    translation:
      "企業は、従業員に割引ランチを提供したい会社との協力でも収益を得ています。",
    studyNotes: {
      chunks: [
        { phrase: "sich finanzieren", meaning: "資金を調達する・収益で運営する" },
        { phrase: "vergünstigte Angebote", meaning: "割引価格の提供" },
      ],
      grammar: [
        { pattern: "mit Firmen, denen …", explanation: "mit + Dativ → Relativpronomen denen。" },
      ],
      vocabulary: [
        { term: "Kooperation", meaning: "協力、提携" },
        { term: "bereitstellen", meaning: "提供する" },
        { term: "vergünstigt", meaning: "割引の" },
      ],
    },
  },
  {
    original:
      "Kritiker bemängeln die hohen Preise. Die Gründer entgegnen, dass viele Kundinnen bereit sind, dafür etwas mehr zu zahlen, wenn Qualität und Umweltbewusstsein stimmen.",
    translation:
      "批判者は価格の高さを指摘します。創業者は、品質と環境意識が伴えば多くの顧客がそれに見合う支払いを惜しまないと反論します。",
    studyNotes: {
      chunks: [
        { phrase: "entgegnen, dass", meaning: "〜と反論する" },
        { phrase: "dafür etwas mehr zahlen", meaning: "そのために多めに払う" },
      ],
      grammar: [],
      vocabulary: [
        { term: "bemängeln", meaning: "批判する、指摘する" },
        { term: "Umweltbewusstsein", meaning: "環境意識" },
        { term: "Gründer", meaning: "創業者" },
      ],
    },
  },
  {
    original:
      "Seit der Gründung vor vier Jahren ist GreenBowl kontinuierlich gewachsen. Demnächst plant das Team die Expansion in weitere europäische Metropolen.",
    translation:
      "創業から4年で GreenBowl は着実に成長しました。近いうちに、さらに欧州の大都市への拡大を計画しています。",
    studyNotes: {
      chunks: [
        { phrase: "kontinuierlich wachsen", meaning: "継続的に成長する" },
        { phrase: "demnächst", meaning: "近いうちに、まもなく" },
      ],
      grammar: [],
      vocabulary: [
        { term: "Expansion", meaning: "拡大" },
        { term: "Metropole", meaning: "大都市" },
        { term: "Gründung", meaning: "創業" },
      ],
    },
  },
  {
    original:
      "Experten sehen darin ein Zeichen dafür, dass nachhaltige Ernährung längst kein Nischenthema mehr ist, sondern zunehmend zum Mainstream geworden ist.",
    translation:
      "専門家は、持続可能な食がもはやニッチなテーマではなく、ますます主流になっている証だと見ています。",
    studyNotes: {
      chunks: [
        { phrase: "kein Nischenthema mehr", meaning: "もはやニッチではない" },
        { phrase: "zunehmend zum Mainstream", meaning: "ますます主流へ" },
      ],
      grammar: [
        { pattern: "nicht … sondern …", explanation: "「〜ではなくむしろ〜」の対比。" },
      ],
      vocabulary: [
        { term: "nachhaltig", meaning: "持続可能な" },
        { term: "Nischenthema", meaning: "ニッチなテーマ" },
        { term: "Mainstream", meaning: "主流" },
      ],
    },
  },
];

export const goetheLesen1: ExamSection = {
  id: "goethe-lesen-1",
  provider: "goethe",
  skill: "lesen",
  partNumber: 1,
  title: "Lesen Teil 1",
  titleJa: "読解パート1 — 空所補充",
  description: "Konnektoren・Relativsätze・Kollokationen",
  estimatedMinutes: 10,
  instruction: "Wählen Sie für jede Lücke die richtige Lösung.",
  passage: {
    title: "JUNGE UNTERNEHMEN DER ERNÄHRUNGSBRANCHE",
    subtitle: "GreenBowl",
    paragraphs,
  },
  questions: [
    {
      id: "g-l1-q1",
      number: 1,
      prompt: "Die Zutaten stammen überwiegend von Bauern aus der Umgebung, ___ die Lieferketten kurz und transparent bleiben.",
      options: [
        { id: "a", text: "um" },
        { id: "b", text: "damit" },
        { id: "c", text: "während" },
        { id: "d", text: "obwohl" },
      ],
      correctOptionId: "b",
      explanation: {
        summary:
          "「地域の農家から調達する」の目的は「サプライチェーンを短く透明に保つ」こと。Zweck を表す damit が正解。",
        wrong: {
          a: "um の後には不定詞が必要（um … zu）。",
          c: "während は時間・対比。目的ではない。",
          d: "obwohl は逆接。",
        },
        tip: "Goethe Lesen 1 は damit / sodass / denen などの接続が頻出。",
      },
    },
    {
      id: "g-l1-q2",
      number: 2,
      prompt: "… gereinigt und ___ wiederverwendet.",
      options: [
        { id: "a", text: "erneut" },
        { id: "b", text: "endlich" },
        { id: "c", text: "eher" },
        { id: "d", text: "einzig" },
      ],
      correctOptionId: "a",
      explanation: {
        summary: "容器は洗浄後に「再び」使われる。erneut がリサイクル循環を表す。",
      },
    },
    {
      id: "g-l1-q3",
      number: 3,
      prompt: "… zusammen, ___ jede Region ihre eigenen Spezialitäten anbieten kann.",
      options: [
        { id: "a", text: "sodass" },
        { id: "b", text: "falls" },
        { id: "c", text: "ob" },
        { id: "d", text: "als" },
      ],
      correctOptionId: "a",
      explanation: {
        summary: "協力の結果として地域メニューが可能 → sodass。",
      },
    },
    {
      id: "g-l1-q4",
      number: 4,
      prompt: "Trotz dieser Vielfalt gelten ___ Qualitätsstandards …",
      options: [
        { id: "a", text: "einheitliche" },
        { id: "b", text: "einzelne" },
        { id: "c", text: "einmalige" },
        { id: "d", text: "eindeutige" },
      ],
      correctOptionId: "a",
      explanation: {
        summary: "地域差があっても「統一された」基準。einheitliche。",
      },
    },
    {
      id: "g-l1-q5",
      number: 5,
      prompt: "… mit Firmen, ___ ihren Mitarbeitenden vergünstigte Mittagsangebote bereitstellen wollen.",
      options: [
        { id: "a", text: "die" },
        { id: "b", text: "denen" },
        { id: "c", text: "deren" },
        { id: "d", text: "den" },
      ],
      correctOptionId: "b",
      explanation: {
        summary: "mit Firmen + Dativ → denen。",
        tip: "前置詞 + Relativpronomen の格は C1 頻出。",
      },
    },
    {
      id: "g-l1-q6",
      number: 6,
      prompt: "… bereit sind, ___ etwas mehr zu zahlen …",
      options: [
        { id: "a", text: "dafür" },
        { id: "b", text: "deshalb" },
        { id: "c", text: "trotzdem" },
        { id: "d", text: "dennoch" },
      ],
      correctOptionId: "a",
      explanation: {
        summary: "品質と環境意識の「ために」多く払う → dafür。",
      },
    },
    {
      id: "g-l1-q7",
      number: 7,
      prompt: "___ plant das Team die Expansion …",
      options: [
        { id: "a", text: "Zuletzt" },
        { id: "b", text: "Dennoch" },
        { id: "c", text: "Dementsprechend" },
        { id: "d", text: "Demnächst" },
      ],
      correctOptionId: "d",
      explanation: {
        summary: "将来の拡大計画 → Demnächst（近いうちに）。",
      },
    },
    {
      id: "g-l1-q8",
      number: 8,
      prompt: "… sondern ___ zum Mainstream geworden ist.",
      options: [
        { id: "a", text: "langsam" },
        { id: "b", text: "zunehmend" },
        { id: "c", text: "plötzlich" },
        { id: "d", text: "vorübergehend" },
      ],
      correctOptionId: "b",
      explanation: {
        summary: "4年の継続的な成長と整合 → zunehmend（ますます）。",
      },
    },
  ],
};
