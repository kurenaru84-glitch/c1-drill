#!/usr/bin/env node
/**
 * Fix studyNotes: remove placeholders, keep good entries, fill from master dict + known patterns only.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTICLES_DIR = path.join(__dirname, "../src/data/articles");

const BAD_CHUNK = /段落から抽出|実践表現/;
const BAD_VOCAB = /段落の重要語/;
const BAD_GRAMMAR = /この文の構造・語順に注目/;
const GENERIC_GRAMMAR = /^(that-clause|relative clause|When \+ clause, main clause|If \+ condition, result|not A but B|By \+ gerund \(series\)|Relativsatz \(der\/die\/das\)|Wenn \+ Nebensatz|Als \+ Nebensatz)$/;

const STOP = new Set([
  "the","a","an","and","or","but","in","on","at","to","for","of","with","by","from","as","is","are","was","were",
  "be","been","have","has","had","do","does","did","will","would","could","should","may","might","can","that",
  "this","these","those","it","its","they","them","their","we","our","you","your","he","she","his","her","who",
  "which","what","when","where","how","why","if","not","no","so","than","then","also","just","more","most","very",
  "too","into","over","after","before","during","while","both","all","any","each","every","some","only","own",
  "same","other","one","new","now","here","there","up","out","off","down","even","about","such","like","well",
  "der","die","das","und","ist","sind","war","ein","eine","nicht","auch","noch","schon","nur","sehr","als","wenn",
  "weil","dass","es","sie","er","wir","man","ich","du","den","dem","des","einer","einem","einen","eines","zum",
  "zur","für","mit","von","zu","auf","aus","bei","nach","über","unter","ohne","durch","doch","wurde","wird",
  "werden","haben","hat","kann","muss","soll","sich","mir","dir","uns","ihm","ihr","ihnen","mein","dein","sein",
  "always","never","often","sometimes","usually","really","very","much","many","few","little","every","each",
]);

function hasJapanese(text) {
  return /[\u3040-\u30ff\u4e00-\u9faf]/.test(text);
}

function isGerman(text) {
  return /[äöüßÄÖÜ]/.test(text) || /\b(der|die|das|und|nicht|sich|Wenn|weil|dass|aber|doch)\b/.test(text);
}

function isProperNoun(term) {
  return /^[A-ZÄÖÜ][a-zäöüß]+$/.test(term) && term.length < 12 &&
    !/^(Bleaching|Recovery|Restoration|Climate|Remote|Feedback|Startup|Coffee|Guitar|Therapy|Podcast|Morning|Space|Balcony|Lisbon|Hannah|Oliver|Lena|Marco|Anna|Tom|Sarah|David|Emma|Lucas|Sophie|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|January|February|March|April|June|July|August|September|October|November|December)$/.test(term) === false &&
    /^[A-Z][a-z]+$/.test(term) && !/^(One|Some|Many|Most|Each|Every|When|Where|What|How|Why|Who|Which|If|Not|No|So|But|And|Or|As|At|In|On|To|For|Of|With|By|From|Up|Out|Off|Down|Over|Under|After|Before|During|While|Both|All|Any|Each|Every|Some|Only|Own|Same|Other|New|Now|Here|There|Even|About|Such|Like|Well|Can|May|Will|Would|Could|Should|Might|Must|Have|Has|Had|Was|Were|Is|Are|Be|Been|Being|Am|Public|Local|Early|Fish|Teams|People|Results|Education|Scientists|Temperature|Sunscreen|Protecting|Getting|Without|Instead|However|Recovery|Bleaching|Restoration|Marine|Climate|Remote|Feedback|Startup|Coffee|Guitar|Therapy|Podcast|Morning|Space|Balcony|Lisbon|Hannah|Oliver|Lena|Marco|Anna|Tom|Sarah|David|Emma|Lucas|Sophie|Psychologists|Architects|Residents|Communities|Regions|Measures|Agreement|International|Documentaries|Herbivorous|Heat|Mass|Coral|Reefs|Reef|Ocean|Pacific|Schools|Million|Millions|German|English|French|Spanish|Italian|Portuguese|European|American|Asian|African|Indian|Chinese|Japanese|Korean|Brazilian|Mexican|Canadian|Australian|British|Irish|Scottish|Swedish|Norwegian|Danish|Finnish|Dutch|Belgian|Swiss|Austrian|Polish|Czech|Hungarian|Romanian|Bulgarian|Greek|Turkish|Russian|Ukrainian|Israeli|Egyptian|Moroccan|Nigerian|Kenyan|South|North|East|West|Central|Global|National|Regional|Traditional|Modern|Digital|Virtual|Physical|Personal|Professional|Informal|Formal|Effective|Productive|Sustainable|Renewable|Compostable|Biodegradable|Lightweight|Recyclable|Organic|Natural|Artificial|Chemical|Mechanical|Electrical|Electronic|Automatic|Manual|Active|Passive|Positive|Negative|Constructive|Destructive|Creative|Innovative|Scientific|Technical|Medical|Financial|Legal|Social|Cultural|Political|Economic|Environmental|Educational|Emotional|Physical|Mental|Spiritual|Intellectual|Practical|Theoretical|Historical|Geological|Biological|Chemical|Physical|Mathematical|Statistical|Logical|Ethical|Moral|Legal|Illegal|Official|Unofficial|Public|Private|Personal|Collective|Individual|Corporate|Commercial|Industrial|Agricultural|Urban|Rural|Coastal|Mountain|Desert|Tropical|Arctic|Antarctic|Marine|Freshwater|Terrestrial|Aerial|Underground|Underwater|Indoor|Outdoor|Internal|External|Domestic|Foreign|Native|Immigrant|Local|Global|National|International|Universal|Specific|General|Special|Ordinary|Extraordinary|Normal|Abnormal|Regular|Irregular|Standard|Nonstandard|Typical|Atypical|Common|Rare|Usual|Unusual|Frequent|Infrequent|Constant|Variable|Stable|Unstable|Fixed|Flexible|Rigid|Soft|Hard|Strong|Weak|Fast|Slow|Quick|Long|Short|High|Low|Big|Small|Large|Tiny|Huge|Massive|Minor|Major|Main|Secondary|Primary|Final|Initial|Original|Current|Previous|Next|Last|First|Second|Third|Fourth|Fifth|Sixth|Seventh|Eighth|Ninth|Tenth|Eleventh|Twelfth|Thirteenth|Fourteenth|Fifteenth|Sixteenth|Seventeenth|Eighteenth|Nineteenth|Twentieth|Twenty|Thirty|Forty|Fifty|Sixty|Seventy|Eighty|Ninety|Hundred|Thousand|Million|Billion|Trillion|Zero|One|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|Eleven|Twelve|Thirteen|Fourteen|Fifteen|Sixteen|Seventeen|Eighteen|Nineteen|Twenty|Thirty|Forty|Fifty|Sixty|Seventy|Eighty|Ninety|Hundred|Thousand|Million|Billion|Trillion)$/.test(term);
}

function getTargets(original) {
  const wc = original.split(/\s+/).filter(Boolean).length;
  if (wc < 18) return { chunks: 3, grammar: 3, vocab: 6 };
  if (wc < 32) return { chunks: 4, grammar: 4, vocab: 8 };
  return { chunks: 5, grammar: 5, vocab: 10 };
}

function isWeakChunkMeaning(meaning) {
  if (BAD_CHUNK.test(meaning)) return true;
  const parts = meaning.split("、").map((p) => p.trim());
  if (parts.length >= 2 && parts.every((p) => p.length <= 10) && !meaning.includes("（") && !meaning.includes("〜")) return true;
  return false;
}

function isGoodChunk(c, original) {
  if (!c.phrase || !c.meaning || isWeakChunkMeaning(c.meaning)) return false;
  if (!hasJapanese(c.meaning)) return false;
  if (c.phrase.split(/\s+/).length < 2) return false;
  return original.toLowerCase().includes(c.phrase.toLowerCase());
}

function isGoodGrammar(g) {
  return g.pattern && g.explanation && !BAD_GRAMMAR.test(g.explanation) && !GENERIC_GRAMMAR.test(g.pattern) && hasJapanese(g.explanation);
}

function isGoodVocab(v, original) {
  if (!v.term || !v.meaning || BAD_VOCAB.test(v.meaning)) return false;
  if (!hasJapanese(v.meaning)) return false;
  if (v.meaning === "雰囲気、風土" && /climate|Climate|Klima/i.test(v.term)) return false;
  if (v.meaning === "休息" && /recovery|Recovery|Erholung/i.test(v.term) && !/rest|Ruhe|休息/i.test(v.term)) return false;
  if (v.meaning === "小さな" && !/small|Small|klein|Klein/i.test(v.term)) return false;
  if (v.meaning === "成功" && v.term.length > 8 && !/success|Success|Erfolg/i.test(v.term)) return false;
  if (v.meaning === "ストレス" && !/stress|Stress/i.test(v.term)) return false;
  if (v.term.length < 3) return false;
  return original.toLowerCase().includes(v.term.toLowerCase());
}

function buildMasterDict() {
  const dict = new Map();
  for (const f of fs.readdirSync(ARTICLES_DIR).filter((x) => /^article-\d+\.ts$/.test(x))) {
    const content = fs.readFileSync(path.join(ARTICLES_DIR, f), "utf8");
    const re = /\{\s*term:\s*"((?:\\.|[^"\\])*)"\s*,\s*meaning:\s*"((?:\\.|[^"\\])*)"\s*\}/g;
    let m;
    while ((m = re.exec(content)) !== null) {
      const term = m[1].replace(/\\"/g, '"');
      const meaning = m[2].replace(/\\"/g, '"');
      if (BAD_VOCAB.test(meaning) || !hasJapanese(meaning)) continue;
      if (meaning === "雰囲気、風土" && /climate|Climate|Klima/i.test(term)) continue;
      dict.set(term.toLowerCase(), meaning);
    }
  }
  const expandPath = path.join(__dirname, "expand-study-notes.mjs");
  if (fs.existsSync(expandPath)) {
    const expandContent = fs.readFileSync(expandPath, "utf8");
    for (const m of expandContent.matchAll(/([\wäöüß-]+):\s*"([^"]+)"/g)) {
      if (hasJapanese(m[2]) && !BAD_VOCAB.test(m[2])) dict.set(m[1].toLowerCase(), m[2]);
    }
  }
  const extras = {
    climate: "気候", warming: "温暖化", emissions: "排出", reef: "サンゴ礁", reefs: "サンゴ礁",
    coral: "サンゴ", bleaching: "白化", algae: "藻", marine: "海洋の", ecosystem: "生態系",
    restoration: "回復、復元", conservation: "保全", sustainable: "持続可能な",
    startup: "スタートアップ", investor: "投資家", revenue: "収益", guitar: "ギター",
    balcony: "ベランダ", gardening: "ガーデニング", lisbon: "リスボン", travel: "旅行",
    dream: "夢", memory: "記憶", sleep: "睡眠", podcast: "ポッドキャスト", episode: "エピソード",
    space: "宇宙", planet: "惑星", email: "メール", therapy: "カウンセリング", anxiety: "不安",
    Klima: "気候", Klimawandel: "気候変動", Riff: "サンゴ礁", Riffe: "サンゴ礁", Korallen: "サンゴ",
    Erholung: "回復", Nachhaltigkeit: "持続可能性",     Kaffee: "コーヒー", Kaffeeanbau: "コーヒー栽培",
    send: "送る", deck: "資料", client: "クライアント", live: "ライブで", only: "〜だけ",
    should: "〜すべき", present: "プレゼンする", revised: "修正した", beforehand: "事前に",
    summary: "要約", meeting: "会議", discussion: "議論", prepared: "準備した",
    numbers: "数字", tonight: "今夜", advance: "事前に", silent: "静かな", staring: "見つめる",
    room: "部屋", want: "欲しい", keep: "残す", full: "完全な", short: "短い",
    thing: "こと", more: "もう", revised: "改訂した", block: "確保する", calendar: "カレンダー",
    clarity: "明確さ", preparation: "準備", criticism: "批判", treat: "扱う",
    schicken: "送る", Kunde: "クライアント", vorher: "事前に", überarbeitet: "修正した",
    Zusammenfassung: "要約", Besprechung: "会議", Diskussion: "議論", vorbereitet: "準備した",
    Nummern: "数字", heute: "今夜", im: "〜で", Voraus: "事前", still: "静かな",
  };
  for (const [k, v] of Object.entries(extras)) dict.set(k.toLowerCase(), v);
  return dict;
}

const CHUNK_PATTERNS = [
  [/maintain focus/gi, "集中力を保つ"],
  [/working from home/gi, "在宅勤務する"],
  [/deep work/gi, "深い集中作業"],
  [/self-awareness/gi, "自己認識"],
  [/treat the morning like/gi, "朝を〜のように扱う"],
  [/transition ritual/gi, "移行の儀式"],
  [/creates a boundary/gi, "境界を作る"],
  [/matters more than/gi, "〜以上に重要である"],
  [/booked my first therapy session/gi, "初めてのカウンセリングを予約した"],
  [/constructive feedback/gi, "建設的なフィードバック"],
  [/compostable packaging/gi, "コンポスト可能な包装"],
  [/carbon footprint/gi, "カーボンフットプリント"],
  [/pitch deck/gi, "ピッチ資料"],
  [/subject line/gi, "件名"],
  [/morning routine/gi, "朝のルーティン"],
  [/passive listening/gi, "受動的リスニング"],
  [/occupy less than one percent/gi, "1％未満を占める"],
  [/support roughly a quarter/gi, "約4分の1を支える"],
  [/underwater cities/gi, "水中の都市（比喩）"],
  [/a process known as bleaching/gi, "白化と呼ばれる過程"],
  [/does not always mean death/gi, "必ずしも死を意味しない"],
  [/vulnerable to disease/gi, "病気に脆弱な"],
  [/enters the danger zone/gi, "危険域に入る"],
  [/grow coral fragments in nurseries/gi, "保育場でサンゴの断片を育てる"],
  [/heat-tolerant corals/gi, "暑さに強いサンゴ"],
  [/would otherwise smother/gi, "そうしなければ覆い尽くす"],
  [/fish populations rebound/gi, "魚の個体数が回復する"],
  [/central to long-term success/gi, "長期的な成功の中心である"],
  [/linked to healthy reefs/gi, "健全な礁と結びついた"],
  [/while global emissions fall/gi, "世界の排出が減る一方で"],
  [/every fraction of a degree matters/gi, "0.1度の差も重要である"],
  [/become advocates for ocean protection/gi, "海洋保護の提唱者になる"],
  [/possible but not guaranteed/gi, "可能だが保証はされない"],
  [/unprecedented in human history/gi, "人類史上前例がない"],
  [/weniger als ein Prozent des Meeresbodens/gi, "海底の1％未満"],
  [/ein Prozess namens Bleaching/gi, "白化と呼ばれる過程"],
  [/bedeutet nicht immer den Tod/gi, "必ずしも死を意味しない"],
  [/anfällig für Krankheiten/gi, "病気に脆弱な"],
  [/die Gefahrenzone erreicht/gi, "危険域に入る"],
  [/Korallenfragmente in Baumschulen züchten/gi, "保育場でサンゴの断片を育てる"],
  [/die Skalierung bleibt teuer und langsam/gi, "拡大は高コストで遅いまま"],
  [/Fürsprecher des Meeresschutzes/gi, "海洋保護の提唱者"],
  [/möglich, aber nicht garantiert/gi, "可能だが保証はされない"],
  [/in der Menschheitsgeschichte beispiellos/gi, "人類史上前例がない"],
  [/Übergangsritual/gi, "移行の儀式"],
  [/schafft eine Grenze/gi, "境界を作る"],
  [/konstruktives Feedback/gi, "建設的なフィードバック"],
  [/both freedom and distraction/gi, "自由と気が散る要素の両方"],
  [/struggled to maintain focus/gi, "集中を保つのに苦労した"],
  [/design our days/gi, "一日を設計する"],
  [/blend personal tasks with professional/gi, "私用と仕事を混ぜ合わせる"],
  [/work from the sofa/gi, "ソファで仕事をする"],
  [/intentional contact/gi, "意図的な連絡"],
  [/Instead of reacting/gi, "〜する代わりに"],
  [/one-to-one conversations/gi, "1対1の面談"],
  [/reduce friction/gi, "摩擦を減らす（手間を減らす比喩）"],
  [/virtual coffee chat/gi, "オンラインのコーヒーチャット"],
  [/presence equals performance/gi, "出社＝成果"],
  [/sharpen the delivery/gi, "伝え方を磨く"],
  [/spilled into everything/gi, "すべてに波及した"],
  [/snapping at friends/gi, "友達にキツく当たる"],
  [/I finally did it/gi, "やっと踏み切った"],
  [/That makes sense/gi, "なるほど、理にかなってる"],
  [/How did it go/gi, "どうだった？"],
  [/sowohl Freiheit als auch Ablenkung/gi, "自由と気が散る要素の両方"],
  [/Es fiel .+ schwer/gi, "〜するのは難しかった"],
  [/besteht darin/gi, "〜することに成り立つ"],
  [/Einzelgespräche/gi, "1対1面談"],
  [/virtueller Kaffeeklatsch/gi, "オンラインのコーヒーチャット"],
  [/Das ergibt Sinn/gi, "なるほど、理にかなってる"],
  [/Wie war es/gi, "どうだった？"],
  [/One of the most effective habits/gi, "最も効果的な習慣のひとつ"],
  [/matters more than most people admit/gi, "多くの人が認める以上に重要である"],
  [/creates a boundary between work and rest/gi, "仕事と休息の境界を作る"],
  [/work from the sofa every day/gi, "毎日ソファで仕事をする"],
  [/protect your energy over long weeks/gi, "長い週を通して体力を守る"],
  [/intentional contact with colleagues/gi, "同僚との意図的な連絡"],
  [/reduce friction for remote workers/gi, "リモートワーカーの手間を減らす"],
  [/schafft eine Grenze zwischen/gi, "〜の間に境界を作る"],
  [/Es fiel vielen schwer/gi, "多くの人にとって難しかった"],
];

function extractGrammar(text, lang, existing, target) {
  const cleaned = text.replace(/^[A-ZÄÖÜ][a-zäöüß]+:\s*/u, "").trim();
  const out = existing.filter(isGoodGrammar);
  const seen = new Set(out.map((g) => g.pattern));

  const add = (pattern, explanation) => {
    if (!seen.has(pattern) && out.length < target && explanation && hasJapanese(explanation)) {
      out.push({ pattern, explanation });
      seen.add(pattern);
    }
  };

  if (lang === "en") {
    if (/,.+ yet .+/i.test(cleaned)) add("..., yet ...", "yet で「それでも」逆接し、意外な対比を強調する。");
    if (/both .+ and .+/i.test(cleaned)) {
      const m = cleaned.match(/both .+ and .+/i);
      if (m) add(m[0].slice(0, 50), "both A and B で2要素を並列に列挙する。");
    }
    if (/less .+ and more .+/i.test(cleaned)) {
      const m = cleaned.match(/less .+ and more .+/i);
      if (m) add(m[0].slice(0, 50), "less on A and more on B でAよりBが重要、という対比。");
    }
    if (/Instead of .+/i.test(cleaned)) {
      const m = cleaned.match(/Instead of [^.]+/i);
      if (m) add(m[0].slice(0, 50), "Instead of + 動名詞で「〜する代わりに」。");
    }
    if (/When .+, .+/i.test(cleaned)) {
      const m = cleaned.match(/When [^,]+, [^.]+/i);
      if (m) add(m[0].length > 55 ? m[0].slice(0, 55) + "…" : m[0], "When節で条件・背景を示し、主節で結果を述べる。");
    }
    if (/If .+, .+/i.test(cleaned)) {
      const m = cleaned.match(/If [^,]+, [^.]+/i);
      if (m) add(m[0].length > 55 ? m[0].slice(0, 55) + "…" : m[0], "If節で条件、主節で結果を述べる。");
    }
    if (/would otherwise/i.test(cleaned)) add("would otherwise + verb", "would otherwise で「そうしなければ〜するだろう」と仮定を表す。");
    if (/as .+ warms/i.test(cleaned)) add("as ... warms...", "as で「〜するにつれて」原因と結果の関係を示す。");
    if (/give .+ a chance to/i.test(cleaned)) add("give + 人 + a chance to + 動詞", "「〜する機会を与える」。");
    if (/cannot .+, but .+/i.test(cleaned)) {
      const m = cleaned.match(/cannot [^,]+, but [^.]+/i);
      if (m) add(m[0].slice(0, 55), "but で限界と部分的な効果を対比する。");
    }
    if (/aim to/i.test(cleaned)) add("aim to + 動詞", "aim to で「〜を目指す」。");
    if (/who .+/i.test(cleaned) && /People|people|Those|those|workers|Workers/.test(cleaned)) add("who + verb (relative)", "関係代名詞 who で先行詞を説明する。");
    if (/requires .+/i.test(cleaned)) {
      const m = cleaned.match(/requires [^.]+/i);
      if (m) add(m[0].slice(0, 55), "require + 名詞（並列可）で必要な要素を列挙する。");
    }
    if (/One of the most/i.test(cleaned)) add("One of the most + adj + N", "One of the most + 形容詞 + 名詞 で「最も〜なものの一つ」。");
    if (/have been .+ing/i.test(cleaned)) add("have been + -ing", "現在完了進行形で過去から現在までの継続を表す。");
    if (/Getting .+, .+ing .+, and .+ing/i.test(cleaned)) add("Getting..., ...ing..., and ...ing...", "動名詞3つを並列し、習慣的行動を列挙する。");
    if (/not .+ but .+/i.test(cleaned)) {
      const m = cleaned.match(/not [^,]+ but [^.]+/i);
      if (m) add(m[0].slice(0, 50), "not A but B でAではなくB、という対比。");
    }
    if (/appreciate .+ saying/i.test(cleaned)) add("I appreciate you + -ing", "appreciate + O + 動名詞で感謝を伝える。");
    if (/What pushed you to/i.test(cleaned)) add("What pushed you to + verb", "push + 人 + to + 動詞 で「〜するきっかけを与える」。");
  } else {
    if (/,.+ aber .+/i.test(cleaned)) add("..., aber ...", "aber で「それでも」逆接し、意外な対比を強調する。");
    if (/sowohl .+ als auch/i.test(cleaned)) {
      const m = cleaned.match(/sowohl .+ als auch .+/i);
      if (m) add(m[0].slice(0, 50), "sowohl A als auch B で両方を列挙する。");
    }
    if (/Wenn .+, .+/i.test(cleaned)) {
      const m = cleaned.match(/Wenn [^,]+, [^.]+/i);
      if (m) add(m[0].length > 55 ? m[0].slice(0, 55) + "…" : m[0], "Wenn節で条件「〜すれば」結果を導く。");
    }
    if (/weil .+/i.test(cleaned)) {
      const m = cleaned.match(/weil [^.]+/i);
      if (m) add(m[0].slice(0, 55), "weil で原因「〜なので」を示す。");
    }
    if (/sonst .+ würden/i.test(cleaned)) add("sonst + Konjunktiv II", "sonst + 仮定法IIで「そうしなければ〜するだろう」。");
    if (/geben .+ die Chance, .+ zu/i.test(cleaned)) add("geben ... die Chance, ... zu", "jemandem die Chance geben, zu + 動詞。");
    if (/nicht .+, (sondern|doch|verringern)/i.test(cleaned)) add("nicht ..., sondern/doch ...", "nicht ... sondern/doch ... で限界と対比。");
    if (/, die .+/i.test(cleaned)) {
      const m = cleaned.match(/, die [^.]+/i);
      if (m) add(m[0].slice(0, 55), "関係代名詞 die/der/das で名詞を後置修飾する。");
    }
    if (/Es fiel .+ schwer/i.test(cleaned)) add("Es fällt + Dat. + schwer, ... zu", "形式主語 es + schwer + zu不定詞で「〜するのは難しい」。");
    if (/erfordert .+/i.test(cleaned)) {
      const m = cleaned.match(/erfordert [^.]+/i);
      if (m) add(m[0].slice(0, 55), "erfordern + 名詞の並列で必要な要素を列挙する。");
    }
    if (/während .+/i.test(cleaned)) {
      const m = cleaned.match(/während [^.]+/i);
      if (m) add(m[0].slice(0, 55), "während で「〜する一方で」時間的対比。");
    }
    if (/besteht darin/i.test(cleaned)) add("besteht darin, ... zu", "darin 構文で「〜することに成り立つ」。");
    if (/Wie war es/i.test(cleaned)) add("Wie war es?", "Wie war es? で「どうだった？」と感想を尋ねる。");
  }

  return padGrammar(cleaned, lang, out, target);
}

