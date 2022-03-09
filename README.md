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
 `ユーザの使用PORT`<br>
 nodeサーバを起動した際の占領PORTを選択します<br>
 `同期箇所`<br>
 情報同期の場所を選択できます。  Clientを選択した場合Clientがいなくなった時情報が初期化されます。 
 Serverを選択した場合Clientが存在しなくとも設定が変更されます。  '操作ジャンル'  操作用に規定された移動方法を全体に適用します。アクション：  
