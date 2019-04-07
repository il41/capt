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
 function draw(){
//console.log(level);
   cubeCluster.rotation.y += 4.001;
  // cubeCluster.rotation.z += 2;
  // cubeCluster.rotation.x += 0.001;
  //cubeCluster.rotation.x += (Math.sin( Date.now()*0.02)*0.01 );


  renderer.render(scene, camera);

 }
 //draw()
setInterval(draw, 1 );
