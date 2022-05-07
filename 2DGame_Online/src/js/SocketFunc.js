//nodeサーバと接続
var socket = io.connect();

//入室処理（Data:アバター配列）
socket.on('Enter',(Data,map,init,item)=>{
    AvaterData = Data;          //ユーザ情報の読み込み
    Map = map;                  //地形情報の読み込み
    Init = init;                //基本設定の読み込み
    My_num = Data.length - 1;   //操作番号の割り当て
    ItemData = item;            //アイテムデータの読み込み
    chara = chara_set(Init);    //アバタ描画処理の読み込み
    Time = Init.limit_time;

    drowD = 3;
    AttackChoice = 1;

    //メインで行う処理
    let main = setInterval (()=>{
        for(var i = 0;i < ItemData.length;i++){
            if(item_collision(AvaterData[My_num],ItemData[i],Init.item_size,Init.item_size)){
                ItemGet(My_num,i);
            }
        }

        //攻撃オブジェクトとの接触判定
        for(var i = 0;i < AttackData.length;i++){
            if(item_collision(AvaterData[My_num],AttackData[i],Init.bullet_size,Init.bullet_size)){
                if(AvaterData[My_num].id != AttackData[i].id){
                    if(AvaterData[My_num].hp > 0)AvaterData[My_num].hp--;

                    console.log(AvaterData[My_num].hp);
                    AttackData.splice(i,1);
                    socket.emit('AttackData_splice',i,My_num);
                }

            }
        }

        //ゲーム終了時の処理(Intervalのclearがメイン)
        if(AvaterData[My_num].hp <= 0||Time <= 0){
            clearInterval(main);
            clearInterval(BasicProcess);
            clearInterval(AttackMove);
            clearInterval(DrowRefresh);
            GameOver();
        }

        //時間の進行(改修予定)
        Time -= 1/Init.fps;
        if(Time<0)Time = 0;
    },1000/Init.fps);

    //簡易実装番攻撃処理
    let AttackMove = setInterval(()=>{
        for (let index = 0; index < AttackData.length; index++){
            console.log(AttackMoveList);
            AttackMoveList[Init.AttackChoice](index);
        }
    },1000/Init.fps)

    //操作処理（サーバ同期の際は受信時に行う）
    let BasicProcess = setInterval (()=>{
        //サーバ同期の場合クライアントの権限で実行しない
        if(Init.Synchro_Avatar == Server)clearInterval(BasicProcess);

        //操作処理
        AvaterData[My_num] = move(AvaterData[My_num],Init.Genre);
    },1000/Init.fps);


    //描画処理
    if(Init.drowD == 2){
    }
    else{
        CreateMap();
    }

    //描画処理（サーバ同期の際は受信時に行う）
    let DrowRefresh = setInterval (()=>{
        //描画処理
        if(Init.drowD == 2){
            drow(Map,AvaterData,ItemData,AttackData,Init);
        }

        //3D用の描画処理
        else{
            Three_drow();
        }

    },1000/Init.fps);

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

    //オブジェクトとアバタが重時の動作(ava:My_num , num:取得したアイテム)
    let ItemGet = function(ava,num){
        //ここにコードを追加（例：未取得のアイテムを取得しスコアを加算）
        if(!ItemData[num].get) {
            if(Init.Synchro_Item == Client){
                AvaterData[My_num].score++;
                ItemData[num].get = true;
            }
            socket.emit('Synchronize_Item',num);
        }
    }

});

//同期におけるemit関係(定期的に同期を行う為の送信情報)
socket.on('SynchroOrder',()=>{
    let Synchro = setInterval (()=>{
        //アバタ情報
        socket.emit('Synchronize_Avater',AvaterData,My_num);
        socket.emit('Synchronize_Time',Time)
        if(AvaterData[My_num].hp <= 0||Time <= 0){
            clearInterval(Synchro)
        }
    },1000/Init.fps);
})

//アバタの同期(Data:ユーザ情報　num:変更したユーザ番号)
socket.on('Synchronize_Avater',(Data,num = -1)=>{
    //クライアント同期
    if(AvaterData.length < Data)AvaterData.push()
    AvaterData[num] = Data[num];

    //サーバ同期では受信する仮引数が少ない
    if(num == -1){
        for(var i = 0;i<Data.length;i++){
            if(i != My_num){
                AvaterData[i] = Data[i];
            }
            //入力情報以外を更新（サーバの管理する入力情報は最新でない）
            else{
                AvaterData[i].id = Data[i].id;
                AvaterData[i].x = Data[i].x;
                AvaterData[i].y = Data[i].y;
                AvaterData[i].angle = Data[i].angle;
                AvaterData[i].jump = Data[i].jump;
                AvaterData[i].accel = Data[i].accel;
                if(Init.Synchro_Item)AvaterData[i].score = Data[i].score;
            }
        }
    }

});

//アイテムの同期
socket.on('Synchronize_Item',(Data)=>{
    if(Init.Synchro_Item == Client){
        ItemData[Data].get = true;
    }
    else{
        ItemData = Data;
    }
});

//時刻同期
socket.on('Synchronize_Time',(num)=>{
    Time = num;    
})

//他ユーザ退出時処理
socket.on('disconnect',(num)=>{
    AvaterData.splice(num,1);
    //他ユーザが先客なら減らした分操作変数をずらす
    if(num < My_num){
        My_num--;
    }
})

//==============[簡単な攻撃処理と被弾処理]==============
socket.on('AttackData_push',(Data)=>{
    AttackData.push(Data);
});


socket.on('Access',(init)=>{
    Init = init;
    //画面のリフレッシュ（10fps)
    TitleLoop = setInterval(TitlteUpdate,100);
    //Joinボタン追加
    window.addEventListener('click',BottunFunc, false);
})
