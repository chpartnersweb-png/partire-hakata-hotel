# パルティーレ博多ホテル LP制作計画

作成日：2026年10月26日  
更新：ヒーローは実際の外観写真を参照した3枚の生成画像を使い、全画面でゆっくりクロスフェード。テキストは最小限。  
対象：現在のAstroプロジェクト  
現在の状態：この計画に沿ったAstroのLPを実装済み。全画面ヒーロー3枚・6室の実写ギャラリー・料金・サービス・アクセス・電話導線を組み込み、ローカルビルドとブラウザで確認。公開は未実施。

## 1. デザインの中心

**コンセプト：春吉から、福岡を歩く。**

キャナルシティ博多まで徒歩3分、天神南駅・櫛田神社前駅からそれぞれ徒歩約8分という立地を入口に、6室の実写、部屋ごとの料金、滞在前後のサービスへつなげる。旅先で歩く時間と、宿に戻る時間の両方を想像できるページにする。

参考サイトから取り入れる要素は、大きな入口のビジュアル、明朝体と余白、細い罫線で整理した料金、客室ごとの写真閲覧、常に辿れる問い合わせ導線。今回の構成は、実際の6室の素材と2つの料金グループに合わせて設計する。

同じ大きさのカードを全セクションに並べる構成は使わず、立地は横長の案内、客室は一つの大きな閲覧面、料金は比較表、時間案内は二本の時間軸、アクセスは実写と地図で表す。

### 参考サイトの観察

