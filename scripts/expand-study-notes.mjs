#!/usr/bin/env node
/**
 * Expands studyNotes: grammar string → array, enrich chunks/grammar/vocab with quality content.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTICLES_DIR = path.join(__dirname, "../src/data/articles");

const EN_VOCAB = {
  pandemic: "パンデミック、世界的流行", professionals: "専門職の人、働く人", distraction: "気を散る要素",
  structure: "枠組み、構造", commute: "通勤", workspace: "仕事場、共有オフィス", productivity: "生産性",
  deliberately: "意図的に、計画的に", maintain: "保つ、維持する", focus: "集中（力）", freedom: "自由",
  success: "成功", design: "設計する、組み立てる", effective: "効果的な", habits: "習慣",
  consistent: "一貫した、決まった", psychologists: "心理学者", transition: "移行", ritual: "儀式、ルーティン",
  temptation: "誘惑", blend: "混ぜ合わせる", environment: "環境", dedicated: "専用の",
  boundary: "境界、区切り", lighting: "照明", comfortable: "快適な", concentration: "集中力",
  communication: "コミュニケーション", misunderstandings: "誤解", intentional: "意図的な",
  meetings: "会議", strategy: "戦略", reserve: "確保する、予約する", fragmented: "断片的な",
  burnout: "燃え尽き症候群", sustainable: "持続可能な", managers: "マネージャー", outcomes: "成果",
  overloaded: "過負荷の", isolated: "孤立した", technology: "技術", thoughtfully: "思慮深く",
  discipline: "規律、自制心", turnover: "離職率", collaboration: "協力", permanent: "恒久的な",
  boundaries: "境界", presentation: "プレゼンテーション", delivery: "伝え方", directly: "率直に",
  audience: "聴衆、参加者", accurate: "正確な", dense: "密度が高い、詰まった", attention: "注意力",
  regulators: "規制当局", reputation: "評判", packaging: "包装", recyclable: "リサイクル可能な",
  consumers: "消費者", waste: "廃棄物", logistics: "物流", brand: "ブランド", materials: "素材",
  cardboard: "段ボール", experiment: "試み、実験", organizations: "組織", option: "選択肢",
  awareness: "認識、気づき", presence: "出社、存在", performance: "成果、パフォーマンス",
  obstacles: "障害、妨げ", schedules: "スケジュール", friction: "摩擦（比喩：手間）",
  substitute: "代わり、代用品", assistant: "助手", motivation: "やる気", loneliness: "孤独",
  informal: "非公式の、気軽な", gatherings: "集まり", discovered: "気づいた、発見した",
  struggled: "苦労した", disappeared: "消えた", offered: "提供した", signals: "合図を送る",
  reduces: "減らす", matters: "重要である", colleague: "同僚", expression: "表情",
  updates: "更新、報告", calendars: "カレンダー", blocking: "ブロッキング（時間割当）",
  reacting: "反応する", periods: "時間帯", approach: "方法、アプローチ", colleagues: "同僚",
  address: "住所（ここでは場所）", laptop: "ノートパソコン", leaders: "リーダー",
  settings: "環境、設定", measure: "測る", define: "定義する、定める", trust: "信頼する",
  platforms: "プラットフォーム", indicators: "表示、インジケーター", routine: "日常、ルーティン",
  chaotic: "乱れた", connection: "つながり", damages: "損なう", invest: "投資する",
  stronger: "より強い", lower: "より低い", temporary: "一時的な", rewards: "報いる、報酬を与える",
  protecting: "守る", communicating: "伝える", respecting: "尊重する", returning: "戻る",
  therapy: "カウンセリング、セラピー", session: "セッション", terrified: "恐怖を感じた",
  schedule: "予約する", dramatic: "大げさな", stress: "ストレス", colleague: "同僚",
  nervous: "緊張した", senior: "上級の、シニア", rushed: "急いだ", financial: "財務の",
  accurate: "正確な", slides: "スライド", chart: "グラフ、チャート", explanation: "説明",
  feedback: "フィードバック", constructive: "建設的な", specific: "具体的な", example: "例",
  clarify: "明確にする", tone: "口調、トーン", defensive: "防御的な", acknowledge: "認める",
  improvement: "改善", actionable: "実行可能な", timeline: "タイムライン", follow: "フォローする",
  culture: "文化", climate: "雰囲気、風土", sustainable: "持続可能な", compostable: "コンポスト可能な",
  biodegradable: "生分解性の", lightweight: "軽量の", shipment: "出荷", carbon: "カーボン",
  footprint: "フットプリント", innovation: "イノベーション", supplier: "サプライヤー",
  renewable: "再生可能な", circular: "循環型の", economy: "経済", landfill: "埋め立て地",
  microplastic: "マイクロプラスチック", legislation: "立法、法規制", compliance: "コンプライアンス",
  transparent: "透明な", certification: "認証", pilot: "試験的な", scale: "規模、拡大する",
  habit: "習慣", morning: "朝", breakfast: "朝食", brain: "脳", lunch: "昼食",
  bedroom: "寝室", sofa: "ソファ", energy: "エネルギー、体力", remote: "リモートの",
  workers: "ワーカー、働く人", message: "メッセージ", email: "メール", chat: "チャット",
  software: "ソフトウェア", headphones: "ヘッドホン", walking: "歩きながらの", virtual: "バーチャル、オンライン",
  coffee: "コーヒー", planning: "計画", self: "自己", idea: "考え、理念",
  booked: "予約した", terrified: "恐怖を感じた", snapping: "キツく当たる", dramatic: "大げさな",
  months: "数か月", first: "初めての", office: "オフィス", step: "一歩", thinking: "考えること",
  finally: "ついに、やっと", next: "次の", about: "〜について",
  pushed: "きっかけを与えた", mentioned: "言及した", helped: "助けた", sounded: "〜に聞こえた",
  things: "こと、物事", badly: "うまくない、浅く", small: "小さな", friends: "友人",
  colleague: "同僚", choose: "選ぶ", specific: "特定の", doctor: "医者", refer: "紹介する",
  spilled: "波及した", sleeping: "眠る", imagined: "想像した", refer: "紹介する",
  counselor: "カウンセラー", anxious: "不安な", vulnerable: "弱さを見せる", stigma: "偏見、スティグマ",
  hesitant: "ためらう", progress: "進展", homework: "（セラピーの）課題", breakthrough: "突破口",
  confidential: "機密の", licensed: "免許を持った", insurance: "保険", copay: "自己負担額",
  overwhelmed: "圧倒された", validated: "認めてもらった", normalize: "普通のことにする",
  recommend: "勧める", skeptical: "懐疑的な", relieved: "ほっとした", awkward: "ぎこちない",
  honest: "正直な", grateful: "感謝している", nervous: "緊張した", rushed: "急いだ",
  stood: "目立った（stand out）", appreciate: "感謝する", constructive: "建設的な",
  defensive: "防御的な", acknowledge: "認める", actionable: "実行可能な", timeline: "タイムライン",
  compostable: "コンポスト可能な", biodegradable: "生分解性の", lightweight: "軽量の",
  footprint: "フootprint、環境負荷", supplier: "サプライヤー", renewable: "再生可能な",
  circular: "循環型の", landfill: "埋め立て地", microplastic: "マイクロプラスチック",
  legislation: "立法", compliance: "コンプライアンス", transparent: "透明な",
  certification: "認証", pilot: "試験的な", shipment: "出荷", compost: "堆肥化",
  renewable: "再生可能な", innovation: "イノベーション", lightweight: "軽量の",
  renewable: "再生可能な", ingredient: "成分", organic: "オーガニックの",
  fermentation: "発酵", probiotic: "プロバイオティクス", gut: "腸", microbiome: "微生物叢",
  inflammation: "炎症", nutrient: "栄養素", supplement: "サプリメント", dietary: "食事の",
  intermittent: "断続的な", fasting: "断食", metabolism: "代謝", glucose: "血糖",
  insulin: "インスリン", longevity: "長寿", mindfulness: "マインドフルネス",
  meditation: "瞑想", resilience: "回復力", gratitude: "感謝", journaling: "ジャーナリング",
  podcast: "ポッドキャスト", subscriber: "登録者", algorithm: "アルゴリズム",
  thumbnail: "サムネイル", engagement: "エンゲージメント", monetize: "収益化する",
  sponsorship: "スポンサー", authenticity: "本 authenticity", niche: "ニッチ",
  milestone: "マイルストーン", burnout: "燃え尽き", imposter: "インポスター",
  syndrome: "症候群", freelance: "フリーランス", gig: "ギグ、単発仕事",
  portfolio: "ポートフォリオ", invoice: "請求書", negotiate: "交渉する",
  contract: "契約", deadline: "締め切り", prototype: "プロトタイプ", iterate: "反復改善する",
  stakeholder: "ステークホルダー", pivot: "方向転換する", scalable: "拡張可能な",
  venture: "ベンチャー", accelerator: "アクセラレーター", pitch: "ピッチ、提案",
  equity: "株式", bootstrap: "自己資金で始める", runway: "資金が続く期間",
  churn: "解約率", retention: "維持率", onboarding: "オンボーディング",
  churn: "解約率", metric: "指標", benchmark: "ベンチマーク",
};

const DE_VOCAB = {
  Pandemie: "パンデミック", Berufstätigen: "就業者、働く人", Ablenkung: "気を散らすもの",
  Struktur: "枠組み", Pendelns: "通勤", Konzentration: "集中力", Produktivität: "生産性",
  bewusst: "意識的に、意図的に", Gewohnheiten: "習慣", vermischen: "混ぜ合わせる",
  Beleuchtung: "照明", Erholung: "休息", Missverständnisse: "誤解", ersetzen: "取って代わる",
  Burnout: "燃え尽き症候群", nachhaltiger: "持続可能な", Ergebnisse: "成果", überlastet: "過負荷の",
  Disziplin: "規律", Fluktuation: "離職率", Einsamkeit: "孤独", Grenzen: "境界",
  Schreibtisch: "机、デスク", Umgebung: "環境", Grenze: "境界", Zimmer: "部屋",
  Kommunikation: "コミュニケーション", Strategie: "戦略", Ansatz: "アプローチ",
  Führungskräfte: "管理職、リーダー", Hindernisse: "障害", Einzelgespräche: "1対1面談",
  Geräuschunterdrückung: "ノイズキャンセリング", Nebengedanke: "後付けの考え",
  Selbstwahrnehmung: "自己認識", Anwesenheit: "出社、存在", Leistung: "成果",
  Übergangsritual: "移行の儀式", Versuchung: "誘惑", Arbeitstag: "仕事の日",
  Gesichtsausdruck: "表情", Videogespräche: "ビデオ通話", zerstückelt: "断片的な",
  Pendelweg: "通勤路", Belohnung: "報酬", Laptop: "ノートパソコン", Reibung: "摩擦（比喩）",
  Werkzeuge: "ツール", Routine: "日常", Assistenten: "助手", Ersatz: "代わり",
  Verbindung: "つながり", Motivation: "やる気", Zusammenarbeit: "協力",
  Organisationen: "組織", Experiment: "試み", Option: "選択肢", dauerhafte: "恒久的な",
  Freiheit: "自由", Arbeitsplatz: "仕事場", Erfolg: "成功", gestalten: "設計する、形作る",
  wirksamsten: "最も効果的な", Psychologen: "心理学者", Mittagessen: "昼食",
  physische: "物理的な", bequemer: "快適な", Energie: "エネルギー", Sofa: "ソファ",
  Remote: "リモート", Mitarbeiter: "従業員", Updates: "更新、報告", Kalender: "カレンダー",
  Aufmerksamkeit: "注意力", Bedürfnis: "必要性、ニーズ", Antworten: "返答",
  Risiko: "リスク", Signal: "合図", isoliert: "孤立した", Messaging: "メッセージング",
  chaotische: "乱れた", informelle: "非公式の", Treffen: "集まり", Kaffeeklatsch: "コーヒーチャット",
  vorübergehendes: "一時的な", Planung: "計画", Fokus: "集中", Präsentation: "プレゼンテーション",
  Feedback: "フィードバック", Zuhörer: "聴衆", Verpackung: "包装", Therapie: "カウンセリング",
  Sitzung: "セッション", erschrocken: "怖がった", Termin: "予約、約束",
  gebucht: "予約した", Angst: "不安、恐怖", übergriffen: "波及した", schlecht: "悪い、浅い",
  dramatisch: "大げさな", Kollegin: "同僚（女性）", empfohlen: "勧めた", Büro: "オフィス",
  Schritt: "一歩", bewegt: "動かした、きっかけを与えた", Therapeutin: "セラピスト（女性）",
  vertraulich: "機密の", Versicherung: "保険", skeptisch: "懐疑的な", erleichtert: "ほっとした",
  ehrlich: "正直な", dankbar: "感謝している", nervös: "緊張した", Präsentation: "プレゼン",
  Feedback: "フィードバック", Zuhörer: "聴衆", konstruktiv: "建設的な", Verteidigung: "防御",
  anerkennen: "認める", umsetzbar: "実行可能な", Verpackung: "包装", recycelbar: "リサイクル可能",
  Verbraucher: "消費者", Abfall: "廃棄物", Logistik: "物流", Marke: "ブランド",
  kompostierbar: "コンポスト可能", biologisch: "生物学的な", abbaubar: "分解性の",
  Lieferant: "サプライヤー", erneuerbar: "再生可能な", Deponie: "埋eme立て地",
  Mikroplastik: "マイクロプラスチック", Gesetzgebung: "立法", Zertifizierung: "認証",
  transparent: "透明な", Innovation: "イノベーション", Zutat: "成分", organische: "オーガニックの",
  Fermentation: "発酵", Darm: "腸", Mikrobiom: "微生物叢", Entzündung: "炎症",
  Nährstoff: "栄養素", Ergänzung: "サプリメント", Stoffwechsel: "代謝", Glukose: "血糖",
  Insulin: "インスulin", Langlebigkeit: "長寿", Achtsamkeit: "マインドフルネス",
  Meditation: "瞑想", Widerstandsfähigkeit: "回復力", Dankbarkeit: "感謝",
  Podcast: "ポッドキャスト", Abonnent: "登録者", Algorithmus: "アルゴリズム",
  Authentizität: "本 authenticity", Nische: "ニッチ", Meilenstein: "マイルストーン",
  Freiberufler: "フリーランス", Rechnung: "請求書", verhandeln: "交渉する",
  Vertrag: "契約", Frist: "締め切り", Prototyp: "プロトタイプ", Stakeholder: "ステークホルダー",
  skalierbar: "拡張可能な", Gründung: "起業", Pitch: "ピッチ", Eigenkapital: "自己資本",
  Kennzahl: "指標", Benchmark: "ベンチマーク",
};

const EN_CHUNKS = [
  [/working from home/gi, "在宅勤務する"],
  [/both freedom and distraction/gi, "自由と気が散る要素の両方"],
  [/struggled to maintain focus/gi, "集中を保つのに苦労した"],
  [/depends less on .+ and more on/gi, "AよりBの方が重要（less/more 対比）"],
  [/design our days/gi, "一日を設計する"],
  [/treat the morning like/gi, "朝を〜のように扱う"],
  [/signals to your brain/gi, "脳に合図を送る"],
  [/blend personal tasks with professional/gi, "私用と仕事を混ぜ合わせる"],
  [/matters more than/gi, "〜以上に重要である"],
  [/creates a boundary/gi, "境界を作る"],
  [/work from the sofa/gi, "ソファで仕事をする"],
  [/grow quietly/gi, "静かに広がる（擬人化）"],
  [/intentional contact/gi, "意図的な連絡"],
  [/Instead of reacting/gi, "〜する代わりに（instead of + 動名詞）"],
  [/deep work/gi, "深い集中作業"],
  [/one more email/gi, "あと1通のメール"],
  [/sends a message/gi, "合図を送る（比喩）"],
  [/remove obstacles/gi, "障害を取り除く"],
  [/one-to-one conversations/gi, "1対1の面談"],
  [/reduce friction/gi, "摩擦を減らす（手間を減らす比喩）"],
  [/not a substitute for/gi, "〜の代わりではない"],
  [/an afterthought/gi, "後付けの考え、二の次"],
  [/virtual coffee chat/gi, "オンラインのコーヒーチャット"],
  [/presence equals performance/gi, "出社＝成果"],
  [/self-awareness/gi, "自己認識"],
  [/sharpen the delivery/gi, "伝え方を磨く"],
  [/rushed through/gi, "急いで片付ける、駆け足で進める"],
  [/stood out to you/gi, "印象に残った、目立った"],
  [/booked my first therapy session/gi, "初めてのカウンセリングを予約した"],
  [/spilled into everything/gi, "すべてに波及した"],
  [/snapping at friends/gi, "友達にキツく当たる"],
  [/no longer a/gi, "もはや〜ではない"],
  [/tightening rules/gi, "規制を強化する"],
];

const DE_CHUNKS = [
  [/die Konzentration zu halten/gi, "集中力を保つ（zu + 不定詞）"],
  [/veränderte ihre Form/gi, "形を変えた（比喩）"],
  [/sowohl Freiheit als auch Ablenkung/gi, "自由と気を散らす要素の両方"],
  [/fiel es vielen schwer/gi, "多くの人にとって難しかった"],
  [/wie einen echten Arbeitstag/gi, "本当の仕事の日のように"],
  [/Übergangsritual/gi, "移行の儀式"],
  [/schafft eine Grenze/gi, "境界を作る"],
  [/leidet oft darunter/gi, "それによって損なわれる"],
  [/wachsen Missverständnisse leise/gi, "誤解が静かに広がる"],
  [/zum richtigen Zeitpunkt/gi, "適切なタイミングで"],
  [/Statt .+ zu reagieren/gi, "〜する代わりに（statt + zu不定詞）"],
  [/zerstückelt wirken/gi, "断片的に見える"],
  [/noch eine E-Mail zu beantworten/gi, "あと1通メールを返す"],
  [/senden ein Signal/gi, "合図を送る"],
  [/beseitigen Hindernisse/gi, "障害を取り除く"],
  [/Einzelgespräche/gi, "1対1面談"],
  [/verringern Reibung/gi, "摩擦を減らす"],
  [/Ersatz für Disziplin/gi, "規律の代わり"],
  [/kein Nebengedanke sein/gi, "後回しの考えではない"],
  [/virtueller Kaffeeklatsch/gi, "オンラインのコーヒーチャット"],
  [/Anwesenheit gleich Leistung/gi, "出社＝成果"],
  [/Selbstwahrnehmung/gi, "自己認識"],
  [/weniger von .+ ab als davon/gi, "AよりBに依存（weniger/als 対比）"],
  [/besteht darin/gi, "〜することに成り立つ"],
];

function isGerman(text) {
  return /[äöüßÄÖÜ]/.test(text) || /\b(der|die|das|und|nicht|sich|eine[rn]?|Als|Wenn|Es fiel)\b/.test(text);
}

function cleanText(text) {
  return text.replace(/^[A-ZÄÖÜ][a-zäöüß]+:\s*/u, "").trim();
}

