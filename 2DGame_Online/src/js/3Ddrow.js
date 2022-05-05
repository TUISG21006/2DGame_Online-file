//====================[試作の3D描画関数]===================
//シーン、カメラ、レンダラー、ジオメトリー、
let scene,camera,renderer,cubeGeometry ,cubeMaterial , cube ;
//オブジェクトの配置個数
let ThreeItemNum = 0;
let ThreeAttackNum = 0;

//シーンへの追加処理
let CreateMap = function() {
    scene = new THREE.Scene();// シーンの作成
    // カメラの作成
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // レンダーの作成
    renderer = new THREE.WebGLRenderer();
    canvas.width = 0;  // サイズ変更
    canvas.height = 0; // サイズ変更
    renderer.setClearColor(new THREE.Color(0xEEEEEE));
    renderer.setSize(720,480);

    // カメラの初期宣言
    camera.position.x = 0;
    camera.position.y = 500;
    camera.position.z = 500;
    camera.lookAt(scene.position);

    // レンダラーの出力をhtml要素に追加する
    document.getElementById("WebGL-output").appendChild(renderer.domElement);

    for(var i = 0;i < AvaterData.length;i++){
        addCube(AvaterData[i].x,AvaterData[i].y,Init.block_size,0xff0000,"Avater");
    }

    //マップの描画
    for(var i = 0;i < Map.length;i++){
        for (var j = 0; j < Map[i].length; j++) {
            if(Map[i][j] == 1){
                addCube(j * Init.block_size , i * Init.block_size,Init.block_size,0x000000);
            }
        }
    }

    //アイテムの描画
    for(var i = 0;i < ItemData.length;i++){
        addSphere(ItemData[i].x,ItemData[i].y,Init.item_size,0x7777ff,"Item");
    }

    // 画面に表示
    renderer.render(scene, camera);
}

//アイテムを配置する配置関数
let ThreeAvaterNum = 0;
// Cubeを配置する関数
function addCube(x,y,size,color = 0xffffff,type = ""){
	var cube = createCube(size, color, x, 0, y);

    //アバター専用の追加処理（命名とアイテムオブジェクトの加算処理）
    if(type == "Avater"){
        cube.name = "myCube" + ThreeAvaterNum;
        ThreeAvaterNum++;
    }

    //その他の追加処理
    else{
	    cube.name = "myCube";
    }

	scene.add(cube);
}

//アイテムを配置する配置関数

function addSphere(x,y,size,color = 0x000000,type = ""){
	var sphere = createSphere(size, color, x, 0, y);

    //アイテム専用の追加処理（命名とアイテムオブジェクトの加算処理）
    if(type == "Item"){
        sphere.name = "mySphere" + ThreeItemNum;
        ThreeItemNum++;
    }
    
    //攻撃専用の追加処理（命名とアイテムオブジェクトの加算処理）
    else if(type == "Attack"){
        sphere.name = "Attack" + ThreeAttackNum;
        ThreeAttackNum++;
    }
    
    //その他の追加処理
    else{
        sphere.name = "mySphere";
    }
	scene.add(sphere);
}

//キューブを作成
function createCube(size, color, x, y, z){
	var geometry = new THREE.BoxBufferGeometry(size, size, size);
	var material = new THREE.MeshBasicMaterial({color: color});
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x, y, z);
	return mesh;
}

//球体を作成
function createSphere(size, color, x, y, z){
    var geometry = new THREE.SphereGeometry(size, size, size);
    var material = new THREE.MeshBasicMaterial({color: color});
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
	return mesh;
}

//3D用オブジェクトのチェックメソッド
let Three_Obj_Check = function(){
    var obj;//シーンの内容を参照する

    //アイテムのチェック
	for(var i=0; i < ItemData.length; i++){
        obj = scene.children[i];
        if(ItemData[i].get&&scene.children.findIndex((e) => e.name === "mySphere"+i) != -1){
            scene.children.splice(scene.children.findIndex((e) => e.name === "mySphere"+i),1);
        }
	}
    //アバタのチェック
    for(var i = 0; i < AvaterData.length; i++){
        if(scene.children.findIndex((e) => e.name === "myCube" + i) != -1){
            obj = scene.children[scene.children.findIndex((e) => e.name === "myCube" + i)];
            obj.position.x = AvaterData[i].x;
            obj.position.z = AvaterData[i].y;
            obj.rotation.y = -AvaterData[i].angle
            camera.lookAt(10,10,10)
        }else{
            addCube(AvaterData[i].x,AvaterData[i].y,Init.block_size,0xff0000,"Avater");
        }
	}
    
    //攻撃のチェック
    for(var i = 0; i < AttackData.length; i++){
        if(scene.children.findIndex((e) => e.name === "Attack" + i) != -1){
            obj = scene.children[scene.children.findIndex((e) => e.name === "Attack" + i)];
            obj.position.x = AttackData[i].x;
            obj.position.z = AttackData[i].y;
        }else{
            console.log(scene.children[i].name);
            addSphere(AttackData[i].x,AttackData[i].y,Init.bullet_size,0x00ff00,"Attack");
        }
	}
    
}

let Three_drow = function(){
    Three_Obj_Check();
    
    scene.remove( scene );
    camera.lookAt(scene.children[scene.children.findIndex((e) => e.name === "myCube"+My_num)].position);
    
    //主観表示にする場合
    //camera.position.x = scene.children[scene.children.findIndex((e) => e.name === "myCube"+My_num)].position.x;
    //camera.position.z = scene.children[scene.children.findIndex((e) => e.name === "myCube"+My_num)].position.z;
    //camera.position.y = scene.children[scene.children.findIndex((e) => e.name === "myCube"+My_num)].position.y;
    //camera.rotation.y = -AvaterData[My_num].angle;

    renderer.render(scene, camera);
}