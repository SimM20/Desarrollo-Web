let circulos = [];
let fantasma = {
    activo: true,
    pos: { x: 0, y: 0 },
    vel: { x: 0, y: 0 },
    ace: { x: 0, y: 0 },
    ang: 0,
    masa: 8,
    radio: 13,
};

//letiables
const FRICCION = -300;
const POTENCIA_TIRO = 0.1;

let puntaje = 0;
let marcador = 10;
let puntajeMaximo = 10;
let condicionVictoria = false;
var extraPotencia = 0
var distanciaClick = 0
var diferenciaDistancia = 0

//Defino el palo
let palo = {
    posi: { x: 100, y: 100 },
    posf: { x: 0, y: 0 },
};

//defino cada uno de los hoyos
let hoyo0 = {
    pos: { x: 0, y: 0 },
};
let hoyo1 = {
    pos: { x: 0, y: 0 },
};
let hoyo2 = {
    pos: { x: 0, y: 0 },
};
let hoyo3 = {
    pos: { x: 0, y: 0 },
};

//defino las zonas de efecto
let zona1 = {
    pos: { x: 300, y: 20 },
    w: 150,
    h: 100,
};

//Creo circulos dandoles posicion, velocidad, radio y los seteo como activos
function crearCirculo(pos, vel, radio) {
    for (let i = 0; i < circulos.length; i++) {
        if (!circulos[i].activo) {
            // Reciclo bola
            circulos[i].pos = pos;
            circulos[i].vel = vel;
            circulos[i].radio = radio;
            circulos[i].activo = true;
            return circulos[i];
        }
    }
    // Nueva bola
    let nuevoCirculo = {
        activo: true,
        pos: pos,
        vel: { x: 0, y: 0 },
        ace: { x: 0, y: 0 },
        ang: 0,
        masa: 8,
        radio: 13,
    };
    circulos.push(nuevoCirculo);
}

function setup() {
    createCanvas(650, 400); //creo X cantidad de circulos

    crearCirculo({ x: 200, y: 200 })

    for (let x = 0; x < 4; x++) {
        for (let y = 0; y <= x; y++) {
            crearCirculo({ x: x * 26 + 400, y: y * 28 + 200 - x * 13 })
        }
    }
}

