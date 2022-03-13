const mapData= require('./map.json'); 
const initData= require('./data.json'); 
var express = require("express"),app = express(),http = require("http"),server = http.createServer(app),io = require("socket.io").listen(server);

app.use("/", express.static(__dirname+"/Server" )); //このディレクトリの奴を使用可的な
server.listen(initData.port);

let User = [];
//IDを検索用の配列
let UserList = [];
var item_list = [];
for(var i = 0;i<initData.item;i++){
    item_list.push({"x":Math.floor(Math.random()*650+initData.sizeh),"y":Math.floor(Math.random()*290+initData.sizeh),get:false})
}

let CreateUser = function(x = 10,y = 10,angle = 0,jump = 0,acsell = 0,score = 0){
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.jump = jump;
    this.up = false;
    this.dow = false;
    this.lef = false;
    this.rig = false;
    this.acsell = acsell;
    this.score = score;

}

io.sockets.on('connection', function(socket) {
    socket.on('room_join',function(){
        UserList.push(socket.id);
        User.push(new CreateUser(initData.user_setx,initData.user_sety,0,0,0))
        socket.emit('join',User.length-1,mapData,User,initData);
    });
    socket.on('Client to Server',(num,flag)=>{
        User[num].up = flag.up;
        User[num].dow = flag.down;
        User[num].rig = flag.right;
        User[num].lef = flag.left;
    });

    // 切断時の処理
    // ・クライアントが切断したら、サーバー側では'disconnect'イベントが発生する
    socket.on('disconnect',() =>{
        User[UserList.indexOf(socket.id)]=undefined;
        console.log(UserList.indexOf(socket.id)," ",socket.id,' is ' ,'disconnect.');
    });

});

var Genre = initData.Genre;
var user_collision = initData.user_collision;
var sizeh = initData.sizeh;
var sizew = initData.sizew;
var map = mapData.map;
var block_size = initData.block_size
var gravity = initData.gravity

var item_size = initData.item_size

var jump_pow = initData.jump_pow
var time = initData.limit_time;

