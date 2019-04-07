const videoSrc;

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

