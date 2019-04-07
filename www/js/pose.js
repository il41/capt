let video;
let poseNet;
let poses = [];
let noseX = 0;
let noseY = 0;
let model

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, 'multiple');
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  //video.hide();
}


var scene = new THREE.Scene();
var threeCamera = new THREE.PerspectiveCamera( 75, (innerWidth/2)/(innerHeight/2), 10.1, 1000 );
threeCamera.position.set( 0, 0, 20 );

var renderer = new THREE.WebGLRenderer({
  antialias:false,alpha: true
  // preserveDrawingBuffer:false
});
renderer.autoClear=true;

renderer.setSize( innerWidth, innerHeight );
document.body.appendChild( renderer.domElement );

var directionalLight = new THREE.HemisphereLight( 0x0000ff, 0x00ff00, 0.6 );
scene.add( directionalLight );
var mat1 = new THREE.MeshLambertMaterial ( { color: 0x0000ff } );
var cubeCluster
 function makeCubes(){
   var Cgeometry = new THREE.BoxGeometry(  1, 1, 1, );

   cubeCluster = new THREE.Object3D();

  for( var i=0; i < 15; i+= 1){
    var cube = new THREE.Mesh( Cgeometry, mat1 );
    cube.position.x = Math.random() * 10 -5
    cube.position.y = Math.random() * 10 -5
    cube.position.z = Math.random() * 10 -5
    cubeCluster.add( cube );

    //makeCubes();
    console.log('hey',i)
    }

   scene.add( cubeCluster );
  }
  function newCubes(){
    cubeCluster = 0;
  }
// makeCubes();

var loader = new THREE.FBXLoader();
 console.log(loader);
 loader.load( 'models/ghostface.fbx', function ( object ) {
  model = object;
  model.scale.set(20,20,20);;
  console.log(model);
  scene.add( model );
 });

 // setTimeout( draw, 1000 );
makeCubes();




monitor = getElementById("monitor");


function draw() {
  image(video, 0, 0, width, height);
  drawKeypoints();
  cubeCluster.rotation.y += 0.01;
   model.position.x = -noseX/(width/2);
  // model.position.y = noseY/100;
monitor.innerHTML = noseX;

 renderer.render(scene, threeCamera);
}

//
// function animate(){
//
// }
//
// setInterval(animate,1);

function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = poses[i].pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
        noseX = keypoint.position.x;
        noseY = keypoint.position.y;
      }
    }
  }
}
