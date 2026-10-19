# Lattice Rush (ラティス・ラッシュ) 〜結晶格子スピードハンター〜

Webブラウザで手軽に遊べる、3D化学パズル＆スピードアクションゲームです。
Three.jsによるリアルタイム3D描画とガラスモーフィズムのCyberpunk UIを採用し、GitHub Pagesで即座に公開できるように設計されています。

## 🎮 ゲームモード
1. **スピードクイズ (Quiz Mode)**
   * ランダムに提示された3D単位結晶格子（単純立方、体心立方、面心立方、塩化ナトリウム型、ダイヤモンド構造など）を視認し、正しい名称をスピーディーに選択します。
2. **ビルドモード (Build Mode)**
   * 指定された結晶格子になるように、3D空間上の格子点（原子）を直接クリックしてオン/オフを切り替え、構造を正しく構築します。

## 🚀 GitHub Pagesでの公開手順

1. **リポジトリの作成**
   * GitHubにログインし、新しいリポジトリ（例: `lattice-rush`）を作成します。
2. **ファイルのアップロード**
   * このzipを展開して得られる以下の4つのファイルを、リポジトリのルートにコミット・プッシュ（またはWeb画面からドラッグ＆ドロップでアップロード）します。
     * `index.html`
     * `style.css`
     * `app.js`
     * `README.md`
3. **Pagesの有効化**
   * GitHubリポジトリの **Settings** > **Pages** タブを開きます。
   * **Source** を `Deploy from a branch` に設定し、**Branch** を `main` (または `master`) の `/ (root)` に選択して **Save** を押します。
4. **公開完了**
   * 数分後、`https://<ユーザー名>.github.io/<リポジトリ名>/` にてゲームが即座に公開されます！

## 🛠️ 技術スタック
* **HTML5 / CSS3**: CSS Variables, Glassmorphism design, Flexbox & Grid layout
* **JavaScript (Vanilla ES6+)**: 外部フレームワーク不要の軽量実装
* **Three.js (r128)**: 3Dモデル生成・カメラ制御・ライティング・レイキャスト(マウス判定)
* **Canvas Confetti**: コンボ＆クリア時のパーティクル演出
