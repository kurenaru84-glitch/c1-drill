import type { ExamSection } from "@/lib/exam-types";

const passageBody = `In Deutschland entstehen täglich neue Start-ups – viele mit dem Anspruch, gesellschaftliche Probleme zu lösen. Eines davon ist GreenBowl: ein Unternehmen, das frische, regionale Mahlzeiten in wiederverwendbaren Behältern anbietet.

Der Name verrät das Konzept: In über 30 Städten können Kundinnen und Kunden vegetarische und vegane Gerichte bestellen, die direkt an den Arbeitsplatz oder nach Hause geliefert werden. Die Zutaten stammen überwiegend von Bauern aus der Umgebung, [1] die Lieferketten kurz und transparent bleiben.

Nach jeder Lieferung werden die Edelstahlbehälter zurückgenommen, gereinigt und [2] wiederverwendet. Auf diese Weise entsteht nahezu kein Verpackungsmüll – ein Vorteil, den viele Berufstätige schätzen, die unter der Woche wenig Zeit zum Kochen haben.

GreenBowl arbeitet mit lokalen Köchinnen und Köchen zusammen, [3] jede Region ihre eigenen Spezialitäten anbieten kann. In München dominieren bayerisch inspirierte Gerichte, in Hamburg eher maritime Varianten. Trotz dieser Vielfalt gelten [4] Qualitätsstandards, die in allen Partnerküchen eingehalten werden müssen.

Das Unternehmen finanziert sich nicht nur durch Verkaufserlöse, sondern auch durch Kooperationen mit Firmen, [5] ihren Mitarbeitenden vergünstigte Mittagsangebote bereitstellen wollen. Für viele Unternehmen ist das ein attraktives Instrument, um Nachhaltigkeit im Arbeitsalltag sichtbar zu machen.

Kritiker bemängeln, dass die Preise über dem Durchschnitt liegen. Die Gründer entgegnen, dass faire Löhne und ökologische Produktion ihren Preis haben – und dass viele Kundinnen und Kunden bereit sind, [6] etwas mehr zu zahlen, wenn Qualität und Umweltbewusstsein stimmen.

Seit der Gründung vor vier Jahren ist GreenBowl kontinuierlich gewachsen. [7] plant das Team die Expansion in weitere europäische Metropolen. Experten sehen darin ein Zeichen dafür, dass nachhaltige Ernährung längst kein Nischenthema mehr ist, sondern [8] zum Mainstream geworden ist.`;

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
    body: passageBody,
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
          "「地域の農家から調達する」の目的は「サプライチェーンを短く透明に保つ」こと。Zweck を表す damit が正解。um だけでは不定詞が続かず文が未完成。während/obwohl は時間・逆接で文脈に合わない。",
        wrong: {
          a: "um の後には不定詞が必要（um … zu）。ここは dass-Satz 相当の構造。",
          c: "während は「〜の間に」または「一方で」。目的ではない。",
          d: "obwohl は逆接。「農家から調達する」ことと矛盾する関係ではない。",
        },
        tip: "Goethe Lesen 1 は damit / sodass / denen などの接続が頻出。前後の因果・目的を必ず確認。",
      },
    },
    {
      id: "g-l1-q2",
      number: 2,
      prompt: "Nach jeder Lieferung werden die Edelstahlbehälter zurückgenommen, gereinigt und ___ wiederverwendet.",
      options: [
        { id: "a", text: "erneut" },
        { id: "b", text: "endlich" },
        { id: "c", text: "eher" },
        { id: "d", text: "einzig" },
      ],
      correctOptionId: "a",
      explanation: {
        summary: "容器は洗浄後に「再び」使われる。erneut がリサイクル循環を正確に表す。",
        wrong: {
          b: "endlich（ついに）は時間の経過を強調し、再利用の反復とは無関係。",
          c: "eher（むしろ）は比較・傾向。ここでは不要。",
          d: "einzig（唯一の）と wiederverwendet の組み合わせが不自然。",
        },
      },
    },
    {
      id: "g-l1-q3",
      number: 3,
      prompt: "GreenBowl arbeitet mit lokalen Köchinnen und Köchen zusammen, ___ jede Region ihre eigenen Spezialitäten anbieten kann.",
      options: [
        { id: "a", text: "sodass" },
        { id: "b", text: "falls" },
        { id: "c", text: "ob" },
        { id: "d", text: "als" },
      ],
      correctOptionId: "a",
      explanation: {
        summary: "地元シェフとの協力の「結果」として地域ごとのメニューが可能になる。sodass（結果）が正解。",
        wrong: {
          b: "falls は条件「もし〜なら」。",
          c: "ob は間接疑問・選択。",
          d: "als は時間「〜したとき」または比較。",
        },
      },
    },
    {
      id: "g-l1-q4",
      number: 4,
      prompt: "Trotz dieser Vielfalt gelten ___ Qualitätsstandards, die in allen Partnerküchen eingehalten werden müssen.",
      options: [
        { id: "a", text: "einheitliche" },
        { id: "b", text: "einzelne" },
        { id: "c", text: "einmalige" },
        { id: "d", text: "eindeutige" },
      ],
      correctOptionId: "a",
      explanation: {
        summary: "地域差があっても「統一された」品質基準が全厨房に適用される。einheitliche が文脈に合う。",
        wrong: {
          b: "einzelne（個々の）なら基準がバラバラになり、後半の「全厨房で守る」と矛盾。",
          c: "einmalige は「一度きりの」。",
          d: "eindeutige は「明確な」。意味は近いが、統一性のニュアンスが弱い。",
        },
      },
    },
    {
      id: "g-l1-q5",
      number: 5,
      prompt: "… durch Kooperationen mit Firmen, ___ ihren Mitarbeitenden vergünstigte Mittagsangebote bereitstellen wollen.",
      options: [
        { id: "a", text: "die" },
        { id: "b", text: "denen" },
        { id: "c", text: "deren" },
        { id: "d", text: "den" },
      ],
      correctOptionId: "b",
      explanation: {
        summary: "mit Firmen + Dativ → denen。関係代名詞の格変化問題。",
        wrong: {
          a: "die は主格・直接目的格。mit の後は与格。",
          c: "deren は所有格（〜の）。",
          d: "den は直接目的格単数。",
        },
        tip: "前置詞 + Relativpronomen の格は C1 頻出。mit → Dativ を即答できるように。",
      },
    },
    {
      id: "g-l1-q6",
      number: 6,
      prompt: "… viele Kundinnen und Kunden bereit sind, ___ etwas mehr zu zahlen, wenn Qualität und Umweltbewusstsein stimmen.",
      options: [
        { id: "a", text: "dafür" },
        { id: "b", text: "deshalb" },
        { id: "c", text: "trotzdem" },
        { id: "d", text: "dennoch" },
      ],
      correctOptionId: "a",
      explanation: {
        summary: "「品質と環境意識のために」多く払う。dafür が Gegenleistung を表す。",
        wrong: {
          b: "deshalb は理由「そのため」。",
          c: "trotzdem / dennoch は逆接「それでも」。",
        },
      },
    },
    {
      id: "g-l1-q7",
      number: 7,
      prompt: "Seit der Gründung vor vier Jahren ist GreenBowl kontinuierlich gewachsen. ___ plant das Team die Expansion in weitere europäische Metropolen.",
      options: [
        { id: "a", text: "Zuletzt" },
        { id: "b", text: "Dennoch" },
        { id: "c", text: "Dementsprechend" },
        { id: "d", text: "Demnächst" },
      ],
      correctOptionId: "d",
      explanation: {
        summary: "新都市への拡大は「近い将来の」計画。Demnächst が未来の予定を示す。",
        wrong: {
          a: "Zuletzt は「最後に／最近」＝過去。",
          b: "Dennoch は逆接。",
          c: "Dementsprechend は「それに応じて」＝前件からの帰結。",
        },
      },
    },
    {
      id: "g-l1-q8",
      number: 8,
      prompt: "… nachhaltige Ernährung längst kein Nischenthema mehr ist, sondern ___ zum Mainstream geworden ist.",
      options: [
        { id: "a", text: "langsam" },
        { id: "b", text: "zunehmend" },
        { id: "c", text: "plötzlich" },
        { id: "d", text: "vorübergehend" },
      ],
      correctOptionId: "b",
      explanation: {
        summary: "4年間の継続的な成長と整合するのは「ますます」主流化する zunehmend。",
        wrong: {
          a: "langsam は弱すぎる。",
          c: "plötzlich は「突然」＝4年の成長と矛盾。",
          d: "vorübergehend は「一時的な」。",
        },
      },
    },
  ],
};
