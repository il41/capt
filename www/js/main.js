const video = document.createElement('video')
const vidDiv = document.getElementById('vidDiv')
video.setAttribute('width', 255);
video.setAttribute('height', 255);
video.autoplay = true
vidDiv.appendChild(video)

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
 });

const poseNet = ml5.poseNet(video, options, model)

let nose = {}

poseNet.on('pose',  function(results) {
  let poses = results;
  loopThroughPoses(poses, nose)
    let estimatedNose = {
      x: nose.x,
      y: nose.y
   }
  if (estimatedNose.x && estimatedNose.y){
    // console.log(estimatedNose.x )
    render(estimatedNose, model)
  }
});


let lastXPosition = 100;
let lastYPosition = 100;

let changeX = 1;
let changeY = 1;


function loopThroughPoses (poses, nose){

  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      if (keypoint.score > 0.2 && keypoint.part === 'nose' ) {
         nose.x = keypoint.position.x
         nose.y = keypoint.position.y
       }
    }
  }
}



// remember that nose is just an empty object like so {} //

const render = function (nose, model ) {
  changeX = nose.x - lastXPosition
  changeY = nose.y - lastYPosition

  model.position.x = (changeX * 0.12)
  model.position.y = -(changeY * 0.12)
  // console.log(model.position.x);
  renderer.render(scene, camera);
}

function updateModel() {
  if(model1.visible==true){
    model1.visible=false
    model2.visible=true
  } else if(model2.visible==true){
    model2.visible=false
    model1.visible=true;
  }
};
