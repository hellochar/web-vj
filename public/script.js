var socket = io();
var canvas = $("<canvas>").appendTo("body").css({
    width: "100%",
    height: "100%",
    background: "black"
}).attr({
    width: $("body").width(),
    height: $("body").height()
});
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, canvas.width() / canvas.height(), 1, 10000);
camera.position.set(0, 0, 100);
camera.lookAt(new THREE.Vector3(0, 0, 0));
var renderer = new THREE.WebGLRenderer({
    canvas: canvas[0]
});
var Words = new ((function () {
    function class_1() {
        this.words = [
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
        this.div = $("<div></div>").addClass("words").prependTo("body");
        this.div.css({
            "line-height": $("body").width() + "px"
        });
    }
    class_1.prototype.animate = function () {
        var period = 1000;
        var showDuration = 200;
        if (Date.now() % period < 16) {
            var wordList = this.words[Math.floor(this.words.length * Math.random())];
            var wordList2 = wordList.split(" ");
            var word = wordList2[Math.floor(wordList2.length * Math.random())];
            this.div.text(word);
        }
        else if (Date.now() % period > showDuration) {
            this.div.text("");
        }
    };
    return class_1;
})());
var PlanetEarth = new ((function () {
    function class_2() {
        var _this = this;
        this.video = $("<video autoplay src='planetearth.mp4'></video>")[0];
        this.video.volume = 0;
        this.video.onplay = function () {
            _this.video.currentTime = 3 * 60 + 43;
            _this.texture = new THREE.Texture(_this.video);
            _this.mesh = new THREE.Mesh(new THREE.SphereGeometry(50, 12, 12), new THREE.MeshBasicMaterial({ map: _this.texture }));
            scene.add(_this.mesh);
        };
    }
    class_2.prototype.animate = function () {
        if (this.texture && this.mesh) {
            this.mesh.rotation.y += 0.002;
            this.texture.needsUpdate = true;
        }
    };
    return class_2;
})());
socket.on("message", function (message) {
    if (message.name == "/note/9" && message.value == 127) {
    }
});
var animatables = [
    PlanetEarth,
    Words
];
function animate() {
    animatables.forEach(function (animatable) {
        animatable.animate();
    });
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
