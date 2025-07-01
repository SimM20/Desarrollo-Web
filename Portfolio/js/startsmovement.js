const canvas = document.getElementById("fondo-estrellas");
const ctx = canvas.getContext("2d");

let estrellas = [];
const cantidad = 100;

function ajustarTamañoCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
ajustarTamañoCanvas();
window.addEventListener("resize", ajustarTamañoCanvas);

function crearEstrellas() {
    estrellas = [];
    for (let i = 0; i < cantidad; i++) {
        estrellas.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            z: Math.random() * canvas.width,
            r: Math.random() * 1.5 + 0.5
        });
    }
}
crearEstrellas();

function dibujar() {
    ctx.fillStyle = "#0d0d14";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let estrella of estrellas) {
        estrella.z -= 2;
        if (estrella.z <= 0) {
            estrella.z = canvas.width;
        }

        const sx = (estrella.x - canvas.width / 2) * (canvas.width / estrella.z) + canvas.width / 2;
        const sy = (estrella.y - canvas.height / 2) * (canvas.width / estrella.z) + canvas.height / 2;

        const radius = estrella.r * (canvas.width / estrella.z);

        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, 2 * Math.PI);
        ctx.fillStyle = "#ffffffaa";
        ctx.fill();
    }

    requestAnimationFrame(dibujar);
}

dibujar();