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
    canvas: <HTMLCanvasElement> canvas[0]
});

interface Animatable {
    animate(): void;
}

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

    public div = $("<div></div>").addClass("words").prependTo("body");

    constructor() {
        this.div.css({
            "line-height": $("body").width() + "px"
        });
    }

    public animate() {
        const period = 1000;
        const showDuration = 200;

        if (Date.now() % period < 16) {
            const wordList = this.words[Math.floor(this.words.length * Math.random())];
            const wordList2 = wordList.split(" ");
            const word = wordList2[Math.floor(wordList2.length * Math.random())];
            this.div.text(word);
        } else if (Date.now() % period > showDuration) {
            this.div.text("");
        }
    }
});

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
            scene.add( this.mesh );
        };
    }

    public animate() {
        if (this.texture && this.mesh) {
            this.mesh.rotation.y += 0.002;
            this.texture.needsUpdate = true;
        }

    }
});


interface IMessage {
    name: string;
    value: number;
}

socket.on("message", (message: IMessage) => {
    if (message.name == "/note/9" && message.value == 127) {
    }
});

const animatables = [
    PlanetEarth,
    Words
];

function animate() {
    animatables.forEach((animatable) => {
        animatable.animate();
    });

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
