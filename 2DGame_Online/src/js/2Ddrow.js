//画面描画用関数（流用性はかなり低い:変数ava_x,ava_y,angle）
let drow = function(map,avater=[],item=[],atack=[],init){
    //画面削除
    ctx.clearRect(0, 0,window.innerWidth,window.innerHeight);
    ctx.beginPath();
    
    //アバター描画に関する処理
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

            //scoreの描画（文字）
            ctx.fillStyle = "#000000";
            ctx.fillText(avater[i].score,avater[i].x ,avater[i].y - DrowHp*2)
        }
    }


    //ステージブロックの描画
    ctx.fillStyle = "#000000";//色を黒く設定
    for(var i = 0;i < map.length;i++){
        for(let j = 0;j < map[i].length;j++){
            if(map[i][j] == 1)
            ctx.fillRect(j*Init.block_size,i*Init.block_size,Init.block_size,Init.block_size);
        }
    }

    //アイテムオブジェクトの描画
    ctx.fillStyle = "#FFA500";//色を黄色に設定
    for(var j = 0;j<item.length;j++){
        if(item[j].get == false){
            ctx.fillRect(item[j].x,item[j].y,Init.item_size,Init.item_size);
        }
    }

    //攻撃の描画
    ctx.fillStyle = "#FFF000";//色を黄色に背定
    for(var i = 0;i < AttackData.length;i++){
        ctx.fillRect(AttackData[i].x,AttackData[i].y,Init.bullet_size,Init.bullet_size);
    }

    //時間の描画
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(Time,0,0);
    
    //TIMEの描画（文字）
    ctx.fillStyle = "#000000";
    ctx.fillText("Time:" + Time .toFixed(3), HPDrawPoint.x , HPDrawPoint.y - DrowHp*2);
}

//自キャラ登録用関数（アバタの画像、サイズ横、サイズ縦、初期位置x、初期位置y）
//登録後は「chara(座標x,座標y)」でアバタを描画
let chara_set = function(init){
    var ava;    //関数の登録用変数

    //中心点の登録
    WideCenter = init.sizew / 2;
    HightCenter = init.sizeh / 2;

    //描画設定が四角形の時
    if(init.ava_type == 0){
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
        newImage.src = "/image/"+Init.ava_type;
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
            ctx.drawImage(newImage, x, y ,init.sizew,init.sizeh)
            ctx.restore();
        }
    }
    return ava;
}