function isProperNoun(term) {
  return /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|January|February|March|April|May|June|July|August|September|October|November|December|Hannah|Oliver|Lena|Marco|Anna|Tom|Sarah|David|Emma|Lucas|Sophie|Felix|Julia|Max|Lisa|Paul|Nina|Tim|Laura|Jan|Marie|Ben|Clara|Erik|Maya|Jonas|Lea|Finn|Zoe|Noah|Ella|Leon|Mia|Lukas|Amelie|Theo|Greta|Anton|Ida|Emil|Lina|Kai|Nora|Jana|Stefan|Katrin|Markus|Petra|Thomas|Sabine|Michael|Andrea|Daniel|Christina|Martin|Susanne|Christian|Nicole|Alexander|Melanie|Sebastian|Jessica|Florian|Sandra|Patrick|Heike|Tobias|Birgit|Matthias|Kerstin|Philipp|Monika|Fabian|Silke|Dominik|Anja|René|Bettina|Holger|Carsten|Ute|Sven|Heiko|Björn|Dennis|Kevin|Jason|Brian|Chris|Alex|Sam|Jordan|Taylor|Morgan|Casey|Riley|Avery|Quinn|Blake|Drew|Jamie|Robin|Charlie|Dakota|Skyler|Rowan|Reese|Parker|Cameron|Logan|Hunter|Dylan|Tyler|Ryan|Kyle|Brandon|Justin|Ethan|Jacob|Nathan|Zachary|Caleb|Isaac|Elijah|Gabriel|Adrian|Victor|Oscar|Hugo|Ivan)$/i.test(term);
}

