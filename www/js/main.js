var videoSrc;

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
      videoSrc = stream;
      console.log("got vid")
    })
    .catch(function (err0r) {
      console.log("Something went wrong!");
    });
}

function setup(){
  var poses = []
  var posenet = ml5.poseNet(video, modelReady);

  poseNet.on('pose', function (results) {
    poses = results;
  });
}

function run() {
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoint
    console.log("nose: " + poses[i].pose.keypoints[0]);
      //DO SOMETHING THREEJS
}

