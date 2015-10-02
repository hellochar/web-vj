const socket = io();

const canvas = $("<canvas>").appendTo("body").css({
    width: "100%",
    height: "100%",
    background: "black"
}).attr({
    width: $("body").width(),
    height: $("body").height()
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, canvas.width() / canvas.height(), 1, 10000);
camera.position.set(0, 0, 100);
camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(camera);
const renderer = new THREE.WebGLRenderer({
    canvas: <HTMLCanvasElement> canvas[0],
    preserveDrawingBuffer: true,
    alpha: true
});
renderer.autoClearColor = false;

declare module THREE {
    export var EffectComposer: any;
    export var RenderPass: any;
    export var ShaderPass: any;
    export var BloomPass: any;
    export var DotScreenShader: any;
    export var RGBShiftShader: any;
}

const composer = new THREE.EffectComposer(renderer);

composer.addPass( new THREE.RenderPass(scene, camera) );

var dotScreenEffect = new THREE.ShaderPass( THREE.DotScreenShader );
dotScreenEffect.uniforms[ 'scale' ].value = 4;
dotScreenEffect.enabled = false;
composer.addPass( dotScreenEffect );

var rgbShiftEffect = new THREE.ShaderPass( THREE.RGBShiftShader );
rgbShiftEffect.uniforms[ 'amount' ].value = 0.0015;
rgbShiftEffect.enabled = false;
composer.addPass( rgbShiftEffect );

var filmPassEffect = new THREE.FilmPass(1000.5, 10.125, 2000, false);
filmPassEffect.enabled = false;
composer.addPass( filmPassEffect );

var kaleidoEffect = new THREE.ShaderPass ( THREE.KaleidoShader );
kaleidoEffect.enabled = false;
kaleidoEffect.uniforms[ 'resolution' ].value.set(window.innerWidth, window.innerHeight);
composer.addPass( kaleidoEffect );

var edgeEffect = new THREE.ShaderPass ( THREE.EdgeShader );
edgeEffect.enabled = false;
composer.addPass (edgeEffect);

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

interface Parameterizable {
    param(value: number): void;
}

interface Animatable extends Parameterizable {
    animate(): void;

    show(): void;

    hide(): void;
}

interface Effect extends Parameterizable {
}

const BackgroundOpacity: Effect = new (class {
    public blackBackground = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(10000, 10000),
        new THREE.MeshBasicMaterial({color: 0x000000, opacity: 1, transparent: true})
    );

    constructor() {
        this.blackBackground.position.z = -3000;
        this.blackBackground.rotation.z = Math.PI / 2;
        camera.add(this.blackBackground);
    }

    param(v: number) {
        this.blackBackground.material.opacity = Math.pow(1 - v / 127, 4);
    }
});

const Words: Animatable = new (class {
    public words = [
        "abstract not concrete",
        "aesthetic having with the appreciation beauty _stringtheory_ string_theory string.theory",
        "alleviate ease pain burden",
        "ambivalent simultaneously feeling opposing feelings uncertain",
        "apathetic feeling showing little emotion",
        "auspicious favorable promising",
        "benevolent well-meaning generous",
        "candor sincerity openness",
        "cogent convincing reasonable",
        "comprehensive broad complete scope content",
        "contemporary current modern from the same time",
        "conviction fixed strong belief",
        "diligent marked painstaking effort hard-working",
        "dubious doubtful unlikely authenticity",
        "eclectic made variety sources styles",
        "egregious conspicuously bad offensive",
        "exculpate free from guilt blame",
        "florid flowery elaborate style",
        "gratuitous given freely unearned unwarranted",
        "hackneyed worn out through overuse trite",
        "idealize consider perfect",
        "impartial not favor one side the other unbiased",
        "imperious arrogantly domineering overbearing",
        "inherent inborn built-in",
        "innovative introducing something new",
        "inveterate long established deep-rooted habitual",
        "laudatory giving praise",
        "maverick one who resists adherence group",
        "mollify calm soothe",
        "novel strikingly new unusual",
        "obdurate stubborn inflexible",
        "objectivity judgment uninfluenced emotion",
        "obstinate stubbornly adhering opinion",
        "ornate elaborately decorated",
        "ostentatious describing pretentious display",
        "paramount chief concern importance",
        "penitent expressing remorse for one's misdeeds",
        "pervasive dispersed throughout",
        "plausible seemingly valid acceptable credible",
        "profound having great depth seriousness",
        "prosaic unimaginative dull ordinary",
        "quandary state uncertainty perplexity",
        "rancorous hateful marked deep-seated ill will",
        "spurious not genuine false counterfeit",
        "stoic indifferent pleasure pain impassive",
        "superfluous extra unnecessary",
        "tenuous having little substance strength unsure weak",
        "timorous timid fearful",
        "transitory short-lived temporary",
        "vindicated freed from blame"
    ];

    public div = $("<div></div>").addClass("words");

    public period: number = 1000;

    constructor() {
        this.div.css({
            "line-height": $("body").height() + "px"
        });
    }

    public show() {
        this.div.prependTo("body");
    }

    public hide() {
        this.div.detach();
    }

    public param(value: number) {
        this.period = value / 127 * 2000 + 200;
    }

    public animate() {
        const showDuration = 200;

        if (Date.now() % this.period < 16) {
            const wordList = this.words[Math.floor(this.words.length * Math.random())];
            const wordList2 = wordList.split(" ");
            const word = wordList2[Math.floor(wordList2.length * Math.random())];
            this.div.text(word);
        } else if (Date.now() % this.period > showDuration) {
            this.div.text("");
        }
    }
});

