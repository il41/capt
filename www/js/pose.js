let video;
let poseNet;
let poses = [];

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
  video.hide();
}

function draw() {
  image(video, 0, 0, width, height);
  drawKeypoints();
}


function drawKeypoints()  {
  // Loop through all poses detected
  for (let i = 0; i < poses.length; i++) {
    let nose = poses[i].pose.keypoints[0];
    //TODO: broadcast keypoints to Threejs script
  }
}