# パルティーレ博多ホテル

福岡市中央区春吉のホテルを紹介するAstro製のLPです。GSAP・Lenisを使い、全画面ヒーロー、客室写真、料金、サービス、アクセスを構成しています。

## 開発

package.jsonのenginesを満たすNode.jsを使用してください。

```sh
npm install
npm run dev -- --background
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
npm run build
```

## 更新する場所

- `src/data/hotel.ts`：ホテル情報・料金・サービス料金・地図の検索住所・客室別Airbnb予約URL
- `src/data/room-images.json`：掲載写真と元ファイルの対応
- `src/components/`：各セクション
- `src/styles/global.css`：配色・レイアウト・レスポンシブ表示
- `src/scripts/main.ts`：ヒーロー・客室ギャラリー・メニュー・スクロール演出
- `docs/lp-design-plan.md`：制作計画と生成画像のプロンプト
- `docs/implementation-notes.md`：実装内容・確認結果・未設定項目

## 画像を作り直す

```sh
npm run assets:prepare
```

`src/assets` の原本から `public/images` のWebPとサムネイルを生成します。HEIC形式の原本の変換には、PATH上のFFmpegを使用します。原本は上書きしません。確認用の一覧画像と一時変換画像はGit対象外の `.preview` に作成します。

ヒーローは実際の外観写真を参照した生成画像です。客室とアクセスの外観は実写を使用しています。

本番URLは `https://partire-hakata-hotel.pages.dev/` に設定しています。SEO設定は `src/data/site.mjs`・`src/data/seo.ts`・`src/components/Seo.astro` に集約しています。今回のSEO変更後の確認はユーザーが行うため未実施です。詳細と公開後の手順は `docs/SEO.md` を参照してください。

6室それぞれにAirbnbの予約URLを設定しています。客室ギャラリーに加え、料金表とページ下部から各室の予約ページへ直接進めます。ヘッダー・メニュー・PC右側の固定ボタン・スマートフォン下部バー・ご予約案内からは、6室を選べる共通の予約パネルを開きます。Airbnbは新しいタブで開き、電話問い合わせも利用できます。詳細は `docs/予約導線.md`。予約導線変更後のビルド・ブラウザ確認はユーザー指定により未実施です。
