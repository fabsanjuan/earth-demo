import * as THREE from 'three';

// Size of canvas.
const canvas = document.querySelector('.webgl');
const width = window.innerWidth;
const height = window.innerHeight;

// Mouse movement.
document.addEventListener('mousemove', particleMovement);
let mouseX = 0
let mouseY = 0
let mouseMove = false;

function particleMovement(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    mouseMove = true;
}
document.addEventListener('mouseleave', () => {
    mouseMove = false;
})

//Create the scene.
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, width / height, 0.1, 1000);
camera.position.z = 40;
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
}
);
renderer.setSize(width, height);
renderer.setClearColor(new THREE.Color('#21282a'), 1);
document.body.appendChild(renderer.domElement);

// Add light to the scene.
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(-4, 0.25, 2.5);
scene.add(directionalLight);

// Objects.
const textureLoad = new THREE.TextureLoader();

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.PointsMaterial({
    size: 0.05
});
const torus = new THREE.Points(geometry, material);
scene.add(torus);

const particleCoords = [];

for (let i = 0; i < 10000; i++) {
    const x = THREE.MathUtils.randFloatSpread(1000);
    const y = THREE.MathUtils.randFloatSpread(1000);
    const z = THREE.MathUtils.randFloatSpread(1000);

    particleCoords.push(x, y, z);
}

const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particleCoords, 3));
const particleMaterial = new THREE.PointsMaterial({
    size: 0.05,
    // map: textureLoad.load('./pngForPoints.png'),
    // transparent: true,
    color: 0xaaaaaa,
});
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);   // Use a custom png img instead. 10 by 10 px (alpha) w/ transparent background.

// Animation.
function animate() {
    requestAnimationFrame(animate);
    // torus.rotation.x += 0.01;
    torus.rotation.y += 0.02;
    torus.rotation.z += 0.01;

    // Background responsive movement.
    if (mouseMove) {
        particles.rotation.y = (mouseY + mouseX) * 0.0003;
    } else {
        particles.rotation.x += 0.0005;
        particles.rotation.y -= 0.0001;
    }

    // Render.
    renderer.render(scene, camera);
}
animate();