import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import gsap from 'gsap'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import atmosphereVertexShader from './shaders/atmosphereVertex.glsl'
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl'

var targetList = []; // object for event listener
const group = new THREE.Group()
const points = new THREE.Group()
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  10,
  innerWidth / innerHeight,
  0.1,
  1080
)
const renderer = new THREE.WebGLRenderer(
  {
    antialias: true.valueOf,
    canvas: document.querySelector('canvas')
  }
)
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)


// render atmosphere
const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 50, 50), // (radius, widthSegments, heightSegments)
  new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide 
  })
)
atmosphere.scale.set(1.1, 1.1, 1.1)
group.add(atmosphere)


// render sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 50, 50),
  new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      globeTexture: {
        value: new THREE.TextureLoader().load('./img/globe.jpg')
      }
    }
  })
)
group.add(sphere)



// set position by latitude & longitude
function pointLatLong(lat, lon) {
  var phi = ((90-lat)*(Math.PI/180))
  var theta = (lon+180)*(Math.PI/180)
  let x = -(Math.sin(phi)*Math.cos(theta))
  let z = (Math.sin(phi)*Math.sin(theta))
  let y = (Math.cos(phi))
  return {x,y,z}
}
class Point{
  pointMesh
  lat
  long
  color
  name
  constructor(lat, long, color, city){
    this.lat = lat
    this.long = long
    this.color = color
    this.city = city
    const point = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.018,20,20),
      new THREE.MeshBasicMaterial({color:this.color})
    )
    const coor = pointLatLong(this.lat, this.long+ 0.1)
    var x = coor.x
    var y = coor.y
    var z = coor.z
    point.name = this.city
    point.position.set(x, y, z)
    this.pointMesh = point
    points.add(this.pointMesh)
  }
  get getPoint(){
    return this.pointMesh
  }
  get getString(){
    return {city, lat, long}
  }
}
// panama coordinate
let panama = new Point(8.983333, 	-79.516670, 0xff0000, 'Panama')
// los angeles coordinate
let losangeles = new Point(34.0522342, -118.496475, 0x00ff00, 'Los Angeles')
// jakarta coordinate
let jakarta = new Point(-6.200000, 106.816666, 0xffff00, 'Jakarta')
// jakarta.getPoint
group.add(points)
scene.add(group)



// EVENT LISTENER
targetList.push(points.children)
var mouse = { x: 0, y: 0 }, INTERSECTED
// Follows the mouse event
function onDocumentMouseMove(event) {
  // Update the mouse variable
  mouse.x = (( event.clientX / window.innerWidth ) * 2 - 1)+0.015;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  // Find intersections
  var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
  var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
  ray .setFromCamera(mouse, camera);
  // Create an array containing all objects in the scene with which the ray intersects
  var intersects = ray.intersectObjects(targetList[0]);
  let likeThis = 0
  // if there is one (or more) intersections
  if (intersects.length > 0) {
    if (intersects[likeThis].object != INTERSECTED) {
      if (INTERSECTED) {
        document.getElementById("labels").innerHTML = intersects[likeThis].object.name;
      }
      INTERSECTED = intersects[0];
    }
  } 
  else {
    INTERSECTED = null;
  }
}
// When the mouse moves, call the given function
document.addEventListener('mousemove', onDocumentMouseMove, false)




// const starGeometry = new THREE.BufferGeometry()
// const starMaterial = new THREE.PointsMaterial({
//   color: 0xffffff
// })
// const starVertices = []
// for (let i=0; i<10000; i++){
//   const x = (Math.random() - 0.5) * 600
//   const y = (Math.random() - 0.5) * 600
//   const z = -Math.random() * 600
//   starVertices.push(x, y, z)
// }
// starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 4.5))
// const stars = new THREE.Points(starGeometry, starMaterial)
// scene.add(stars)




camera.position.z = 15
const globeRotate = {
  x: -0.01
}

function animate(){
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  group.rotation.y = globeRotate.x
  gsap.to(group.rotation, {
    y: globeRotate.x * 0.2,
    duration: 4
  })
}
animate()
addEventListener('keydown', (event) => {
  if (event.key === "ArrowLeft") {
    globeRotate.x -= 0.2
  } else if (event.key === "ArrowRight") {
    globeRotate.x += 0.2
  }
})

// document.querySelector('canvas').addEventListener('mousemove', () => {
//   mouse.x = (event.clientX / innerWidth) * 2-1
//   console.log(mouse.x)
// })