function isBadChunk(phrase) {
  if (phrase.split(/\s+/).length < 2) return true;
  if (/^(Hannah|Oliver|Lena|Marco|Anna|Tom|Sarah|David|Emma|Lucas|Sophie|Felix|Julia|Max|Lisa|Paul|Nina|Tim|Laura|Jan|Marie|Ben|Clara|Erik|Maya|Jonas|Lea|Finn|Zoe|Noah|Ella|Leon|Mia|Lukas|Amelie|Theo|Greta|Anton|Ida|Emil|Lina|Kai|Nora|Jana):?\s/i.test(phrase)) return true;
  return false;
}

function parseGrammarString(str) {
  const s = str.trim();
  const arrow = s.indexOf("→");
  if (arrow > 0) {
    return { pattern: s.slice(0, arrow).trim(), explanation: s.slice(arrow + 1).trim() };
  }
  return { pattern: s.slice(0, Math.min(50, s.length)), explanation: s };
}

function getTargets(original) {
  const wc = original.split(/\s+/).filter(Boolean).length;
  if (wc < 18) return { chunks: 3, grammar: 3, vocab: 6 };
  if (wc < 32) return { chunks: 4, grammar: 4, vocab: 8 };
  return { chunks: 5, grammar: 5, vocab: 10 };
}

