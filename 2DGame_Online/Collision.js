//上側の通過判定関数
let upper_collision = function(x,y,sw,sh){
    if(Map[Math.floor((y-1)/Init.block_size)][Math.floor((x)/Init.block_size)]==1
    ||Map[Math.floor((y-1)/Init.block_size)][Math.ceil((x)/Init.block_size)]==1){
        return false;
    }
    else{
        return true;
    }
}

//下側の通過判定関数
let under_collision = function(x,y,sw,sh){
    if(Map[Math.floor((y+sh+1)/Init.block_size)][Math.floor((x)/Init.block_size)]==1
    ||Map[Math.floor((y+sh+1)/Init.block_size)][Math.ceil((x)/Init.block_size)]==1){
        return false;
    }
    else{
        return true;
    }
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

//アイテムの接触判定（アイテムは座標間の距離で測っているので上下左右はない）
let item_collision = function(ava,item,Target_w,Target_h){
    //重なっている状態のチェック
    var w,h;
    if(item.x > ava.x) w = Init.sizew;
    else w = Target_w;
    if(item.y > ava.y) h = Init.sizeh;
    else h = Target_h;
    
    //重なっているならtrue
    if(Math.abs(item.x - ava.x) < w 
    && Math.abs(item.y - ava.y) < h)return true;
    else false;
};