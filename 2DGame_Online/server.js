//GUI設定の読み込み
const Map= require('./init/map.json').map; 
const Init = require('./init/data.json'); 
var f = require('./src/js/MoveFunc.js');
//f.func();

//nodeサーバの立ち上げ
var express = require("express"),app = express(),http = require("http"),server = http.createServer(app),io = require("socket.io").listen(server);

//index先の設定
app.use("/", express.static(__dirname+"/src/")); 
server.listen(Init.port);

let AvaterData = [];        //アバタオブジェクトを格納する配列
let Time = Init.limit_time; //ゲーム内時間
let ItemData = [];          //アイテムオブジェクトを格納
let MoveFuncList = [];      //移動ルーチンを格納する
let PerfectSynchron = Init.Perfect_Synchron; //完全同期：true　非完全同期:false
let GameMode = false;

//アイテムの配置（ランダム生成）
for(var i = 0;i < Init.item;i++){
    ItemData.push({"x":Math.floor(Math.random()*Init.wide+Init.sizeh),"y":Math.floor(Math.random()*Init.hight+Init.sizeh),get:false})
}

//アバタオブジェクト生成用関数（コンストラクタ的）
let UserAdd = function(id)
{
    this.id = id;
    this.x = Init.user_setx;
    this.y = Init.user_sety;
    this.angle = 0;
    this.jump = 0;
    this.accel = 0;
    this.hp = 10;
    this.score = 0;
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
    this.beat = false;
}

//JSON内のBoolの内訳
let Client = false;
let Server = true;

//====================[相互通信内での処理(主に同期処理)]====================================
io.sockets.on('connection', function(socket)
{
    console.log(socket.id);
    socket.on('new',()=>
    {
         //入室処理
        AvaterData.push(new UserAdd(socket.id));//アバタデータを追加
        socket.emit('Enter',AvaterData,Map,Init,ItemData,Time);//クライアントに初期設定を送信

        //データ送信関数の発火
        socket.emit('SynchroOrder');
    })


    //アバタ同期（Data:アバタデータ、num：操作番号）
    socket.on('Synchronize_Avater',(Data,num)=>
    {
        //アバタデータを検索し未登録か他クライアントが未受信の場合非同期
        if(AvaterData.findIndex((e) => e.id === socket.id) != -1
        ||AvaterData[num].beat != undefined)
        {
            if(PerfectSynchron && AvaterData[num].beat){}
            else
            {
                //クライアント同期である場合全クライアントに入力情報を送信
                if(Init.Synchro_Avatar == Client)
                {
                    socket.broadcast.emit('Synchronize_Avater',Data,num);
                }
                //サーバ内のユーザ入力情報を更新
                AvaterData[num].up = Data[num].up;
                AvaterData[num].down = Data[num].down;
                AvaterData[num].left = Data[num].left;
                AvaterData[num].right = Data[num].right;

                //完全同期である場合次回受信時に他クライアントが未受信なら非更新
                AvaterData[num].beat = true;
            }
            
            //全クライアントが受信済みであるなら更新可能状態に変更
            if(AvaterData.findIndex((e) => e.beat == false) == -1)
            {
                //更新処理（全アバタをループで更新）
                for (let index = 0; index < AvaterData.length; index++) 
                {
                    //完全同期である場合更新可能状態に戻す
                    if(PerfectSynchron)
                    {
                        AvaterData[index].beat = false;
                    }
                    //サーバ同期である場合アバタ情報の一斉送信
                    AvaterData[index] = move(AvaterData[index],Init.Genre);
                    io.sockets.emit("Synchronize_Avater",AvaterData);
                }
            }
        }
    });

    //アイテムの同期(Data:アイテムの番号)
    socket.on('Synchronize_Item',(Data)=>
    {
        //アイテム：サーバ同期時
        if(Init.Synchro_Item == Server)
        {
            //サーバ箇所でゲット処理
            if(!ItemData[Data].get)
            {
                //サーバ内で取得時の処理
                ItemGet(AvaterData.findIndex((e) => e.id === socket.id),Data)
            }
            io.sockets.emit('Synchronize_Item',ItemData);
        }
        //アイテム：クライアント同期時
        else
        {
            io.sockets.emit('Synchronize_Item',Data);
        }
        //アイテム消去処理
        ItemData[Data].get = true;
    });

    // 切断時の処理
    // クライアントが切断したら、サーバー側では'disconnect'イベントが発生する
    socket.on('disconnect',() =>
    {
        //プレイヤーが離脱したことを通知
        io.sockets.emit('disconnect',AvaterData.findIndex((e) => e.id === socket.id))
        AvaterData.splice(AvaterData.findIndex((e) => e.id === socket.id),1);
    });

//=======================[試作の攻撃関数]======================================
    //攻撃の送信(クライアント処理だけの簡易実装版)
    socket.on('AttackData_push',(Data)=>
    {
        socket.broadcast.emit('AttackData_push',Data);
    });

    socket.on('AttackData_splice',(Data,num)=>
    {
        AvaterData[num].hp--;
        socket.broadcast.emit('AttackData_splice',Data,num);
    });

});


