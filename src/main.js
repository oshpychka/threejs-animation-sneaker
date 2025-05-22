import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './lenis.js'

gsap.registerPlugin(ScrollTrigger);

let container;
let camera;
let renderer;
let scene;
let model3d;
let modelBox;
let modelSneaker;
let pivotBox = new THREE.Group();
let pivotSneaker = new THREE.Group();
let lastRenderTime = 0;
const fps = 60;
const materials = [];
container = document.querySelector(".model");
model3d = document.querySelector("#model");
scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight);
camera.position.set(9, 1, 4);
camera.lookAt(0, 0, 0);

renderer = new THREE.WebGLRenderer({
    antialias: false,
    alpha: true
});

renderer.setSize(container.clientWidth + 300, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

container.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x46A997, 2);
directionalLight.position.set(1, 10, 50);
scene.add(directionalLight);

scene.add(pivotBox);
scene.add(pivotSneaker);

let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;
controls.enableRotate = true;
controls.enablePan = true;

const loader = new GLTFLoader();
loader.load('./models/box/box.glb', function(gltf) {
    modelBox = gltf.scene;

    modelBox.traverse(function(node) {
        if (node.isMesh && node.material) {
            node.material.transparent = true;
            node.material.side = THREE.FrontSide;
            materials.push(node.material);
        }
    });

    console.log(modelBox)
    modelBox.scale.set(15, 12, 30);
    modelBox.rotation.set(0, 2.5, 0);
    modelBox.position.set(-7, 0, -5);

    pivotBox.add(modelBox);

}, undefined, function(error) {
    console.error(error);
});

loader.load('./models/sneaker/sneaker.glb', function(gltf) {
    modelSneaker = gltf.scene;

    modelSneaker.traverse(function(node) {
        if (node.isMesh && node.material) {
            node.material.transparent = true;
            node.material.side = THREE.FrontSide;
            materials.push(node.material);
        }
    });

    console.log(modelSneaker)
    modelSneaker.scale.set(1.4, 0.8, 1.4);
    modelSneaker.position.set(-7, 0, -5);
    modelSneaker.rotation.set(0, 1, 0)

    pivotSneaker.add(modelSneaker);

    setupScrollAnimationBox();
    updateModelScaleAndPosition();

}, undefined, function(error) {
    console.error(error);
});

animate();

window.addEventListener('resize', () => {
    if(window.innerWidth < 1200) {
        const width = container.clientWidth + 0;
        const height = container.clientHeight;

        renderer.setSize(width, height);
        camera.aspect = width / height;
    }
    updateModelScaleAndPosition()
    camera.updateProjectionMatrix();
});

const isDesktop = window.innerWidth > 1024;
const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
const isMobile = window.innerWidth > 575 && window.innerWidth <= 768;
const isLowMobile = window.innerWidth > 520 && window.innerWidth <= 575;
const noAnimation = window.innerWidth <= 520;