function tween(v: THREE.Vector3, to: THREE.Vector3, millis: number, then?: Function, onUpdate?: Function) {
    const start = v.clone();
    let startTime: number;
    function update(timestamp) {
        if (!startTime) startTime = timestamp;
        let timeDelta = timestamp - startTime;
        if (timeDelta > startTime) timeDelta = millis;
        const lerpedValue = Math.pow(timeDelta / millis, 1/4);

        v.copy(start);
        v.lerp(to, lerpedValue);
        if (onUpdate) {
            onUpdate();
        }

        if (timeDelta < millis) {
            requestAnimationFrame(update);
        } else {
            if (then) {
                then();
            }
        }
    }
    requestAnimationFrame(update);
}

const PlanetEarth: Animatable = new (class {

    public video = <HTMLVideoElement> $("<video autoplay src='planetearth.mp4'></video>")[0];
    public texture: THREE.Texture;
    public mesh: THREE.Mesh;

    constructor() {
        this.video.volume = 0;
        this.video.onplay = () => {
            this.video.currentTime = 38;
            this.texture = new THREE.Texture(this.video);
            this.mesh = new THREE.Mesh(
                new THREE.SphereGeometry(50, 12, 12),
                new THREE.MeshBasicMaterial({map: this.texture})
            );
        };
        this.video.ontimeupdate = () => {
            if (this.video.currentTime > 13*60 + 24) {
                this.video.currentTime = 38;
                this.video.play();
            }
        };
    }

    public param(value: number) {
        this.video.playbackRate = Math.pow(125, value / 127);
    }

    public show() {
        scene.add(this.mesh);
        this.mesh.scale.set(0,0,0);
        tween(this.mesh.scale, new THREE.Vector3(1, 1, 1), 300);
    }

    public hide() {
        tween(this.mesh.scale, new THREE.Vector3(0, 0, 0), 100, () => {
            scene.remove(this.mesh);
        });
    }

    public animate() {
        if (this.texture && this.mesh) {
            this.mesh.rotation.y += 0.0002 * this.video.playbackRate;
            this.texture.needsUpdate = true;
        }

    }
});

const Rocks: Animatable = new (class {
    public object = new THREE.Object3D();

    public speed: number = 0.02;

    constructor() {
        const geometry = new THREE.CubeGeometry(15, 15, 15);
        const material = new THREE.MeshNormalMaterial({ });
        for(let i = 0; i < 200; i++) {
            const rock = new THREE.Mesh(geometry, material);
            const variation = 500;
            rock.position.set(variation * (Math.random() - 0.5),
                              variation * (Math.random() - 0.5),
                              variation * (Math.random() - 0.5));
            this.object.add(rock);
        }
    }

    param(value: number) {
        this.speed = Math.pow(value / 127, 2) * 0.5;
    }

    show() {
        scene.add(this.object);
        this.object.scale.set(0,0,0);
        tween(this.object.scale, new THREE.Vector3(1, 1, 1), 1000);
    }

    hide() {
        tween(this.object.scale, new THREE.Vector3(0, 0, 0), 300, () => {
            scene.remove(this.object);
        });
    }

    animate() {
        this.object.children.forEach((rock) => {
            const worldPos = rock.getWorldPosition();
            rock.rotation.x += worldPos.x / 1000 * this.speed * 20;
            rock.rotation.y += worldPos.y / 1000 * this.speed * 20;
            rock.rotation.z += 0.001 / Math.max(worldPos.z, 0.01) * this.speed * 20;
            rock.position.x += 0.5 * this.speed * 20 * Math.cos(Date.now() / 1000);
        });
        this.object.rotateX(this.speed);
    }
});

