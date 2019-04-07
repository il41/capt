var videoSrc;
var posenet;
var skeletons = [];
var poses = [];

function setup(){
  videoSrc = createCapture(VIDEO);
  video.size(windowWidth, windowHeight)
  posenet = ml5.poseNet(videoSrc);

  posenet.on('pose', function (results) {
    poses = results;
    console.log("got pose");
    drawPose();
  });
}

function drawPose() {
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoint
    console.log("nose: " + poses[i].pose.keypoints[0]);
      //DO SOMETHING THREEJS
  }
}