const video = document.createElement('video')
const vidDiv = document.getElementById('vidDiv')
video.setAttribute('width', 255);
video.setAttribute('height', 255);
video.autoplay = true
//vidDiv.appendChild(video)
window.onload = switchBackground();

navigator.mediaDevices.getUserMedia({ video: true, audio: false })
  .then(function(stream) {
  video.srcObject = stream;
})

  .catch(function(err) {
  console.log("An error occurred! " + err);
});

const options = {
  flipHorizontal: true,
  minConfidence: 0.2
}

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, (innerWidth/2)/(innerHeight/2), 10.1, 1000 );
camera.position.set( 0, 0, 20 );

var renderer = new THREE.WebGLRenderer({
  antialias:false,alpha: true
  // preserveDrawingBuffer:false
});
renderer.autoClear=true;

renderer.setSize( innerWidth, innerHeight );
document.body.appendChild( renderer.domElement );

var directionalLight = new THREE.HemisphereLight( 0x0000ff, 0x00ff00, 1.4 );
scene.add( directionalLight );

var mat1 = new THREE.MeshLambertMaterial({color: 0x00ff00});
var matw = new THREE.LineBasicMaterial( {
	color: 0xffffff,
	linewidth: 1
});
var matn = new THREE.MeshNormalMaterial();

var model = new THREE.Object3D;
var model1;
var model2;
var models = []
models.push(model1,model2);

var leftHand = new THREE.Object3D;
var rightHand = new THREE.Object3D;

var oloader = new THREE.OBJLoader();
var loader = new THREE.FBXLoader();
loader.load( 'models/head.fbx', function ( object ) {
  model1 = object;
  model1.scale.set(20,20,20);
  model1.visible = true;
  model.add(model1);
});
loader.load( 'models/head2.fbx', function ( object ) {
  model2 = object;
  model2.material = matn;
  model2.scale.set(20,20,20);
  model2.quaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), Math.PI / 2 );
  model2.position.z -=5;
  model2.position.x -=4;
  model.add(model2);
  model2.visible = false;
});
loader.load( 'models/head3.fbx', function ( object ) {
  model3 = object;
  model3.material = matn;
  model3.scale.set(20,20,20);
  model.add(model3);
  model3.visible = false;
});
loader.load( 'models/head4.fbx', function ( object ) {
  model4 = object;
  model4.material = matn;
  model4.scale.set(20,20,20);
  model.add(model4);
  model4.visible = false;
});
scene.add( model );

loader.load( 'models/lefthand.fbx', function ( object ) {
  leftHand = object;
  leftHand.scale.set(30,30,20);
  leftHand.quaternion.setFromAxisAngle( new THREE.Vector3( -1, 0, 0 ), Math.PI / 2 );
  leftHand.visible = true;
  scene.add( leftHand );
});

loader.load( 'models/hand.fbx', function ( object ) {
  rightHand = object;
  rightHand.scale.set(30,30,20);
  rightHand.quaternion.setFromAxisAngle( new THREE.Vector3( -1, 0, 0 ), Math.PI / 2 );
  rightHand.visible = true;
  scene.add( rightHand )
  rightHand.material=mat1;
});
var environment = new THREE.Object3D;
loader.load( 'models/crowd.fbx', function ( object ) {
  environment = object;
  environment.scale.set(150,150,150);
  environment.visible = true;
  environment.position.z +=50;
  environment.position.x +=10;
  environment.position.y -=50;
  scene.add( environment );
  environment.material=matn;
});

var bodyModels = [model, leftHand, rightHand];

 document.addEventListener("click", function(){
   updateModel();
   //switchBackground();
 });

const poseNet = ml5.poseNet(video, options, model)

let pose = []

function bodyPart (x, y, bmodel) {
  this.x = x;
  this.y = y;
  this.bmodel = bmodel;
}

poseNet.on('pose',  function(poses) {
  if (poses[0] == undefined) return;
  let results = loopThroughPoses(poses);
  environment.rotation.y += Math.random()/15;
  directionalLight.color.setHex( Math.random() * 0xffffff);
});

function loopThroughPoses (poses){
  let results = [];
  for (let i = 0; i < poses.length; i++){
    let temp_pose = poses[i].pose;
    let keyPoints = [temp_pose.keypoints[0], temp_pose.keypoints[9], temp_pose.keypoints[10]];
    for (let j = 0; j < 3; j++) {
      if (keyPoints[j].score > 0.2) {
        let temp_model;
        switch (j) {
          case 0:
            temp_model = model;
            break;
          case 1:
            temp_model = leftHand;
            break;
          case 2:
            temp_model = rightHand;
            break;
          default:
            break;
        }
        temp_model.position.x = (keyPoints[j].position.x *.15) - 15;
        temp_model.position.y = (keyPoints[j].position.y * -.12) + 16;
        scene.add(temp_model);
        renderer.render(scene, camera);
      }
    }
  }
  return results;
}

// remember that nose is just an empty object like so {} //

function updateModel() {
  if(model1.visible){
    model1.visible=false
    model2.visible=true
  } else if(model2.visible){
    model2.visible=false
    model3.visible=true;
  } else if(model3.visible){
    model3.visible=false
    model4.visible=true;
  } else if(model4.visible){
    model4.visible=false
    model1.visible=true;
  }
};

function switchBackground(){
  let index = Math.floor(Math.random() * 6);
  let bgImg;
  switch (index) {
    case 0:
      bgImg = "6.gif"
      break;
    case 1:
      bgImg = "2.jpg"
      break;
    case 2:
      bgImg = "glitter_flag.gif"
      break;
    case 3:
      bgImg = "4.gif"
      break;
    case 4:
      bgImg = "5.png"
      break;
    case 5:
      bgImg = "3.png"
      break;
    default:
      break;
  }
  document.body.style.backgroundImage = "url('images/" + bgImg + "')"
}

function randomColor(){
  var letters = "0123456789ABCDEF";
  // html color code starts with #
  var color = '#';

  // generating 6 times as HTML color code consist
  // of 6 letter or digits
  for (var i = 0; i < 6; i++){
     color += letters[(Math.floor(Math.random() * 16))];}
   console.log(color);
  return color
}