let move = function(Genre,x,y,angle,up,down,left,right,jump,acsell,user,score){
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
        //上キー入力時&上進行可能時
        //この辺上下左右使いまわしなので関数に使用としたがスパゲッティ化しそうなので却下
        //解説は落下処理箇所に記載
        if(upper_collision(x,y,sizew,sizeh) && up){
            //アバター同士に接触判定があり接触を行った際
            if(user_collision == 1&&user.length>0){
                check : while(true){
                    for(var i = 1;i< user.length;i++){
                        if(user[i] != undefined && !upper_avatar_collision(x,y,user[i].x,user[i].y,sizeh)){
                            new_jump = 0;
                            break check;
                        }
                    }
                    new_jump = jump - jump_pow;
                    new_y--;
                    break check;
                }
            }
            else{
                new_jump = jump - jump_pow;
                new_y--;
            }
        }
        //下キー入力時
        if(under_collision(x,y,sizew,sizeh) && down){
            if(user_collision == 1&&user.length>0){
                check : while(true){
                    for(var i = 1;i< user.length;i++){
                        if(user[i] != undefined && !under_avatar_collision(x,y,user[i].x,user[i].y,sizeh)){
                            new_jump = 0;
                            break check;
                        }
                    }
                    new_y++;
                    break check;
                }
            }
            else{
                new_y++;
            }
        }
        //右キー入力時
        if(left_collision(x,y,sizew,sizeh) && left){
            if(user_collision == 1&&user.length>0){
                check : while(true){
                    for(var i = 1;i< user.length;i++){
                        if(user[i] != undefined && !left_avatar_collision(x,y,user[i],x,user[i],y,sizeh)){
                            break check;
                        }
                    }
                    new_x--;
                    break check;
                }
            }
            else{
                new_x--;
            }
        }
        //左キー入力時
        if(right_collision(x,y,sizew,sizeh )&& right){
            if(user_collision == 1&&user.length>0){
                check : while(true){
                    for(var i = 1;i< user.length;i++){
                        if(user[i] != undefined && !right_avatar_collision(x,y,user[i],x,user[i],y,sizeh)){
                            break check;
                        }
                    }
                    new_x++;
                    break check;
                }
            }
            else{
                new_x++;
            }
        }

        //落ちる処理（床にめり込んだ際はフィールドに戻す）
        if(under_collision(x,y,sizew,sizeh)){
            new_jump += gravity;
            //他アバタと接触がある際の動作
            if(user_collision == 1&&user.length>0){
                //一度でも他ユーザと接触があればcheckを切る
                check : while(true){
                    for(var i = 1;i < user.length;i++){
                        if(user[i] != undefined && !under_avatar_collision(x,y,user[i].x,user[i].y,sizeh)){
                            new_y = Math.ceil(y-1);
                            new_jump = 0;
                            break check;
                        }
                    }
                    //一度も他ユーザと接触が無ければ落下しcheckを切る
                    new_y += new_jump;
                    break check;
                }
            }
            else{
                new_y += new_jump;
            }
        }
        //床接着時
        else{
            new_jump = 0;
            new_y = Math.ceil(y-1);
        }
        //飛び上がる処理（天井にめり込んだ際は戻す）
        if(!upper_collision(x,y,sizew,sizeh)){new_jump = 0;new_y = Math.ceil(y+1);}
    }

    //シューティング時の動作
    if(Genre == 2){
        if(upper_collision(x,y,sizew,sizeh) && up){
            //アバター同士に接触判定があり接触を行った際
            if(user_collision == 1&&user.length>0){
                check : while(true){
                    for(var i = 1;i< user.length;i++){
                        if(user[i] != undefined && !upper_avatar_collision(x,y,user[i].x,user[i].y,sizeh)){
                            break check;
                        }
                    }
                    new_y--;
                    break check;
                }
            }
            else{
                new_y--;
            }
        }

        if(under_collision(x,y,sizew,sizeh) && down){
            if(user_collision == 1&&user.length>0){
                check : while(true){
                    for(var i = 1;i< user.length;i++){
                        if(user[i] != undefined && !under_avatar_collision(x,y,user[i].x,user[i].y,sizeh)){
                            break check;
                        }
                    }
                    new_y++;
                    break check;
                }
            }
            else{
                new_y++;
            }
        }
        
        if(left_collision(x,y,sizew,sizeh) && left){
            if(user_collision == 1&&user.length>0){
                check : while(true){
                    for(var i = 1;i< user.length;i++){
                        if(user[i] != undefined && !left_avatar_collision(x,y,user[i],x,user[i],y,sizeh)){
                            break check;
                        }
                    }
                    new_x--;
                    break check;
                }
            }
            else{
                new_x--;
            }
        }
        if(right_collision(x,y,sizew,sizeh) && right){
            if(user_collision == 1&&user.length>0){
                check : while(true){
                    for(var i = 1;i< user.length;i++){
                        if(user[i] != undefined && !right_avatar_collision(x,y,user[i],x,user[i],y,sizeh)){
                            break check;
                        }
                    }
                    new_x++;
                    break check;
                }
            }
            else{
                new_x++;
            }
        }
    }

    //レースゲーム時の動作
    if(Genre == 3){
        //0:sin=0,cos=1 90:sin=1,cos=0 180:sin=0,cos=-1 270:sin=-1,cos=0
        
        //上下の進行
        if((Math.cos(angle) >= 0 && upper_collision(x,y,sizew,sizeh))
        ||(Math.cos(angle) < 0 && under_collision(x,y,sizew,sizeh))){
            new_y -= acsell * Math.cos(angle);
        }

        //左右の進行
        if((Math.sin(angle) >= 0 && right_collision(x,y,sizew,sizeh))||
        (Math.sin(angle) < 0 && left_collision(x,y,sizew,sizeh))){
            new_x += acsell * Math.sin(angle);   
        }

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
    
    var new_score ;

    new_score = score;
    for(var i = 0;i < item_list.length;i++){
        if(item_list[i].get == false && item_collision(x+sizew/4,y+sizew/4,item_list[i].x,item_list[i].y,sizew,item_size)){
            new_score++;
            item_list[i].get = true;
        }
    }

    var new_state = {"x":new_x,"y":new_y,"angle":new_angle,"jump":new_jump,"acsell":new_acsell,"score":new_score}
    return new_state;
};