const IncomingGrid: Animatable = new (class {
    public gridHelper = new THREE.GridHelper(3000, 15);

    constructor() {
        this.gridHelper.rotateX(Math.PI / 2);
    }

    param(value: number) {
        this.gridHelper.rotation.z = value / 127 - 0.5;
    }

    show() {
        scene.add(this.gridHelper);
    }

    hide() {
        scene.remove(this.gridHelper);
    }

    public animate() {
        const scale = 1 + 0.1 * Math.pow(Math.sin(Date.now() / 600), 320);
        this.gridHelper.scale.set(scale, scale, scale);
        this.gridHelper.position.z = (2*Math.sin(Date.now() / 4000) - 1) * 10 - 400;
    }

});

const Circles: Animatable = new (class {
    public object = new THREE.Object3D();

    public delta = 0;
    public speed = 1;

    constructor() {
        const extent = 4000;
        const distance = 150;

        const geometry = new THREE.SphereGeometry(10, 4, 3);
        const material = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            shading: THREE.FlatShading
        });
        for(let x = -extent; x < extent; x += distance) {
            for(let z = 100; z > 100 - extent; z -= distance) {
                const sphere = new THREE.Mesh (geometry, material);
                sphere.position.set(x, -100, z);
                sphere.rotation.set(Math.random()*1, Math.random()*1, Math.random()*1);
                this.object.add(sphere);
            }
        }

        scene.add(new THREE.AmbientLight(0x222222));
        const directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(1,1,1);
        scene.add(directionalLight);
    }

    public param(value: number) {
        this.speed = value / 20 + 1;
    }

    show() {
        scene.add(this.object);
    }

    hide() {
        scene.remove(this.object);
    }

    animate() {
        this.delta += this.speed;

        this.object.children.forEach((child) => {
            const scale = 1.5*Math.sin(child.position.z / 900 - this.delta / 19) + 1.5;
            child.scale.set(scale, scale, scale);
        });
    }
});

const Particles: Animatable = new (class {
    private extent = 2000;

    public object = new THREE.Object3D();
    public geometry = new THREE.Geometry();
    public starTexture = THREE.ImageUtils.loadTexture("star.png");
    public material = new THREE.PointCloudMaterial({
        color: 0xff3366,
        map: this.starTexture,
        sizeAttenuation: true,
        size: 70,
        vertexColors: THREE.VertexColors,
        alphaTest: 0.8,
        transparent: true
    });

    public speed = 1;

    constructor() {
        for( let i = 0; i < 2000; i++) {
            this.geometry.vertices.push(new THREE.Vector3(
                (Math.random()*2-1) * this.extent,
                (Math.random()*2-1) * this.extent,
                (Math.random()*2-1) * this.extent
            ));
            this.geometry.colors.push(new THREE.Color().setHSL(i / 2000, 1, 0.8));
        }

        const pointCloud = new THREE.PointCloud(this.geometry, this.material);
        this.object.add(pointCloud);
        this.object.position.z = -this.extent / 2;
        this.param(0);
    }

    public param(value: number) {
        this.speed = Math.exp(value / 127 * 4 + 1) * 1e-4;
    }

    show() {
        scene.add(this.object);
        this.object.scale.set(0,0,0);
        tween(this.object.scale, new THREE.Vector3(1, 1, 1), 1000);
    }

    hide() {
        scene.remove(this.object);
    }

    animate() {
        this.material.color.offsetHSL(0.0001, 0, 0);
        const center = new THREE.Vector3(0, 0, -1000);
        const scale = this.speed;
        this.geometry.vertices.forEach((v) => {
            const vx = v.x * scale,
                  vy = v.y * scale,
                  vz = (v.z - 800) * scale;
            v.x += vx*vx - vy + 3*vz + 3000 * scale + Math.sin(Date.now() / 3000) * 1000 * scale;
            v.y += vx/Math.max(vy, 0.1) + vx - 0.03 + vz;
            v.z += vz - vx*vy + Math.sin(vz * 40) + Math.cos(Date.now() / 2200) * 1000 * scale;

            if (v.distanceTo(center) > this.extent) {
                v.set(
                    (Math.random()*2-1) * this.extent,
                    (Math.random()*2-1) * this.extent,
                    (Math.random()*2-1) * this.extent
                );
            }
        });
        this.geometry.verticesNeedUpdate = true;
    }

});


