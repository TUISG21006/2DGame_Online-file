//アバタ動作格納用
let MoveFuncList = [];
//以下に動作用の関数を挿入

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
MoveFuncList.push(function(ava)
{
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
MoveFuncList.push(function(ava)
{
    if(ava.up)ava.y--;
    if(ava.left)ava.x--;
    if(ava.right)ava.x++;
    if(ava.down)ava.y++;
    var temp =[{x:ava.x,y:ava.y,angle:ava.angle,jump:ava.jump,accel:ava.accel}];
    return temp;
});

const RaceGame = 3;     //レースゲームは3番に登録されている
const DrowRect = "0";   //マジナン避け

//レースゲーム操作
MoveFuncList.push(function(ava)
{
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
