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

- `src/data/hotel.ts`：ホテル情報・料金・サービス料金・地図の検索住所
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

オンライン予約先と本番URLは未設定です。現時点では電話問い合わせを使用します。
