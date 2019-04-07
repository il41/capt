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

 document.addEventListener("click", function(){
   updateModel();
   //switchBackground();
 });

const poseNet = ml5.poseNet(video, options, model)

let pose = []

poseNet.on('pose',  function(poses) {
  if (poses[0] == undefined) return;
  loopThroughPoses(poses, pose);
  let estimatedPose = {
    noseX: pose[0],
    noseY: pose[1],
    lhX: pose[2],
    lhY: pose[3],
    rhX: pose[4],
    rhY: pose[5]
  }
  if (estimatedPose.noseX && estimatedPose.noseY){
    render(estimatedPose, model)
  }
});

let lastXPosition = 100;
let lastYPosition = 100;

let changeX = 1;
let changeY = 1;

function loopThroughPoses (poses, pose){
    let temp_pose = poses[0].pose;
    let keyPoints = [temp_pose.keypoints[0], temp_pose.keypoints[9], temp_pose.keypoints[10]];
    for (let i = 0; i < 3; i++) {
      if (keyPoints[i].score > 0.2) {
         pose[2*i] = keyPoints[i].position.x
         pose[2*i + 1] = keyPoints[i].position.y
      }
  }
}

// remember that nose is just an empty object like so {} //

const render = function (pose, model ) {
  changeX = pose.noseX - lastXPosition
  changeY = pose.noseY - lastYPosition

  model.position.x = (changeX * 0.12)
  model.position.y = -(changeY * 0.12)
  // console.log(model.position.x);
  renderer.render(scene, camera);
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