interface IMessage {
    name: string;
    value: number;
}

const noteStates: {[name:string]: boolean} = {};

socket.on("message", (message: IMessage) => {
    console.log(message);
    const ON_OFF_MAPPING: {[name: string]: Animatable} = {
        "/note/9": PlanetEarth,
        "/note/10": Words,
        "/note/11": Rocks,
        "/note/12": IncomingGrid,
        "/note/25": Circles,
        "/note/26": Particles,
    };
    const PARAMETER_MAPPING: {[name: string]: Parameterizable} = {
        "/cc/41": PlanetEarth,
        "/cc/42": Words,
        "/cc/43": Rocks,
        "/cc/44": IncomingGrid,
        "/cc/45": Circles,
        "/cc/46": Particles,

        "/cc/21": BackgroundOpacity,
        "/cc/22": { // dotScreenEffect
            param: (v: number) => {
                if (v === 0) {
                    dotScreenEffect.enabled = false;
                } else {
                    dotScreenEffect.enabled = true;
                    dotScreenEffect.uniforms['scale'].value = Math.pow(v / 127, 3) * 4;
                }
            }
        },
        "/cc/23": { //rgbShiftEffect
            param: (v: number) => {
                if (v === 0) {
                    rgbShiftEffect.enabled = false;
                } else {
                    rgbShiftEffect.enabled = true;
                    rgbShiftEffect.uniforms['amount'].value = v / 127;
                }
            }
        },
        "/cc/24": { // filmPassEffect
            param: (v: number) => {
                if (v === 0) {
                    filmPassEffect.enabled = false;
                } else {
                    filmPassEffect.enabled = true;
                    filmPassEffect.uniforms['sIntensity'].value = v / 12.7;
                }
            }
        },
        "/cc/25": { // kaleidoEffect
            param: (v: number) => {
                if (v === 0) {
                    kaleidoEffect.enabled = false;
                } else {
                    kaleidoEffect.enabled = true;
                    kaleidoEffect.uniforms['sides'].value = Math.floor(1 + (v - 1) / 126 * (24 - 1));
                }
            }
        },
        "/cc/26": { // edgeShader
            param: (v: number) => {
                if (v === 0) {
                    edgeEffect.enabled = false;
                } else {
                    edgeEffect.enabled = true;
                    edgeEffect.uniforms['wet'].value = v / 127;
                }
            }
        }
    };
    const toggledAnimatable = ON_OFF_MAPPING[message.name];
    const parameterChangedAnimatable = PARAMETER_MAPPING[message.name];
    if (toggledAnimatable && message.value == 127) {
        noteStates[message.name] = !noteStates[message.name];
        if (noteStates[message.name]) {
            toggledAnimatable.show();
        } else {
            toggledAnimatable.hide();
        }
    } else if (parameterChangedAnimatable) {
        parameterChangedAnimatable.param(message.value);
    }

    const AMOUNT = 80;

    if (message.name === "/cc/116" && message.value == 127) {
        // left
        const newPosition = camera.position.clone();
        newPosition.x -= AMOUNT;
        tween(camera.position, newPosition, 200, null, () => {
            camera.lookAt(new THREE.Vector3());
        });
    }
    if (message.name === "/cc/117" && message.value == 127) {
        // left
        const newPosition = camera.position.clone();
        newPosition.x += AMOUNT;
        tween(camera.position, newPosition, 200, null, () => {
            camera.lookAt(new THREE.Vector3());
        });
    }
    if (message.name === "/cc/114" && message.value == 127) {
        // left
        const newPosition = camera.position.clone();
        newPosition.y += AMOUNT;
        tween(camera.position, newPosition, 200, null, () => {
            camera.lookAt(new THREE.Vector3());
        });
    }
    if (message.name === "/cc/115" && message.value == 127) {
        // left
        const newPosition = camera.position.clone();
        newPosition.y -= AMOUNT;
        tween(camera.position, newPosition, 200, null, () => {
            camera.lookAt(new THREE.Vector3());
        });
    }
});

const animatables = [
    PlanetEarth,
    Words,
    Rocks,
    IncomingGrid,
    Circles,
    Particles
];

const effects = [
    BackgroundOpacity
]

animatables.forEach((a) => {
    try {
        a.show()
    } catch (e) {
        console.error(e);
    }
});

function animate() {
    animatables.forEach((animatable) => {
        animatable.animate();
    });

    /*renderer.render(scene, camera);*/
    composer.render();
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
