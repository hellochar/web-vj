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
    canvas: canvas[0],
    preserveDrawingBuffer: true,
    alpha: true
});
renderer.autoClearColor = false;
var BackgroundOpacity = new ((function () {
    function class_1() {
        this.blackBackground = new THREE.Mesh(new THREE.PlaneBufferGeometry(10000, 10000), new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 1, transparent: true }));
        this.blackBackground.position.z = -5000;
        this.blackBackground.rotation.z = Math.PI / 2;
        scene.add(this.blackBackground);
    }
    class_1.prototype.param = function (v) {
        this.blackBackground.material.opacity = Math.pow(v / 127, 4);
    };
    return class_1;
})());
var Words = new ((function () {
    function class_2() {
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
        this.div = $("<div></div>").addClass("words");
        this.period = 1000;
        this.div.css({
            "line-height": $("body").height() + "px"
        });
    }
    class_2.prototype.show = function () {
        this.div.prependTo("body");
    };
    class_2.prototype.hide = function () {
        this.div.detach();
    };
    class_2.prototype.param = function (value) {
        this.period = value / 127 * 2000 + 200;
    };
    class_2.prototype.animate = function () {
        var showDuration = 200;
        if (Date.now() % this.period < 16) {
            var wordList = this.words[Math.floor(this.words.length * Math.random())];
            var wordList2 = wordList.split(" ");
            var word = wordList2[Math.floor(wordList2.length * Math.random())];
            this.div.text(word);
        }
        else if (Date.now() % this.period > showDuration) {
            this.div.text("");
        }
    };
    return class_2;
})());
function tween(v, to, millis, then) {
    var start = v.clone();
    var startTime;
    function update(timestamp) {
        if (!startTime)
            startTime = timestamp;
        var timeDelta = timestamp - startTime;
        if (timeDelta > startTime)
            timeDelta = millis;
        var lerpedValue = Math.pow(timeDelta / millis, 1 / 4);
        v.copy(start);
        v.lerp(to, lerpedValue);
        if (timeDelta < millis) {
            requestAnimationFrame(update);
        }
        else {
            if (then) {
                then();
            }
        }
    }
    requestAnimationFrame(update);
}
var PlanetEarth = new ((function () {
    function class_3() {
        var _this = this;
        this.video = $("<video autoplay src='planetearth.mp4'></video>")[0];
        this.video.volume = 0;
        this.video.onplay = function () {
            _this.video.currentTime = 3 * 60 + 43;
            _this.texture = new THREE.Texture(_this.video);
            _this.mesh = new THREE.Mesh(new THREE.SphereGeometry(50, 12, 12), new THREE.MeshBasicMaterial({ map: _this.texture }));
        };
    }
    class_3.prototype.param = function (value) {
        this.video.playbackRate = Math.pow(5, 2 * (value / 127 - 0.5));
    };
    class_3.prototype.show = function () {
        scene.add(this.mesh);
        this.mesh.scale.set(0, 0, 0);
        tween(this.mesh.scale, new THREE.Vector3(1, 1, 1), 300);
    };
    class_3.prototype.hide = function () {
        var _this = this;
        tween(this.mesh.scale, new THREE.Vector3(0, 0, 0), 100, function () {
            scene.remove(_this.mesh);
        });
    };
    class_3.prototype.animate = function () {
        if (this.texture && this.mesh) {
            this.mesh.rotation.y += 0.002 * this.video.playbackRate;
            this.texture.needsUpdate = true;
        }
    };
    return class_3;
})());
var Rocks = new ((function () {
    function class_4() {
        this.object = new THREE.Object3D();
        this.speed = 0.02;
        var geometry = new THREE.CubeGeometry(15, 15, 15);
        var material = new THREE.MeshNormalMaterial({});
        for (var i = 0; i < 200; i++) {
            var rock = new THREE.Mesh(geometry, material);
            var variation = 500;
            rock.position.set(variation * (Math.random() - 0.5), variation * (Math.random() - 0.5), variation * (Math.random() - 0.5));
            this.object.add(rock);
        }
    }
    class_4.prototype.param = function (value) {
        this.speed = Math.pow(value / 127, 2) * 0.5;
    };
    class_4.prototype.show = function () {
        scene.add(this.object);
        this.object.scale.set(0, 0, 0);
        tween(this.object.scale, new THREE.Vector3(1, 1, 1), 1000);
    };
    class_4.prototype.hide = function () {
        var _this = this;
        tween(this.object.scale, new THREE.Vector3(0, 0, 0), 300, function () {
            scene.remove(_this.object);
        });
    };
    class_4.prototype.animate = function () {
        var _this = this;
        this.object.children.forEach(function (rock) {
            var worldPos = rock.getWorldPosition();
            rock.rotation.x += worldPos.x / 1000 * _this.speed * 20;
            rock.rotation.y += worldPos.y / 1000 * _this.speed * 20;
            rock.rotation.z += 0.001 / Math.max(worldPos.z, 0.01) * _this.speed * 20;
            rock.position.x += 0.5 * _this.speed * 20 * Math.cos(Date.now() / 1000);
        });
        this.object.rotateX(this.speed);
    };
    return class_4;
})());
var IncomingGrid = new ((function () {
    function class_5() {
        this.gridHelper = new THREE.GridHelper(3000, 15);
        this.gridHelper.rotateX(Math.PI / 2);
    }
    class_5.prototype.param = function (value) {
        this.gridHelper.rotation.z = value / 127 - 0.5;
    };
    class_5.prototype.show = function () {
        scene.add(this.gridHelper);
    };
    class_5.prototype.hide = function () {
        scene.remove(this.gridHelper);
    };
    class_5.prototype.animate = function () {
        var scale = 1 + 0.1 * Math.pow(Math.sin(Date.now() / 600), 320);
        this.gridHelper.scale.set(scale, scale, scale);
        this.gridHelper.position.z = (2 * Math.sin(Date.now() / 4000) - 1) * 10 - 400;
    };
    return class_5;
})());
var noteStates = {};
socket.on("message", function (message) {
    console.log(message);
    var ON_OFF_MAPPING = {
        "/note/9": PlanetEarth,
        "/note/10": Words,
        "/note/11": Rocks,
        "/note/12": IncomingGrid
    };
    var PARAMETER_MAPPING = {
        "/cc/41": PlanetEarth,
        "/cc/42": Words,
        "/cc/43": Rocks,
        "/cc/44": IncomingGrid,
        "/cc/21": BackgroundOpacity
    };
    var toggledAnimatable = ON_OFF_MAPPING[message.name];
    var parameterChangedAnimatable = PARAMETER_MAPPING[message.name];
    if (toggledAnimatable && message.value == 127) {
        noteStates[message.name] = !noteStates[message.name];
        if (noteStates[message.name]) {
            toggledAnimatable.show();
        }
        else {
            toggledAnimatable.hide();
        }
    }
    else if (parameterChangedAnimatable) {
        parameterChangedAnimatable.param(message.value);
    }
});
var animatables = [
    PlanetEarth,
    Words,
    Rocks,
    IncomingGrid
];
var effects = [
    BackgroundOpacity
];
function animate() {
    animatables.forEach(function (animatable) {
        animatable.animate();
    });
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
