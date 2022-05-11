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

//時間の進行
let Clock = function(num){
    Time = (Time < 0 || AvaterData[My_num].hp <= 0 ?  0 : Time - num);
}
