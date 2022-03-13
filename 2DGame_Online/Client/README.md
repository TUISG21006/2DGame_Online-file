# Client_main_server<br>
Client同期をベースとしたチューニングです<br>
アバタの座標、アイテムの座標、時間が管理されています。<br>
(今後オブジェクトごとに変更可能予定)<br>

## Function Description<br>
### init()<br>
#### 使用変数

#### 説明<br>
Serverから送られた環境情報を使用する変数に格納します。

### initial_position<br>
#### 使用変数<br>
set_x,set_y,user1_setx,user1_sety
#### 説明<br>
アバタの初期位置にアバタのx,yを格納します。

### Ingame_parameters<br>
#### 使用変数<br>

#### 説明<br>
ゲーム内で処理するためのアバタ情報を生成します。
### chara_set(type:string,wide:number,hight:number,x:number,y:number)<br>
#### 使用変数<br>

#### 説明<br>

### other_chara_set(type:string,wide:number,hight:number,x:number,y:number)<br>
### chara(x:number,y:number,angle:number)<br>
### ccreate_bullet<br>
### count_down(num:number)<br>
### point_update(x:number,y:number,angle:number,jump:number,acsell:number)<br>
### drow<br>