function updateModelScaleAndPosition() {

    if (modelBox) {
        if (isLowMobile || noAnimation) {
            modelBox.scale.set(4, 5, 8);
            modelBox.position.set(-1, -0.1, -1);
        } else if (isMobile) {
            modelBox.scale.set(8, 8, 16);
            modelBox.position.set(-2, 0, -2);
        } else if (isTablet) {
            modelBox.scale.set(12, 10, 25);
            modelBox.position.set(-6, 0, -5);
        } else {
            modelBox.scale.set(15, 12, 30);
            modelBox.position.set(-7, 0, -5);
        }
    }

    if (modelSneaker) {
        if (isLowMobile || noAnimation) {
            modelSneaker.scale.set(0.35, 0.6, 0.35);
            modelSneaker.position.set(-1, -0.1, -1);
        } else if (isMobile) {
            modelSneaker.scale.set(0.8, 1, 0.8);
            modelSneaker.position.set(-2, -0.1, -2);
        } else if (isTablet) {
            modelSneaker.scale.set(1.2, 0.7, 1.2);
            modelSneaker.position.set(-6, 0, -5);
        } else {
            modelSneaker.scale.set(1.4, 0.8, 1.4);
            modelSneaker.position.set(-7, 0, -5);
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    const now = Date.now();
    const delta = now - lastRenderTime;

    if (delta > 1000 / fps) {
        controls.update();
        renderer.render(scene, camera);
        lastRenderTime = now;
    }
}

let scrollAnimationsInitialized = false;

function resetAnimations() {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    gsap.killTweensOf("*");

    setupScrollAnimationBox();
    scrollAnimationsInitialized = true;
}

function setupScrollAnimationBox(pivot) {

    const tl1 = gsap.timeline({
        scrollTrigger: {
            trigger: '#hero',
            start: "top top",
            end: "+=500%",
            scrub: 1
        }
    })

    tl1.to(pivotBox.rotation, {
        x: noAnimation ? 0 : -3,
        ease: "power2.inOut"
    }, 0)

    tl1.to(pivotSneaker.rotation, {
        x: noAnimation ? 0 : -3,
        ease: "power2.inOut"
    }, 0)

    if(noAnimation) {
        tl1.to(modelBox.rotation, {
            x: -3,
            ease: "power2.inOut"
        }, 0)

        tl1.to(modelSneaker.rotation, {
            x: -3,
            ease: "power2.inOut"
        }, 0)
    }

    tl1.to(pivotBox.position, {
        y: 15,
        ease: "power2.inOut"
    })

   if(isDesktop) {
       tl1.to(pivotSneaker.scale, {
           x: 10,
           y: 10,
           z: 10,
           ease: "power3.inOut"
       }, '<');
   } else if (isTablet) {
       tl1.to(pivotSneaker.scale, {
           x: 3,
           y: 3,
           z: 3,
           ease: "power3.inOut"
       }, '<');
   } else if(isMobile) {
       tl1.to(pivotSneaker.scale, {
           x: 0.6,
           y: 1,
           z: 0.6,
           ease: "power3.inOut"
       }, '<');
   }

    if(!noAnimation) {
        tl1.to(pivotSneaker.rotation, {
            x: 0,
            y: 0,
            z: 0,
            ease: "none"
        }, '<')

        tl1.to(pivotSneaker.position, {
            x: 3,
            y: 0,
            z: 3,
            ease: "none"
        }, '<')
    }

    if(noAnimation) {
        tl1.to(pivotSneaker.scale, {
            x: 1,
            y: 1,
            z: 1,
            ease: "power3.inOut"
        }, '<');
    }

    if(isDesktop) {
        tl1.to(model3d, {
            x: "10vw",
            y: "50vh",
            scale: 1.5,
            ease: "none"
        }, '<')
    } else if (isTablet) {
        tl1.to(model3d, {
            x: "10vw",
            y: "50vh",
            scale: 1.5,
            ease: "none"
        }, '<')
    } else if (isMobile) {
        tl1.to(model3d, {
            x: "40vw",
            y: "50vh",
            scale: 1.5,
            ease: "none"
        }, '<')
    } else if (isLowMobile) {
        tl1.to(model3d, {
            x: "50vw",
            y: "50vh",
            scale: 1.5,
            ease: "none"
        }, '<')
    }

    if(noAnimation) {
        tl1.to(model3d, {
            x: "-20vw",
            y: "20vh",
            scale: 1.5,
            ease: "none"
        }, '<')
    }

    tl1.fromTo(".hero__bottom-text", {
        opacity: 0,
        x: 100,
    }, {
        opacity: 1,
        color: '#D45A00',
        x: 0,
        ease: "power2.inOut"
    });

    tl1.to(modelSneaker.rotation, {
        x: Math.PI * 2,
        y: 1.5,
        ease: "none",
    }, '<');

    tl1.fromTo(modelSneaker.children[4].material.color, {
        r: modelSneaker.children[4].material.color.r,
        g: modelSneaker.children[4].material.g,
        b: modelSneaker.children[4].material.b
    }, {
        r: 1.65,
        g: 0.33,
        b: 0,
        ease: "power2.inOut"
    });

    if(isDesktop) {
        tl1.to(model3d, {
            x: "-10vw",
            y: "40vh",
            ease: "power2.inOut"
        })
    } else if(isTablet) {
        tl1.to(model3d, {
            x: "-10vw",
            y: "40vh",
            ease: "power2.inOut"
        })
    } else if (isMobile) {
        tl1.to(model3d, {
            x: "25vw",
            y: "40vh",
            ease: "power2.inOut"
        })
    } else if (isLowMobile) {
        tl1.to(model3d, {
            x: "40vw",
            y: "20vh",
            ease: "power2.inOut"
        })
    }

    tl1.to(modelSneaker.rotation, {
        y: Math.PI * 0.5,
        z: 0.15,
        ease: "none",
    }, '<');

    const tl2 = gsap.timeline({
        scrollTrigger: {
            trigger: '#colored',
            start: "top top",
            end: "+=600%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
        }
    })

    tl2.fromTo(".colored__main-text", {
        opacity: 0,
        x: 100,
    }, {
        opacity: 1,
        color: '#D45A00',
        x: 0,
        ease: "power2.inOut"
    });

    tl2.to(modelSneaker.rotation, {
        y: modelSneaker.rotation.y + Math.PI * 2,
        z: -0.15,
        ease: "power4.out"
    });

    tl2.to(modelSneaker.children[4].material.color, {
        r: 1.0,
        g: 1,
        b: 2,
        ease: "power4.out"
    }, "<");

    tl2.to(modelSneaker.rotation, {
        y: modelSneaker.rotation.y - Math.PI * 2,
        z: 0.15,
        ease: "power4.out"
    });

    tl2.to(modelSneaker.children[4].material.color, {
        r: 1.0,
        g: 0.3,
        b: 0.0,
        ease: "power4.out"
    }, "<");

    tl2.to(modelSneaker.rotation, {
        y: modelSneaker.rotation.y + Math.PI * 0.8,
        z: 0.15,
        ease: "power4.out"
    });

    tl2.to(modelSneaker.children[4].material.color, {
        r: 0.0,
        g: 0.9,
        b: 0.7,
        ease: "power4.out"
    }, "<");

    const tl3 = gsap.timeline({
        scrollTrigger: {
            trigger: '#advantage',
            start: "top top",
            end: "+=530%",
            scrub: 1,
        }
    })

    if(isDesktop) {
        tl3.to(model3d, {
            x: "20vw",
            y: "30vh",
            ease: "power2.inOut"
        }, '<')
    } if(isTablet) {
        tl3.to(model3d, {
            x: "15vw",
            y: "30vh",
            ease: "power2.inOut"
        }, '<')
    } else if(isMobile) {
        tl3.to(model3d, {
            x: "40vw",
            y: "30vh",
            ease: "power2.inOut"
        }, '<')
    } else if (isLowMobile) {
        tl3.to(model3d, {
            x: "80vw",
            y: "30vh",
            ease: "power2.inOut"
        }, '<')
    }

   if(isDesktop) {
       tl3.to(modelSneaker.scale, {
           x: 1.2,
           y: 1.2,
           z: 1.2,
           ease: "power4.out"
       }, "<");
   } else if(isTablet) {
       tl3.to(modelSneaker.scale, {
           x: 1.1,
           y: 1.1,
           z: 1.1,
           ease: "power4.out"
       }, "<");
   } else if(isMobile) {
       tl3.to(modelSneaker.scale, {
           x: 0.8,
           y: 0.8,
           z: 0.8,
           ease: "power4.out"
       }, "<");
   } else if (isLowMobile) {
       tl3.to(modelSneaker.scale, {
           x: 0.4,
           y: 0.4,
           z: 0.4,
           ease: "power4.out"
       }, "<");
   }

    if(isDesktop) {
        tl3.to(modelSneaker.rotation, {
            y: -5,
            z: 4,
            ease: "power4.out"
        }, "<");
    } else if (isTablet) {
        tl3.to(modelSneaker.rotation, {
            y: -5,
            z: 4,
            ease: "power4.out"
        }, "<");
    } else if (isMobile) {
        tl3.to(modelSneaker.rotation, {
            y: -5,
            z: 4,
            ease: "power4.out"
        }, "<");
    } else if (isLowMobile) {
        tl3.to(modelSneaker.rotation, {
            y: -1,
            z: 2,
            ease: "power4.out"
        }, "<");
    }

    tl3.fromTo('.advantage__first-block', {
        opacity: 0,
        x: 100,
    }, {
        opacity: 1,
        color: '#a12525',
        x: 0,
        ease: "power2.inOut"
    }, '>');

    tl3.to(modelSneaker.children[4].material.color, {
        r: 0.631,
        g: 0.145,
        b: 0.145,
        ease: "power4.out"
    }, "<");

    tl3.fromTo('.advantage__second-block', {
        opacity: 0,
        x: 100,
    }, {
        opacity: 1,
        color: '#21e8ef',
        x: 0,
        ease: "power2.inOut"
    }, '>');

    tl3.to(modelSneaker.children[4].material.color, {
        r: 0.129,
        g: 0.91,
        b: 0.937,
        ease: "power4.out"
    }, "<");

    if(isDesktop) {
        tl3.to(model3d, {
            x: "-50vw",
            y: "20vh",
            ease: "power2.inOut"
        }, '<')
    } if(isTablet) {
        tl3.to(model3d, {
            x: "-50vw",
            y: "20vh",
            ease: "power2.inOut"
        }, '<')
    } else if(isMobile) {
        tl3.to(model3d, {
            x: "-15vw",
            y: "20vh",
            ease: "power2.inOut"
        }, '<')
    } else if (isLowMobile) {
        tl3.to(model3d, {
            x: "10vw",
            y: "20vh",
            ease: "power2.inOut"
        }, '<')
    }

    if(isDesktop) {
        tl3.to(modelSneaker.scale, {
            x: 1.5,
            y: 1.5,
            z: 1.5,
            ease: "power4.out"
        }, "<");
    } else if(isTablet) {
        tl3.to(modelSneaker.scale, {
            x: 1.1,
            y: 1.1,
            z: 1.1,
            ease: "power4.out"
        }, "<");
    } else if(isMobile) {
        tl3.to(modelSneaker.scale, {
            x: 1,
            y: 1,
            z: 1,
            ease: "power4.out"
        }, "<");
    }

    tl3.to(modelSneaker.rotation, {
        y: 3,
        z: 1,
        ease: "power4.out"
    }, "<");

    if(isDesktop) {
        tl3.to(model3d, {
            x: "20vw",
            y: "10vh",
            ease: "power2.inOut"
        })
    } else if (isTablet) {
        tl3.to(model3d, {
            x: "10vw",
            y: "10vh",
            ease: "power2.inOut"
        })
    } else if(isMobile) {
        tl3.to(model3d, {
            x: "50vw",
            y: "10vh",
            ease: "power2.inOut"
        })
    } else if (isLowMobile) {
        tl3.to(model3d, {
            x: "70vw",
            y: "10vh",
            ease: "power2.inOut"
        })
    }

    tl3.fromTo('.advantage__third-block', {
        opacity: 0,
        x: 100,
    }, {
        opacity: 1,
        color: '#5200ff',
        x: 0,
        ease: "power2.inOut"
    }, '<+0.1')

    if(isDesktop) {
        tl3.to(modelSneaker.scale, {
            x: 1.3,
            y: 1.3,
            z: 1.3,
            ease: "power4.out"
        }, "<");
    } else if(isTablet) {
        tl3.to(modelSneaker.scale, {
            x: 1.1,
            y: 1.1,
            z: 1.1,
            ease: "power4.out"
        }, "<");
    } else if(isMobile) {
        tl3.to(modelSneaker.scale, {
            x: 1.1,
            y: 1.1,
            z: 1.1,
            ease: "power4.out"
        }, "<");
    }

    tl3.to(modelSneaker.rotation, {
        y: 6,
        z: 6,
        ease: "power4.out"
    }, "<");

    tl3.to(modelSneaker.children[4].material.color, {
        r: 0.321,
        g: 0,
        b: 1.0,
        ease: "power4.out"
    }, "<");

    const tl4 = gsap.timeline({
        scrollTrigger: {
            trigger: '#control',
            start: "top top",
            end: "+=90%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
        }
    })

    if(isDesktop) {
        tl4.to(model3d, {
            x: "-8vw",
            y: "50vh",
            ease: "power2.inOut"
        }, '<')
    } else if (isTablet) {
        tl4.to(model3d, {
            x: "-8vw",
            y: "50vh",
            ease: "power2.inOut"
        }, '<')
    } else if (isMobile) {
        tl4.to(model3d, {
            x: "20vw",
            y: "50vh",
            ease: "power2.inOut"
        }, '<')
    } else if (isLowMobile) {
        tl4.to(model3d, {
            x: "40vw",
            y: "35vh",
            ease: "power2.inOut"
        }, '<')
    }

    if(noAnimation) {
        tl4.to(model3d, {
            x: "-30vw",
            y: "35vh",
            ease: "power2.inOut"
        }, '<')
    }

    if(isDesktop) {
        tl4.to(modelSneaker.scale, {
            x: 1.5,
            y: 1.5,
            z: 1.5,
            ease: "power4.out"
        }, "<");
    } else if (isTablet) {
        tl4.to(modelSneaker.scale, {
            x: 1.5,
            y: 1.5,
            z: 1.5,
            ease: "power4.out"
        }, "<");
    } else if (isMobile) {
        tl4.to(modelSneaker.scale, {
            x: 1,
            y: 1,
            z: 1,
            ease: "power4.out"
        }, "<");
    }

    tl4.to(modelSneaker.rotation, {
        y: modelSneaker.rotation.y + Math.PI * 2,
        z: -0.15,
        ease: "power4.out"
    });
}