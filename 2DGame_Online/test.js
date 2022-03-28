exports.func = function () {
    console.log("load");
}
    


exports.move = function(Genre,x,y,angle,up,down,left,right,jump,acsell,user){
    //変数更新用変数
    var new_x = x;
    var new_y = y;
    var new_angle = angle;

    //ジャンプ更新用変数
    var new_jump = jump;

    //角度更新用変数
    var new_angle = angle;
    var new_acsell = acsell;

    //アクションゲーム時の動作
    if(Genre == 1){
        //移動処理（攻撃用に角度を変更している）
        if(up)new_jump = jump - jump_pow;
        if(left){new_x--; new_angle =  270*Math. PI/180}
        if(right){new_x++; new_angle =  90*Math. PI/180}

        //通常の落下処理
        new_jump += gravity;
        new_y += new_jump;
    }

    //レースゲーム用
    if(Genre == 2){
        if(up)new_y--;
        if(down)new_y++;
        if(left)new_x--;
        if(right)new_x++;
    }

    //レースゲーム時の動作
    if(Genre == 3){
        //上下の進行
        new_y -= acsell * Math.cos(angle);

        //左右の進行
        new_x += acsell * Math.sin(angle); 

        //上キーで加速
        if(up){
            if(acsell < max_spead)new_acsell += 0.01;
        }

        //非加速時は減速
        else{
            if(acsell > 0 && friction > 0){new_acsell -= 1*friction;}
            else if(acsell > 0 && friction == 0){new_acsell = acsell}
            else{acsell = 0}
        }
        
        //角度の更新
        if(left){new_angle -=  rotation;}
        if(right){new_angle += rotation;}
    }

    //上下壁接触時
    if(!f.upper_collision(new_x,new_y,sizew,sizeh)
    ||!f.under_collision(new_x,new_y,sizew,sizeh)){
        new_y = y ;
        if(Genre == 1)new_jump = 0;
    }

    //左右壁接触時
    if(!left_collision(new_x,new_y,sizew,sizeh)
    ||!right_collision(new_x,new_y,sizew,sizeh)){
        new_x = x;
    }

    //ユーザ情報の更新
    point_update(new_x,new_y,new_angle,new_jump,new_acsell);

    //情報更新の送信
    socket.emit("Avater_move",new_x,new_y,new_angle,user_number,hp);
};

//上側の通過判定関数
exports.upper_collision = function(x,y,sw,sh){
    if(map[Math.floor((y-1)/block_size)][Math.floor((x)/block_size)]==1
    ||map[Math.floor((y-1)/block_size)][Math.ceil((x)/block_size)]==1){
        return false;
    }
    else{
        return true;
    }
}

//下側の通過判定関数
exports. under_collision = function(x,y,sw,sh){
    if(map[Math.floor((y+sh+1)/block_size)][Math.floor((x)/block_size)]==1
    ||map[Math.floor((y+sh+1)/block_size)][Math.ceil((x)/block_size)]==1){
        return false;
    }
    else{
        return true;
    }
}

//左側の通過判定関数
exports. left_collision = function(x,y,sw,sh){
    if(map[Math.floor((y)/block_size)][Math.floor((x-1)/block_size)]==1||map[Math.ceil((y)/block_size)][Math.floor((x-1)/block_size)]==1){return false;}
    else{return true;}
}

//右側の通過判定関数
exports. right_collision = function(x,y,sw,sh){
    if(map[Math.floor((y)/block_size)][Math.floor((x+sw)/block_size)]==1||map[Math.ceil((y)/block_size)][Math.floor((x+sw)/block_size)]==1){return false;}
    else{return true;}
}

//上側ユーザ接触
exports. upper_avatar_collision = function(x,y,ex,ey,hight){
    if(Math.abs(y-ey)< hight && y-ey > 0 && Math.abs(x-ex)<hight){
        return false;
    }
    else{
        return true;
    }
};

//下側ユーザ接触
exports. under_avatar_collision = function(x,y,ex,ey,hight){
    if(Math.abs(y-ey)< hight && y-ey <= 0 && Math.abs(x-ex)<hight){
        return false;
    }
    else{
        return true;
    }
};

//左側ユーザ接触
exports. left_avatar_collision = function(x,y,ex,ey,wide){
    if(Math.abs(x-ex)< wide && x-ex >= 0 && Math.abs(y-ey)<wide){
        return false;
    }
    else{
        return true;
    }
};

//右側ユーザ接触
exports. right_avatar_collision = function(x,y,ex,ey,wide){
    if(Math.abs(x-ex)< wide && x-ex < 0 && Math.abs(y-ey)<wide){
        return false;
    }
    else{
        return true;
    }
};

//アイテムの接触判定（アイテムは座標間の距離で測っているので上下左右はない）
exports. item_collision = function(x,y,ix,iy,size,isize){
    if(Math.abs(ix - x) + Math.abs(iy - y) < (size + isize) / 2){
        return true;
    }
};