function padGrammar(cleaned, lang, out, target) {
  const seen = new Set(out.map((g) => g.pattern));
  const add = (pattern, explanation) => {
    if (out.length >= target || seen.has(pattern) || !hasJapanese(explanation)) return;
    out.push({ pattern, explanation });
    seen.add(pattern);
  };
  const clauses = cleaned.split(/(?<=[.!?;])\s+|,\s+(?=[A-ZÄÖÜ「])/).map((s) => s.trim()).filter((s) => s.length > 12);
  if (lang === "en") {
    for (const clause of clauses) {
      if (out.length >= target) break;
      const p = clause.length > 52 ? clause.slice(0, 52) + "…" : clause;
      if (/\b(is|are|was|were) \w+ing\b/i.test(clause)) add(p, "be + -ing で進行・継続を表す。");
      else if (/\b(is|are|was|were) \w+ to \w+/i.test(clause)) add(p, "be + to不定詞 で目的・未来を表す。");
      else if (/\b(may|might|can|could|should|must|will|would) \w+/i.test(clause)) add(p, "助動詞 + 動詞原形 で推量・可能性・義務を表す。");
      else if (/\bbut\b/i.test(clause)) add(p, "but で逆接・対比を示す。");
      else if (/\band\b.*\band\b/i.test(clause)) add(p, "and で要素を並列に列挙する。");
      else if (/\bby \w+ing\b/i.test(clause)) add(p, "by + 動名詞 で方法・手段を示す。");
      else if (/\bwithout \w+/i.test(clause)) add(p, "without + 名詞 で「〜なしに」を表す。");
    }
  } else {
    for (const clause of clauses) {
      if (out.length >= target) break;
      const p = clause.length > 52 ? clause.slice(0, 52) + "…" : clause;
      if (/\b(werden|wurde|wurden|wird)\b/i.test(clause)) add(p, "werden/wurde + Partizip II で受動・変化を表す。");
      else if (/\b(können|könnte|könnten|muss|müssen|soll|sollte)\b/i.test(clause)) add(p, "助動詞 + 不定詞 で能力・義務・推量を表す。");
      else if (/\baber\b/i.test(clause)) add(p, "aber で逆接・対比を示す。");
      else if (/\bund\b.*\bund\b/i.test(clause)) add(p, "und で要素を並列に列挙する。");
      else if (/\bohne\b/i.test(clause)) add(p, "ohne + Akk. で「〜なしに」を表す。");
      else if (/\bdass\b/i.test(clause)) add(p, "dass節で内容・事実を伝える。");
    }
  }
  for (const clause of clauses) {
    if (out.length >= target) break;
    const p = clause.length > 52 ? clause.slice(0, 52) + "…" : clause;
    if (lang === "en") {
      if (/\b(is|are|was|were)\b/i.test(clause)) add(p, "be動詞 + 補語で状態・特徴を述べる。");
      else if (/\b(has|have|had)\b/i.test(clause)) add(p, "have/has + 過去分詞 で完了・経験を表す。");
      else add(p, "SVO 語順で主語・動詞・目的語を確認する。");
    } else {
      if (/\b(sein|sind|ist|war|waren|wird|werden)\b/i.test(clause)) add(p, "sein/werden で状態・変化を表す。");
      else if (/\b(haben|hat|hatte|hatten)\b/i.test(clause)) add(p, "haben + Partizip II で完了を表す。");
      else add(p, "動詞の語尾変化（活用）に注目する。");
    }
  }
  return out.slice(0, target);
}

