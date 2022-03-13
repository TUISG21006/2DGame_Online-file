const mapData= require('./map.json'); 
const initData= require('./data.json'); 

var express = require("express"),app = express(),http = require("http"),server = http.createServer(app),io = require("socket.io").listen(server);

app.use("/", express.static(__dirname+"/Client")); 
server.listen(initData.port);


var user_list = []
var user_count = 0;
var room_num = 0;
let item_list = [];
for(var i = 0;i<initData.item;i++){
    item_list.push({"x":Math.floor(Math.random()*650+initData.sizeh),"y":Math.floor(Math.random()*290+initData.sizeh),get:false})
}

io.sockets.on('connection', function(socket) {
    //initData.user_setx = Math.floor(Math.random()*720);
    initData.user_setx = initData.user_setx;
    //initData.user_sety = Math.floor(Math.random()*300);
    initData.user_sety = initData.user_sety;
    var room;
    console.log(socket.id);
    socket.on("room_in",function(){
        user_list.push(socket.id)
        user_count ++;
        if(user_count%2 == 0){
            room = room_num;
            socket.join(room);
            room_num++;
        }
        socket.emit("Initial_setting",initData,mapData,user_count,item_list);
    });

    socket.on("Avater_move",function(x,y,angle,num){
        room = Math.floor((num)/2);
        socket.broadcast.emit("Avater_move",x,y,angle,num);
    });

    // 切断時の処理
    // ・クライアントが切断したら、サーバー側では'disconnect'イベントが発生する
    socket.on('disconnect',() =>{
        io.sockets.emit("disconnect",user_list.indexOf(socket.id))
        console.log(user_list.indexOf(socket.id)," ",socket.id,' is ' ,'disconnect. User Count is', user_count);
    });

    socket.on('Client_Synchoro',(time,item)=>{
        socket.broadcast.emit('Client_Synchoro',time,item)
    });
    socket.on('Item_get',(i)=>{
        socket.broadcast.emit('Item_get',i)
    });
    socket.on('Battle_Synchoro',(i)=>{
        socket.broadcast.emit('Battle_Synchoro',i)
    });
});