- [パルティーレ高砂ホテル](https://partire-takasago-hotel.pages.dev/)：画面いっぱいのエントランス写真、白系の背景、繊細な欧文、簡潔な料金表、画面端の縦型予約導線を確認。
- [リベール博多駅前ホテル](https://liveil-hakataekimae.pages.dev/)：エントランス写真を大きく使い、暗めの写真に明朝のコピーを重ねるヒーロー、料金・客室・施設情報・アクセスの流れ、写真ギャラリーを確認。
- 参考サイトの宿泊料金、設備、予約URLは、この施設の情報として転用しない。

## 2. 色・文字・余白

| 役割 | 色案 | 用途 |
| --- | --- | --- |
| 基本背景 | `#F5F2EC` | 温かいオフホワイト。長い料金案内も読みやすくする |
| 基本文字 | `#302D29` | 本文、料金、ナビゲーション |
| 外観由来のブラウン | `#806B5C` | 部屋番号、細い区切り、背景の一部 |
| くすんだブロンズ | `#8B7454` | 装飾線や小さなアクセント。小さい本文には使わない |
| 濃色背景 | `#282B28` | 最後の問い合わせセクション |

提供済みの外観画像のタイル色と、参考サイトの静かな印象に合わせる。文字のコントラストは実装時に確認して調整する。

- 日本語見出し：細すぎない明朝体。候補はNoto Serif JP、または游明朝。
- 本文・操作ボタン：読みやすいゴシック体。候補はNoto Sans JP、またはシステムフォント。
- 金額・時刻：数字の桁を揃え、部屋番号と金額を迷わず読み取れるようにする。
- ホテル名は日本語の正式名称を明記。欧文を添える場合は仮の文字組みとして扱い、公式ロゴと称さない。
- 本文セクションはPCで最大約1280pxの内容幅と80〜120px程度の外側余白。スマートフォンは20〜24px程度の左右余白を基本に調整する。ヒーロー画像はこの幅制限の対象にせず、画面の端から端まで表示する。

## 3. ページ構成

### 01｜ヒーロー：旅の入口

コピー案：

> 春吉から、  
> 福岡を歩く。

画像は `src/assets/810880137.jpg` の実際の外観を直接参照して生成する。茶系のタイル、4階建ての輪郭、バルコニーと黒い手すり、中央の入口を維持した外観ビジュアルを使う。

ヒーローは1枚の固定画像ではなく、外観全景→上階のタイルとバルコニー→入口の3カットを順番にクロスフェードする。3枚とも外観写真を参照して生成し、同じ建物として色・質感・夕方の光を揃える。写真ごとにホテル名やコピーを入れ替えず、テキストは同じ位置に留める。

PC・タブレット・スマートフォンのすべてで、ヒーローを表示領域の幅100%・高さ100%にする。高さは100vhを互換用に指定し、対応環境では100dvhで現在の表示領域を満たす。ヘッダーや固定操作部の高さは差し引かない。画像はセクション全体に `position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;` 相当で敷き、周囲の余白・枠・画像外のテキスト領域を作らない。

ホテル名とメニューは画像に重ねる透明ヘッダーとして配置。ヒーロー内の主な文字はホテル名と上記の短いコピーだけに絞る。徒歩分数・料金・説明文・大きな複数の誘導ボタンはヒーローに置かず、次のセクションから案内する。スクロール案内は小さな線か矢印に留める。

画像の切り替えは小さな3本のラインで示す。各ラインから画像を選べるようにし、隣に控えめな一時停止・再生ボタンを置く。操作名は支援技術にも伝え、表示テキストの量を増やさない。

写真が読み取れるよう、必要な範囲だけ薄いグラデーションを重ねる。文字量を増やして外観を隠さない。画像の焦点位置はデバイス別に調整し、縦長画面でも建物と入口を残す。横長の元画像で縦画面に対応しきれない場合は、同じ外観写真を参照した縦版を用意する。

スマートフォンの固定下部バーはヒーロー表示中は出さず、ヒーローを通過してから表示する。生成画像であることは小さな注記で伝える。実写の原本はアクセス案内で別途使用する。

### 02｜春吉を拠点にする

「キャナルシティ博多 徒歩3分」を中心に、2駅から徒歩約8分の案内を細い罫線でつなぐ。PCは横方向の一続きの案内、スマートフォンは三つの読みやすい行にする。

装飾的な徒歩ルートは実際の経路と誤認させないものとし、正確な経路はアクセスセクションの地図へ誘導する。徒歩時間は提供情報を掲載する。

### 03｜6つの客室を実写で見る

上部に「101・102・201・202・301・401」の部屋選択を置き、その下に選択中の客室の大きな写真、サムネイル、料金・定員をまとめる。部屋を切り替えるたびに、写真・部屋番号・料金が一緒に変わる設計。

PCは写真約7：説明約3の比率。スマートフォンは部屋番号を3列×2行で表示し、写真、情報の順に縦積みする。写真はボタン・サムネイル・スワイプで操作でき、自動で切り替え続けない。拡大表示には閉じるボタン、Esc操作、フォーカスの復帰を設ける。

現在のフォルダには次の素材がある。枚数はファイル数であり、掲載可能な有効画像数は実装前に選別する。

| フォルダ | ファイル数 | 基本料金グループ |
| --- | ---: | --- |
| 101 | 22 | 平日13,000円／週末20,000円 |
| 102 | 27 | 平日13,000円／週末20,000円 |
| 201 | 22 | 平日14,000円／週末21,000円 |
| 202 | 24 | 平日14,000円／週末21,000円 |
| 301 | 20 | 平日14,000円／週末21,000円 |
| 401 | 26 | 平日13,000円／週末20,000円 |

`src/assets/810880137.jpg` は実際の建物の外観を確認できる画像。アクセス案内に使用する。

一部の.jpgファイルは画像ビューアで読み込めず、拡張子のないファイルもあるため、形式・回転・解像度を確認してから選定する。元画像を保持してWeb用画像を用意する。

ベッド数、面積、Wi-Fi、キッチン、アメニティなどは、確認できた情報だけを記載する。写真に写る物だけで全室共通設備を断定しない。

### 04｜宿泊料金を比較する

| 客室 | 平日料金 | 週末料金 |
| --- | ---: | ---: |
| 101・102・401号室 | 13,000円 | 20,000円 |
| 201・202・301号室 | 14,000円 | 21,000円 |

共通条件は表の直下にまとめる。

- 上記料金には2名様までの宿泊料金を含む。
- 3名様以上は、追加1名様につき1泊3,000円。
- 最大4名様まで宿泊可能。
- 清掃費は1予約（1グループ）あたり5,000円。

清掃費は宿泊日数ごとの料金と混同しないよう、宿泊料金と行を分ける。価格のカウントアップ演出は使わず、最初から正しい金額を表示する。スマートフォンも横スクロールに頼らず、2つの部屋グループごとに平日・週末を縦に読める形にする。

平日・週末の曜日区分、税の扱いは提供されていないため、独自に補完しない。現段階では自動見積もり機能を追加しない。

### 05｜到着前と出発後の時間案内

見出し案：**荷物を預けて、もう少し街へ。**

到着と出発の時間帯を別々の帯で表す。

| 区分 | 通常時間 | 有料サービスの時間 |
| --- | --- | --- |
| 到着 | チェックイン15:00〜 | チェックイン前の荷物預かり／アーリーチェックイン：13:00以降 |
| 出発 | チェックアウト10:00まで | チェックアウト後の荷物預かり／レイトチェックアウト：12:00まで |

どちらも1時間あたり1,000円。荷物の個数制限なしを明記する。荷物預かりと客室利用のサービス名をそれぞれ表示し、荷物預かりだけで客室も使えるような表現を避ける。同時利用時の合算や端数時間の扱いは、確認するまで記載しない。

### 06｜施設情報・アクセス

| 項目 | 掲載内容 |
| --- | --- |
| 店舗名 | パルティーレ博多ホテル |
| 住所 | 〒810-0003 福岡市中央区春吉2丁目7番2号 パルティーレ博多 |
| 電話 | 080-3430-9237 |
| 最寄駅 | 天神南駅 徒歩約8分／櫛田神社前駅 徒歩約8分 |
| 周辺 | キャナルシティ博多 徒歩3分 |
| チェックイン | 15:00〜 |
| チェックアウト | 10:00まで |
| 駐車場 | 建物前に1台分。1台あたり1日1,000円。事前予約が必要 |
| エレベーター | なし |

PCは住所・外観写真と地図の組み合わせ、スマートフォンは住所・外観写真・地図の順で表示する。地図は入力住所で位置を確認してから設定する。外部地図を開くボタンも設ける。

駐車場の台数制限、事前予約、エレベーターがないことは、施設情報と問い合わせ直前の両方で確認できるようにする。注意書きだけを極端に小さくしない。

### 07｜お問い合わせ

濃色背景にホテル名と電話番号を配置し、「空室・ご宿泊についてのお問い合わせ」へつなげる。

予約サイトのURLは未提示のため、現在使える導線は `tel:08034309237`。ボタンは「電話で問い合わせる」とする。オンライン予約URLが提供されたら「空室・予約を確認する」を追加し、必要なら客室ごとのリンクも設定する。

PCは本文閲覧時のヘッダー内の問い合わせボタン、スマートフォンは画面下の「客室・料金」「電話で問い合わせる」を基本とする。ヒーロー内はホテル名・メニュー・短いコピーを優先し、スマートフォンの固定バーはヒーローを通過した後に表示する。本文下部には固定バーの高さとセーフエリア分の余白を確保する。

## 4. 生成ヒーロー画像

採用方針：**実際の外観を参照した3枚の生成画像を、全画面でクロスフェードする。**

参照元は `src/assets/810880137.jpg`。茶系タイルの4階建て、3段のバルコニー、黒い手すりと装飾パネル、建物中央の既存の入口、周辺の街並みを基準にする。自然な光や遠近感を整え、前景の車・自転車・ごみ箱や電線などの視覚的な混雑を整理する。建物の階数、外壁、窓、手すり、入口の構造は変えず、豪華なロビーや別の建物を追加しない。

前回の `src/assets/hero/partire-hakata-hero-concept.png` は旧案として残し、ヒーローの採用対象から外す。

コピーは画像に焼き込まず、HTMLで重ねる。実際の外観を参照した生成画像であることを注記し、客室紹介には実写を使う。

### 使用する3つのカット

| 順番 | カット | 役割 | 使用する生成画像 |
| --- | --- | --- | --- |
| 01 | 外観全景 | 建物全体を見せ、ホテルの印象を伝える | `src/assets/hero/partire-hakata-exterior-hero-v2.png` |
| 02 | 上階の外壁・バルコニー | 実際のタイルと黒い手すりに寄り、構図に変化をつける | `src/assets/hero/partire-hakata-hero-balconies.png` |
| 03 | 入口 | 中央の既存の入口と短い通路に寄り、到着する雰囲気を伝える | `src/assets/hero/partire-hakata-hero-entrance.png` |

全景の単純な切り抜き3枚ではなく、同じ参照元から構図の異なる画像を生成する。近景の生成では、参照写真に写っていない部分の細部に解釈が含まれるため、実写そのものとは区別する。旧案の別建物の入口は混ぜない。

3カットはすべて生成・保存済み。組み込みのimage_genを使用し、追加2枚は実際の外観写真を建物の基準、生成済みの全景を色と光の参考として生成した。画像出力で構図・色調を確認済み。ページ上の再生とデバイス別の切り取りは実装時に確認する。

- 生成済み画像：`src/assets/hero/partire-hakata-exterior-hero-v2.png`。外観参照・夕景の横長画像を生成し、建物の主な特徴と全体構図を確認済み。デバイス別の最終トリミングは実装時に確認する。
- PC：16:9前後の横長構図を画面全体に使用。
- モバイル：建物と入口を中心にトリミング。構図が合わなければ同じ参照元から縦版を別途生成。
- 実装時：3枚ともWebP/AVIFと適切な解像度を用意する。最初の全景だけを優先読み込みし、残りは最初の画像を表示した後に読み込み・デコードする。次の画像の準備ができるまで現在の画像を保持する。
- 生成方式：組み込みのimage_gen。画像の用途と生成プロンプトをこの計画書に保存する。

### 生成プロンプト：外観全景

```text
Use case: lighting-weather / architectural image refinement. Asset type: full-viewport website hero for パルティーレ博多ホテル. Reference image: the supplied local exterior photograph is the factual reference and must determine the architecture. Generate a high-resolution 16:9 landscape exterior image faithfully based on this exact modest four-storey Japanese urban apartment hotel. Preserve the actual brown/taupe small rectangular tiled facade, three stacked broad balcony fronts above the ground floor, dark brown/black horizontal balcony rails, black decorative metal perforated rail panels at the left and right ends, flat roof outline, facade proportions, balcony spacing, actual windows and doors, recessed simple central ground-floor entrance with the original short tiled walkway, and the neighboring low-rise urban setting. Show the complete facade and entrance centered, filling the image height naturally, and extend only plausible neighboring street context to make a wide composition. Keep the central architecture usable when the image is cropped vertically on a phone. Refine perspective and exposure gently as professional architectural photography, early evening with soft natural sky and a restrained warm glow only inside the existing entry. Keep the hotel recognizably the same ordinary building, not upgraded into a luxury hotel. Remove the parked foreground car, bicycles, bins and distracting overhead wires for an uncluttered editorial composition, without changing the building or creating parking markings. Keep walls, entrance geometry and rail details as close as possible to the reference. Do not add wood portal frames, decorative landscaping, a new canopy, glass lobby, luxury finishes, extra floors, extra balconies, rooftop amenities or invented views. Do not invent a new hotel sign: retain the existing small entrance sign in its original position and original appearance if it can be faithfully represented; no new lettering or signage. No people, no text overlay, no logo overlay, no watermark, no website UI, no artificial blank copy panel. Fine realistic tiled textures, calm neutral browns and muted blue evening sky, refined but credible.
```

### 追加画像の生成プロンプト：上階の外壁・バルコニー

```text
Use case: architectural editorial photograph generation. Asset type: one 16:9 full-screen hotel website hero slide, no text overlay or UI. Reference 1 is the real exterior and is authoritative for architecture. Reference 2 is the previously generated full facade and provides matching dusk color grading only. Depict this SAME ordinary four-storey brown/taupe tiled Japanese urban apartment hotel, same black railings and patterned end panels, same facade and windows, same existing recessed central entrance. Do not add luxury amenities, new canopies, wooden portals, landscaping, extra floors or changed architecture. Photorealistic, refined but credible architectural photography, quiet early evening natural light, muted browns, blue sky and restrained warm entry light consistent with reference 2. Remove foreground vehicles, bicycles, bins and distracting wires. No people, no watermark, no invented lettering, no new signs. Preserve any existing entrance sign if visible as close as possible to the real reference. This is a new camera composition, not a collage, and must cover a full browser viewport. Keep the important subject in the central half so a portrait crop still works. Composition: a close, upward-looking architectural detail from street level toward the upper three balconies and flat roof. Emphasize the real rectangular tiled balcony fronts, black horizontal rails, and dark ornamental perforated panels against a small amount of muted blue evening sky. The existing upper facade should dominate the frame, giving a clearly different scale from the full building shot. Crop away the ground floor and entrance. Restrained perspective, sharp tile texture, soft side light, no added lights on balconies. Landscape 16:9.
```

### 追加画像の生成プロンプト：入口

```text
Use case: architectural editorial photograph generation. Asset type: one 16:9 full-screen hotel website hero slide, no text overlay or UI. Reference 1 is the real exterior and is authoritative for architecture. Reference 2 is the previously generated full facade and provides matching dusk color grading only. Depict this SAME ordinary four-storey brown/taupe tiled Japanese urban apartment hotel, same black railings and patterned end panels, same facade and windows, same existing recessed central entrance. Do not add luxury amenities, new canopies, wooden portals, landscaping, extra floors or changed architecture. Photorealistic, refined but credible architectural photography, quiet early evening natural light, muted browns, blue sky and restrained warm entry light consistent with reference 2. Remove foreground vehicles, bicycles, bins and distracting wires. No people, no watermark, no invented lettering, no new signs. Preserve any existing entrance sign if visible as close as possible to the real reference. This is a new camera composition, not a collage, and must cover a full browser viewport. Keep the important subject in the central half so a portrait crop still works. Composition: a closer straight-on street-level view of the ACTUAL ground-floor entrance in reference 1, with its short pale tiled walkway, recessed corridor and existing glass door at the rear, tiled wall surround, original small pinkish sign above the entrance and the two existing ground-floor windows on either side. Include enough brown tiled facade to make the location recognizable, crop away the upper floors. Do not redesign or widen the entrance, do not add glass frontage, luxury finishes, plants, furniture, reception or new lights. Only the existing passage has a gentle warm glow. Keep the doorway centered and clearly legible as architecture, balanced symmetrical composition. Landscape 16:9.
```

## 5. GSAP・Lenisの動き

| 対象 | 表現 | 初期設定の目安 |
| --- | --- | --- |
| ヒーロー | 3枚の全画面画像をゆっくりクロスフェードし、ごく小さくズームアウト | 切替開始は約6秒間隔、重なり約1.6秒。画像1.025→1。コピーは初回のみ約0.8秒で表示 |
| 見出し | 下から12〜20pxの移動とフェード | 約0.6〜0.8秒、基本一度だけ |
| 立地の案内 | 罫線と徒歩時間の順次表示 | 各項目0.1秒程度ずらす |
| 客室切替 | 写真と情報の短いクロスフェード | 約0.25〜0.4秒。連打時の競合を処理 |
| 料金 | 罫線とグループのフェード | 数字自体は常時正確に表示 |
| 時間の案内 | 到着・出発の線が短く伸びる | 読む速度を妨げない長さ |
| ボタン | 色と矢印の小さな変化 | 約0.2秒。キーボードでも状態が分かる |

LenisはPCのホイール操作に控えめな滑らかさを付ける。タッチ端末は標準の操作感を優先し、スワイプや写真モーダル内の操作を妨げない。ページ全体を長時間固定するスクロールや、強制的な横スクロールは設けない。

### ヒーロースライドの詳細

- 全景→バルコニー→入口→全景の順に繰り返す。約6秒ごとに次の切替を開始し、うち約1.6秒をフェードの重なりに使う。最終値は実装画面で調整する。
- 画像を同じ位置に重ね、次の画像が現在の画像を覆うように不透明度を上げる。現在の画像は切替完了まで表示し、白や黒の空白を挟まない。3枚目から1枚目へ戻る際も同じ処理にする。
- コピー、ホテル名、メニューは画像の外側の共通レイヤーに置き、画像ごとに再表示・点滅させない。各スライドで文字の読みやすさを確認する。
- 3本の小さなラインは選択ボタンとして機能し、一時停止・再生も可能にする。操作部分にキーボードフォーカスがある間と、ポインターがある間は自動再生を止める。明示的な一時停止は利用者が再生するまで維持する。
- ヒーローが画面外に出たとき、タブが非表示のときは再生を止める。戻ったときに何枚も一気に進ませない。
- 動きを減らす設定では自動再生・ズーム・フェードを停止し、最初の画像を表示する。画像選択は瞬時の手動切替にする。
- 次の画像の読み込み・デコードが失敗した場合は現在の画像を保持し、利用可能な画像だけで動作させる。JSが使えない場合も最初の全景を表示する。
- PC・スマートフォンのそれぞれで3枚分の焦点位置を持ち、全画面表示中に建物・入口が不自然に切れないよう調整する。

技術方針：

- Lenisのスクロール更新をScrollTriggerへ通知し、GSAP tickerからLenisを更新する。別のrequestAnimationFrameとの二重駆動を防ぐ。
- メディア条件の切り替えは `gsap.matchMedia()` を使う。
- `prefers-reduced-motion: reduce` ではズーム・視差・移動・スクロール補間を停止し、情報をすぐ表示する。
- 初期HTMLで本文を読める状態にして、JSが正常に準備できた場合だけ演出を追加する。読み込み待ちで白紙にしない。
- メニューと拡大画像を開くときは背景スクロールを適切に停止・復帰させる。
- 初期画像とフォントの寸法確定後にスクロール位置を再計算する。

実装参照：

- [GSAP ScrollTrigger公式ドキュメント](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [Lenis公式README：GSAPとの連携](https://github.com/darkroomengineering/lenis#gsap-scrolltrigger)

## 6. Astro実装方針と検証

`package.json` に登録済みのAstro・GSAP・Lenisを使用して実装済み。客室の原本141枚はWeb用へ変換し、ギャラリーには部屋の全景を先頭に選んだ計66枚を掲載。HEIC形式が.jpgとして保存されていた画像はFFmpegで変換し、原本は保持した。

- ホテル情報・部屋番号・料金・有料サービスを一つのデータファイルに集約し、料金表と客室案内の差異を防ぐ。
- ヒーロー、客室閲覧、料金、時間案内、アクセス、問い合わせをAstroコンポーネントに分ける。
- 客室写真は選択・圧縮し、最初に表示するもの以外を遅延読み込みする。原寸の全画像を一度に読ませない。ヒーローも1枚目を優先し、2・3枚目は順次読み込む。
- 日本語の `lang`、タイトル、description、見出し順、画像の代替テキストを設定する。
- 本番URLが決まった時点でcanonical・OG・サイトマップを設定する。架空の本番ドメインは入れない。
- 開発サーバーはAGENTS.mdに従い `astro dev --background` で起動し、status/logs/stopで管理する。
- 実装完了後はビルドと、PC・タブレット・スマートフォンで表示を確認する。320〜390pxの狭い幅でも部屋番号・料金・固定バーがはみ出さないことを確認する。
- ヒーローの3枚切替・最後から最初へのフェード・停止と再開・低速回線時の画像保持・デバイス別の切り取り、客室切替、画像拡大、電話リンク、地図、アンカー、キーボード操作、動きを減らす設定を確認する。

参照：

- [Astroコンポーネント](https://docs.astro.build/en/basics/astro-components/)
- [Astroのスタイリング](https://docs.astro.build/en/guides/styling/)

## 7. 実装を進める順番

1. 客室写真の形式確認と選定、外観参照のヒーロー3枚の生成と構図調整。
2. 色・文字・余白と、PC／スマートフォンの骨格を実装。
3. 実写ギャラリーと、料金・追加費用・時間案内を実装。
4. 問い合わせ、地図、駐車場・エレベーターの案内を実装。
5. GSAP・Lenisと、動きを減らす設定を追加。
6. 表示・操作・ビルドを確認し、本番URLに応じた公開設定を整える。

## 8. 未提示の情報

計画は上記の提供情報で成立する。公開する文言とリンクを完成させる際は、次を確認する。

- オンライン予約URL。客室別URLがある場合はそれぞれ。
- 平日・週末の具体的な曜日区分、祝日・繁忙日の扱い。
- 表示料金の税込・税別、宿泊税などの扱い。
- 有料サービスの端数時間、同時利用時の計算、事前手続き。
- 予約取消条件など、掲載が必要な利用規約。
- 公式ロゴと本番公開URL。

未確定の条件を参考サイトから補完せず、確認できたものから反映する。
