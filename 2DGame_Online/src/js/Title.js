/*タイトル画面の処理まとめ*/

var TitleLoop;//画面更新
//画面のフォント定義
var Font = ['メイリオ','Meiryo UI','Yu Gothic','Yu Mincho Light','YuMincho','Yu Mincho','游明朝体','Yu Gothic UI','ＭＳ ゴシック','MS UI Gothic','ＭＳ Ｐ明朝','MS PMincho','Arial','Arial Black','Calibri','Cambria','Cambria Math','Candara','Consolas','Comic Sans MS','Constantia','Corbel','Courier','Ebrima','Franklin Gothic Medium','Gabriola','Gadugi','Georgia','Impact','Javanese Text','Leelawadee UI','Lucida Console','Modern','Mongolian Baiti','MS Sans Serif','Mv Boli']

//タイトル文字の表示箇所
var TitleFont = {
    Font : "2DGame Online",
    size : 0.2,
    PointX : 0.5,
    PointY : 0.2
} 

//Joinボタンの表示箇所
var ButtonPoint = {
    Font : "Game Join",
    size : 20,
    PointX : 300,
    PointY : 300,
    width : 100,
    height : 50
} 

//タイトルの表示
let Title = function(){



}

//画面更新
let TitlteUpdate = function(){

    ctx.clearRect(0, 0,canvas.width,canvas.height);
    ctx.beginPath();
    
    //画面幅表示
    ctx.strokeRect(0, 0,canvas.width,canvas.height);

    //タイトル描画
    ctx.font = canvas.height * TitleFont.size + "px " + Font[Math.floor(Math.random()*Font.length)];
    ctx.fillText("2DGame Online",
        (canvas.width * TitleFont.PointX) - (canvas.width * TitleFont.size / 2),
        (canvas.height * TitleFont.PointY) + (canvas.height * TitleFont.size / 2),
        canvas.width * TitleFont.size
    )

    //Join描画
    ctx.font = ButtonPoint.size + "px 'メイリオ'";
    ctx.fillText(ButtonPoint.Font,
        ButtonPoint.PointX,
        ButtonPoint.PointY + (ButtonPoint.size + ButtonPoint.height) / 2,
        ButtonPoint.width)
}

let BottunFunc = function(e){
    
    var button = e.target.getBoundingClientRect();
    mouseX = e.clientX - button.left;
    mouseY = e.clientY - button.top;

    if(ButtonPoint.PointX < mouseX && mouseX < ButtonPoint.PointX + ButtonPoint.width){
        if(ButtonPoint.PointY < mouseY && mouseY < ButtonPoint.PointY + ButtonPoint.height){
            ButtonClick()
            window.removeEventListener('click', BottunFunc);
        }
    }
}


//JoinButtonクリック時
function ButtonClick(){
    clearInterval(TitleLoop);
    ctx.font = "'serif'";

    GameStert();
} 