const EN_DIALOGUE_CHUNKS = [
  [/I finally did it/gi, "やっと踏み切った"],
  [/I have been thinking about it/gi, "ずっと考えてきた"],
  [/a big step/gi, "大きな一歩"],
  [/walking into the office/gi, "オフィスに入る"],
  [/What pushed you to/gi, "何がきっかけで〜したの"],
  [/spilled into everything/gi, "すべてに波及した"],
  [/snapping at friends/gi, "友達にキツく当たる"],
  [/sleeping badly/gi, "眠りが浅い、よく眠れない"],
  [/sounded less dramatic/gi, "大げさに聞こえなかった"],
  [/choose someone specific/gi, "特定の人を選ぶ"],
  [/refer you/gi, "紹介する"],
  [/That makes sense/gi, "なるほど、理にかなってる"],
  [/How did it go/gi, "どうだった？"],
  [/I am glad/gi, "うれしい、よかった"],
];

const DE_DIALOGUE_CHUNKS = [
  [/Ich habe endlich den Schritt gemacht/gi, "やっと踏み切った"],
  [/Ein großer Schritt/gi, "大きな一歩"],
  [/Was hat dich dazu bewegt/gi, "何がきっかけで"],
  [/in alles übergegriffen/gi, "すべてに波及した"],
  [/über kleine Dinge/gi, "小さなことについて"],
  [/Das ergibt Sinn/gi, "なるほど、理にかなってる"],
  [/Wie war es/gi, "どうだった？"],
];

