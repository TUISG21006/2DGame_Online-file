var ResultLoop;
var Rank = 1;

//Joinボタンの表示箇所
var reason = {
    Font  ,
    size : 20,
    PointX : 300,
    PointY : 300,
    width : 100,
    height : 50
} 

let Result = function(){
    if(drowD == 2){
    }
    else{
        scene.remove( scene );
        scene = []
        canvas.width = Init.wide;  // サイズ変更
        canvas.height = Init.hight; // サイズ変更
        ctx.clearRect(0, 0,Init.wide,Init.hight);
        ctx.beginPath();
    }
    alert("GAME OVER");
    //画面のリフレッシュ（10fps)
    ResultLoop = setInterval(ResultUpdate,100);

    //Joinボタン追加
    window.addEventListener('click',TitleBack, false);

    for (let i = 0; i < AvaterData.length; i++) {
        Rank = (AvaterData[i].score > AvaterData[My_num].score ? Rank + 1:Rank)
    }
}

let ResultUpdate = function(){
    console.log(Rank);
    ctx.clearRect(0, 0,Init.wide,Init.hight);
    ctx.beginPath();
    
    //画面幅表示
    ctx.strokeRect(0, 0,canvas.width,canvas.height);

    //タイトル描画
    ctx.fillStyle = "black";
    ctx.font = canvas.height * TitleFont.size + "px " + Font[Math.floor(Math.random()*Font.length)];
    ctx.fillText("GAME OVER",
        (canvas.width * TitleFont.PointX) - (canvas.width * TitleFont.size / 2),
        (canvas.height * TitleFont.PointY) + (canvas.height * TitleFont.size / 2),
        canvas.width * TitleFont.size
    )
    if(Time <= 0){
        reason.Font = "Time out"
    }else{
        reason.Font = "HP out"
    }
    ctx.font = canvas.height * TitleFont.size/2 + "px " + Font[Math.floor(Math.random()*Font.length)];
    ctx.fillText(reason.Font,
        (canvas.width * TitleFont.PointX) - (canvas.width * TitleFont.size/2),
        (canvas.height * TitleFont.PointY) + (canvas.height * TitleFont.size),
        canvas.width * TitleFont.size
    )


    //Join描画
    ctx.font = ButtonPoint.size + "px 'メイリオ'";
    ctx.fillText("Back to Title",
        ButtonPoint.PointX,
        ButtonPoint.PointY + (ButtonPoint.size + ButtonPoint.height) / 2,
        ButtonPoint.width)
}

//JoinButtonクリック時
let TitleBack = function(){
    // reloadメソッドによりページをリロード
    AvaterData = [];          //ユーザ情報の読み込み
    Map = [];                  //地形情報の読み込み
    Init = [];                //基本設定の読み込み
    My_num = null;   //操作番号の割り当て
    ItemData = [];            //アイテムデータの読み込み
    chara = {};    //アバタ描画処理の読み込み
    Time = null;
    window.location.reload();
} 
