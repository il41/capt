const video = document.createElement('video')
const vidDiv = document.getElementById('vidDiv')
video.setAttribute('width', 255);
video.setAttribute('height', 255);
video.autoplay = true
vidDiv.appendChild(video)
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

var directionalLight = new THREE.HemisphereLight( 0x0000ff, 0x00ff00, 0.6 );
scene.add( directionalLight );

var model = new THREE.Object3D;
var model1;
var model2;
var models = []
models.push(model1,model2);

var leftHand = new THREE.Object3D;
var rightHand = new THREE.Object3D;

var loader = new THREE.FBXLoader();
 loader.load( 'models/ghostface.fbx', function ( object ) {
  model1 = object;
  model1.scale.set(20,20,20);
  model.add(model1);
 });
 loader.load( 'models/arrow.fbx', function ( object ) {
  model2 = object;
  model2.scale.set(20,20,20);
  model.add(model2);
  model2.visible = false;
 });
  scene.add( model );

  loader.load( 'models/ghostface.fbx', function ( object ) {
   leftHand = object;
   leftHand.scale.set(2,2,2);
   leftHand.visible = true;
  });
   scene.add( rightHand );
   loader.load( 'models/ghostface.fbx', function ( object ) {
    rightHand = object;
    rightHand.scale.set(2,2,2);
    rightHand.visible = true;
   });
    scene.add( rightHand );

var bodyModels = [model, leftHand, rightHand];
console.log(bodyModels);

 document.addEventListener("click", function(){
   updateModel();
   //switchBackground();
 });

const poseNet = ml5.poseNet(video, options, model)

let pose = []

function bodyPart (x, y, dx, dy, model) {
  this.x = x;
  this.y = y;
  this.model = model;
}

poseNet.on('pose',  function(poses) {
  if (poses[0] == undefined) return;
  if (bodyModels[0] =! undefined){
    let results = loopThroughPoses(poses);
    for (i=0; i < results.length; i++) {
      render(results[i]);
    }
  }
});

function loopThroughPoses (poses){
  let results = [];
  for (let i = 0; i < poses.length; i++){
    let temp_pose = poses[i].pose;
    let keyPoints = [temp_pose.keypoints[0], temp_pose.keypoints[9], temp_pose.keypoints[10]];
    for (let j = 0; j < 3; j++) {
      if (keyPoints[j].score > 0.2) {
        results.push(new bodyPart(keyPoints[j].position.x, keyPoints[j].position.y, bodyModels[j]));
      }
    }
  }
  return results;
}

// remember that nose is just an empty object like so {} //

const render = function (bodypart) {
  bodypart.model.position.x = x * .12;
  bodypart.model.position.y = y * .12;
  // console.log(model.position.x);
  renderer.render(scene, camera);
  console.log("rendering");
}

function updateModel() {
  if(model1.visible){
    model1.visible=false
    model2.visible=true
  } else if(model2.visible){
    model2.visible=false
    model1.visible=true;
  }
};

function switchBackground(){
  let index = Math.floor(Math.random() * 4);
  let bgImg;
  switch (index) {
    case 0:
      bgImg = "1.png"
      break;
    case 1:
      bgImg = "2.jpg"
      break;
    case 2:
      bgImg = "3.png"
      break;
    case 3:
      bgImg = "4.gif"
      break;
    default:
      break;
  }
  document.body.style.backgroundImage = "url('images/" + bgImg + "')"
}
