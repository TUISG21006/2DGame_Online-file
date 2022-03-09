# 2DGame_Online-file
Node.jsを用いたオンラインゲーム設定ツールです。  
アバターのサイズや操作方法、同期処理のタイミング及び同期箇所の選択が可能です。
![none](https://user-images.githubusercontent.com/88083230/157493832-5e674127-e892-41de-865a-5723572d65f6.png)  
![none](https://user-images.githubusercontent.com/88083230/157494462-34cd70b2-b45a-46bc-8c20-95356f3f7fd7.png)
  
## Requirements  
このコードは、GUI画面をnet6.0-windows、VisualStudioに依存しておりWindowsによってのみ動作します。  
またホストの立ち上げにnode-v12.16.1が必要です。  
## Usage  
設定はゲームの基礎設定を行う「ゲーム設定」とゲームのチューニングパラメータを設定する「ゲーム内設定」の2種類が設定できます。  
### ゲーム設定<br>
`ユーザの使用PORT`<br>
nodeサーバを起動した際の占領PORTを選択します<br><br>
`同期箇所`<br>
情報同期の場所を選択できます。<br>
Clientを選択した場合Clientがいなくなった時情報が初期化されます。<br>
Serverを選択した場合Clientが存在しなくとも設定が変更されます。<br><br>
`操作ジャンル`<br>
操作用に規定された移動方法を全体に適用します。<br>
アクション　　：重力の係数に従い落下し上キーでジャンプします。<br>
シューティング：上下左右にキーに従い移動します。<br>
レース　　　　：摩擦係数に従い方向変化と加速を行います。<br><br>
`画面更新頻度`<br>
1秒内の画面更新頻度（FPS）を設定できます。<br><br>
`同期頻度`<br>
1秒内の情報同期頻度を設定できます。<br><br>
`上下左右キー`<br>
操作用入力キーを設定できます。<br><br>
### ゲーム内設定<br>
`アバターの初期位置XY`<br>
アバタの初期位置を設定します<br><br>
`ブロックのサイズ`<br>
マップを含む1マスのサイズを変更できます<br><br>
`制限時間`<br>
ゲーム全体の制限時間を設定します<br><br>
`ユーザ同士の接触`<br>
ユーザの接触に判定が付与されます衝突時動作を止めます。<br><br>
`アイテムのサイズ`<br>
アイテム一つのサイズを変更できます。<br><br>
`移動速度`<br>
アバタの移動速度を変更できます。<br><br>
`動作速度`<br>
アバタの移動頻度を設定できます。<br><br>
`ジャンプ力`<br>
ジャンル1の際どの程度跳ねるかを設定できます。<br><br>
`回転力`<br>
ジャンル3の際どの程度早く旋回できるか設定できます<br><br>
`摩擦力`<br>
ジャンル3の際どの程度減速するかを設定できます<br><br>
`重力`<br>
ジャンル1の際どの程度下に落ちやすいかを設定します<br><br>
`ポイントアイテムの生成数`<br>
ゲーム上のポイントアイテム生成数を設定できます<br><br>
## Server起動後  
Server起動後は設定したポート番号にhttp://localhost: でアクセスする事でゲームを開始できます。

