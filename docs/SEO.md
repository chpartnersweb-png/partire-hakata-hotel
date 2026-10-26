# SEO設定

本番URL： https://partire-hakata-hotel.pages.dev/

## ソースへ実装した内容

- `src/data/site.mjs`：本番URL・言語・OG画像情報の共通設定。
- `astro.config.mjs`：共通設定を参照してsiteを指定し、静的出力を明示。
- `src/data/seo.ts`：ホテル名・福岡・春吉・キャナルシティ博多への徒歩アクセスを含むタイトルと説明文。Hotel・WebSite・WebPage・ImageObjectをつなぐJSON-LD。
- `src/components/Seo.astro`：canonical、robots、OGP、X/Twitterカード、JSON-LDをHTMLのheadへ出力。
- `src/pages/robots.txt.ts`：クロール許可とサイトマップのURL。
- `src/pages/sitemap.xml.ts`：本番のトップページURLを掲載。ページ内アンカーは別ページとして登録しない。
- `public/images/og/partire-hakata-hotel.jpg`：201号室の実写から作成した1200×630pxの共有画像。元写真は`src/assets/201/IMG_6756.jpg`、Web用の参照元は`public/images/rooms/201/01.webp`。
- `scripts/prepare-assets.mjs`：画像を再作成した際にOG画像も生成する処理を追加。
- ヒーローの「外観写真をもとにした生成イメージ」の表示テキストと専用CSSを削除。画像の参照元・生成プロンプトは制作計画書に保持。

タイトル：

> パルティーレ博多ホテル｜福岡・春吉／キャナルシティ博多徒歩3分

構造化データのホテル情報は既存の`hotel.ts`を参照。住所、電話、通常のチェックイン・アウト時刻、実写画像を設定している。受付営業時間、正確な緯度経度、評価・口コミ、星の数、未確定の税・料金条件、オンライン予約機能は追加していない。

## 確認状態

今回のSEO変更とヒーローテキスト削除の後は、ユーザーの指定に従いビルド、型チェック、ブラウザ、スクリーンショット、構造化データテスト、デプロイ後の確認を実施していない。以前のLP実装時の確認結果は、今回の変更の検証を意味しない。既存のdistも今回のSEO変更では再生成していない。

## 公開後に行う作業

1. 通常の公開手順でビルド・デプロイする。
2. 本番のトップページ、robots.txt、sitemap.xml、OG画像が取得できることを確認する。
3. Google Search Consoleで本番URLのプロパティを登録・所有権確認し、`https://partire-hakata-hotel.pages.dev/sitemap.xml`を送信する。
4. URL検査と構造化データのテストを行う。

本番への反映、インデックス登録、検索結果での表示は、このソース編集では確認していない。
