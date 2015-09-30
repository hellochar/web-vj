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
const renderer = new THREE.WebGLRenderer({
    canvas: <HTMLCanvasElement> canvas[0],
    preserveDrawingBuffer: true,
    alpha: true
});
renderer.autoClearColor = false;

const composer = new THREE.EffectComposer(renderer);
composer.addPass( new THREE.RenderPass(scene, camera) );

var effect = new THREE.ShaderPass( THREE.DotScreenShader );
effect.uniforms[ 'scale' ].value = 4;
composer.addPass( effect );

var effect2 = new THREE.ShaderPass( THREE.RGBShiftShader );
effect2.uniforms[ 'amount' ].value = 0.0015;
effect2.renderToScreen = true;
composer.addPass( effect2 );

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
        this.blackBackground.position.z = -5000;
        this.blackBackground.rotation.z = Math.PI / 2;
        scene.add(this.blackBackground);
    }

    param(v: number) {
        this.blackBackground.material.opacity = Math.pow(v / 127, 4);
    }
});

const Words: Animatable = new (class {
    public words = [
        "abstract not concrete",
        "aesthetic having with the appreciation beauty",
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

function tween(v: THREE.Vector3, to: THREE.Vector3, millis: number, then?: () => any) {
    const start = v.clone();
    let startTime: number;
    function update(timestamp) {
        if (!startTime) startTime = timestamp;
        let timeDelta = timestamp - startTime;
        if (timeDelta > startTime) timeDelta = millis;
        const lerpedValue = Math.pow(timeDelta / millis, 1/4);

        v.copy(start);
        v.lerp(to, lerpedValue);

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
            this.video.currentTime = 3*60 + 43;
            this.texture = new THREE.Texture(this.video);
            this.mesh = new THREE.Mesh(
                new THREE.SphereGeometry(50, 12, 12),
                new THREE.MeshBasicMaterial({map: this.texture})
            );
        };
    }

    public param(value: number) {
        this.video.playbackRate = Math.pow(5, 2*(value / 127 - 0.5));
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
            this.mesh.rotation.y += 0.002 * this.video.playbackRate;
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
        "/note/12": IncomingGrid
    };
    const PARAMETER_MAPPING: {[name: string]: Parameterizable} = {
        "/cc/41": PlanetEarth,
        "/cc/42": Words,
        "/cc/43": Rocks,
        "/cc/44": IncomingGrid,

        "/cc/21": BackgroundOpacity
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
});

const animatables = [
    PlanetEarth,
    Words,
    Rocks,
    IncomingGrid
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
