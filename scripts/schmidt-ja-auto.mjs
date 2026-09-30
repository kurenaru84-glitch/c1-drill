/**
 * Lektion 2–5: 書籍のドイツ語解説から日本語解説を組み立て、誤答ヒントを生成
 */

/** 巻末一覧・Lösungen のドイツ語パターン → 日本語（主要 NVV） */
const DE_GLOSS = [
  [/missverstehen|falsch verstehen|falsch interpretieren/i, "誤解する・取り違える"],
  [/unbegründet|erfunden|absurd|abwegig/i, "根拠がない・でっち上げ"],
  [/betrügen/i, "だます"],
  [/gehorchen|folgen|fügen/i, "言いなりになる・従う"],
  [/offenherzig|direkt|Gefühle aussprechen/i, "率直である・思ったことを口にする"],
  [/abgelehnt|Ablehnung|Anklang finden/i, "拒否される・受け入れられない"],
  [/sich nähern|Anmarsch/i, "近づいてくる（多くはマイナス）"],
  [/unterbinden|verhindern|Riegel/i, "阻止する・食い止める"],
  [/bevorstehen|ins Haus stehen/i, "間近に迫っている"],
  [/empfehlen|ans Herz legen/i, "強く勧める・心に留めて勧める"],
  [/falschen Hände/i, "不適切な人の手に渡る"],
  [/im Bau befinden/i, "建設中である"],
  [/zu Ohren kommen/i, "耳に入る・聞き及ぶ"],
  [/Däumchen drehen/i, "何もせずくつろぐ"],
  [/in den Schatten stellen/i, "凌駕する・影にする"],
  [/an den Nagel hängen/i, "（仕事などを）やめる"],
  [/aus der Affäre ziehen/i, "困った状況からうまく逃れる"],
  [/Prüfung.*ablegen/i, "試験を受ける・合格する"],
  [/auf der Hut/i, "用心する・警戒する"],
  [/Kredit aufnehmen/i, "ローンを組む"],
  [/zur Sprache bringen/i, "話題にする"],
  [/Frist setzen/i, "期限を設定する"],
  [/auf die Folter spannen/i, "じらす・長く待たせる"],
  [/aus der Reihe tanzen/i, "周りと違う行動をする"],
  [/Handtuch werfen/i, "あきらめる"],
  [/leichte Schulter/i, "軽く考える・なめてかかる"],
  [/Hintertreffen/i, "遅れ・不利な立場になる"],
  [/in Erfüllung/i, "実現する"],
  [/in die Jahre kommen/i, "老朽化する"],
  [/Bedenken haben/i, "懸念・疑いを持つ"],
  [/Verantwortung tragen/i, "責任を負う"],
  [/Beachtung schenken/i, "注意を払う"],
  [/am Herzen liegen/i, "とても大切である"],
  [/Auge zudrücken/i, "見て見ぬふりをする・大目に見る"],
  [/in die Irre führen/i, "誤解させる・迷わせる"],
  [/in die Schuhe schieben/i, "罪をなすりつける"],
  [/Bedrängnis/i, "窮地に陥る"],
  [/Attentat.*vorhaben/i, "（冗談で）お願いがある"],
  [/auf den Grund gehen/i, "原因を究明する"],
  [/vor Augen führen/i, "はっきり思い知らせる"],
  [/Beifall ernten/i, "拍手・賛同を得る"],
  [/im Keim ersticken/i, "芽のうちに潰す"],
  [/Samthandschuhen/i, "慎重に・丁寧に扱う"],
  [/in Erwägung ziehen/i, "検討に入れる"],
  [/nach Atem ringen|nach Luft ringen/i, "息を切らす"],
  [/Opfer bringen/i, "犠牲を払う・譲る"],
  [/Hohn und Spott/i, "あざ笑いを買う"],
  [/in Streik treten/i, "ストライキに入る"],
  [/aus dem Weg gehen/i, "避ける"],
  [/gegen den Strich/i, "不快・反感を抱く"],
  [/Abschussliste/i, "解雇候補・切り捨て候補"],
  [/Posten.*antreten/i, "就任する"],
  [/Vortrag halten/i, "講演する"],
  [/Entschluss fassen/i, "決心する"],
  [/in Kenntnis setzen/i, "知らせる"],
  [/in Kauf nehmen/i, "（不都合を）受け入れる"],
  [/Bild.*machen/i, "イメージを持つ・判断する"],
  [/Anschein erwecken/i, "…のように見せる"],
  [/Lebensunterhalt.*bestreiten/i, "生活費を稼ぐ"],
  [/Kritik üben/i, "批判する"],
  [/mit Vorsicht genießen/i, "鵜呑みにしない"],
  [/in die Knie gehen/i, "屈服する"],
  [/zu Herzen nehmen/i, "深く気にする"],
  [/schiefe Bahn/i, "悪い道にそれる"],
  [/aus der Welt schaffen/i, "片づける"],
  [/über einen Kamm scheren/i, "一律に扱う"],
  [/Anklang finden/i, "好評を得る"],
  [/übers Knie brechen/i, "軽率に決める"],
  [/Abhängigkeit/i, "依存関係に陥る"],
  [/zur Rede stellen/i, "問い詰める"],
  [/außer Frage/i, "疑いのない"],
  [/Bedarf decken/i, "需要を満たす"],
  [/richtigen Adresse/i, "頼むべき相手である"],
  [/Prüfung unterziehen/i, "検査・試験にかける"],
  [/Geheimnis.*behalten|bewahren/i, "秘密を守る"],
  [/Auge.*werfen/i, "目をつける・興味を持つ"],
  [/Initiative ergreifen/i, "率先して動く"],
  [/in jemandes Lage versetzen/i, "立場に立って考える"],
  [/im Hinterkopf behalten/i, "心の片隅に留める"],
  [/hinter vorgehaltener Hand/i, "内密に・ひそひそ"],
];

export function meaningJaFromDe(de, nvv, num) {
  const phrase = pickNvvPhrase(de, nvv);
  const lines = [];
  if (phrase) lines.push(`正解は「${phrase}」。`);
  if (de) {
    const hints = [];
    for (const [re, ja] of DE_GLOSS) {
      if (re.test(de)) hints.push(ja);
    }
    if (hints.length) {
      lines.push(hints.slice(0, 3).join("／"));
    } else {
      lines.push(
        "書籍の言い換え：ドイツ語の同義表現どおり、文脈に合う固定コロケーションを選ぶ。"
      );
    }
  } else if (nvv) {
    lines.push(
      `この空所は「${nvv}」と動詞・前置詞がセットの NVV。Lektion 内の例文とセットで暗記してください。`
    );
  } else {
    lines.push("慣用句全体（名詞＋動詞）を思い出して選ぶ。");
  }
  return lines.join("");
}

function pickNvvPhrase(de, nvv) {
  if (!de) return nvv || "";
  const beforeEq = de.split("=")[0]?.trim();
  if (beforeEq && beforeEq.length < 120) return beforeEq.replace(/\s+/g, " ");
  return nvv || "";
}

export function defaultWrongHints(options, correctId, nvv, prompt) {
  const wrong = {};
  const lowerPrompt = prompt.toLowerCase();
  for (const o of options) {
    if (o.id === correctId) continue;
    const t = o.text;
    let msg = `「${t}」はこの文の NVV パターンと結びつきません。`;
    if (nvv && !lowerPrompt.includes(t.toLowerCase()) && t.length < 25) {
      msg += `正解は「${nvv}」周辺の慣用句です。`;
    }
    wrong[o.id] = msg;
  }
  return wrong;
}