function draw() {
    let pasos = 50; //Fisicas
    let dt = deltaTime / 1000 / pasos; //le doy las respectivas posiciones a los hoyos

    hoyo0.pos = { x: 0, y: 0 };
    hoyo1.pos = { x: width, y: 0 };
    hoyo2.pos = { x: 0, y: height - 25 };
    hoyo3.pos = { x: width, y: height - 25 }; //le doy las respectivas posiciones al palo

    palo.posi = { x: mouseX, y: mouseY };
    palo.posf = { x: mouseX, y: mouseY };


    //Verifico la colision para todos los circulos ya creados, 50 verificaciones

    for (var r = 0; r < pasos; r++) {
        for (let i = 0; i < circulos.length; i++) {
            if (!circulos[i].activo) continue
            calcularFisicas(circulos[i], dt)
            bordesDePantalla(circulos[i])
            verificarColisionZonas(circulos[i], zona1)
            chequearBolaHoyo(hoyo0)
            chequearBolaHoyo(hoyo1)
            chequearBolaHoyo(hoyo2)
            chequearBolaHoyo(hoyo3)
            let dir = limitar(circulos[i].vel, 1)
            let fuerza = mul(dir, FRICCION)
            aplicarFuerza(circulos[i], fuerza)
            for (let j = i + 1; j < circulos.length; j++) {
                if (!circulos[j].activo) continue
                NEWverifiColisCircs(circulos[i], circulos[j])

            }
        }
    }

    //Dibujo

    background(0, 153, 0);

    strokeWeight(1)
    fill(200, 0, 0);
    rect(zona1.pos.x - 60, zona1.pos.y, zona1.w, zona1.h);
    textSize(45);
    fill(0, 102, 153, 51);
    text(">", 350, 90);
    text("<", 260, 90);
    text("^", 305, 65);
    text(" v", 296, 114);
    textSize(90);
    fill(0);
    text(".", 188, 195);
    line(200, 1000, 200, -1000);
    strokeWeight(1)
    if (condicionVictoria) {
        textSize(90);
        fill(0);
        text("YOU WIN!!", width / 7, height / 2);
        circulos[0].active = false;
    } //dibujo los circulos solo si estos estan activos, por lo que al tocar con los agujeros estos se desactivan y dejan de pintarse

    for (let t = 0; t < circulos.length; t++) {
        if (circulos[t].activo) {
            //si la bola es la bola 0, se la pinta de blanco
            if (t == 0) {
                fill(255);
            } //si no es la bola 0 se la rellena de otros colores
            else {
                fill(t * 210, t * 15, t * 90);
            }
            circle(circulos[t].pos.x, circulos[t].pos.y, circulos[t].radio * 2);
        }
    } // agujeros, rectangulo y puntaje
    strokeWeight(0)
    fill(0);
    circle(5, 5, 40 * 2);
    circle(width - 5, 5, 40 * 2);
    circle(5, height - 35, 40 * 2);
    circle(width - 5, height - 35, 40 * 2);
    fill(255);
    rect(0, height - 30, width, 100);
    fill(0);
    textSize(18);
    text("Bolas restantes: " + puntajeMaximo, 10, height - 8);
    text("POOL GAME", 500, height - 8);

    //palo
    strokeWeight(5);

    var angX = cos(circulos[0].ang)
    var angY = sin(circulos[0].ang)

    var puntoChoque = { x: circulos[0].pos.x + circulos[0].radio * angX, y: circulos[0].pos.y + circulos[0].radio * angY }

    var distanciaBolaPalo = magnitud(restar(circulos[0].pos, palo.posi))
    var direccionPalo = normalizado(restar(circulos[0].pos, palo.posi))
    var largoPalo = mul(direccionPalo, -100 - extraPotencia)
    var largoPalo2 = mul(direccionPalo, -circulos[0].radio - extraPotencia)

    if (magnitud(circulos[0].vel) < 3) {
        stroke(145, 51, 0)
        line(circulos[0].pos.x + largoPalo2.x, circulos[0].pos.y + largoPalo2.y, circulos[0].pos.x + largoPalo.x, circulos[0].pos.y + largoPalo.y);
        preview()
        strokeWeight(0)
        stroke(0)
    }
    strokeWeight(1);
    text(" Potencia " + extraPotencia, 50, 20);
}

//revisa si las bolas entraron o no en los agujeros
function chequearBolaHoyo(hoyo) {
    for (let i = 0; i < circulos.length; i++) {
        let dif = restar(circulos[i].pos, hoyo.pos);
        let distancia = magnitud(dif); //si hay colision, o sea que la distancia es menor al radio de ambos circulos
        if (circulos[i].activo && distancia < circulos[i].radio + 35) {
            if (circulos[i] != circulos[0]) {
                circulos[i].activo = false;
                puntajeMaximo--;
                if (puntajeMaximo === 0) {
                    condicionVictoria = true;
                }
            } else {
                //este else hace que si la bola que entro es blanca, si eso sucede la teletransporta al punto 0,0 y resta un punto al jugador
                circulos[0].pos = { x: 200, y: 200 };
                circulos[0].vel = { x: 0, y: 0 }; //puntaje-=1
            }
        }
    }
}

//Verificamos la colision entre dos circulos
function verificarColisionCirculos(circulo1, circulo2) {
    let dif = restar(circulo1.pos, circulo2.pos);
    let distancia = magnitud(dif); //si hay colision, o sea que la distancia es menor al radio de ambos circulos
    if (distancia < circulo1.radio + circulo2.radio) {
        let interseccion = (circulo1.radio + circulo2.radio - distancia) * 50;
        let dir = normalizado(dif); //aplicamos fuerzas contrarias para que los objetos se repelan

        aplicarFuerza(circulo1, mul(dir, interseccion));
        aplicarFuerza(circulo2, mul(dir, -interseccion));
    }
}

