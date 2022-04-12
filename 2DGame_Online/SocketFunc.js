//nodeサーバと接続
var socket = io.connect();

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
    drow(Map,AvaterData,ItemData,AttackData,Init);
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

//==============[]==============
socket.on('AttackData_push',(Data)=>{
    AttackData.push(Data);
});

socket.on('AttackData_splice',(Data,num)=>{
    AttackData.splice(Data,1);
    AvaterData[num].hp--;
});