function extractChunksFromText(text, lang, existing, target) {
  const cleaned = cleanText(text);
  const patterns = lang === "de" ? [...DE_CHUNKS, ...DE_DIALOGUE_CHUNKS] : [...EN_CHUNKS, ...EN_DIALOGUE_CHUNKS];
  const out = [...existing];
  const seen = new Set(existing.map((c) => c.phrase.toLowerCase()));

  for (const [re, meaning] of patterns) {
    const m = cleaned.match(re);
    if (m && !seen.has(m[0].toLowerCase()) && !isBadChunk(m[0])) {
      out.push({ phrase: m[0], meaning });
      seen.add(m[0].toLowerCase());
    }
    if (out.length >= target) break;
  }

  // extract meaningful 2-5 word phrases
  if (out.length < target) {
    const words = cleaned.match(/[\wäöüß'-]+/g) || [];
    for (let len = 5; len >= 2 && out.length < target; len--) {
      for (let i = 0; i <= words.length - len; i++) {
        const phrase = words.slice(i, i + len).join(" ");
        if (phrase.length < 10 || seen.has(phrase.toLowerCase()) || isBadChunk(phrase)) continue;
        if (/^(the|a|an|and|or|but|in|on|at|to|for|of|with|by|from|is|are|was|were|it|they|we|you|he|she|I|der|die|das|und|ist|sind|war|ein|eine|ich|und|habe|hat|war|bin|sind)$/i.test(words[i])) continue;
        out.push({ phrase, meaning: lang === "de" ? `「${phrase}」— 段落から抽出した実践表現` : `「${phrase}」— 段落から抽出した実践表現` });
        seen.add(phrase.toLowerCase());
        if (out.length >= target) break;
      }
    }
  }
  return out.slice(0, target);
}

function extractGrammar(text, lang, existing, target) {
  const cleaned = cleanText(text);
  const out = [...existing];
  const seen = new Set(out.map((g) => g.pattern));

  const add = (pattern, explanation) => {
    if (!seen.has(pattern) && out.length < target) {
      out.push({ pattern, explanation });
      seen.add(pattern);
    }
  };

  if (lang === "en") {
    if (/When .+, .+/i.test(cleaned)) add("When + clause, main clause", "When節で背景・時を示し、主節で結果や主張を述べる。");
    if (/both .+ and .+/i.test(cleaned)) add("both A and B", "both ... and ... で2要素を並列に列挙する。");
    if (/less .+ and more .+/i.test(cleaned)) add("less on A and more on B", "AよりBの方が重要、という対比。less / more のペア。");
    if (/not .+ but .+/i.test(cleaned)) add("not A but B", "AではなくB、という対比構文。");
    if (/Instead of .+/i.test(cleaned)) add("Instead of + gerund", "「〜する代わりに」という対比の前置き表現。");
    if (/Without .+, .+/i.test(cleaned)) add("Without + noun, clause", "Without + 名詞で「〜なしに」条件を示す。");
    if (/; .+/i.test(cleaned)) add("semicolon between clauses", "セミコロンで対比・補足の独立節をつなぐ。");
    if (/By .+ing/i.test(cleaned)) add("By + gerund (series)", "By + 動名詞で方法・手段を列挙する。");
    if (/If .+, .+/i.test(cleaned)) add("If + condition, result", "If節で条件、主節で結果を述べる。");
    if (/that .+/i.test(cleaned)) add("that-clause", "that節で内容・考えを伝える。");
    if (/who |which |that .+/i.test(cleaned)) add("relative clause", "関係代名詞節で名詞を後置修飾する。");
    if (/have been .+ing/i.test(cleaned)) add("present perfect continuous", "have been + -ing で過去から現在までの継続を表す。");
    if (/appreciate .+ ing/i.test(cleaned)) add("appreciate + O + -ing", "appreciate + 目的語 + 動名詞で「〜してくれて感謝する」。");
    if (/no longer/i.test(cleaned)) add("no longer + verb", "no longer で「もはや〜ない」状態変化を示す。");
    if (/when used/i.test(cleaned)) add("when + past participle", "when + 過去分詞で「〜されたとき」という条件。");
    if (/cannot .+ by who/i.test(cleaned)) add("measure by + wh-clause", "by + 疑問詞節で「〜によって」基準を示す。");
    if (/It is .+ to /i.test(cleaned)) add("It is + adj + to-inf", "形式主語 it + 形容詞 + to不定詞。");
    if (/One of the most/i.test(cleaned)) add("One of the most + adj + N", "One of the most で「最も〜なものの一つ」。");
    if (/What pushed you to/i.test(cleaned)) add("What pushed you to + verb", "push + 人 + to + 動詞 で「〜するきっかけを与える」。");
    if (/Did you .+, or did/i.test(cleaned)) add("Did you A, or did B?", "or で2つの選択肢を尋ねる疑問文。");
    if (/less .+ than I imagined/i.test(cleaned)) add("less ... than I imagined", "less ... than で「想像より〜でない」比較。");
    if (/I wanted to talk about/i.test(cleaned)) add("I wanted to talk about ...", "過去形 wanted で丁寧に話題を切り出す。");
    if (/I appreciate you saying/i.test(cleaned)) add("I appreciate you + -ing", "appreciate + O + 動名詞で感謝を伝える。");
  } else {
    if (/Als .+, .+/i.test(cleaned)) add("Als + Nebensatz", "Als節で過去の時点・背景を示す。");
    if (/Es fiel .+ schwer, .+ zu/i.test(cleaned)) add("Es fällt + Dat. + schwer, ... zu", "形式主語 es + schwer + zu不定詞で「〜するのは難しい」。");
    if (/sowohl .+ als auch/i.test(cleaned)) add("sowohl A als auch B", "sowohl ... als auch ... で両方を列挙。");
    if (/weniger .+ als/i.test(cleaned)) add("weniger ... als / ab als", "weniger ... als で「〜より少ない／重要でない」比較。");
    if (/nicht .+, sondern/i.test(cleaned)) add("nicht A, sondern B", "nicht ... sondern ... の対比構文。");
    if (/Statt .+ zu/i.test(cleaned)) add("Statt ... zu + Inf.", "Statt + zu不定詞で「〜する代わりに」。");
    if (/Ohne .+, .+/i.test(cleaned)) add("Ohne + Akk., Hauptsatz", "Ohne + 第四格で「〜なしに」。");
    if (/; /i.test(cleaned)) add("Semikolon zwischen Sätzen", "セミコロンで対比・補足の節をつなぐ。");
    if (/, die |, der |, das /i.test(cleaned)) add("Relativsatz (der/die/das)", "関係代名詞節で名詞を後置修飾。");
    if (/Wenn .+, .+/i.test(cleaned)) add("Wenn + Nebensatz", "Wenn節で条件を示す。");
    if (/besteht darin/i.test(cleaned)) add("besteht darin, ... zu", "darin 構文で「〜することに成り立つ」。");
    if (/Es ist leicht, .+ zu/i.test(cleaned)) add("Es ist leicht, ... zu", "形式主語 es + leicht + zu不定詞。");
    if (/wichtiger, als/i.test(cleaned)) add("Komparativ + als", "比較級 + als で「〜以上に」。");
    if (/wenn man /i.test(cleaned)) add("wenn + man + Verb", "wenn節で一般条件を示す。");
    if (/ohne .+ zurückzu/i.test(cleaned)) add("ohne ... zu + Inf.", "ohne + zu不定詞 + dass節で「〜せずに」。");
    if (/Ziel ist nicht/i.test(cleaned)) add("Ziel ist nicht A, sondern B", "目的の対比構文。");
    if (/Was hat dich dazu bewegt/i.test(cleaned)) add("Was hat dich dazu bewegt, ...?", "bewegen + 人 + dazu + zu不定詞で「きっかけを与える」。");
    if (/Hast du .+, oder hat/i.test(cleaned)) add("Hast du A, oder hat B?", "oder で2つの選択肢を尋ねる。");
  }

  // pad with sentence-based patterns
  const padSources = [
    ...cleaned.split(/[.!?;]+/).map((s) => s.trim()).filter((s) => s.length > 12),
    ...cleaned.split(/[,]+/).map((s) => s.trim()).filter((s) => s.length > 15),
  ];
  for (const s of padSources) {
    if (out.length >= target) break;
    const pattern = s.length > 55 ? s.slice(0, 55) + "…" : s;
    if (!seen.has(pattern)) {
      out.push({ pattern, explanation: "この文の構造・語順に注目して読む。" });
      seen.add(pattern);
    }
  }
  return out.slice(0, target);
}

function extractVocab(text, lang, existing, target) {
  const dict = lang === "de" ? DE_VOCAB : EN_VOCAB;
  const stop = new Set(["the","a","an","and","or","but","in","on","at","to","for","of","with","by","from","as","is","are","was","were","be","been","have","has","had","do","does","did","will","would","could","should","may","might","can","that","this","these","those","it","its","they","them","their","we","our","you","your","he","she","his","her","who","which","what","when","where","how","why","if","not","no","so","than","then","also","just","more","most","very","too","into","over","after","before","during","while","both","all","any","each","every","some","only","own","same","other","one","new","now","here","there","up","out","off","down","der","die","das","und","ist","sind","war","ein","eine","nicht","auch","noch","schon","nur","sehr","als","wenn","weil","dass","es","sie","er","wir","man","ich","du","den","dem","des","einer","einem","einen","eines","zum","zur","für","mit","von","zu","auf","aus","bei","nach","über","unter","ohne","durch","doch","wurde","wird","werden","haben","hat","kann","muss","soll","been","being"]);
  const out = [...existing];
  const seen = new Set(existing.map((v) => v.term.toLowerCase()));
  const cleaned = cleanText(text);

  const tokens = cleaned.match(/[\wäöüß'-]+/g) || [];
  for (const raw of tokens) {
    const term = raw.replace(/^['"]|['"]$/g, "");
    const lower = term.toLowerCase();
    if (term.length < 4 || stop.has(lower) || seen.has(lower) || isProperNoun(term)) continue;
    const meaning = dict[term] || dict[term.charAt(0).toUpperCase() + term.slice(1).toLowerCase()] || dict[lower];
    if (!meaning) continue;
    out.push({ term, meaning });
    seen.add(lower);
    if (out.length >= target) break;
  }

  // second pass: content words with suffix patterns
  if (out.length < target) {
    for (const raw of tokens) {
      const term = raw.replace(/^['"]|['"]$/g, "");
      const lower = term.toLowerCase();
      const minLen = target <= 6 ? 4 : 5;
      if (term.length < minLen || stop.has(lower) || seen.has(lower) || isProperNoun(term)) continue;
      if (/(tion|ment|ness|ity|able|ible|ful|less|ive|ous|ing|ed|ly|ist|ism|ize|ise)$/i.test(term) || (lang === "de" && /(ung|keit|heit|lich|isch|los|bar|ieren|schaft)$/i.test(term))) {
        out.push({ term, meaning: dict[lower] || dict[term] || `${term}（段落の重要語）` });
        seen.add(lower);
      }
      if (out.length >= target) break;
    }
  }
  // third pass: any remaining useful words
  if (out.length < target) {
    for (const raw of tokens) {
      const term = raw.replace(/^['"]|['"]$/g, "");
      const lower = term.toLowerCase();
      if (term.length < 4 || stop.has(lower) || seen.has(lower) || isProperNoun(term)) continue;
      out.push({ term, meaning: dict[lower] || dict[term] || `${term}（段落の重要語）` });
      seen.add(lower);
      if (out.length >= target) break;
    }
  }
  return out.slice(0, target);
}

function parseStudyNotesBlock(block) {
  const chunks = [];
  const chunksMatch = block.match(/chunks:\s*\[([\s\S]*?)\]\s*,/);
  if (chunksMatch) {
    const itemRe = /\{\s*phrase:\s*"((?:\\.|[^"\\])*)"\s*,\s*meaning:\s*"((?:\\.|[^"\\])*)"\s*\}/g;
    let m;
    while ((m = itemRe.exec(chunksMatch[1])) !== null) chunks.push({ phrase: m[1], meaning: m[2] });
  }
  let grammar = [];
  const grammarArrayMatch = block.match(/grammar:\s*\[([\s\S]*?)\]\s*,/);
  const grammarStringMatch = block.match(/grammar:\s*\n?\s*"((?:\\.|[^"\\])*)"\s*,/);
  if (grammarArrayMatch) {
    const itemRe = /\{\s*pattern:\s*"((?:\\.|[^"\\])*)"\s*,\s*explanation:\s*"((?:\\.|[^"\\])*)"\s*\}/g;
    let m;
    while ((m = itemRe.exec(grammarArrayMatch[1])) !== null) grammar.push({ pattern: m[1], explanation: m[2] });
  } else if (grammarStringMatch) {
    grammar.push(parseGrammarString(grammarStringMatch[1]));
  }
  const vocabulary = [];
  const vocabMatch = block.match(/vocabulary:\s*\[([\s\S]*?)\]\s*,?\s*\}/);
  if (vocabMatch) {
    const itemRe = /\{\s*term:\s*"((?:\\.|[^"\\])*)"\s*,\s*meaning:\s*"((?:\\.|[^"\\])*)"\s*\}/g;
    let m;
    while ((m = itemRe.exec(vocabMatch[1])) !== null) vocabulary.push({ term: m[1], meaning: m[2] });
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

function expandBlock(block, original) {
  const lang = isGerman(original) ? "de" : "en";
  const targets = getTargets(original);
  const parsed = parseStudyNotesBlock(block);
  return formatStudyNotes({
    chunks: extractChunksFromText(original, lang, parsed.chunks, targets.chunks),
    grammar: extractGrammar(original, lang, parsed.grammar, targets.grammar),
    vocabulary: extractVocab(original, lang, parsed.vocabulary, targets.vocab),
  });
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let count = 0;
  const paraRe = /original:\s*\n\s*"((?:\\.|[^"\\])*)"\s*,\s*\n\s*translation:\s*\n\s*"((?:\\.|[^"\\])*)"\s*,\s*\n\s*(studyNotes:\s*\{[\s\S]*?\n\s*\})/g;
  content = content.replace(paraRe, (match, original, translation, studyNotesBlock) => {
    count++;
    const expanded = expandBlock(studyNotesBlock, original);
    return `original:\n          "${original}",\n        translation:\n          "${translation}",\n        ${expanded}`;
  });
  fs.writeFileSync(filePath, content, "utf8");
  return count;
}

const files = fs.readdirSync(ARTICLES_DIR).filter((f) => /^article-\d+\.ts$/.test(f)).sort();
let total = 0;
for (const f of files) {
  const n = processFile(path.join(ARTICLES_DIR, f));
  console.log(`${f}: ${n} paragraphs`);
  total += n;
}
console.log(`Total: ${total}`);