function chequeoColision(circ1, circ2) {
    var dif = restar(circ1.pos, circ2.pos);
    var longi = magnitud(dif);
    return (longi < circ1.radio + circ2.radio)

    if (circ1.pos.y < circ1.radio) {
        circ1.pos.y = circ1.radio;
        circ1.vel.y = -circ1.vel.y;
    } //izquierda
    if (circ1.pos.x < circ1.radio) {
        circ1.pos.x = circ1.radio;
        circ1.vel.x = -circ1.vel.x;
    } //abajo
    if (circ1.pos.y + circ1.radio > height - 30) {
        circ1.pos.y = height - circ1.radio - 30;
        circ1.vel.y = -circ1.vel.y;
    } //derecha
    if (circ1.pos.x + circ1.radio > width) {
        circ1.pos.x = width - circ1.radio;
        circ1.vel.x = -circ1.vel.x;
    }

    if (circ2.pos.y < circ2.radio) {
        circ2.pos.y = circ2.radio;
        circ2.vel.y = -circ2.vel.y;
    } //izquierda
    if (circ2.pos.x < circ2.radio) {
        circ2.pos.x = circ2.radio;
        circ2.vel.x = -circ2.vel.x;
    } //abajo
    if (circ2.pos.y + circ2.radio > height - 30) {
        circ2.pos.y = height - circ2.radio - 30;
        circ2.vel.y = -circ2.vel.y;
    } //derecha
    if (circ2.pos.x + circ2.radio > width) {
        circ2.pos.x = width - circ2.radio;
        circ2.vel.x = -circ2.vel.x;
    }
}

function NEWverifiColisCircs(circ1, circ2) {
    var dif = restar(circ1.pos, circ2.pos);
    var longi = magnitud(dif);

    if (longi < circ1.radio + circ2.radio) {
        var anormal = normalizado(restar(circ1.pos, circ2.pos));
        var paralela = {
            x: -anormal.y,
            y: anormal.x,
        };

        var u1 = escalar(circ1.vel, anormal);
        var u2 = escalar(circ2.vel, anormal);

        var p1 = escalar(circ1.vel, paralela);
        var p2 = escalar(circ2.vel, paralela);

        var m1 = circ1.masa;
        var m2 = circ2.masa;

        var v1 = ((m1 - m2) / (m1 + m2)) * u1 + ((2 * m2) / (m1 + m2)) * u2;
        var v2 = ((m2 - m1) / (m1 + m2)) * u2 + ((2 * m1) / (m1 + m2)) * u1;

        var vecNormal1 = mul(anormal, v1);
        var vecParalelo1 = mul(paralela, p1);
        var velFinal1 = sumar(vecNormal1, vecParalelo1);

        var vecNormal2 = mul(anormal, v2);
        var vecParalelo2 = mul(paralela, p2);
        var velFinal2 = sumar(vecNormal2, vecParalelo2);

        circ1.vel = velFinal1;
        circ2.vel = velFinal2;
        divorcio(circ1, circ2)
    }
}

function divorcio(circ1, circ2) {
    var dif = restar(circ1.pos, circ2.pos);
    var laSuma = sumar(circ1.pos, circ2.pos);

    var laDivision = division(laSuma, 2);
    var laNorma = normalizado(dif);

    var posFinalCirc1 = sumar(laDivision, mul(laNorma, circ1.radio));
    var posFinalCirc2 = sumar(laDivision, mul(mul(laNorma, -1), circ2.radio));

    circ1.pos = posFinalCirc1
    circ2.pos = posFinalCirc2
}

