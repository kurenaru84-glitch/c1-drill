import type { ExamSection } from "@/lib/exam-types";

export const schmidt_l1_lektion: ExamSection = {
  "id": "schmidt-l1-lektion",
  "provider": "schmidt",
  "skill": "nvv",
  "partNumber": 1,
  "title": "Lektion 1",
  "titleJa": "NVV Lektion 1",
  "description": "Lektionsteil · Fragen mit Erklärung",
  "estimatedMinutes": 30,
  "instruction": "Wählen Sie die richtige Lösung (Nomen-Verb-Verbindung).",
  "questions": [
    {
      "id": "schmidt-q1",
      "number": 1,
      "prompt": "Ein neues Musikinstrument zu erlernen, ist ein Hobby, das sehr viel Zeit in ________ nimmt.",
      "promptJa": "新しい楽器を学ぶことは、非常に多くの時間を（　）する趣味だ。",
      "options": [
        {
          "id": "a",
          "text": "Erwartung"
        },
        {
          "id": "b",
          "text": "Anspruch"
        },
        {
          "id": "c",
          "text": "Bemühung"
        },
        {
          "id": "d",
          "text": "Zuspruch"
        }
      ],
      "correctOptionId": "b",
      "explanation": {
        "summary": "【正解のコロケーション】Anspruch\n\n【解説】\n正解は 「Zeit in Anspruch nehmen」（多くの時間を要する・時間を取る）。Anspruch は「要求・占有」、nehmen と組み合わさって「（時間などを）費やす・必要とする」になる。\n\n【ドイツ語の言い換え（書籍）】\netwas nimmt (viel) Zeit in Anspruch = (viel) Zeit beanspruchen, Zeit dauern, Zeit brauchen, Zeit benötigen",
        "german": "etwas nimmt (viel) Zeit in Anspruch = (viel) Zeit beanspruchen, Zeit dauern, Zeit brauchen, Zeit benötigen",
        "wrong": {
          "a": "in Erwartung nehmen という NVV はない。Erwartung は「期待」。",
          "c": "in Bemühung nehmen は不自然。Bemühung は「努力」だが、この空所パターンでは使わない。",
          "d": "Zuspruch は「励まし・同意」。時間を「取る」文脈の名詞ではない。"
        },
        "tip": "同じ NVV は Lektion と Quiz で形が変わるので、名詞＋動詞のセットで音読して覚えてください。"
      }
    },
    {
      "id": "schmidt-q2",
      "number": 2,
      "prompt": "„Mit dir kann man keinen Kompromiss schließen, da du immer nur deinen Willen ________ willst.“",
      "promptJa": "「あなたとは妥協できない。いつも自分の意志だけを（　）したがるんだ。」",
      "options": [
        {
          "id": "a",
          "text": "durchsetzen"
        },
        {
          "id": "b",
          "text": "durchstehen"
        },
        {
          "id": "c",
          "text": "durchhängen"
        },
        {
          "id": "d",
          "text": "durchstellen"
        }
      ],
      "correctOptionId": "a",
      "explanation": {
        "summary": "【正解のコロケーション】durchsetzen\n\n【解説】\n正解 「seinen Willen durchsetzen」 ＝自分の考えを通す・譲らない（bestehen, beharren, nicht nachgeben）。Kompromiss と対比される典型文。\n\n【ドイツ語の言い換え（書籍）】\njemand will seinen Willen durchsetzen = auf etwas bestehen, auf etwas beharren, nicht nachgeben, stur / unnachgiebig sein",
        "german": "jemand will seinen Willen durchsetzen = auf etwas bestehen, auf etwas beharren, nicht nachgeben, stur / unnachgiebig sein",
        "wrong": {
          "b": "durchstehen は「耐え抜く」。意志を「通す」ではない。",
          "c": "durchhängen は俗語的に「だらだらする」など。Willen とは結ばない。",
          "d": "durchstellen は「仕込む・陥れる」。文脈と無関係。"
        },
        "tip": "同じ NVV は Lektion と Quiz で形が変わるので、名詞＋動詞のセットで音読して覚えてください。"
      }
    },
    {
      "id": "schmidt-q3",
      "number": 3,
      "prompt": "Dieses gestern beschlossene Gesetz ________ am ersten Januar des nächsten Jahres in Kraft.",
      "promptJa": "昨日可決されたこの法律は、来年の1月1日に施行（　）。",
      "options": [
        {
          "id": "a",
          "text": "nimmt"
        },
        {
          "id": "b",
          "text": "haut"
        },
        {
          "id": "c",
          "text": "schlägt"
        },
        {
          "id": "d",
          "text": "tritt"
        }
      ],
      "correctOptionId": "d",
      "explanation": {
        "summary": "【正解のコロケーション】tritt\n\n【解説】\n正解 「in Kraft treten」（施行される・効力を生じる）。Gesetz は主語として「tritt in Kraft」。nimmt / schlägt など別動詞のセットは違う。\n\n【ドイツ語の言い換え（書籍）】\netwas tritt in Kraft / in Kraft treten = etwas wird gültig / aktiv / wirksam, Gültigkeit / Wirksamkeit erlangen",
        "german": "etwas tritt in Kraft / in Kraft treten = etwas wird gültig / aktiv / wirksam, Gültigkeit / Wirksamkeit erlangen",
        "wrong": {
          "a": "in Anspruch nehmen など別コロケーション。法律は「力に入る」＝treten。",
          "b": "haut … in Kraft は存在しない。",
          "c": "schlägt in Kraft も標準的な法律表現ではない。"
        },
        "tip": "同じ NVV は Lektion と Quiz で形が変わるので、名詞＋動詞のセットで音読して覚えてください。"
      }
    },
    {
      "id": "schmidt-q4",
      "number": 4,
      "prompt": "Wegen steigender Rohstoffpreise sind die Kosten für dieses Projekt völlig aus ________ gelaufen.",
      "promptJa": "原材料価格の上昇により、このプロジェクトのコストは完全に手に負えなく（　）。",
      "options": [
        {
          "id": "a",
          "text": "der Kontrolle"
        },
        {
          "id": "b",
          "text": "dem Lenkrad"
        },
        {
          "id": "c",
          "text": "der Steuerung"
        },
        {
          "id": "d",
          "text": "dem Ruder"
        }
      ],
      "correctOptionId": "d",
      "explanation": {
        "summary": "【正解のコロケーション】dem Ruder\n\n【解説】\n正解 「aus dem Ruder laufen」 ＝制御不能になる・収拾がつかなくなる（die Kontrolle verlieren）。Ruder は「舵」。\n\n【ドイツ語の言い換え（書籍）】\netwas läuft (völlig) aus dem Ruder = die Kontrolle über etwas verlieren, etwas ist nicht mehr kontrollierbar / beherrschbar, chaotisch",
        "german": "etwas läuft (völlig) aus dem Ruder = die Kontrolle über etwas verlieren, etwas ist nicht mehr kontrollierbar / beherrschbar, chaotisch",
        "wrong": {
          "a": "aus der Kontrolle laufen は意味は近いが、定番の慣用句は dem Ruder。",
          "b": "Lenkrad（ハンドル）版はこの定型ではない。",
          "c": "Steuerung も書籍の NVV リストでは Ruder が正解パターン。"
        },
        "tip": "同じ NVV は Lektion と Quiz で形が変わるので、名詞＋動詞のセットで音読して覚えてください。"
      }
    },
    {
      "id": "schmidt-q5",
      "number": 5,
      "prompt": "„Kannst du mir das bitte noch mal erklären? Ich ________ nur Bahnhof.“",
      "promptJa": "「もう一度説明してくれる？ 私は駅しか（　）ないんだ。」",
      "options": [
        {
          "id": "a",
          "text": "höre"
        },
        {
          "id": "b",
          "text": "verstehe"
        },
        {
          "id": "c",
          "text": "weiß"
        },
        {
          "id": "d",
          "text": "kenne"
        }
      ],
      "correctOptionId": "b",
      "explanation": {
        "summary": "【正解のコロケーション】verstehe\n\n【解説】\n正解 「nur Bahnhof verstehen」 ＝全く理解できない（überhaupt nicht begreifen）。口語的・イメージ的な表現。\n\n【ドイツ語の言い換え（書籍）】\n(nur) Bahnhof verstehen / jemand versteht nur Bahnhof = etwas (überhaupt) nicht verstehen / begreifen",
        "german": "(nur) Bahnhof verstehen / jemand versteht nur Bahnhof = etwas (überhaupt) nicht verstehen / begreifen",
        "wrong": {
          "a": "Bahnhof hören は慣用句ではない。",
          "c": "weiß Bahnhof も不自然。動詞は verstehen が固定。",
          "d": "kennen では「理解」のニュアンスにならない。"
        },
        "tip": "同じ NVV は Lektion と Quiz で形が変わるので、名詞＋動詞のセットで音読して覚えてください。"
      }
    },
    {
      "id": "schmidt-q6",
      "number": 6,
      "prompt": "Als die Einbrecher die Alarmanlage bemerkten, haben sie sich schleunigst aus dem Staub ________.",
      "promptJa": "侵入者が警報装置に気づいたとき、彼らは急いで逃げ出し、さっさと立ち去っ（　）。",
      "options": [
        {
          "id": "a",
          "text": "geflohen"
        },
        {
          "id": "b",
          "text": "gerannt"
        },
        {
          "id": "c",
          "text": "gemacht"
        },
        {
          "id": "d",
          "text": "gelaufen"
        }
      ],
      "correctOptionId": "c",
      "explanation": {
        "summary": "【正解のコロケーション】gemacht\n\n【解説】\n正解 「sich aus dem Staub machen」 ＝急いで（逃げるように）立ち去る。machen が動詞部分。geflohen / gerannt だけではこの NVV にならない。\n\n【ドイツ語の言い換え（書籍）】\nsich aus dem Staub machen = einen Ort meist fluchtartig / schnell verlassen, fliehen, flüchten, wegrennen",
        "german": "sich aus dem Staub machen = einen Ort meist fluchtartig / schnell verlassen, fliehen, flüchten, wegrennen",
        "wrong": {
          "a": "sich aus dem Staub geflohen は文法的・慣用的にこの句ではない。",
          "b": "gerannt も同様。定型は sich … machen。",
          "d": "gelaufen もセットが違う。"
        },
        "tip": "同じ NVV は Lektion と Quiz で形が変わるので、名詞＋動詞のセットで音読して覚えてください。"
      }
    },
    {
      "id": "schmidt-q7",
      "number": 7,
      "prompt": "Im Brandfall sollten Sie auf jeden Fall ________ bewahren und sich zügig zum Ausgang begeben.",
      "promptJa": "火災の際は、どうしても冷静さを（　）、速やかに出口へ向かうべきだ。",
      "options": [
        {
          "id": "a",
          "text": "Stille"
        },
        {
          "id": "b",
          "text": "Entspannung"
        },
        {
          "id": "c",
          "text": "Ruhe"
        },
        {
          "id": "d",
          "text": "Gelassenheit"
        }
      ],
      "correctOptionId": "c",
      "explanation": {
        "summary": "【正解のコロケーション】Ruhe\n\n【解説】\n正解 「Ruhe bewahren」 ＝冷静さを保つ・パニックにならない（gelassen bleiben）。Brandfall の定番。\n\n【ドイツ語の言い換え（書籍）】\nRuhe bewahren = ruhig / gelassen / entspannt bleiben, nicht in Panik verfallen / geraten, nicht panisch werden",
        "german": "Ruhe bewahren = ruhig / gelassen / entspannt bleiben, nicht in Panik verfallen / geraten, nicht panisch werden",
        "wrong": {
          "a": "Stille bewahren は「静寂を保つ」で、人の心理の冷静さとは違う。",
          "b": "Entspannung bewahren は不自然な組み合わせ。",
          "d": "Gelassenheit bewahren は意味は近いが、教科書的 NVV は Ruhe bewahren。"
        },
        "tip": "同じ NVV は Lektion と Quiz で形が変わるので、名詞＋動詞のセットで音読して覚えてください。"
      }
    },
    {
      "id": "schmidt-q8",
      "number": 8,
      "prompt": "Wegen einer schweren Lungenentzündung des Schauspielers ________ das ganze Theaterstück ins Wasser und musste verschoben werden.",
      "promptJa": "俳優の重い肺炎のため、演劇全体が水に（　）、延期せざるを得なくなった。",
      "options": [
        {
          "id": "a",
          "text": "stolperte"
        },
        {
          "id": "b",
          "text": "stürzte"
        },
        {
          "id": "c",
          "text": "fiel"
        },
        {
          "id": "d",
          "text": "brach"
        }
      ],
      "correctOptionId": "c",
      "explanation": {
        "summary": "【正解のコロケーション】fiel\n\n【解説】\n正解 「ins Wasser fallen」 ＝（計画が）実現しない・中止になる（ausfallen）。fiel ins Wasser。\n\n【ドイツ語の言い換え（書籍）】\netwas fällt ins Wasser / ins Wasser fallen = etwas (Geplantes) kann nicht ausgeführt / getan / gemacht / unternommen werden, ausfallen",
        "german": "etwas fällt ins Wasser / ins Wasser fallen = etwas (Geplantes) kann nicht ausgeführt / getan / gemacht / unternommen werden, ausfallen",
        "wrong": {
          "a": "ins Wasser stolpern は「水に躓く」字面で、計画中止の意味ではない。",
          "b": "stürzen も同様。",
          "d": "brechen だけでは ins Wasser のコロケーションにならない。"
        },
        "tip": "同じ NVV は Lektion と Quiz で形が変わるので、名詞＋動詞のセットで音読して覚えてください。"
      }
    },
    {
      "id": "schmidt-q9",
      "number": 9,
      "prompt": "Die Teilnehmerin ________ Himmel und Hölle in Bewegung, um doch noch zur C1-Prüfung zugelassen zu werden.",
      "promptJa": "参加者は C1 試験にどうしても受験できるように、あらゆる手段を（　）。",
      "options": [
        {
          "id": "a",
          "text": "setzte"
        },
        {
          "id": "b",
          "text": "stellte"
        },
        {
          "id": "c",
          "text": "legte"
        },
        {
          "id": "d",
          "text": "hängte"
        }
      ],
      "correctOptionId": "a",
      "explanation": {
        "summary": "【正解のコロケーション】setzte\n\n【解説】\n正解 「Himmel und Hölle in Bewegung setzen」 ＝目的達成のために全力を尽くす。setzen が動詞。\n\n【ドイツ語の言い換え（書籍）】\nHimmel und Hölle in Bewegung setzen = alles versuchen, um ein bestimmtes Ziel zu erreichen",
        "german": "Himmel und Hölle in Bewegung setzen = alles versuchen, um ein bestimmtes Ziel zu erreichen",
        "wrong": {
          "b": "stellen ではこの慣用句にならない（setzen が正）。",
          "c": "legen / hängen も別表現。",
          "d": "hängte … in Bewegung は不正解パターン。"
        },
        "tip": "同じ NVV は Lektion と Quiz で形が変わるので、名詞＋動詞のセットで音読して覚えてください。"
      }
    },
    {
      "id": "schmidt-q10",
      "number": 10,
      "prompt": "Nach einigen Monaten gelang es der Polizei endlich, den cleveren Einbrechern ________ zu legen.",
      "promptJa": "数か月後、警察はついに巧妙な泥棒たちに（　）ことに成功した。",
      "options": [
        {
          "id": "a",
          "text": "das Handwerk"
        },
        {
          "id": "b",
          "text": "den Handel"
        },
        {
          "id": "c",
          "text": "das Gewerbe"
        },
        {
          "id": "d",
          "text": "die Tätigkeit"
        }
      ],
      "correctOptionId": "a",
      "explanation": {
        "summary": "【正解のコロケーション】das Handwerk\n\n【解説】\n正解 「jemandem das Handwerk legen」 ＝（犯罪などを）やめさせる・阻止する。\n\n【ドイツ語の言い換え（書籍）】\njemandem das Handwerk legen = kriminelle Handlungen beenden / vereiteln, jemandem etwas unmöglich machen",
        "german": "jemandem das Handwerk legen = kriminelle Handlungen beenden / vereiteln, jemandem etwas unmöglich machen",
        "wrong": {
          "b": "den Handel legen は「商売」であり文脈の「犯罪を止める」とずれる。",
          "c": "Gewerbe / Tätigkeit も Handwerk の慣用句ではない。",
          "d": "同上。"
        },
        "tip": "同じ NVV は Lektion と Quiz で形が変わるので、名詞＋動詞のセットで音読して覚えてください。"
      }
    },
    {
      "id": "schmidt-q11",
      "number": 11,
      "prompt": "„Man sollte seine Freunde auch in schwierigen Situationen niemals im Stich ________.“",
      "promptJa": "「困難な状況でも、友達を見捨ててはいけない。」",
      "options": [
        {
          "id": "a",
          "text": "liegen"
        },
        {
          "id": "b",
          "text": "lassen"
        },
        {
          "id": "c",
          "text": "ergeben"
        },
        {
          "id": "d",
          "text": "aufgeben"
        }
      ],
      "correctOptionId": "b",
      "explanation": {
        "summary": "【正解のコロケーション】lassen\n\n【解説】\n正解 「jemanden im Stich lassen」 ＝困っている人を助けずに見捨てる。\n\n【ドイツ語の言い換え（書籍）】\njemanden im Stich lassen = sich um jemanden, der in einer Notlage ist, nicht mehr kümmern, jemanden verlassen",
        "german": "jemanden im Stich lassen = sich um jemanden, der in einer Notlage ist, nicht mehr kümmern, jemanden verlassen",
        "wrong": {
          "a": "im Stich liegen は「放置されている」状態で、能動の「見捨てる」ではない。",
          "c": "sich ergeben は「降伏する」など別義。",
          "d": "aufgeben は「あきらめる」で im Stich と結ばない。"
        },
        "tip": "同じ NVV は Lektion と Quiz で形が変わるので、名詞＋動詞のセットで音読して覚えてください。"
      }
    },
    {
      "id": "schmidt-q12",
      "number": 12,
      "prompt": "Die Fraktion wird die Vorschläge und Ideen ausarbeiten und nächste Woche im Parlament zur Abstimmung ________.",
      "promptJa": "会派は提案とアイデアを具体化し、来週議会で投票に（　）予定だ。",
      "options": [
        {
          "id": "a",
          "text": "bekommen"
        },
        {
          "id": "b",
          "text": "bringen"
        },
        {
          "id": "c",
          "text": "tragen"
        },
        {
          "id": "d",
          "text": "geben"
        }
      ],
      "correctOptionId": "b",
      "explanation": {
        "summary": "【正解のコロケーション】bringen\n\n【解説】\n正解 「etwas zur Abstimmung bringen」 ＝議会などで採決・投票にかける。\n\n【ドイツ語の言い換え（書籍）】\netwas zur Abstimmung bringen = etwas vorschlagen, über das abgestimmt werden kann / soll",
        "german": "etwas zur Abstimmung bringen = etwas vorschlagen, über das abgestimmt werden kann / soll",
        "wrong": {
          "a": "zur Abstimmung bekommen は「投票を受ける」側のイメージで不適。",
          "c": "tragen / geben だけではこの NVV にならない。",
          "d": "geben 単独では bringen の定型に劣る。"
        },
        "tip": "同じ NVV は Lektion と Quiz で形が変わるので、名詞＋動詞のセットで音読して覚えてください。"
      }
    },
    {
      "id": "schmidt-q13",
      "number": 13,
      "prompt": "Einige Ernährungsberater betonen immer wieder, dass die Vorteile einer vegetarischen Ernährung auf ________ liegen.",
      "promptJa": "一部の栄養士は、菜食の利点は明らかに（　）と繰り返し強調している。",
      "options": [
        {
          "id": "a",
          "text": "dem Arm"
        },
        {
          "id": "b",
          "text": "der Brust"
        },
        {
          "id": "c",
          "text": "dem Kopf"
        },
        {
          "id": "d",
          "text": "der Hand"
        }
      ],
      "correctOptionId": "d",
      "explanation": {
        "summary": "【正解のコロケーション】der Hand\n\n【解説】\n正解 「auf der Hand liegen」 ＝明らかである・自明（offensichtlich）。\n\n【ドイツ語の言い換え（書籍）】\netwas liegt auf der Hand / auf der Hand liegen = etwas ist klar / offensichtlich / offenkundig",
        "german": "etwas liegt auf der Hand / auf der Hand liegen = etwas ist klar / offensichtlich / offenkundig",
        "wrong": {
          "a": "auf dem Arm liegen は「腕の上」字面で慣用句ではない。",
          "b": "auf der Brust も同様。",
          "c": "auf dem Kopf liegen も「頭の上」で意味が違う。"
        },
        "tip": "同じ NVV は Lektion と Quiz で形が変わるので、名詞＋動詞のセットで音読して覚えてください。"
      }
    },
    {
      "id": "schmidt-q14",
      "number": 14,
      "prompt": "Die Geschäftsführung des Hotels hat für den Start der Renovierungsarbeiten den nächsten Herbst ins Auge ________.",
      "promptJa": "ホテル経営陣は、改装開始を来年の秋に（　）している。",
      "options": [
        {
          "id": "a",
          "text": "genommen"
        },
        {
          "id": "b",
          "text": "geholt"
        },
        {
          "id": "c",
          "text": "gefasst"
        },
        {
          "id": "d",
          "text": "geworfen"
        }
      ],
      "correctOptionId": "c",
      "explanation": {
        "summary": "【正解のコロケーション】gefasst\n\n【解説】\n正解 「etwas ins Auge fassen」 ＝（時期などを）計画に入れる・意図する。gefasst。\n\n【ドイツ語の言い換え（書籍）】\netwas ins Auge fassen = etwas planen / beabsichtigen / anvisieren, sich etwas vornehmen",
        "german": "etwas ins Auge fassen = etwas planen / beabsichtigen / anvisieren, sich etwas vornehmen",
        "wrong": {
          "a": "ins Auge nehmen は別の用法（目に入れる）で、この「計画」句では fassen。",
          "b": "holen / werfen も NVV として不適。",
          "d": "geworfen は不自然。"
        },
        "tip": "同じ NVV は Lektion と Quiz で形が変わるので、名詞＋動詞のセットで音読して覚えてください。"
      }
    },
    {
      "id": "schmidt-q15",
      "number": 15,
      "prompt": "„Da du neulich deinen Job verloren hast, kann ich dir finanziell etwas unter die Arme ________, bis du eine neue Arbeit gefunden hast.“",
      "promptJa": "「先日職を失ったなら、新しい仕事が見つかるまで金銭的に少し（　）してあげるよ。」",
      "options": [
        {
          "id": "a",
          "text": "greifen"
        },
        {
          "id": "b",
          "text": "helfen"
        },
        {
          "id": "c",
          "text": "halten"
        },
        {
          "id": "d",
          "text": "nehmen"
        }
      ],
      "correctOptionId": "a",
      "explanation": {
        "summary": "【正解のコロケーション】greifen\n\n【解説】\n正解 「jemandem unter die Arme greifen」 ＝人を（金銭的などに）支える・助ける。\n\n【ドイツ語の言い換え（書籍）】\njemandem unter die Arme greifen = jemanden unterstützen, jemandem helfen",
        "german": "jemandem unter die Arme greifen = jemanden unterstützen, jemandem helfen",
        "wrong": {
          "b": "unter die Arme helfen は定型ではない（greifen が動詞）。",
          "c": "halten / nehmen もこの句では使わない。",
          "d": "同上。"
        },
        "tip": "同じ NVV は Lektion と Quiz で形が変わるので、名詞＋動詞のセットで音読して覚えてください。"
      }
    },
    {
      "id": "schmidt-q16",
      "number": 16,
      "prompt": "Thomas ist niedergeschlagen. Gestern wollte er Maria eigentlich auf ein Eis einladen, aber sie hat ihm ________ gegeben.",
      "promptJa": "トーマスは落ち込んでいる。昨日マリアをアイスに誘おうとしたが、彼女は彼を（　）。",
      "options": [
        {
          "id": "a",
          "text": "einen Korb"
        },
        {
          "id": "b",
          "text": "eine Tasche"
        },
        {
          "id": "c",
          "text": "einen Sack"
        },
        {
          "id": "d",
          "text": "eine Tüte"
        }
      ],
      "correctOptionId": "a",
      "explanation": {
        "summary": "【正解のコロケーション】einen Korb\n\n【解説】\n正解 「jemandem einen Korb geben」 ＝（恋愛などで）断る・振る。\n\n【ドイツ語の言い換え（書籍）】\njemandem einen Korb geben / von jemandem einen Korb bekommen = jemanden zurückweisen / abweisen",
        "german": "jemandem einen Korb geben / von jemandem einen Korb bekommen = jemanden zurückweisen / abweisen",
        "wrong": {
          "b": "eine Tasche geben は慣用句ではない。",
          "c": "Sack / Tüte も「振る」意味の Korb ではない。",
          "d": "同上。"
        },
        "tip": "同じ NVV は Lektion と Quiz で形が変わるので、名詞＋動詞のセットで音読して覚えてください。"
      }
    },
    {
      "id": "schmidt-q17",
      "number": 17,
      "prompt": "Da es schlichtweg zu zeitintensiv war, wurden die Arbeiten an diesem Projekt ________.",
      "promptJa": "時間がかかりすぎるため、このプロジェクトへの作業は（　）された。",
      "options": [
        {
          "id": "a",
          "text": "eingestellt"
        },
        {
          "id": "b",
          "text": "ausgeführt"
        },
        {
          "id": "c",
          "text": "angewandt"
        },
        {
          "id": "d",
          "text": "aufgenommen"
        }
      ],
      "correctOptionId": "a",
      "explanation": {
        "summary": "【正解のコロケーション】eingestellt\n\n【解説】\n正解 「Arbeiten einstellen」 ＝作業を中止する・やめる。\n\n【ドイツ語の言い換え（書籍）】\netwas einstellen / Arbeiten an etwas einstellen = mit einer Arbeit aufhören, eine Arbeit beenden, eine Arbeit bleiben lassen / stoppen",
        "german": "etwas einstellen / Arbeiten an etwas einstellen = mit einer Arbeit aufhören, eine Arbeit beenden, eine Arbeit bleiben lassen / stoppen",
        "wrong": {
          "b": "ausführen は「実行する」で文脈（中止）と逆。",
          "c": "anwenden は「適用する」。",
          "d": "aufnehmen は「開始・引き受ける」方向。"
        },
        "tip": "同じ NVV は Lektion と Quiz で形が変わるので、名詞＋動詞のセットで音読して覚えてください。"
      }
    },
    {
      "id": "schmidt-q18",
      "number": 18,
      "prompt": "Nachdem bei Sabine eingebrochen wurde, ging sie zur Polizei und ________ Anzeige gegen Unbekannt.",
      "promptJa": "サビーネの家に侵入された後、彼女は警察に行き、身元不明者に対して告訴（　）。",
      "options": [
        {
          "id": "a",
          "text": "gab"
        },
        {
          "id": "b",
          "text": "brachte"
        },
        {
          "id": "c",
          "text": "erstattete"
        },
        {
          "id": "d",
          "text": "leistete"
        }
      ],
      "correctOptionId": "c",
      "explanation": {
        "summary": "【正解のコロケーション】erstattete\n\n【解説】\n正解 「Anzeige erstatten」 ＝（警察に）告訴する・届け出る。動詞は erstatten。\n\n【ドイツ語の言い換え（書籍）】\ngegen jemanden Anzeige erstatten = jemanden (polizeilich) anzeigen / melden, etwas zur Anzeige bringen",
        "german": "gegen jemanden Anzeige erstatten = jemanden (polizeilich) anzeigen / melden, etwas zur Anzeige bringen",
        "wrong": {
          "a": "Anzeige geben は口語的にはあるが、教科書・試験では erstatten が定番。",
          "b": "brachte Anzeige も標準 NVV ではない。",
          "d": "leistete Anzeige は不自然。"
        },
        "tip": "同じ NVV は Lektion と Quiz で形が変わるので、名詞＋動詞のセットで音読して覚えてください。"
      }
    },
    {
      "id": "schmidt-q19",
      "number": 19,
      "prompt": "Die beiden Staaten haben während ihrer Verhandlungen eine Abmachung ________, von der beide profitieren.",
      "promptJa": "両国は交渉の中で、双方が利益を得る協定を（　）。",
      "options": [
        {
          "id": "a",
          "text": "genommen"
        },
        {
          "id": "b",
          "text": "gestellt"
        },
        {
          "id": "c",
          "text": "gemacht"
        },
        {
          "id": "d",
          "text": "getroffen"
        }
      ],
      "correctOptionId": "d",
      "explanation": {
        "summary": "【正解のコロケーション】getroffen\n\n【解説】\n正解 「eine Abmachung treffen」 ＝協定を結ぶ・合意する。\n\n【ドイツ語の言い換え（書籍）】\n(mit jemandem) eine Abmachung treffen = sich mit jemandem einigen, übereinkommen, eine Einigung erzielen, einen Kompromiss finden",
        "german": "(mit jemandem) eine Abmachung treffen = sich mit jemandem einigen, übereinkommen, eine Einigung erzielen, einen Kompromiss finden",
        "wrong": {
          "a": "Abmachung nehmen はこの意味の NVV ではない。",
          "b": "stellen も違う。",
          "c": "machen だけでは treffen の定型に劣る（Abmachung treffen が固定）。"
        },
        "tip": "同じ NVV は Lektion と Quiz で形が変わるので、名詞＋動詞のセットで音読して覚えてください。"
      }
    },
    {
      "id": "schmidt-q20",
      "number": 20,
      "prompt": "„Bevor du diese Vereinbarung unterschreibst, solltest du dir die ganze Sache noch mal durch den Kopf ________ lassen.“",
      "promptJa": "「この契約に署名する前に、全体をもう一度よく（　）した方がいい。」",
      "options": [
        {
          "id": "a",
          "text": "laufen"
        },
        {
          "id": "b",
          "text": "gehen"
        },
        {
          "id": "c",
          "text": "fließen"
        },
        {
          "id": "d",
          "text": "denken"
        }
      ],
      "correctOptionId": "b",
      "explanation": {
        "summary": "【正解のコロケーション】gehen\n\n【解説】\n正解 「sich etwas durch den Kopf gehen lassen」 ＝よく考える・熟考する。gehen lassen。\n\n【ドイツ語の言い換え（書籍）】\nsich etwas (noch mal) durch den Kopf gehen lassen = über etwas (noch mal) nachdenken, überlegen",
        "german": "sich etwas (noch mal) durch den Kopf gehen lassen = über etwas (noch mal) nachdenken, überlegen",
        "wrong": {
          "a": "durch den Kopf laufen は主語が「考え」側で句が違う。",
          "c": "fließen もこの慣用句ではない。",
          "d": "denken lassen だけでは定型の durch den Kopf gehen にならない。"
        },
        "tip": "同じ NVV は Lektion と Quiz で形が変わるので、名詞＋動詞のセットで音読して覚えてください。"
      }
    }
  ]
} as ExamSection;
