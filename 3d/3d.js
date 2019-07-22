var cursor = {x: 0, y: 0, active: false};
var originalCursor = {x: 0, y: 0}
window.addEventListener('mousemove', function (e) {
    cursor.y = e.pageY;
    cursor.x = e.pageX
    
    if(cursor.active){
        cameraRotation += (cursor.x - originalCursor.x) / 100
        cameraRotationVertical -= (cursor.y - originalCursor.y) / 100
        if(cameraRotationVertical > Math.PI * 3 / 8){
            cameraRotationVertical = Math.PI * 3 / 8
        }
        if(cameraRotationVertical < 0){
            cameraRotationVertical = 0
        }

        originalCursor.x = e.pageX
        originalCursor.y = e.pageY
    }
});

window.addEventListener('mousedown', function (e) {
    cursor.active = true;
    originalCursor.x = e.pageX
    originalCursor.y = e.pageY
});

window.addEventListener('mouseup', function (e) {
    cursor.active = false;
});

var keys = {
    87: {keydown: function(){}, keyup: function(){}, active: false}, // up
    83: {keydown: function(){}, keyup: function(){}, active: false}, // down
    65: {keydown: function(){}, keyup: function(){}, active: false}, // left
    68: {keydown: function(){}, keyup: function(){}, active: false}  // right
}

document.addEventListener('keydown', function (event) {
    if (keys[event.keyCode] == undefined) {
        return
    }
    keys[event.keyCode].keydown()
    keys[event.keyCode].active = true
})

document.addEventListener('keyup', function (event) {
    if (keys[event.keyCode] == undefined) {
        return
    }
    keys[event.keyCode].keyup()
    keys[event.keyCode].active = false
});

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.rotation.order = "XZY"
var clock = new THREE.Clock();
var loader = new THREE.GLTFLoader();

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var runnerTexture = new THREE.TextureLoader().load( 'exampleAnimation.png' );
var runnerTextureAlpha = new THREE.TextureLoader().load( 'exampleAnimationAlpha.png' );
annie = new TextureAnimator( runnerTexture, 10, 1, 10, 75 ); // texture, #horiz, #vert, #total, duration.
annieAlpha = new TextureAnimator( runnerTextureAlpha, 10, 1, 10, 75 ); // texture, #horiz, #vert, #total, duration.
var runnerMaterial = new THREE.MeshBasicMaterial( { map: runnerTexture, alphaMap: runnerTextureAlpha, side: THREE.DoubleSide, transparent: true } );
var runnerGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
var runner = new THREE.Mesh(runnerGeometry, runnerMaterial);
runner.position.set(0,0,0);
scene.add(runner);

var sphere = new THREE.Mesh( new THREE.SphereGeometry( .2, 10, 10 ),  new THREE.MeshBasicMaterial( {color: 0xffff00} ) );
sphere.position.y = 4
scene.add( sphere );

var background
loader.load('scene.gltf', function ( gltf ) { background = gltf.scene; scene.add( gltf.scene );}, function ( xhr ) {}, function ( error ) {});

var runnerPos = {x: 0, y: 0.9, z: 0}

//var controls = new THREE.OrbitControls( camera, renderer.domElement );

var directionalLight = new THREE.PointLight( 0xffffff, 1, 0, 1 );
directionalLight.position.set( 1, 4, 1 ).normalize();
scene.add( directionalLight );

var hemisphereLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, .4 );
scene.add( hemisphereLight );

var time = 0
var timeScale = .25
var cameraRotation = 0
var cameraRotationVertical = 0
var delta = 0 
var zoomLevel = 2

document.body.addEventListener('wheel',function(event){
    zoomLevel += event.deltaY / 15
    return false; 
}, false);

function animate() {
    delta = clock.getDelta() 
    time += delta * timeScale
    directionalLight.position.x = 7 * Math.cos(time * 2);
    directionalLight.position.z = 7 * Math.sin(time * 2);
    sphere.position.x = 5 * Math.cos(time * 2);
    sphere.position.z = 5 * Math.sin(time * 2);
    
    camera.position.y = 2 + zoomLevel * Math.sin(cameraRotationVertical) + runnerPos.y;
    camera.position.x = zoomLevel * 5 * Math.cos(cameraRotationVertical) * Math.cos(cameraRotation) + runnerPos.x;
    camera.position.z = zoomLevel * 5 * Math.cos(cameraRotationVertical) * Math.sin(cameraRotation) + runnerPos.z;
    camera.rotation.y = Math.PI / 2 + -cameraRotation;
    runner.rotation.y = -Math.PI / 2 + -cameraRotation;
    camera.rotation.x = cameraRotationVertical * Math.sin(-cameraRotation) * .6;
    camera.rotation.z = cameraRotationVertical * Math.sin(Math.PI / 2 - cameraRotation) * .6;
    annie.update(1000 * delta)
    annieAlpha.update(1000 * delta)

    if(keys[87].active){
        runnerPos.x -= .4 * Math.cos(cameraRotation)
        runnerPos.z -= .4 * Math.sin(cameraRotation)
    }    
    if(keys[83].active){
        runnerPos.x += .1 * Math.cos(cameraRotation)
        runnerPos.z += .1 * Math.sin(cameraRotation)
    }    
    if(keys[65].active){
        runnerPos.x -= .3 * Math.cos(-Math.PI / 2 + cameraRotation)
        runnerPos.z -= .3 * Math.sin(-Math.PI / 2 + cameraRotation)
    }    
    if(keys[68].active){
        runnerPos.x -= .3 * Math.cos(Math.PI / 2 + cameraRotation)
        runnerPos.z -= .3 * Math.sin(Math.PI / 2 + cameraRotation)
    }

    runner.position.x = runnerPos.x
    runner.position.y = runnerPos.y
    runner.position.z = runnerPos.z

    //controls.update()
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
animate();


function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) 
{	
	// note: texture passed by reference, will be updated by the update function.
		
	this.tilesHorizontal = tilesHoriz;
	this.tilesVertical = tilesVert;
	// how many images does this spritesheet contain?
	//  usually equals tilesHoriz * tilesVert, but not necessarily,
	//  if there at blank tiles at the bottom of the spritesheet. 
	this.numberOfTiles = numTiles;
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
	texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );

	// how long should each image be displayed?
	this.tileDisplayDuration = tileDispDuration;

	// how long has the current image been displayed?
	this.currentDisplayTime = 0;

	// which image is currently being displayed?
	this.currentTile = 0;
		
	this.update = function( milliSec )
	{
		this.currentDisplayTime += milliSec;
		while (this.currentDisplayTime > this.tileDisplayDuration)
		{
			this.currentDisplayTime -= this.tileDisplayDuration;
			this.currentTile++;
			if (this.currentTile == this.numberOfTiles)
				this.currentTile = 0;
			var currentColumn = this.currentTile % this.tilesHorizontal;
			texture.offset.x = currentColumn / this.tilesHorizontal;
			var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
			texture.offset.y = currentRow / this.tilesVertical;
		}
	};
}		