function extractChunks(text, existing, target, dict) {
  const cleaned = text.replace(/^[A-ZÄÖÜ][a-zäöüß]+:\s*/u, "").trim();
  const out = existing.filter((c) => isGoodChunk(c, cleaned));
  const seen = new Set(out.map((c) => c.phrase.toLowerCase()));

  for (const [re, meaning] of CHUNK_PATTERNS) {
    const m = cleaned.match(re);
    if (m && !seen.has(m[0].toLowerCase()) && m[0].split(/\s+/).length >= 2) {
      out.push({ phrase: m[0], meaning });
      seen.add(m[0].toLowerCase());
    }
    if (out.length >= target) return out.slice(0, target);
  }
  return padChunks(cleaned, out, target, dict);
}

function padChunks(cleaned, out, target, dict) {
  const seen = new Set(out.map((c) => c.phrase.toLowerCase()));
  const words = cleaned.match(/[\wäöüß'-]+/g) || [];
  for (let len = 5; len >= 2 && out.length < target; len--) {
    for (let i = 0; i <= words.length - len; i++) {
      const phrase = words.slice(i, i + len).join(" ");
      if (seen.has(phrase.toLowerCase()) || phrase.length < 10 || STOP.has(words[i].toLowerCase())) continue;
      const matched = words.slice(i, i + len).filter((w) => dict.has(w.toLowerCase()) && w.length >= 4);
      if (matched.length >= 3) {
        const meaning = matched.map((w) => dict.get(w.toLowerCase())).slice(0, 3).join("、");
        if (!isWeakChunkMeaning(meaning)) {
          out.push({ phrase, meaning });
          seen.add(phrase.toLowerCase());
        }
      }
      if (out.length >= target) return out.slice(0, target);
    }
  }
  return out.slice(0, target);
}

function extractVocab(text, existing, target, dict) {
  const cleaned = text.replace(/^[A-ZÄÖÜ][a-zäöüß]+:\s*/u, "").trim();
  const out = existing.filter((v) => isGoodVocab(v, cleaned));
  const seen = new Set(out.map((v) => v.term.toLowerCase()));

  const tokens = cleaned.match(/[\wäöüß'-]+/g) || [];
  const sorted = [...tokens].sort((a, b) => b.length - a.length);

  const minLen = target <= 6 ? 3 : 4;
  for (const raw of sorted) {
    const term = raw.replace(/^['"]|['"]$/g, "");
    const lower = term.toLowerCase();
    if (term.length < minLen || STOP.has(lower) || seen.has(lower)) continue;
    const meaning = dict.get(lower) || dict.get(term);
    if (!meaning || BAD_VOCAB.test(meaning) || !hasJapanese(meaning)) continue;
    out.push({ term, meaning });
    seen.add(lower);
    if (out.length >= target) break;
  }
  if (out.length < target) {
    for (const raw of tokens) {
      const term = raw.replace(/^['"]|['"]$/g, "");
      const lower = term.toLowerCase();
      if (term.length < minLen || STOP.has(lower) || seen.has(lower)) continue;
      if (/(tion|ment|ness|ity|able|ible|ful|less|ive|ous|ing|ist|ism|ize|ise|ung|keit|heit|lich|isch|los|bar|ieren|schaft)$/i.test(term)) {
        const meaning = dict.get(lower);
        if (meaning && hasJapanese(meaning)) {
          out.push({ term, meaning });
          seen.add(lower);
        }
      }
      if (out.length >= target) break;
    }
  }
  return out.slice(0, target);
}

function parseStudyNotesBlock(block) {
  const chunks = [];
  const cm = block.match(/chunks:\s*\[([\s\S]*?)\]\s*,/);
  if (cm) {
    const re = /\{\s*phrase:\s*"((?:\\.|[^"\\])*)"\s*,\s*meaning:\s*"((?:\\.|[^"\\])*)"\s*\}/g;
    let m;
    while ((m = re.exec(cm[1])) !== null) chunks.push({ phrase: m[1].replace(/\\"/g, '"'), meaning: m[2].replace(/\\"/g, '"') });
  }
  const grammar = [];
  const gm = block.match(/grammar:\s*\[([\s\S]*?)\]\s*,/);
  if (gm) {
    const re = /\{\s*pattern:\s*"((?:\\.|[^"\\])*)"\s*,\s*explanation:\s*"((?:\\.|[^"\\])*)"\s*\}/g;
    let m;
    while ((m = re.exec(gm[1])) !== null) grammar.push({ pattern: m[1].replace(/\\"/g, '"'), explanation: m[2].replace(/\\"/g, '"') });
  }
  const vocabulary = [];
  const vm = block.match(/vocabulary:\s*\[([\s\S]*?)\]\s*,?\s*\}/);
  if (vm) {
    const re = /\{\s*term:\s*"((?:\\.|[^"\\])*)"\s*,\s*meaning:\s*"((?:\\.|[^"\\])*)"\s*\}/g;
    let m;
    while ((m = re.exec(vm[1])) !== null) vocabulary.push({ term: m[1].replace(/\\"/g, '"'), meaning: m[2].replace(/\\"/g, '"') });
  }
  return { chunks, grammar, vocabulary };
}

function formatStudyNotes(notes) {
  const esc = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const chunksStr = notes.chunks.map((c) => `            { phrase: "${esc(c.phrase)}", meaning: "${esc(c.meaning)}" }`).join(",\n");
  const grammarStr = notes.grammar.map((g) => `            { pattern: "${esc(g.pattern)}", explanation: "${esc(g.explanation)}" }`).join(",\n");
  const vocabStr = notes.vocabulary.map((v) => `            { term: "${esc(v.term)}", meaning: "${esc(v.meaning)}" }`).join(",\n");
  return `studyNotes: {
          chunks: [
${chunksStr},
          ],
          grammar: [
${grammarStr},
          ],
          vocabulary: [
${vocabStr},
          ],
        }`;
}

function countBad(parsed) {
  let n = 0;
  for (const c of parsed.chunks) if (!isGoodChunk(c, "x") || BAD_CHUNK.test(c.meaning)) n++;
  for (const g of parsed.grammar) if (!isGoodGrammar(g)) n++;
  for (const v of parsed.vocabulary) if (!hasJapanese(v.meaning) || BAD_VOCAB.test(v.meaning)) n++;
  return n;
}

function fixBlock(block, original, dict) {
  const lang = isGerman(original) ? "de" : "en";
  const targets = getTargets(original);
  const parsed = parseStudyNotesBlock(block);
  const beforeBad = countBad(parsed);

  const fixed = {
    chunks: extractChunks(original, parsed.chunks, targets.chunks, dict),
    grammar: extractGrammar(original, lang, parsed.grammar, targets.grammar),
    vocabulary: extractVocab(original, parsed.vocabulary, targets.vocab, dict),
  };

  const changed = JSON.stringify(parsed) !== JSON.stringify(fixed);
  return { notes: fixed, changed, targets };
}

function processFile(filePath, dict) {
  let content = fs.readFileSync(filePath, "utf8");
  let fixedParas = 0;
  const paraRe = /original:\s*\n\s*"((?:\\.|[^"\\])*)"\s*,\s*\n\s*translation:\s*\n\s*"((?:\\.|[^"\\])*)"\s*,\s*\n\s*(studyNotes:\s*\{[\s\S]*?\n\s*\})/g;
  content = content.replace(paraRe, (match, original, translation, studyNotesBlock) => {
    const { notes, changed } = fixBlock(studyNotesBlock, original, dict);
    if (changed) fixedParas++;
    return `original:\n          "${original}",\n        translation:\n          "${translation}",\n        ${formatStudyNotes(notes)}`;
  });
  fs.writeFileSync(filePath, content, "utf8");
  return fixedParas;
}

const dict = buildMasterDict();
const files = fs.readdirSync(ARTICLES_DIR).filter((f) => /^article-\d+\.ts$/.test(f)).sort();
let total = 0;
for (const f of files) {
  if (f === "article-14.ts") continue;
  const n = processFile(path.join(ARTICLES_DIR, f), dict);
  console.log(`${f}: ${n} paragraphs fixed`);
  total += n;
}
console.log(`Total paragraphs fixed (excl. article-14): ${total}`);
