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
scene.add(camera);
var renderer = new THREE.WebGLRenderer({
    canvas: canvas[0],
    preserveDrawingBuffer: true,
    alpha: true
});
renderer.autoClearColor = false;
var composer = new THREE.EffectComposer(renderer);
composer.addPass(new THREE.RenderPass(scene, camera));
var dotScreenEffect = new THREE.ShaderPass(THREE.DotScreenShader);
dotScreenEffect.uniforms['scale'].value = 4;
dotScreenEffect.enabled = false;
composer.addPass(dotScreenEffect);
var rgbShiftEffect = new THREE.ShaderPass(THREE.RGBShiftShader);
rgbShiftEffect.uniforms['amount'].value = 0.0015;
rgbShiftEffect.enabled = false;
composer.addPass(rgbShiftEffect);
var filmPassEffect = new THREE.FilmPass(1000.5, 10.125, 2000, false);
filmPassEffect.enabled = false;
composer.addPass(filmPassEffect);
var kaleidoEffect = new THREE.ShaderPass(THREE.KaleidoShader);
kaleidoEffect.enabled = false;
kaleidoEffect.uniforms['resolution'].value.set(window.innerWidth, window.innerHeight);
composer.addPass(kaleidoEffect);
var edgeEffect = new THREE.ShaderPass(THREE.EdgeShader);
edgeEffect.enabled = false;
composer.addPass(edgeEffect);
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
var BackgroundOpacity = new ((function () {
    function class_1() {
        this.blackBackground = new THREE.Mesh(new THREE.PlaneBufferGeometry(10000, 10000), new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 1, transparent: true }));
        this.blackBackground.position.z = -3000;
        this.blackBackground.rotation.z = Math.PI / 2;
        camera.add(this.blackBackground);
    }
    class_1.prototype.param = function (v) {
        this.blackBackground.material.opacity = Math.pow(1 - v / 127, 4);
    };
    return class_1;
})());
var Words = new ((function () {
    function class_2() {
        this.words = [
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
function tween(v, to, millis, then, onUpdate) {
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
        if (onUpdate) {
            onUpdate();
        }
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
            _this.video.currentTime = 38;
            _this.texture = new THREE.Texture(_this.video);
            _this.mesh = new THREE.Mesh(new THREE.SphereGeometry(50, 12, 12), new THREE.MeshBasicMaterial({ map: _this.texture }));
        };
        this.video.ontimeupdate = function () {
            if (_this.video.currentTime > 13 * 60 + 24) {
                _this.video.currentTime = 38;
                _this.video.play();
            }
        };
    }
    class_3.prototype.param = function (value) {
        this.video.playbackRate = Math.pow(125, value / 127);
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
            this.mesh.rotation.y += 0.0002 * this.video.playbackRate;
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
var Circles = new ((function () {
    function class_6() {
        this.object = new THREE.Object3D();
        this.delta = 0;
        this.speed = 1;
        var extent = 4000;
        var distance = 150;
        var geometry = new THREE.SphereGeometry(10, 4, 3);
        var material = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            shading: THREE.FlatShading
        });
        for (var x = -extent; x < extent; x += distance) {
            for (var z = 100; z > 100 - extent; z -= distance) {
                var sphere = new THREE.Mesh(geometry, material);
                sphere.position.set(x, -100, z);
                sphere.rotation.set(Math.random() * 1, Math.random() * 1, Math.random() * 1);
                this.object.add(sphere);
            }
        }
        scene.add(new THREE.AmbientLight(0x222222));
        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
    }
    class_6.prototype.param = function (value) {
        this.speed = value / 20 + 1;
    };
    class_6.prototype.show = function () {
        scene.add(this.object);
    };
    class_6.prototype.hide = function () {
        scene.remove(this.object);
    };
    class_6.prototype.animate = function () {
        var _this = this;
        this.delta += this.speed;
        this.object.children.forEach(function (child) {
            var scale = 1.5 * Math.sin(child.position.z / 900 - _this.delta / 19) + 1.5;
            child.scale.set(scale, scale, scale);
        });
    };
    return class_6;
})());
var Particles = new ((function () {
    function class_7() {
        this.extent = 2000;
        this.object = new THREE.Object3D();
        this.geometry = new THREE.Geometry();
        this.starTexture = THREE.ImageUtils.loadTexture("star.png");
        this.material = new THREE.PointCloudMaterial({
            color: 0xff3366,
            map: this.starTexture,
            sizeAttenuation: true,
            size: 70,
            vertexColors: THREE.VertexColors,
            alphaTest: 0.8,
            transparent: true
        });
        this.speed = 1;
        for (var i = 0; i < 2000; i++) {
            this.geometry.vertices.push(new THREE.Vector3((Math.random() * 2 - 1) * this.extent, (Math.random() * 2 - 1) * this.extent, (Math.random() * 2 - 1) * this.extent));
            this.geometry.colors.push(new THREE.Color().setHSL(i / 2000, 1, 0.8));
        }
        var pointCloud = new THREE.PointCloud(this.geometry, this.material);
        this.object.add(pointCloud);
        this.object.position.z = -this.extent / 2;
        this.param(0);
    }
    class_7.prototype.param = function (value) {
        this.speed = Math.exp(value / 127 * 4 + 1) * 1e-4;
    };
    class_7.prototype.show = function () {
        scene.add(this.object);
        this.object.scale.set(0, 0, 0);
        tween(this.object.scale, new THREE.Vector3(1, 1, 1), 1000);
    };
    class_7.prototype.hide = function () {
        scene.remove(this.object);
    };
    class_7.prototype.animate = function () {
        var _this = this;
        this.material.color.offsetHSL(0.0001, 0, 0);
        var center = new THREE.Vector3(0, 0, -1000);
        var scale = this.speed;
        this.geometry.vertices.forEach(function (v) {
            var vx = v.x * scale, vy = v.y * scale, vz = (v.z - 800) * scale;
            v.x += vx * vx - vy + 3 * vz + 3000 * scale + Math.sin(Date.now() / 3000) * 1000 * scale;
            v.y += vx / Math.max(vy, 0.1) + vx - 0.03 + vz;
            v.z += vz - vx * vy + Math.sin(vz * 40) + Math.cos(Date.now() / 2200) * 1000 * scale;
            if (v.distanceTo(center) > _this.extent) {
                v.set((Math.random() * 2 - 1) * _this.extent, (Math.random() * 2 - 1) * _this.extent, (Math.random() * 2 - 1) * _this.extent);
            }
        });
        this.geometry.verticesNeedUpdate = true;
    };
    return class_7;
})());
var noteStates = {};
socket.on("message", function (message) {
    console.log(message);
    var ON_OFF_MAPPING = {
        "/note/9": PlanetEarth,
        "/note/10": Words,
        "/note/11": Rocks,
        "/note/12": IncomingGrid,
        "/note/25": Circles,
        "/note/26": Particles,
    };
    var PARAMETER_MAPPING = {
        "/cc/41": PlanetEarth,
        "/cc/42": Words,
        "/cc/43": Rocks,
        "/cc/44": IncomingGrid,
        "/cc/45": Circles,
        "/cc/46": Particles,
        "/cc/21": BackgroundOpacity,
        "/cc/22": {
            param: function (v) {
                if (v === 0) {
                    dotScreenEffect.enabled = false;
                }
                else {
                    dotScreenEffect.enabled = true;
                    dotScreenEffect.uniforms['scale'].value = Math.pow(v / 127, 3) * 4;
                }
            }
        },
        "/cc/23": {
            param: function (v) {
                if (v === 0) {
                    rgbShiftEffect.enabled = false;
                }
                else {
                    rgbShiftEffect.enabled = true;
                    rgbShiftEffect.uniforms['amount'].value = v / 127;
                }
            }
        },
        "/cc/24": {
            param: function (v) {
                if (v === 0) {
                    filmPassEffect.enabled = false;
                }
                else {
                    filmPassEffect.enabled = true;
                    filmPassEffect.uniforms['sIntensity'].value = v / 12.7;
                }
            }
        },
        "/cc/25": {
            param: function (v) {
                if (v === 0) {
                    kaleidoEffect.enabled = false;
                }
                else {
                    kaleidoEffect.enabled = true;
                    kaleidoEffect.uniforms['sides'].value = Math.floor(1 + (v - 1) / 126 * (24 - 1));
                }
            }
        },
        "/cc/26": {
            param: function (v) {
                if (v === 0) {
                    edgeEffect.enabled = false;
                }
                else {
                    edgeEffect.enabled = true;
                    edgeEffect.uniforms['wet'].value = v / 127;
                }
            }
        }
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
    var AMOUNT = 80;
    if (message.name === "/cc/116" && message.value == 127) {
        var newPosition = camera.position.clone();
        newPosition.x -= AMOUNT;
        tween(camera.position, newPosition, 200, null, function () {
            camera.lookAt(new THREE.Vector3());
        });
    }
    if (message.name === "/cc/117" && message.value == 127) {
        var newPosition = camera.position.clone();
        newPosition.x += AMOUNT;
        tween(camera.position, newPosition, 200, null, function () {
            camera.lookAt(new THREE.Vector3());
        });
    }
    if (message.name === "/cc/114" && message.value == 127) {
        var newPosition = camera.position.clone();
        newPosition.y += AMOUNT;
        tween(camera.position, newPosition, 200, null, function () {
            camera.lookAt(new THREE.Vector3());
        });
    }
    if (message.name === "/cc/115" && message.value == 127) {
        var newPosition = camera.position.clone();
        newPosition.y -= AMOUNT;
        tween(camera.position, newPosition, 200, null, function () {
            camera.lookAt(new THREE.Vector3());
        });
    }
});
var animatables = [
    PlanetEarth,
    Words,
    Rocks,
    IncomingGrid,
    Circles,
    Particles
];
var effects = [
    BackgroundOpacity
];
animatables.forEach(function (a) {
    try {
        a.show();
    }
    catch (e) {
        console.error(e);
    }
});
function animate() {
    animatables.forEach(function (animatable) {
        animatable.animate();
    });
    composer.render();
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
