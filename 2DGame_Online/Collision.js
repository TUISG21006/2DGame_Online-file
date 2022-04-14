//上側の通過判定関数
let upper_collision = function(x,y,sw,sh){
    return ((Map[Math.floor((y-1)/Init.block_size)][Math.floor((x)/Init.block_size)]==1
    ||Map[Math.floor((y-1)/Init.block_size)][Math.ceil((x)/Init.block_size)]==1) ?  false:true)
}

//下側の通過判定関数
let under_collision = function(x,y,sw,sh){
    return ((Map[Math.floor((y+sh+1)/Init.block_size)][Math.floor((x)/Init.block_size)]==1
    ||Map[Math.floor((y+sh+1)/Init.block_size)][Math.ceil((x)/Init.block_size)]==1) ?  false:true)
}

//左側の通過判定関数
let left_collision = function(x,y,sw,sh){
    return ((Map[Math.floor((y)/Init.block_size)][Math.floor((x-1)/Init.block_size)]==1
    ||Map[Math.ceil((y)/Init.block_size)][Math.floor((x-1)/Init.block_size)]==1) ?  false:true)
}

//右側の通過判定関数
let right_collision = function(x,y,sw,sh){
    return ((Map[Math.floor((y)/Init.block_size)][Math.floor((x+sw)/Init.block_size)]==1
    ||Map[Math.ceil((y)/Init.block_size)][Math.floor((x+sw)/Init.block_size)]==1) ?  false:true)
}

//アイテムの接触判定（アイテムは座標間の距離で測っているので上下左右はない）
let item_collision = function(ava,item,Target_w,Target_h){
    //重なっている状態のチェック
    var w = (item.x > ava.x ? Init.sizew:Target_w)
    var h = (item.y > ava.y ? Init.sizeh:Target_h)
    //重なっているならtrue
    return ((Math.abs(item.x - ava.x) < w && Math.abs(item.y - ava.y) < h) ? true:false)
};