//simplemente checkea si hay colision o no con las zonas rojas
function verificarColisionZonas(circulos, zona) {
    let puntoCentralBolaBlanca = {
        pos: { x: circulos.pos.x, y: circulos.pos.y },
    }; // Limito puntoCentralBolaBlanca a los limites del rectangulo

    if (puntoCentralBolaBlanca.pos.x < zona.pos.x) {
        puntoCentralBolaBlanca.pos.x = zona.pos.x;
    }
    if (puntoCentralBolaBlanca.pos.x > zona.pos.x + zona.w) {
        puntoCentralBolaBlanca.pos.x = zona.pos.x + zona.w;
    }
    if (puntoCentralBolaBlanca.pos.y < zona.pos.y) {
        puntoCentralBolaBlanca.pos.y = zona.pos.y;
    }
    if (puntoCentralBolaBlanca.pos.y > zona.pos.y + zona.h) {
        puntoCentralBolaBlanca.pos.y = zona.pos.y + zona.h;
    }
    let dif = restar(puntoCentralBolaBlanca.pos, circulos.pos);
    let distancia = magnitud(dif); //si hay colision, o sea que la distancia es menor al radio de ambos circulos

    if (distancia < circulos.radio) {
        let interseccion = circulos.radio * 10;
        let dir = normalizado(dif); //aplicamos fuerzas contrarias para que los objetos se repelan
        aplicarFuerza(circulos, mul({ x: 0, y: 20 }, interseccion));
    }
}

function bordesDePantallaFantasma(circulo) {
    fill("#ffffff90")
    //arriba
    if (circulo.pos.y < circulo.radio) {
        circulo.pos.y = circulo.radio;
        circulo.vel.y = -circulo.vel.y;
        circle(circulo.pos.x, circulo.pos.y, circulo.radio * 2)
    } //izquierda
    if (circulo.pos.x < circulo.radio) {
        circulo.pos.x = circulo.radio;
        circulo.vel.x = -circulo.vel.x;
        circle(circulo.pos.x, circulo.pos.y, circulo.radio * 2)
    } //abajo
    if (circulo.pos.y + circulo.radio > height - 30) {
        circulo.pos.y = height - circulo.radio - 30;
        circulo.vel.y = -circulo.vel.y;
        circle(circulo.pos.x, circulo.pos.y, circulo.radio * 2)
    } //derecha
    if (circulo.pos.x + circulo.radio > width) {
        circulo.pos.x = width - circulo.radio;
        circulo.vel.x = -circulo.vel.x;
        circle(circulo.pos.x, circulo.pos.y, circulo.radio * 2)
    }
}

//seteo en una funcion los bordes de la mesa de pool
function bordesDePantalla(circulo) {
    //arriba
    if (circulo.pos.y < circulo.radio) {
        circulo.pos.y = circulo.radio;
        circulo.vel.y = -circulo.vel.y;
    } //izquierda
    if (circulo.pos.x < circulo.radio) {
        circulo.pos.x = circulo.radio;
        circulo.vel.x = -circulo.vel.x;
    } //abajo
    if (circulo.pos.y + circulo.radio > height - 30) {
        circulo.pos.y = height - circulo.radio - 30;
        circulo.vel.y = -circulo.vel.y;
    } //derecha
    if (circulo.pos.x + circulo.radio > width) {
        circulo.pos.x = width - circulo.radio;
        circulo.vel.x = -circulo.vel.x;
    }
}

function posicionTriangular(circ1, circ2) {
    for (var i = 0; i > circulos.length; i++) {
        for (var j = i + 1; j > circulos.length; j++) {
            if (circ1 != circulos[0]) { circ1.pos = { x: 300 + i, y: 300 + j } }
            else { circ1.pos = { x: 200, y: 200 } }
        }
    }

}

function mousePressed() {
    var dif = restar(palo.posf, circulos[0].pos)
    var distancia = magnitud(dif)
    distanciaClick = distancia
}

function mouseDragged() {
    //extraPotencia++
    var dif = restar(palo.posf, circulos[0].pos)
    var distancia = magnitud(dif)

    extraPotencia = distancia - distanciaClick
    if (extraPotencia < 0) {
        extraPotencia = 0
    }
    if (extraPotencia > 50) {
        extraPotencia = 50
    }
}

//click del mouse ejecuta la accion del golpe del palo, que solo funciona con la bola blanca
function mouseReleased() {
    let dif = restar(palo.posf, circulos[0].pos);
    let distancia = magnitud(dif);

    if (magnitud(circulos[0].vel) < 5) {
        let interseccion = (circulos[0].radio + distancia) * POTENCIA_TIRO * extraPotencia / 25;
        let dir = normalizado(dif); //aplicamos fuerzas contrarias para que los objetos se repelan
        aplicarImpulso(circulos[0], mul(dir, -interseccion));
    }
    extraPotencia = 0
}