//==============[MainFunk.jsから移植(今後エクスポート予定)]================================
//アイテム取得時の処理（ava:ユーザ番号 , num：接触したアイテム番号）
let ItemGet = (ava,num)=>
{
    AvaterData[ava].score++;
    ItemData[num].get = true;
}

//アバタの座標処理（クライアント同期の際はclearされる）
let ServerMove = setInterval (()=>{
    if(Init.Synchro_Avatar == Client)clearInterval(ServerMove);
    if(!PerfectSynchron)
    {
        //全アバタの更新をループで行う
        for (let index = 0; index < AvaterData.length; index++) {
            AvaterData[index] = move(AvaterData[index],Init.Genre);
        }
    }
},1000/Init.fps);

//サーバ内時間管理処理（クライアント同期の際はclearされる）
let ServerTime = setInterval (()=>{
    if(Init.Synchro_Time == Client)clearInterval(ServerTime);
},1000/Init.fps);


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



//=======================[MoveFuncから移植]======================================
//ここに動作用の関数を挿入

//例（コピペして利用）
MoveFuncList.push(function(ava){
    //上キー入力時
    if(ava.up)
    //下キー入力時
    if(ava.down)
    //左キー入力時
    if(ava.left)
    //右キー入力時
    if(ava.right)
    
    //更新
    var temp =[{x:ava.x,y:ava.y,angle:ava.angle,jump:ava.jump,accel:ava.accel}];
    return temp;
});

//アクションゲーム操作
MoveFuncList.push(function(ava){
    //移動処理（攻撃用に角度を変更している）
    if(ava.up)ava.jump = ava.jump - Init.jump_pow;
    if(ava.left){ava.x--; ava.angle =  270*Math. PI/180}
    if(ava.right){ava.x++; ava.angle =  90*Math. PI/180}

    //通常の落下処理
    ava.jump += Init.gravity;
    ava.y += ava.jump;

        //上下壁接触時
    if(!upper_collision(ava.x,ava.y,Init.sizew,Init.sizeh)
    ||!under_collision(ava.x,ava.y,Init.sizew,Init.sizeh)){
        ava.jump = 0;
    }
    var temp =[{x:ava.x,y:ava.y,angle:ava.angle,jump:ava.jump,accel:ava.accel}];
    return temp;
}); 

//シューティングゲーム操作
MoveFuncList.push(function(ava){
    if(ava.up)ava.y--;
    if(ava.left)ava.x--;
    if(ava.right)ava.x++;
    if(ava.down)ava.y++;
    var temp =[{x:ava.x,y:ava.y,angle:ava.angle,jump:ava.jump,accel:ava.accel}];
    return temp;
});

//レースゲーム操作
MoveFuncList.push(function(ava){
    var new_accel = ava.accel;
    //上下の進行
    ava.y -= ava.accel * Math.cos(ava.angle);

    //左右の進行
    ava.x += ava.accel * Math.sin(ava.angle); 

    //上キーで加速
    if(ava.up){
        if(ava.accel < Init.max_spead)new_accel += 0.01;
    }

    //非加速時は減速
    else{
        if(ava.accel > 0 && Init.friction > 0){new_accel -= Init.friction;}
        else if(ava.accel > 0 && Init.friction == 0){new_accel = ava.accel}
        else{ava.accel = 0}
    }

    //角度の更新
    if(ava.left){ava.angle -=  Init.rotation;}
    if(ava.right){ava.angle += Init.rotation;}
    //加速の更新
    ava.accel = new_accel;

    var temp =[{x:ava.x,y:ava.y,angle:ava.angle,jump:ava.jump,accel:ava.accel}];
    return temp;
});



//===================[collisionから移植]====================================================
//上側の通過判定関数
let upper_collision = function(x,y,sw,sh){
    if(Map[Math.floor((y-1)/Init.block_size)][Math.floor((x)/Init.block_size)]==1
    ||Map[Math.floor((y-1)/Init.block_size)][Math.ceil((x)/Init.block_size)]==1){return false;}
    else{return true;}
}

//下側の通過判定関数
let under_collision = function(x,y,sw,sh){
    if(Map[Math.floor((y+sh+1)/Init.block_size)][Math.floor((x)/Init.block_size)]==1
    ||Map[Math.floor((y+sh+1)/Init.block_size)][Math.ceil((x)/Init.block_size)]==1){return false;}
    else{return true;}
}

//左側の通過判定関数
let left_collision = function(x,y,sw,sh){
    if(Map[Math.floor((y)/Init.block_size)][Math.floor((x-1)/Init.block_size)]==1
    ||Map[Math.ceil((y)/Init.block_size)][Math.floor((x-1)/Init.block_size)]==1){return false;}
    else{return true;}
}

//右側の通過判定関数
let right_collision = function(x,y,sw,sh){
    if(Map[Math.floor((y)/Init.block_size)][Math.floor((x+sw)/Init.block_size)]==1
    ||Map[Math.ceil((y)/Init.block_size)][Math.floor((x+sw)/Init.block_size)]==1){return false;}
    else{return true;}
}