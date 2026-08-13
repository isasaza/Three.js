
var scene, camera, renderer;
var figuresGeo = [];   
var count = 0;         
var toAlter = 1;        

init();
animate();


//  Three.js
function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(20, 20, 20);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('app') });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);

    var gridHelper = new THREE.GridHelper(100, 50);
    scene.add(gridHelper);

    var axesHelper = new THREE.AxesHelper(20);
    scene.add(axesHelper);

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}


function graficar() {
    var inputs = document.querySelectorAll('input[data-vector]');
    var u = { x: 0, y: 0, z: 0 };
    var v = { x: 0, y: 0, z: 0 };

    inputs.forEach(function (input) {
        var vec = input.getAttribute('data-vector');
        var axis = input.getAttribute('name');
        var value = parseFloat(input.value) || 0;
        if (vec === 'U') u[axis] = value;
        if (vec === 'V') v[axis] = value;
    });

    var dir = new THREE.Vector3(u.x, u.y, u.z);
    var origin = new THREE.Vector3(0, 0, 0);
    var length = dir.length();
    if (length > 0) {
        var arrowU = new THREE.ArrowHelper(dir.clone().normalize(), origin, length, 0xff0000);
        scene.add(arrowU);
    }

    var dirV = new THREE.Vector3(v.x, v.y, v.z);
    var lengthV = dirV.length();
    if (lengthV > 0) {
        var arrowV = new THREE.ArrowHelper(dirV.clone().normalize(), origin, lengthV, 0x0000ff);
        scene.add(arrowV);
    }
}

// Creación de figuras

function creationOfFigures(figure) { // box, torus, cone
    var col = +('0x' + Math.floor(Math.random() * 16777215).toString(16));
    var validateParams = callParameters(figure, col);
}


function callParameters(figure, col) {
    var validateParams = false;

    switch (figure) {
        case 'box':
            var message = 'Please enter the parameters of BoxGeometry \n(width: Float, height: Float, depth: Float)';
            var datas = prompt(message, "w,h,z");
            validateParams = validateData(datas, "w,h,z");

            if (validateParams) {
                var values = cleanParamsUI(datas, ',');
                var geometry = new THREE.BoxGeometry(values[0], values[1], values[2]);
                drawObjects(geometry, col);
            } else {
                document.getElementById('warningMssgI').style.display = 'block';
            }
            break;

        case 'torus':
            var message = 'Please enter the parameters of TorusGeometry \n(radius: Float, tube: Float, radialSegments: Integer, tubularSegments: Integer)';
            var datas = prompt(message, "r,rt,rs,ts");
            validateParams = validateData(datas, "r,rt,rs,ts");

            if (validateParams) {
                var values = cleanParamsUI(datas, ',');
                var geometry = new THREE.TorusGeometry(values[0], values[1], values[2], values[3]);
                drawObjects(geometry, col);
            } else {
                document.getElementById('warningMssgI').style.display = 'block';
            }
            break;

        case 'cone':
            var message = 'Please enter the parameters of ConeGeometry \n(radius: Float, height: Float, radialSegments: Integer)';
            var datas = prompt(message, "r,h,rs");
            validateParams = validateData(datas, "r,h,rs");

            if (validateParams) {
                var values = cleanParamsUI(datas, ',');
                var geometry = new THREE.ConeGeometry(values[0], values[1], values[2]);
                drawObjects(geometry, col);
            } else {
                document.getElementById('warningMssgI').style.display = 'block';
            }
            break;
    }
    return validateParams;
}

// Valida
function validateData(datas, conditionValidation) {
    if (datas) {
        return datas != conditionValidation;
    }
    return false;
}

// Convierte el texto "10,3,16,100" en un arreglo de números [10,3,16,100]
function cleanParamsUI(params, flag) {
    var value = params.split(flag);
    for (var i = 0; i < value.length; i++) {
        value[i] = parseFloat(value[i]);
    }
    return value;
}


// Dibujar 
function drawObjects(geometry, col, isWireframe) {
    count++;
    var material = new THREE.MeshBasicMaterial({ color: col, wireframe: isWireframe || false });
    var objectToAdd = new THREE.Mesh(geometry, material);
    objectToAdd.name = "figura" + count;
    objectToAdd.id = "figura" + count;

    figuresGeo.push(objectToAdd); 
    scene.add(objectToAdd);

    document.getElementById('warningMssgI').style.display = 'none';
    showAllObjectUI(figuresGeo[figuresGeo.length - 1]);
}


function showAllObjectUI(fig) {
    document.getElementById('selectModel').style.display = 'block';

    var node = document.createElement("LI");
    var textnode = document.createTextNode(JSON.stringify(fig.name));
    node.appendChild(textnode);
    node.setAttribute("style", "cursor: pointer; margin-bottom:10px; margin-top: 10px;");
    node.setAttribute("onclick", "selectObject(" + JSON.stringify(fig.name) + ")");

    document.getElementById("myList").appendChild(node);
}


function selectObject(tra) {
    alert("You have selected the figure " + tra);
    toAlter = tra.replace(/\D/g, '');
}


function translateOBJ(caseToDo) {
    var tam = figuresGeo.length;
    if (tam > 0) {
        switch (caseToDo) {
            case 'translate':
                figuresGeo[toAlter - 1].position.set(10, 0, 0);
                break;
            case 'rotate':
                figuresGeo[toAlter - 1].rotateX(45 * (Math.PI) / 180);
                break;
            case 'scale':
                figuresGeo[toAlter - 1].scale.set(2, 2, 2);
                break;
        }
        show2hide('none', 'none');
    } else {
        show2hide('none', 'block');
    }
}


function show2hide(mssg1, mssg2) {
    document.getElementById('warningMssgI').style.display = mssg1;
    document.getElementById('warningMssgnf').style.display = mssg2;
}