function preview() {
    var distanciaBolaPalo = magnitud(restar(circulos[0].pos, palo.posi))
    var direccionPalo = normalizado(restar(circulos[0].pos, palo.posi))


    let dif = restar(palo.posf, circulos[0].pos);
    let distancia = magnitud(dif);

    let interseccion = (circulos[0].radio + distancia) * POTENCIA_TIRO * extraPotencia / 10;
    let dir = normalizado(dif); //aplicamos fuerzas contrarias para que los objetos se repelan
    var velocidadFantasma = mul(dir, -interseccion / circulos[0].masa);

    fantasma.pos = circulos[0].pos
    fantasma.vel = velocidadFantasma

    for (var i = 0; i < 500; i++) {
        calcularFisicas(fantasma, 1 / 30)
        if (fantasmaChoca()) {
            noStroke()
            fill("#ffffff90")
            circle(fantasma.pos.x, fantasma.pos.y, fantasma.radio * 2)
            break;

        }
        if (i % 50 == 0) {
            noStroke()
            fill("#ffffff50")
            circle(fantasma.pos.x, fantasma.pos.y, fantasma.radio)
        }
    }
}

function fantasmaChoca() {
    for (let j = 1; j < circulos.length; j++) {
        if (!circulos[j].activo) continue
        if (chequeoColision(fantasma, circulos[j])) {
            return true
        }
    }
    bordesDePantallaFantasma(fantasma)
    return false
}

//funcion para aplicar una fuerza a un cuerpo
function aplicarFuerza(cuerpo, fuerza) {
    cuerpo.ace = sumar(cuerpo.ace, division(fuerza, cuerpo.masa));
}

function aplicarImpulso(cuerpo, impulso) {
    cuerpo.vel = sumar(cuerpo.vel, mul(impulso, cuerpo.masa));
}

//funcion que calcula fisicas
function calcularFisicas(cuerpo, dt) {
    //aceleracion afec velocidad
    cuerpo.vel = sumar(cuerpo.vel, mul(cuerpo.ace, dt)); //velocidad afec posiscion

    cuerpo.pos = sumar3(
        cuerpo.pos,
        mul(cuerpo.vel, dt),
        mul(cuerpo.ace, dt * dt * 0.5)
    ); // Reinciar aceleracion

    cuerpo.ace.x = 0;
    cuerpo.ace.y = 0;
}

//funcion limitar que restringe que tan grande puede ser una magnitud
function limitar(vector, limite) {
    let magni = magnitud(vector);
    if (magni > limite) {
        let normal = normalizado(vector);
        return mul(normal, limite);
    } else {
        return vector;
    }
}

//funcion multiplicar que multiplica un vector por un escalar
function mul(vector, escalar) {
    let resultado = {
        x: vector.x * escalar,
        y: vector.y * escalar,
    };
    return resultado;
}

//funcion division que divide un vector y un escalar
function division(vector, escalar) {
    let resultado = {
        x: vector.x / escalar,
        y: vector.y / escalar,
    };
    return resultado;
}

//funcion sumar que suma dos vectores
function sumar(vector1, vector2) {
    let resultado = {
        x: vector1.x + vector2.x,
        y: vector1.y + vector2.y,
    };
    return resultado;
}

function sumar3(vector1, vector2, vector3) {
    var resultado = {
        x: vector1.x + vector2.x + vector3.x,
        y: vector1.y + vector2.y + vector3.y,
    };
    return resultado;
}

//funcion restar que resta dos vectores
function restar(vector1, vector2) {
    let resultado = {
        x: vector1.x - vector2.x,
        y: vector1.y - vector2.y,
    };
    return resultado;
}

//funcion normalizado que normaliza un vector
function normalizado(vector) {
    magni = magnitud(vector);
    let resultado = {
        x: vector.x / magni,
        y: vector.y / magni,
    };
    return resultado;
}

//funcion magnitud que le saca la magnitud a un vector (hace pitagoras)
function magnitud(vector) {
    return sqrt(vector.x * vector.x + vector.y * vector.y);
}

function escalar(a, b) {
    return a.x * b.x + a.y * b.y;
}