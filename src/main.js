import * as THREE from 'three';
import vertexShader from '../shaders/vertex.glsl';
import fragmentShader from '../shaders/fragment.glsl';
import earthMapBumped from './assets/earthMapBumped.jpg';
import earthMapLights from './assets/earthMapLights.jpg';
import earthMapClouds from './assets/earthMapClouds.jpg';

// Set the app width and height to window dimensions.
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

// Setup a scene, camera, and basic object props.
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.01, 1000);
camera.position.z = 40;

// Setup display variables.
const backgroundCover = document.querySelector('.container-profile');
const switchBtn = document.querySelector('.to-earth');

  // Objects
  const textureLoad = new THREE.TextureLoader();

  // Animation.
  function animation(time) {
    earthMesh.rotation.y = time / 8000;
    lightMesh.rotation.y = time / 8000;
    cloudMesh.rotation.y = time / 8000;
    glowMesh.rotation.y = time / 8000;

    renderer.render(scene, camera);
}

// Global renderer.
const renderer = new THREE.WebGLRenderer( {
    antialias: true,
    canvas: canvas
} ); // Antialias sharpens the ragged edges of the objects.
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);
profileDisplay();

// Earth config
function earthDisplay() {
    camera.position.z = 3.5;
    renderer.setAnimationLoop(animation);
    renderer.setClearColor(new THREE.Color(0x000000, 0));

    // Objects
    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
    const geometry = new THREE.IcosahedronGeometry(1, 6);
    const material = new THREE.MeshStandardMaterial( {map: textureLoad.load(earthMapBumped)} );
    const earthMesh = new THREE.Mesh(geometry, material);
    scene.add(earthGroup);
    earthGroup.add(earthMesh);

    // Add the fresnel texture to the earth.
    const glowMaterial = new THREE.ShaderMaterial({
        vertexShader,  // vertexShader: vertexShader,
        fragmentShader,  // fragmentShader: fragmentShader,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
    })
    const glowMesh = new THREE.Mesh(geometry, glowMaterial);
    glowMesh.scale.set(1.1, 1.1, 1.1);
    earthGroup.add(glowMesh);

    // Add the city lights as a blended mesh.
    const lightMaterial = new THREE.MeshBasicMaterial( {
        map: textureLoad.load(earthMapLights), 
        blending: THREE.CustomBlending,
        blendEquation: THREE.AddEquation,
        blendSrc: THREE.SrcColorFactor,
        blendDst: THREE.OneFactor,
        });
    const lightMesh = new THREE.Mesh(geometry, lightMaterial);
    earthGroup.add(lightMesh);

    // Add the clouds as a blended mesh.
    const cloudMaterial = new THREE.MeshBasicMaterial( {
        map: textureLoad.load(earthMapClouds),
        blending: THREE.CustomBlending,
        blendEquation: THREE.AddEquation,
        blendSrc: THREE.DstColorFactor,
        blendDst: THREE.OneFactor,
        });
    const cloudMesh = new THREE.Mesh(geometry, cloudMaterial);
    cloudMesh.scale.setScalar(1.003);
    earthGroup.add(cloudMesh);

    // Add stars.
    const starsCoords = [];

    for (let i = 0; i < 10000; i++) {
        const x = THREE.MathUtils.randFloatSpread(2000);
        const y = THREE.MathUtils.randFloatSpread(2000);
        const z = THREE.MathUtils.randFloatSpread(2000);

        starsCoords.push(x, y, z);
    }

    const starsGeometry = new THREE.BufferGeometry();
    starsGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( starsCoords, 3 ) );
    const starsMaterial = new THREE.PointsMaterial( { color: 0xaaaaaa } );
    const stars = new THREE.Points( starsGeometry, starsMaterial );
    scene.add( stars );
    // Animation.
    function animation(time) {
        earthMesh.rotation.y = time / 8000;
        lightMesh.rotation.y = time / 8000;
        cloudMesh.rotation.y = time / 8000;
        glowMesh.rotation.y = time / 8000;

        renderer.render(scene, camera);
    }
    // Add light to the scene.
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(-4, 0.25, 2.5);
  scene.add(directionalLight);
}

function profileDisplay() {
    camera.position.z = 40;
    renderer.setClearColor(new THREE.Color('#21282a'), 1);

    // Objects.
    const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const material = new THREE.PointsMaterial({
        size: 0.05
    });
    const torus = new THREE.Points(geometry, material);
    scene.add(torus);
    console.log(material);

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
}

function clearScene() {
    while(scene.children.length > 0){ 
        const object = scene.children[0];

        if (object.isMesh) {
            if (object.geometry) {
                object.geometry.dispose();
            }

            if (object.material) {
                
                if (object.material.isMaterial) {
                    cleanMaterial(object.material);
                } else {
                    // an array of materials
                    for (const material of object.material) cleanMaterial(material);
                }
            }
        }
        
        scene.remove(object);
    }
    // Clean any textures, materials, etc., not directly attached to scene objects...
}
function cleanMaterial(material) {
    if (material.map) material.map.dispose();
    if (material.lightMap) material.lightMap.dispose();
    if (material.bumpMap) material.bumpMap.dispose();
    if (material.normalMap) material.normalMap.dispose();
    if (material.specularMap) material.specularMap.dispose();
    if (material.envMap) material.envMap.dispose();
    material.dispose();
}

switchBtn.addEventListener('click', () => {
    backgroundCover.classList.toggle('hidden');

    // Setup 2 displays:
    if (backgroundCover.classList.contains('hidden')) {
        clearScene();
        // cleanMaterial(material);
        earthDisplay();
        } else {
            clearScene();
            profileDisplay();
        }
    })


/*
Descriptions for the different textures used to render the Earth.

earthMapColored:
This map is a synthesis between my original earth map, gradient mapping of the USGS DEM information, hand painting, DEM modulation of detail, bathyspheric depth information, and the USGS Ocean clip. Bathyspheric data was used to modulate the color of the water so that deeper areas are a darker blue than shallow areas.

earthMapBumped:
This is pieced together exclusively from the USGS DEM database. It contains landmass elevations only, with the ocean at zero, and the top of Mt. Everest at 255. Use this as a bump map to give the appearance of the Earth's rugged surface features. Some madmen have also used this data in POV Ray as a displacement map on a very finely divided sphere to produce a "true" 3D version of the Earth. The 10K version is VERY large, so make sure you really need that much detail.

earthMapLights:
1024 x 512 color image. Very similar to the night lights map as published by NASA on their Blue Marble Page. I took their 30000 x 15000 black and white city lights map, and adapted it with a color table to a colorized version of my earth color map. This comes in 2k, 4k, and 10k versions in color, as opposed to the maximum 2k size of the NASA version of this map (higher resolution versions are available on the paid page only because of their size). Be sure to have a look at the tutorials page for a special rendering tip for using this map.


TODO: add the cloud mesh and other planets. 
TODO: Allow the user to navigate through the solar system and zoom in and expand on any planet. 
TODO: Display CSS properties if the FOV of the camera is within certain parameters.
*/