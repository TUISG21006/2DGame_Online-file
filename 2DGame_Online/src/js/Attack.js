//=====================[試作の攻撃関数]=======================
let AttackData = [];
let AttackMoveList = [];

let AttackAdd = function(id,x,y,angle)
{
    this.id = id;
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.time = 0;
    this.move = 3
}

//周囲旋回型の近接攻撃
AttackMoveList.push(function(num){
    AttackData[num].y = AvaterData[AvaterData.findIndex((e) => e.id === AttackData[num].id)].y + Init.sizew/2
    AttackData[num].x = AvaterData[AvaterData.findIndex((e) => e.id === AttackData[num].id)].x + Init.sizeh/2
    AttackData[num].y -= 50 * Math.cos(AttackData[num].angle);
    AttackData[num].x += 50 * Math.sin(AttackData[num].angle); 
    AttackData[num].angle += 0.1;
}) 

//直線進行型の遠距離攻撃
AttackMoveList.push(function(num){
    AttackData[num].y -= 1 * Math.cos(AttackData[num].angle);
    AttackData[num].x += 1 * Math.sin(AttackData[num].angle);
}) 