import type { ArticlePairSeed } from "@/lib/types";

export const article04: ArticlePairSeed = {
  pairId: "startup-pitch",
  titleJa: "スタートアップのピッチ",
  category: "business",
  format: "monologue",
  en: {
    title: "Pitching a Startup Idea to Investors",
    paragraphs: [
      {
        original:
          "Hi everyone, thanks for being here. My name is Jonas, and I am the founder of Shelfwise. We help small grocery stores predict which products will sell out before the weekend. I am not going to waste your time with a long story about my childhood. I want to show you a problem that costs retailers money every single day.",
        translation:
          "みなさん、来てくれてありがとう。ジョナスです。Shelfwiseの創業者です。小さな食料品店が、週末前にどの商品が売り切れるか予測するのを手伝っています。幼少期の長い話で時間を無駄にはしません。小売業者が毎日損をしている問題をお見せします。",
        studyNotes: {
          chunks: [
            { phrase: "waste your time with", meaning: "〜で時間を無駄にする" },
            { phrase: "costs retailers money every single day", meaning: "小売業者に毎日損失をもたらす" },
          ],
          grammar: [
            { pattern: "I am not going to waste...", explanation: "be going to + 動詞で意図・計画を述べる。" },
            { pattern: "We help small grocery stores predict which products …", explanation: "助動詞 + 動詞原形 で推量・可能性・義務を表す。" },
            { pattern: "Hi everyone, thanks for being here.", explanation: "SVO 語順で主語・動詞・目的語を確認する。" },
            { pattern: "My name is Jonas, and I am the founder of Shelfwise.", explanation: "be動詞 + 補語で状態・特徴を述べる。" },
            { pattern: "I am not going to waste your time with a long story …", explanation: "SVO 語順で主語・動詞・目的語を確認する。" },
          ],
          vocabulary: [
            { term: "founder", meaning: "創業者、創設者" },
            { term: "retailers", meaning: "小売業者" },
            { term: "small", meaning: "小さな" },
            { term: "waste", meaning: "廃棄物" },
            { term: "about", meaning: "〜について" },
            { term: "want", meaning: "欲しい" },
          ],
        },
      },
      {
        original:
          "Last year I visited forty independent shops in Berlin. Almost every owner told me the same thing: they either overstock fresh items and throw food away, or they run out of popular goods and lose customers to larger chains. The average store wastes about eight percent of refrigerated inventory each month.",
        translation:
          "去年、ベルリンの独立店を40軒回りました。ほぼ全員が同じことを言いました。生鮮品を過剰に仕入れて食品を捨てるか、人気商品が切れて大手チェーンに客を逃すかだ、と。平均して店は冷蔵在庫の約8％を毎月無駄にしています。",
        studyNotes: {
          chunks: [
            { phrase: "run out of popular goods", meaning: "人気商品が品切れになる" },
            { phrase: "lose customers to larger chains", meaning: "大手チェーンに客を逃す" },
          ],
          grammar: [
            { pattern: "they either A or they B", explanation: "either...or で2つの選択肢を並列する。" },
            { pattern: "Almost every owner told me the same thing: they eith…", explanation: "and で要素を並列に列挙する。" },
            { pattern: "Last year I visited forty independent shops in Berli…", explanation: "SVO 語順で主語・動詞・目的語を確認する。" },
            { pattern: "The average store wastes about eight percent of refr…", explanation: "SVO 語順で主語・動詞・目的語を確認する。" },
          ],
          vocabulary: [
            { term: "overstock", meaning: "過剰に仕入れる" },
            { term: "inventory", meaning: "在庫" },
            { term: "about", meaning: "〜について" },
            { term: "thing", meaning: "こと" },
          ],
        },
      },
      {
        original:
          "Shelfwise connects to the store's sales data and local weather forecasts. Our algorithm suggests order quantities for the next five days. A pilot with three shops reduced spoilage by thirty-one percent in twelve weeks. That is real money returned to families who run these businesses on tight margins.",
        translation:
          "Shelfwiseは店の売上データと地域の天気予報をつなぎます。アルゴリズムが次の5日間の発注量を提案します。3店舗での試験導入で、12週間で廃棄が31％減りました。薄い利益で店を運営する家族に、実際のお金が戻ったのです。",
        studyNotes: {
          chunks: [
            { phrase: "reduced spoilage by thirty-one percent", meaning: "廃棄を31％削減した" },
            { phrase: "on tight margins", meaning: "薄い利益率で（営業している）" },
          ],
          grammar: [
            { pattern: "That is real money returned to...", explanation: "過去分詞 returned で結果を説明する。" },
            { pattern: "Shelfwise connects to the store's sales data and loc…", explanation: "SVO 語順で主語・動詞・目的語を確認する。" },
            { pattern: "Our algorithm suggests order quantities for the next…", explanation: "SVO 語順で主語・動詞・目的語を確認する。" },
            { pattern: "A pilot with three shops reduced spoilage by thirty-…", explanation: "SVO 語順で主語・動詞・目的語を確認する。" },
            { pattern: "That is real money returned to families who run thes…", explanation: "be動詞 + 補語で状態・特徴を述べる。" },
          ],
          vocabulary: [
            { term: "spoilage", meaning: "廃棄、腐敗" },
            { term: "algorithm", meaning: "アルゴリズム" },
            { term: "next", meaning: "次の" },
            { term: "pilot", meaning: "試験的な" },
          ],
        },
      },
      {
        original:
          "You might ask why existing software does not solve this. Enterprise tools are built for supermarket chains with dedicated IT teams. Independent owners need something they can set up in an afternoon without consultants. We designed Shelfwise for a tablet on the shop counter, not a server room.",
        translation:
          "既存のソフトでは解決できないのでは、と思うかもしれません。大企業向けツールは専門ITチームのあるスーパーチェーン向けです。独立店のオーナーには、コンサルなしで午後に設定できるものが必要です。Shelfwiseはサーバールームではなく、カウンターのタブレット向けに設計しました。",
        studyNotes: {
          chunks: [
            { phrase: "set up in an afternoon", meaning: "午後に設定できる" },
            { phrase: "not a server room", meaning: "サーバールームではない（対比）" },
          ],
          grammar: [
            { pattern: "something they can set up", explanation: "関係代名詞 they can set up で名詞を修飾。" },
            { pattern: "Without + noun, clause", explanation: "Without + 名詞で「〜なしに」条件を示す。" },
            { pattern: "You might ask why existing software does not solve t…", explanation: "助動詞 + 動詞原形 で推量・可能性・義務を表す。" },
            { pattern: "Independent owners need something they can set up in…", explanation: "助動詞 + 動詞原形 で推量・可能性・義務を表す。" },
            { pattern: "Enterprise tools are built for supermarket chains wi…", explanation: "be動詞 + 補語で状態・特徴を述べる。" },
          ],
          vocabulary: [
            { term: "enterprise", meaning: "大企業向けの" },
            { term: "dedicated", meaning: "専用の、専任の" },
            { term: "software", meaning: "ソフトウェア" },
            { term: "tools", meaning: "道具、対処法" },
            { term: "room", meaning: "部屋" },
          ],
        },
      },
      {
        original:
          "Our business model is straightforward. Stores pay a monthly subscription based on revenue. We also earn a small commission when they order through our supplier marketplace. Customer acquisition cost is low because owners recommend us to neighboring shops when they see fewer empty shelves.",
        translation:
          "ビジネスモデルは単純です。店は売上に応じた月額料金を払います。サプライヤーマーケットプレイス経由の発注では少額の手数料も得ます。棚が空きにくくなるのを見たオーナーが近隣の店に勧めるので、顧客獲得コストは低いです。",
        studyNotes: {
          chunks: [
            { phrase: "based on revenue", meaning: "売上に応じた" },
            { phrase: "customer acquisition cost", meaning: "顧客獲得コスト" },
          ],
          grammar: [
            { pattern: "because owners recommend us", explanation: "because + 節で理由を述べる。" },
            { pattern: "Our business model is straightforward.", explanation: "be動詞 + 補語で状態・特徴を述べる。" },
            { pattern: "Stores pay a monthly subscription based on revenue.", explanation: "SVO 語順で主語・動詞・目的語を確認する。" },
            { pattern: "We also earn a small commission when they order thro…", explanation: "SVO 語順で主語・動詞・目的語を確認する。" },
            { pattern: "Customer acquisition cost is low because owners reco…", explanation: "be動詞 + 補語で状態・特徴を述べる。" },
          ],
          vocabulary: [
            { term: "subscription", meaning: "月額料金、サブスクリプション" },
            { term: "commission", meaning: "手数料、コミッション" },
            { term: "small", meaning: "小さな" },
            { term: "supplier", meaning: "サプライヤー" },
            { term: "recommend", meaning: "勧める" },
            { term: "cost", meaning: "費用、コスト" },
            { term: "revenue", meaning: "収益" },
          ],
        },
      },
      {
        original:
          "The market is larger than it looks. In Germany alone, there are more than six thousand independent food retailers. Across the European Union, the segment still represents billions in annual sales. We are starting in urban neighborhoods where delivery apps have increased competition for foot traffic.",
        translation:
          "市場は見た目より大きいです。ドイツだけでも独立の食品小売店は6千軒以上。EU全体でも、この区分は年間数十億ユーロの売上です。配達アプリで来店競争が激しくなった都市部の住宅地から始めています。",
        studyNotes: {
          chunks: [
            { phrase: "larger than it looks", meaning: "見た目より大きい" },
            { phrase: "competition for foot traffic", meaning: "来店客を巡る競争" },
          ],
          grammar: [
            { pattern: "where delivery apps have increased...", explanation: "関係副詞 where で場所・状況を修飾。" },
            { pattern: "We are starting in urban neighborhoods where deliver…", explanation: "be + -ing で進行・継続を表す。" },
            { pattern: "The market is larger than it looks.", explanation: "be動詞 + 補語で状態・特徴を述べる。" },
            { pattern: "In Germany alone, there are more than six thousand i…", explanation: "be動詞 + 補語で状態・特徴を述べる。" },
            { pattern: "Across the European Union, the segment still represe…", explanation: "SVO 語順で主語・動詞・目的語を確認する。" },
          ],
          vocabulary: [
            { term: "segment", meaning: "区分、セグメント" },
            { term: "foot traffic", meaning: "来店客、歩行者の往来" },
            { term: "delivery", meaning: "伝え方" },
            { term: "retailers", meaning: "小売業者" },
            { term: "still", meaning: "静かな" },
          ],
        },
      },
      {
        original:
          "Our team combines retail experience and machine learning. I spent six years managing supply chains for a regional wholesaler. My co-founder, Priya, built forecasting models at a logistics startup. We have two engineers and a part-time designer who grew up working in her parents' corner store.",
        translation:
          "チームは小売経験と機械学習を組み合わせています。私は地域卸売業者でサプライチェーンを6年管理しました。共同創業者プリヤは物流スタートアップで予測モデルを構築しました。エンジニア2人と、両親の角店で育ったパートタイムのデザイナーがいます。",
        studyNotes: {
          chunks: [
            { phrase: "combines retail experience and machine learning", meaning: "小売経験と機械学習を組み合わせる" },
            { phrase: "grew up working in her parents' corner store", meaning: "両親の角店で働きながら育った" },
          ],
          grammar: [
            { pattern: "who grew up working in...", explanation: "who + 過去形 + 動名詞で背景を説明。" },
            { pattern: "Our team combines retail experience and machine lear…", explanation: "SVO 語順で主語・動詞・目的語を確認する。" },
            { pattern: "I spent six years managing supply chains for a regio…", explanation: "SVO 語順で主語・動詞・目的語を確認する。" },
            { pattern: "My co-founder", explanation: "SVO 語順で主語・動詞・目的語を確認する。" },
            { pattern: "Priya, built forecasting models at a logistics start…", explanation: "SVO 語順で主語・動詞・目的語を確認する。" },
          ],
          vocabulary: [
            { term: "co-founder", meaning: "共同創業者" },
            { term: "forecasting", meaning: "予測" },
            { term: "logistics", meaning: "物流" },
            { term: "combines", meaning: "組み合わせる" },
            { term: "regional", meaning: "地域の" },
            { term: "startup", meaning: "スタートアップ" },
          ],
        },
      },
      {
        original:
          "We are raising four hundred thousand euros to expand from three pilot stores to forty by next spring. The funds will hire two sales representatives and improve integration with common checkout systems. Our goal is to reach profitability within eighteen months at current pricing.",
        translation:
          "来年春までに試験3店から40店へ広げるため、40万ユーロを調達します。資金は営業担当2名の採用と、一般的なレジシステムとの連携強化に使います。現行価格で18か月以内に黒字化するのが目標です。",
        studyNotes: {
          chunks: [
            { phrase: "expand from three pilot stores to forty", meaning: "試験3店から40店へ拡大する" },
            { phrase: "reach profitability within eighteen months", meaning: "18か月以内に黒字化する" },
          ],
          grammar: [
            { pattern: "to expand from A to B", explanation: "to + 動詞で目的を示す。" },
            { pattern: "We are raising four hundred thousand euros to expand…", explanation: "be + -ing で進行・継続を表す。" },
            { pattern: "The funds will hire two sales representatives and im…", explanation: "助動詞 + 動詞原形 で推量・可能性・義務を表す。" },
            { pattern: "Our goal is to reach profitability within eighteen m…", explanation: "be動詞 + 補語で状態・特徴を述べる。" },
          ],
          vocabulary: [
            { term: "profitability", meaning: "黒字化、収益性" },
            { term: "integration", meaning: "連携、統合" },
            { term: "pilot", meaning: "試験的な" },
            { term: "next", meaning: "次の" },
            { term: "months", meaning: "数か月" },
          ],
        },
      },
      {
        original:
          "The risks are real, and I will name them. Larger software vendors could move downmarket. Store owners may resist sharing data until they trust us. We address this with transparent dashboards and a cancel-anytime policy. Early retention in our pilot cohort is ninety-two percent.",
        translation:
          "リスクは本物で、名前を挙げます。大手ソフトベンダーが下位市場に降りてくる可能性があります。店のオーナーは信頼するまでデータ共有を嫌がるかもしれません。透明なダッシュボードといつでも解約可能な方針で対応しています。試験グループの早期継続率は92％です。",
        studyNotes: {
          chunks: [
            { phrase: "move downmarket", meaning: "下位市場に降りてくる" },
            { phrase: "a cancel-anytime policy", meaning: "いつでも解約可能な方針" },
            { phrase: "address this with transparent dashboards", meaning: "住所（ここでは場所）、透明な" },
          ],
          grammar: [
            { pattern: "may resist sharing data until...", explanation: "may + 動詞で可能性、until で条件。" },
            { pattern: "The risks are real, and I will name them.", explanation: "助動詞 + 動詞原形 で推量・可能性・義務を表す。" },
            { pattern: "Larger software vendors could move downmarket.", explanation: "助動詞 + 動詞原形 で推量・可能性・義務を表す。" },
            { pattern: "Store owners may resist sharing data until they trus…", explanation: "助動詞 + 動詞原形 で推量・可能性・義務を表す。" },
            { pattern: "We address this with transparent dashboards and a ca…", explanation: "SVO 語順で主語・動詞・目的語を確認する。" },
          ],
          vocabulary: [
            { term: "retention", meaning: "継続率、定着" },
            { term: "cohort", meaning: "グループ、コホート" },
            { term: "software", meaning: "ソフトウェア" },
            { term: "trust", meaning: "信頼する" },
            { term: "address", meaning: "住所（ここでは場所）" },
            { term: "transparent", meaning: "透明な" },
            { term: "pilot", meaning: "試験的な" },
            { term: "policy", meaning: "政策" },
          ],
        },
      },
      {
        original:
          "I believe independent retailers are essential to healthy cities. They know their customers by name and adapt faster than national chains. With better forecasting, they can compete on freshness instead of price alone. Thank you for listening. I would love to take your questions and show you a live demo after this session.",
        translation:
          "独立小売店は健全な都市に不可欠だと信じています。客の名前を知り、全国チェーンより速く適応します。予測が良くなれば、値段だけでなく鮮度で競えます。聞いていただきありがとうございます。質問を受け、この後ライブデモもお見せしたいです。",
        studyNotes: {
          chunks: [
            { phrase: "compete on freshness instead of price alone", meaning: "値段だけでなく鮮度で競う" },
            { phrase: "take your questions", meaning: "質問を受ける" },
          ],
          grammar: [
            { pattern: "I would love to take...", explanation: "would love to + 動詞で丁寧な希望を表す。" },
            { pattern: "Instead of + gerund", explanation: "「〜する代わりに」という対比の前置き表現。" },
            { pattern: "instead of price alone", explanation: "Instead of + 動名詞で「〜する代わりに」。" },
            { pattern: "I believe independent retailers are essential to hea…", explanation: "be + to不定詞 で目的・未来を表す。" },
            { pattern: "With better forecasting, they can compete on freshne…", explanation: "助動詞 + 動詞原形 で推量・可能性・義務を表す。" },
          ],
          vocabulary: [
            { term: "essential", meaning: "不可欠な" },
            { term: "forecasting", meaning: "予測" },
            { term: "session", meaning: "セッション" },
            { term: "retailers", meaning: "小売業者" },
            { term: "adapt", meaning: "適応する" },
            { term: "live", meaning: "ライブで" },
          ],
        },
      },
    ],
  },
  de: {
    title: "Eine Startup-Idee vor Investoren pitchen",
    paragraphs: [
      {
        original:
          "Hallo zusammen, danke, dass ihr da seid. Mein Name ist Jonas, und ich bin Gründer von Shelfwise. Wir helfen kleinen Lebensmittelläden vorherzusagen, welche Produkte vor dem Wochenende ausverkauft sein werden. Ich werde eure Zeit nicht mit einer langen Geschichte über meine Kindheit verschwenden. Ich möchte euch ein Problem zeigen, das Händler jeden Tag Geld kostet.",
        translation:
          "みなさん、来てくれてありがとう。ジョナスです。Shelfwiseの創業者です。小さな食料品店が、週末前にどの商品が売り切れるか予測するのを手伝っています。幼少期の長い話で時間を無駄にはしません。小売業者が毎日損をしている問題をお見せします。",
        studyNotes: {
          chunks: [
            { phrase: "jeden Tag Geld kostet", meaning: "毎日損失をもたらす" },
          ],
          grammar: [
            { pattern: "Ich werde ... nicht verschwenden", explanation: "werden + 否定で意図を述べる。" },
            { pattern: "Hallo zusammen, danke, dass ihr da seid.", explanation: "dass節で内容・事実を伝える。" },
            { pattern: "Wir helfen kleinen Lebensmittelläden vorherzusagen, …", explanation: "werden/wurde + Partizip II で受動・変化を表す。" },
            { pattern: "Mein Name ist Jonas, und ich bin Gründer von Shelfwi…", explanation: "sein/werden で状態・変化を表す。" },
            { pattern: "Ich werde eure Zeit nicht mit einer langen Geschicht…", explanation: "動詞の語尾変化（活用）に注目する。" },
          ],
          vocabulary: [
            { term: "Gründer", meaning: "創業者、創設者" },
            { term: "Händler", meaning: "小売業者、商人" },
          ],
        },
      },
      {
        original:
          "Letztes Jahr besuchte ich vierzig unabhängige Läden in Berlin. Fast jeder Inhaber sagte mir dasselbe: Sie kaufen entweder zu viele frische Waren ein und werfen Lebensmittel weg, oder beliebte Artikel gehen aus und Kunden gehen zu großen Ketten. Der durchschnittliche Laden verschwendet etwa acht Prozent des Kühlwarenbestands pro Monat.",
        translation:
          "去年、ベルリンの独立店を40軒回りました。ほぼ全員が同じことを言いました。生鮮品を過剰に仕入れて食品を捨てるか、人気商品が切れて大手チェーンに客を逃すかだ、と。平均して店は冷蔵在庫の約8％を毎月無駄にしています。",
        studyNotes: {
          chunks: [
            { phrase: "beliebte Artikel gehen aus", meaning: "人気商品が品切れになる" },
            { phrase: "Kunden gehen zu großen Ketten", meaning: "客が大手チェーンに行く" },
          ],
          grammar: [
            { pattern: "entweder ... oder", explanation: "either...or に相当する対比構文。" },
            { pattern: "Fast jeder Inhaber sagte mir dasselbe: Sie kaufen en…", explanation: "und で要素を並列に列挙する。" },
            { pattern: "Letztes Jahr besuchte ich vierzig unabhängige Läden …", explanation: "動詞の語尾変化（活用）に注目する。" },
            { pattern: "Der durchschnittliche Laden verschwendet etwa acht P…", explanation: "動詞の語尾変化（活用）に注目する。" },
          ],
          vocabulary: [
            { term: "Inhaber", meaning: "オーナー、店主" },
            { term: "Kühlwarenbestands", meaning: "冷蔵在庫" },
          ],
        },
      },
      {
        original:
          "Shelfwise verbindet Verkaufsdaten des Ladens mit lokalen Wettervorhersagen. Unser Algorithmus schlägt Bestellmengen für die nächsten fünf Tage vor. Ein Pilot mit drei Läden reduzierte Verderb um einunddreißig Prozent in zwölf Wochen. Das ist echtes Geld, das Familien zurückbekommen, die diese Geschäfte mit knappen Margen führen.",
        translation:
          "Shelfwiseは店の売上データと地域の天気予報をつなぎます。アルゴリズムが次の5日間の発注量を提案します。3店舗での試験導入で、12週間で廃棄が31％減りました。薄い利益で店を運営する家族に、実際のお金が戻ったのです。",
        studyNotes: {
          chunks: [
            { phrase: "reduzierte Verderb um einunddreißig Prozent", meaning: "廃棄を31％削減した" },
            { phrase: "mit knappen Margen führen", meaning: "薄い利益率で運営する" },
          ],
          grammar: [
            { pattern: "das Familien zurückbekommen", explanation: "関係代名詞 das で Geld を修飾。" },
            { pattern: ", die diese Geschäfte mit knappen Margen führen", explanation: "関係代名詞 die/der/das で名詞を後置修飾する。" },
            { pattern: "Shelfwise verbindet Verkaufsdaten des Ladens mit lok…", explanation: "動詞の語尾変化（活用）に注目する。" },
            { pattern: "Unser Algorithmus schlägt Bestellmengen für die näch…", explanation: "動詞の語尾変化（活用）に注目する。" },
            { pattern: "Ein Pilot mit drei Läden reduzierte Verderb um einun…", explanation: "動詞の語尾変化（活用）に注目する。" },
          ],
          vocabulary: [
            { term: "Verderb", meaning: "廃棄、腐敗" },
            { term: "Algorithmus", meaning: "アルゴリズム" },
            { term: "Pilot", meaning: "試験的な" },
          ],
        },
      },
      {
        original:
          "Ihr fragt euch vielleicht, warum bestehende Software das nicht löst. Enterprise-Tools sind für Supermarktketten mit eigenen IT-Teams gebaut. Unabhängige Inhaber brauchen etwas, das sie an einem Nachmittag ohne Berater einrichten können. Wir haben Shelfwise für ein Tablet an der Ladentheke entwickelt, nicht für einen Serverraum.",
        translation:
          "既存のソフトでは解決できないのでは、と思うかもしれません。大企業向けツールは専門ITチームのあるスーパーチェーン向けです。独立店のオーナーには、コンサルなしで午後に設定できるものが必要です。Shelfwiseはサーバールームではなく、カウンターのタブレット向けに設計しました。",
        studyNotes: {
          chunks: [
            { phrase: "nicht für einen Serverraum", meaning: "サーバールーム向けではない" },
          ],
          grammar: [
            { pattern: "etwas, das sie ... einrichten können", explanation: "関係代名詞 das で名詞を修飾。" },
            { pattern: "Ohne + Akk., Hauptsatz", explanation: "Ohne + 第四格で「〜なしに」。" },
            { pattern: "Unabhängige Inhaber brauchen etwas, das sie an einem…", explanation: "助動詞 + 不定詞 で能力・義務・推量を表す。" },
            { pattern: "Ihr fragt euch vielleicht, warum bestehende Software…", explanation: "動詞の語尾変化（活用）に注目する。" },
            { pattern: "Enterprise-Tools sind für Supermarktketten mit eigen…", explanation: "sein/werden で状態・変化を表す。" },
          ],
          vocabulary: [
            { term: "Enterprise-Tools", meaning: "大企業向けツール" },
            { term: "Ladentheke", meaning: "店のカウンター" },
            { term: "Software", meaning: "ソフトウェア" },
            { term: "Inhaber", meaning: "オーナー、店主" },
          ],
        },
      },
      {
        original:
          "Unser Geschäftsmodell ist unkompliziert. Läden zahlen ein monatliches Abo basierend auf dem Umsatz. Wir verdienen außerdem eine kleine Provision, wenn sie über unseren Lieferantenmarktplatz bestellen. Die Kundenakquisitionskosten sind niedrig, weil Inhaber uns an Nachbarläden empfehlen, wenn sie weniger leere Regale sehen.",
        translation:
          "ビジネスモデルは単純です。店は売上に応じた月額料金を払います。サプライヤーマーケットプレイス経由の発注では少額の手数料も得ます。棚が空きにくくなるのを見たオーナーが近隣の店に勧めるので、顧客獲得コストは低いです。",
        studyNotes: {
          chunks: [
            { phrase: "basierend auf dem Umsatz", meaning: "売上に応じた" },
          ],
          grammar: [
            { pattern: "weil Inhaber uns empfehlen", explanation: "weil + 節で理由を述べる。" },
            { pattern: "wenn sie über unseren Lieferantenmarktplatz bestellen. …", explanation: "Wenn節で条件「〜すれば」結果を導く。" },
            { pattern: "weil Inhaber uns an Nachbarläden empfehlen, wenn sie we", explanation: "weil で原因「〜なので」を示す。" },
            { pattern: "Unser Geschäftsmodell ist unkompliziert.", explanation: "sein/werden で状態・変化を表す。" },
            { pattern: "Läden zahlen ein monatliches Abo basierend auf dem U…", explanation: "動詞の語尾変化（活用）に注目する。" },
          ],
          vocabulary: [
            { term: "Provision", meaning: "手数料、コミッション" },
            { term: "Lieferantenmarktplatz", meaning: "サプライヤーマーケットプレイス" },
            { term: "Inhaber", meaning: "オーナー、店主" },
          ],
        },
      },
      {
        original:
          "Der Markt ist größer, als er aussieht. Allein in Deutschland gibt es mehr als sechstausend unabhängige Lebensmittelhändler. In der Europäischen Union macht das Segment weiterhin Milliardenumsätze pro Jahr aus. Wir starten in urbanen Vierteln, in denen Liefer-Apps den Wettbewerb um Laufkundschaft verstärkt haben.",
        translation:
          "市場は見た目より大きいです。ドイツだけでも独立の食品小売店は6千軒以上。EU全体でも、この区分は年間数十億ユーロの売上です。配達アプリで来店競争が激しくなった都市部の住宅地から始めています。",
        studyNotes: {
          chunks: [
            { phrase: "größer, als er aussieht", meaning: "見た目より大きい" },
            { phrase: "Wettbewerb um Laufkundschaft", meaning: "来店客を巡る競争" },
          ],
          grammar: [
            { pattern: "in denen Liefer-Apps ... verstärkt haben", explanation: "関係代名詞 in denen で場所を修飾。" },
            { pattern: "Der Markt ist größer, als er aussieht.", explanation: "sein/werden で状態・変化を表す。" },
            { pattern: "Allein in Deutschland gibt es mehr als sechstausend …", explanation: "動詞の語尾変化（活用）に注目する。" },
            { pattern: "In der Europäischen Union macht das Segment weiterhi…", explanation: "動詞の語尾変化（活用）に注目する。" },
            { pattern: "Wir starten in urbanen Vierteln, in denen Liefer-App…", explanation: "haben + Partizip II で完了を表す。" },
          ],
          vocabulary: [
            { term: "Segment", meaning: "区分、セグメント" },
            { term: "Laufkundschaft", meaning: "来店客、歩行者の往来" },
            { term: "urbanen", meaning: "都市の" },
          ],
        },
      },
      {
        original:
          "Unser Team vereint Handelserfahrung und maschinelles Lernen. Ich habe sechs Jahre Lieferketten für einen regionalen Großhändler geleitet. Meine Mitgründerin Priya hat Prognosemodelle bei einem Logistik-Start-up entwickelt. Wir haben zwei Ingenieure und eine Designerin in Teilzeit, die in dem Laden ihrer Eltern aufgewachsen ist.",
        translation:
          "チームは小売経験と機械学習を組み合わせています。私は地域卸売業者でサプライチェーンを6年管理しました。共同創業者プリヤは物流スタートアップで予測モデルを構築しました。エンジニア2人と、両親の角店で育ったパートタイムのデザイナーがいます。",
        studyNotes: {
          chunks: [
            { phrase: "vereint Handelserfahrung und maschinelles Lernen", meaning: "小売経験と機械学習を組み合わせる" },
            { phrase: "in dem Laden ihrer Eltern aufgewachsen", meaning: "両親の店で育った" },
            { phrase: "Meine Mitgründerin Priya hat Prognosemodelle", meaning: "共同創業者（女性）、予測モデル" },
            { phrase: "Mitgründerin Priya hat Prognosemodelle bei", meaning: "共同創業者（女性）、予測モデル" },
            { phrase: "Mitgründerin Priya hat Prognosemodelle", meaning: "共同創業者（女性）、予測モデル" },
          ],
          grammar: [
            { pattern: "die in dem Laden ... aufgewachsen ist", explanation: "関係代名詞 die で主語を修飾。" },
            { pattern: ", die in dem Laden ihrer Eltern aufgewachsen ist", explanation: "関係代名詞 die/der/das で名詞を後置修飾する。" },
            { pattern: "Unser Team vereint Handelserfahrung und maschinelles…", explanation: "動詞の語尾変化（活用）に注目する。" },
            { pattern: "Ich habe sechs Jahre Lieferketten für einen regional…", explanation: "動詞の語尾変化（活用）に注目する。" },
            { pattern: "Meine Mitgründerin Priya hat Prognosemodelle bei ein…", explanation: "haben + Partizip II で完了を表す。" },
          ],
          vocabulary: [
            { term: "Mitgründerin", meaning: "共同創業者（女性）" },
            { term: "Prognosemodelle", meaning: "予測モデル" },
          ],
        },
      },
      {
        original:
          "Wir sammeln vierhunderttausend Euro, um von drei Pilotläden bis nächsten Frühling auf vierzig zu wachsen. Das Geld finanziert zwei Vertriebsmitarbeiter und bessere Anbindung an gängige Kassensysteme. Unser Ziel ist Profitabilität innerhalb von achtzehn Monaten bei aktuellen Preisen.",
        translation:
          "来年春までに試験3店から40店へ広げるため、40万ユーロを調達します。資金は営業担当2名の採用と、一般的なレジシステムとの連携強化に使います。現行価格で18か月以内に黒字化するのが目標です。",
        studyNotes: {
          chunks: [
            { phrase: "Profitabilität innerhalb von achtzehn Monaten", meaning: "18か月以内の黒字化" },
          ],
          grammar: [
            { pattern: "um ... zu wachsen", explanation: "um + zu不定詞で目的を示す。" },
            { pattern: "Wir sammeln vierhunderttausend Euro, um von drei Pil…", explanation: "動詞の語尾変化（活用）に注目する。" },
            { pattern: "Das Geld finanziert zwei Vertriebsmitarbeiter und be…", explanation: "動詞の語尾変化（活用）に注目する。" },
            { pattern: "Unser Ziel ist Profitabilität innerhalb von achtzehn…", explanation: "sein/werden で状態・変化を表す。" },
          ],
          vocabulary: [
            { term: "Profitabilität", meaning: "黒字化、収益性" },
            { term: "Anbindung", meaning: "連携、接続" },
          ],
        },
      },
      {
        original:
          "Die Risiken sind real, und ich nenne sie. Größere Softwareanbieter könnten in den unteren Markt vordringen. Ladenbesitzer zögern möglicherweise, Daten zu teilen, bis sie uns vertrauen. Wir reagieren mit transparenten Dashboards und einer jederzeit kündbaren Policy. Die frühe Bindung in unserer Pilotgruppe liegt bei zweiundneunzig Prozent.",
        translation:
          "リスクは本物で、名前を挙げます。大手ソフトベンダーが下位市場に降りてくる可能性があります。店のオーナーは信頼するまでデータ共有を嫌がるかもしれません。透明なダッシュボードといつでも解約可能な方針で対応しています。試験グループの早期継続率は92％です。",
        studyNotes: {
          chunks: [
            { phrase: "in den unteren Markt vordringen", meaning: "下位市場に降りてくる" },
            { phrase: "jederzeit kündbaren Policy", meaning: "いつでも解約可能な方針" },
          ],
          grammar: [
            { pattern: "bis sie uns vertrauen", explanation: "bis + 節で「〜するまで」という条件。" },
            { pattern: "Größere Softwareanbieter könnten in den unteren Mark…", explanation: "助動詞 + 不定詞 で能力・義務・推量を表す。" },
            { pattern: "Die Risiken sind real, und ich nenne sie.", explanation: "sein/werden で状態・変化を表す。" },
            { pattern: "Ladenbesitzer zögern möglicherweise", explanation: "動詞の語尾変化（活用）に注目する。" },
            { pattern: "Daten zu teilen, bis sie uns vertrauen.", explanation: "動詞の語尾変化（活用）に注目する。" },
          ],
          vocabulary: [
            { term: "Bindung", meaning: "継続率、定着" },
            { term: "Pilotgruppe", meaning: "試験グループ、パイロットコホート" },
            { term: "Policy", meaning: "政策" },
          ],
        },
      },
      {
        original:
          "Ich glaube, dass unabhängige Händler für lebendige Städte unverzichtbar sind. Sie kennen ihre Kunden beim Namen und passen sich schneller an als nationale Ketten. Mit besserer Prognose können sie mit Frische statt nur mit Preis konkurrieren. Danke fürs Zuhören. Ich beantworte gerne eure Fragen und zeige nach dieser Session eine Live-Demo.",
        translation:
          "独立小売店は健全な都市に不可欠だと信じています。客の名前を知り、全国チェーンより速く適応します。予測が良くなれば、値段だけでなく鮮度で競えます。聞いていただきありがとうございます。質問を受け、この後ライブデモもお見せしたいです。",
        studyNotes: {
          chunks: [
            { phrase: "mit Frische statt nur mit Preis konkurrieren", meaning: "値段だけでなく鮮度で競う" },
            { phrase: "beantworte gerne eure Fragen", meaning: "喜んで質問にお答えする" },
          ],
          grammar: [
            { pattern: "statt nur mit Preis", explanation: "statt + mit で「〜ではなく」という対比。" },
            { pattern: "Statt ... zu + Inf.", explanation: "Statt + zu不定詞で「〜する代わりに」。" },
            { pattern: "Ich glaube, dass unabhängige Händler für lebendige S…", explanation: "dass節で内容・事実を伝える。" },
            { pattern: "Mit besserer Prognose können sie mit Frische statt n…", explanation: "助動詞 + 不定詞 で能力・義務・推量を表す。" },
            { pattern: "Sie kennen ihre Kunden beim Namen und passen sich sc…", explanation: "動詞の語尾変化（活用）に注目する。" },
          ],
          vocabulary: [
            { term: "unverzichtbar", meaning: "不可欠な" },
            { term: "Prognose", meaning: "予測" },
            { term: "Händler", meaning: "商人" },
            { term: "Zuhören", meaning: "聞くこと、聴取" },
            { term: "Session", meaning: "セッション" },
          ],
        },
      },
    ],
  },
};
