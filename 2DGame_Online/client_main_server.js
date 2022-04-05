const mapData= require('./map.json'); 
const initData= require('./data.json'); 
//var f = require('./test.js');
//f.func();

var express = require("express"),app = express(),http = require("http"),server = http.createServer(app),io = require("socket.io").listen(server);

app.use("/", express.static(__dirname+"/Client")); 
server.listen(initData.port);


var user_list = []
var user_count = -1;
var room_num = 0;
var counter = 0;
var time = initData.limit_time;
let item_list = [];
let room_limit = 2;



var Genre = initData.Genre;
var sizeh = initData.sizeh;
var sizew = initData.sizew;
var map = mapData.map;
var block_size = initData.block_size
var gravity = initData.gravity

var item_size = initData.item_size

var jump_pow = initData.jump_pow
var time = initData.limit_time;

var rotation = initData.rotation;//回転速度

var max_spead = initData.max_spead;//レース操作時最大速度
var friction = initData.friction;//摩擦係数

//ID管理用の配列
let User = [];

//座標管理用（クライアント：true）
let flag_a = false;
//アイテム管理用（クライアント：true）
let flag_b = initData.Synchro_Item;
//時間管理用（クライアント：true）
let flag_c = initData.Synchro_Time;
//攻撃管理用（クライアント：true）
let flag_d = initData.Synchro_Time;
//完全同期（true）：不完全同期（false）
let flag_e = true;

for(var i = 0;i<initData.item;i++){
    item_list.push({"x":Math.floor(Math.random()*650+initData.sizeh),"y":Math.floor(Math.random()*290+initData.sizeh),get:false})
}

let create_avater = function(x,y,angle,jump,acsell,score,up,down,left,right){
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.jump = jump;
    this.acsell = acsell;
    this.score = score;
    this.up = up,
    this.down = down,
    this.left = left,
    this.right = right
}

io.sockets.on('connection', function(socket) {
    //initData.user_setx = Math.floor(Math.random()*720);
    initData.user_setx = initData.user_setx;
    //initData.user_sety = Math.floor(Math.random()*300);
    initData.user_sety = initData.user_sety;
    var room;
    console.log(socket.id);
    console.log(counter)

    //ユーザが入室時
    socket.on("room_in",function(){
        
        //ユーザをクライアントが管理する場合IDのみ
        User.push(socket.id);
        user_list.push(new create_avater(initData.user_setx,initData.user_sety,0,1.0,0,0));
        
        //ユーザ数加算
        user_count ++;

        //部屋振り分け処理
        if(user_count%room_limit == 0){
            room = room_num;
            socket.join(room);
            room_num++;
        }

        //バグの排除
        if(user_count <= 0){
            user_count = 0;
        }

        socket.emit("Initial_setting",initData,mapData,user_count,item_list,time);
    });

    //アバタがクライアントで移動した際の処理
    socket.on("Avater_move",function(x,y,angle,num,hp){
        room = Math.floor((num)/2);
        socket.broadcast.emit("Avater_move",x,y,angle,num,hp);
    });

    // 切断時の処理
    // ・クライアントが切断したら、サーバー側では'disconnect'イベントが発生する
    socket.on('disconnect',() =>{

        io.sockets.emit("disconnect",User.indexOf(socket.id));
        console.log(User.indexOf(socket.id)," ",socket.id,' is ' ,'disconnect. User Count is', user_count);
        

        user_list.splice(User.indexOf(socket.id),1);
        User.splice(User.indexOf(socket.id),1);

        user_count--;
        if(user_list.length < counter){
            counter = user_list.length
        }
    });

    socket.on('Client_Synchoro_time',(time2)=>{
        //time = time2;
        if(flag_c)socket.broadcast.emit('Client_Synchoro',time2);
    });

    socket.on('Client_Synchoro_item',(item)=>{
        //item_list = item;
        //socket.broadcast.emit('Client_Synchoro',item)
    });

    //
    socket.on('Client_Synchoro_avater',(num,flag,avater)=>{
        if(!flag_a && user_list[num] != undefined){
            user_list[num].up = flag.up;
            user_list[num].down = flag.down;
            user_list[num].right = flag.right;
            user_list[num].left = flag.left;
            
        }
        point_update(move(Genre,
            user_list[num].x,
            user_list[num].y,
            user_list[num].angle,
            user_list[num].up,
            user_list[num].down,
            user_list[num].left,
            user_list[num].right,
            user_list[num].jump,
            user_list[num].acsell,
            num),num);

            io.sockets.emit('Server_to_Client',user_list); 
    });


    //アイテム管理用関数
    socket.on('Item_get',(i)=>{
        if(flag_b){
            socket.broadcast.emit('Item_get',i)
            item_list[i].get = true;
        }
        else{
            item_list[i].get = true;
        }

    });
    
    if(!flag_b){
            var item_syn = setInterval(()=>{
                io.sockets.emit("Client_Synchoro_item",item_list);
            },60);
        

    }

    //
    socket.on('Battle_Synchoro',(i)=>{
        socket.broadcast.emit('Battle_Synchoro',i)
    });


    socket.on("DROW",()=>{
        counter++;
        if(counter==user_list.length){
            io.sockets.emit("DROW");
            counter = 0;
        }
    })

    socket.on('Heart Beat',()=>{
        counter++;
        if(counter==user_list.length){
            io.sockets.emit("Server_to_Client Move");
            counter = 0;
        }
    })

});

//Server側の動作処理。エクスポートさせ今後は別ファイルに移行予定
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

    var new_score = score;

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
    if(!upper_collision(new_x,new_y,sizew,sizeh)
    ||!under_collision(new_x,new_y,sizew,sizeh)){
        new_y = y ;
        if(Genre == 1)new_jump = 0;
    }

    //左右壁接触時
    if(!left_collision(new_x,new_y,sizew,sizeh)
    ||!right_collision(new_x,new_y,sizew,sizeh)){
        new_x = x;
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

var winner = {
    score:0,
    num:0
};


let point_update = function(state,num){
    user_list[num].x = state.x;
    user_list[num].y = state.y;
    user_list[num].angle = state.angle;
    user_list[num].jump = state.jump;
    user_list[num].acsell = state.acsell;
    user_list[num].score = state.score;
}

//座標更新処理
if(!flag_a){
    let ain = setInterval(()=>{
        for(var i = 0;i < user_list.length ;i++){
            if(user_list[i] != undefined){
                point_update(move(Genre,
                    user_list[i].x,
                    user_list[i].y,
                    user_list[i].angle,
                    user_list[i].up,
                    user_list[i].down,
                    user_list[i].left,
                    user_list[i].right,
                    user_list[i].jump,
                    user_list[i].acsell,
                    i),i);
            }
        }
        if(!flag_e){
           io.sockets.emit('Server_to_Client',user_list); 
        }
    },1000/initData.max_move);
}

if(!flag_c){
    let Aur = setInterval(()=>{
        if(time > 0  ){
            time--;
            io.sockets.emit('Client_Synchoro',time);
        }else{
           // clearInterval(ain);
           // clearInterval(Aur);
            io.sockets.emit('Game_end');
        }

    },1000)
}