//上側の通過判定関数
let upper_collision = function(x,y,sw,sh){
    if(map[Math.floor((y-1)/block_size)][Math.floor((x)/block_size)]==1
    ||map[Math.floor((y-1)/block_size)][Math.ceil((x)/block_size)]==1){
        return false;
    }
    else{
        return true;
    }
}

//下側の通過判定関数
let under_collision = function(x,y,sw,sh){
    if(map[Math.floor((y+sh+1)/block_size)][Math.floor((x)/block_size)]==1
    ||map[Math.floor((y+sh+1)/block_size)][Math.ceil((x)/block_size)]==1){
        return false;
    }
    else{
        return true;
    }
}

//左側の通過判定関数
let left_collision = function(x,y,sw,sh){
    if(map[Math.floor((y)/block_size)][Math.floor((x-1)/block_size)]==1||map[Math.ceil((y)/block_size)][Math.floor((x-1)/block_size)]==1){return false;}
    else{return true;}
}

//右側の通過判定関数
let right_collision = function(x,y,sw,sh){
    if(map[Math.floor((y)/block_size)][Math.floor((x+sw)/block_size)]==1||map[Math.ceil((y)/block_size)][Math.floor((x+sw)/block_size)]==1){return false;}
    else{return true;}
}

//上側ユーザ接触
let upper_avatar_collision = function(x,y,ex,ey,hight){
    if(Math.abs(y-ey)< hight && y-ey > 0 && Math.abs(x-ex)<hight){
        return false;
    }
    else{
        return true;
    }
};

//下側ユーザ接触
let under_avatar_collision = function(x,y,ex,ey,hight){
    if(Math.abs(y-ey)< hight && y-ey <= 0 && Math.abs(x-ex)<hight){
        return false;
    }
    else{
        return true;
    }
};

//左側ユーザ接触
let left_avatar_collision = function(x,y,ex,ey,wide){
    if(Math.abs(x-ex)< wide && x-ex >= 0 && Math.abs(y-ey)<wide){
        return false;
    }
    else{
        return true;
    }
};

//右側ユーザ接触
let right_avatar_collision = function(x,y,ex,ey,wide){
    if(Math.abs(x-ex)< wide && x-ex < 0 && Math.abs(y-ey)<wide){
        return false;
    }
    else{
        return true;
    }
};

//アイテムの接触判定（アイテムは座標間の距離で測っているので上下左右はない）
let item_collision = function(x,y,ix,iy,size,isize){
    if(Math.abs(ix - x) + Math.abs(iy - y) < (size + isize) / 2){
        return true;
    }
};

let main = setInterval(()=>{
    for(var i = 0;i < User.length ;i++){
        if(User[i] != undefined){
            point_update(move(Genre,User[i].x,User[i].y,User[i].angle,User[i].up,User[i].dow,User[i].lef,User[i].rig,User[i].jump,User[i].acsell,i),i);
            io.sockets.emit('Server to Client',User,item_list,time);    
        }
    }
},1000/initData.max_move);


var winner = {
    score:0,
    num:0
};

let GaameEnd = setInterval(()=>{
    if(time>0){
        time--;
    }
    else{
        clearInterval(main);
        for (let i = 0; i < User.length; i++) {
            if(User[i].score >= winner.score){
                winner.score = User[i].score;
                winner.num = i;
            }
        }
        io.sockets.emit("Gaame End",winner.num,winner.score)
        clearInterval(GaameEnd);
    }
},1000)

let point_update = function(state,num){
    User[num].x = state.x;
    User[num].y = state.y;
    User[num].angle = state.angle;
    User[num].jump = state.jump;
    User[num].acsell = state.acsell;
    User[num].score = state.score;
}