//アバタの動作(ava:アバタ情報 , num:操作ジャンル)
let move = function(ava,num){
    //非更新用変数
    var new_x = ava.x;
    var new_y = ava.y;
    
    //座標　更新用変数
    var Temp = ava;
    //更新処理（オブジェクトを直接参照するとJSの性質上勝手に更新される）
    var TempArray = MoveFuncList[num](ava);

    //動作関数から返された配列をオブジェクトに格納（同上の理由で配列としている）
    Temp.x = TempArray[0].x;
    Temp.y = TempArray[0].y;
    Temp.angle = TempArray[0].angle;
    Temp.jump = TempArray[0].jump;
    Temp.accel = TempArray[0].accel;

    //上下壁接触時に更新しない
    if(!upper_collision(Temp.x,Temp.y,Init.sizew,Init.sizeh)
    ||!under_collision(Temp.x,Temp.y,Init.sizew,Init.sizeh)){
        Temp.y = new_y ;
    }
    //左右壁接触時に更新しない
    if(!left_collision(Temp.x,Temp.y,Init.sizew,Init.sizeh)
    ||!right_collision(Temp.x,Temp.y,Init.sizew,Init.sizeh)){
        Temp.x = new_x;
    }
    
    return Temp;
}

const DrowHp = 10;

//画面描画用関数（流用性はかなり低い:変数ava_x,ava_y,angle）
let drow = function(map,avater=[],item=[],atack=[],init){
    //画面削除
    ctx.clearRect(0, 0,init.wide,init.hight);
    ctx.beginPath();

    
    for(var i = 0;i < avater.length;i++){
        if(avater[i] != undefined){
            //アバタの描画
            chara(avater[i].x,avater[i].y,avater[i].angle);
            //HPの描画（図形）
            ctx.fillStyle = "#FF0000";
            ctx.fillRect(avater[i].x ,avater[i].y - DrowHp*2,DrowHp*avater[i].hp*Init.sizew/100,DrowHp)
            //HPの描画（文字）
            ctx.fillStyle = "#000000";
            ctx.fillText(avater[i].hp,avater[i].x ,avater[i].y - DrowHp)

            //HPの描画（文字）
            ctx.fillStyle = "#000000";
            ctx.fillText(avater[i].score,avater[i].x ,avater[i].y - DrowHp*2)
        }
    }

    ctx.fillStyle = "#000000";
    //ステージブロックの描画
    for(var i = 0;i < map.length;i++){
        for(let j = 0;j < map[i].length;j++){
            if(map[i][j] == 1)
            ctx.fillRect(j*Init.block_size,i*Init.block_size,Init.block_size,Init.block_size);
        }
    }

    //アイテムオブジェクトの描画
    ctx.fillStyle = "#FFA500";
    for(var j = 0;j<item.length;j++){
        if(item[j].get == false){
            ctx.fillRect(item[j].x,item[j].y,Init.item_size,Init.item_size);
        }
    }
    //攻撃の描画
    ctx.fillStyle = "#FFF000";
    for(var i = 0;i < AttackData.length;i++){
        console.log(AttackData[i].x);
        ctx.fillRect(AttackData[i].x,AttackData[i].y,Init.bullet_size,Init.bullet_size);
    }

    //時間の描画
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(Time,0,0);
    

}

//キーボード操作関数
document.onkeydown = function (e) {
    if(e.key == Init.keycode_up)AvaterData[My_num].up = true;
    if(e.key == Init.keycode_do)AvaterData[My_num].down = true;
    if(e.key == Init.keycode_le)AvaterData[My_num].left = true;
    if(e.key == Init.keycode_ri)AvaterData[My_num].right = true;
    if(e.key == " ") {
        AttackData.push(new AttackAdd(AvaterData[My_num].id,AvaterData[My_num].x,AvaterData[My_num].y,AvaterData[My_num].angle))
        socket.emit('AttackData_push',AttackData[AttackData.length-1]);
    }
}
//キーボードを離した際の関数
document.onkeyup = function(e){
    if(e.key == Init.keycode_up)AvaterData[My_num].up = false;
    if(e.key == Init.keycode_do)AvaterData[My_num].down = false;
    if(e.key == Init.keycode_le)AvaterData[My_num].left = false;
    if(e.key == Init.keycode_ri)AvaterData[My_num].right = false;
}

//自キャラ登録用関数（アバタの画像、サイズ横、サイズ縦、初期位置x、初期位置y）
//登録後は「chara(座標x,座標y)」でアバタを描画
let chara_set = function(init){
    var ava;    //関数の登録用変数

    //中心点の登録
    WideCenter = init.sizew / 2;
    HightCenter = init.sizeh / 2;

    //描画設定が四角形の時
    if(Init.ava_type == DrowRect){
        ava = function(x,y,angle){
            //レースゲーム時のみ画像を回転させています。
            if(Init.Genre != RaceGame){
                //座標の記録
                ctx.save();
                //アバタを中心とした回転
                ctx.translate(x + WideCenter, y + HightCenter);
                ctx.rotate(angle);
                //アバタ以外の逆回転
                ctx.translate(-x - WideCenter,-y - HightCenter);
            }
            //四角形の描画準備
            ctx.strokeRect(x,y,init.sizew,init.sizeh);
            ctx.restore();
        }
    }
    else{
        //画像の読み込み
        var newImage = new Image();
        newImage.src = Init.ava_type;
        ava = function(x,y,angle){
            if(Init.Genre == RaceGame){
                //座標の記録
                ctx.save();
                //アバタを中心とした回転
                ctx.translate(x + WideCenter, y + HightCenter);
                ctx.rotate(angle);
                //アバタ以外の逆回転
                ctx.translate(-x - WideCenter,-y - HightCenter);
            }
            ctx.strokeRect(x,y,init.sizew,init.sizeh);
            ctx.restore();
        }
    }
    return ava;
}