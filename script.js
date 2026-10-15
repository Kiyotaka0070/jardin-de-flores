
"use strict";

const FECHA_INICIO = "2026-10-10";

const jardin = document.getElementById("jardin");
const totalFlores = document.getElementById("totalFlores");
const semanas = document.getElementById("semanas");
const proximaFlor = document.getElementById("proximaFlor");
const efectos = document.getElementById("efectos");

const modalCarta = document.getElementById("modalCarta");
const abrirCarta = document.getElementById("abrirCarta");
const cerrarCarta = document.getElementById("cerrarCarta");
const finalizarCarta = document.getElementById("finalizarCarta");

const COLORES = [
    "#ff4fbc", "#45d9ff", "#a66bff",
    "#ff365e", "#ffe779", "#ffb4e5",
    "#8cfff0", "#ff8b45"
];

const SIMBOLOS = [
    "💖", "💕", "💗", "💙", "🌸",
    "🌷", "🌹", "✨", "✦", "💜"
];

// Verificar que los elementos esenciales existan.
if (!jardin || !efectos) {
    console.error(
        "No se encuentran #jardin o #efectos. Revisa index.html."
    );
} else {
    iniciarJardin();
}

function convertirFecha(texto) {
    const [anio, mes, dia] = texto.split("-").map(Number);
    return new Date(anio, mes - 1, dia);
}

function obtenerSemanasTranscurridas() {
    const inicio = convertirFecha(FECHA_INICIO);
    const hoy = new Date();

    inicio.setHours(0, 0, 0, 0);
    hoy.setHours(0, 0, 0, 0);

    if (hoy < inicio) return 0;

    return Math.floor(
        (hoy.getTime() - inicio.getTime()) /
        (7 * 24 * 60 * 60 * 1000)
    );
}

function crearFlor(numero) {
    const flor = document.createElement("div");
    flor.className = "flor";

    const color = COLORES[numero % COLORES.length];
    const altura = 100 + (numero * 17) % 65;

    flor.style.setProperty("--color-flor", color);
    flor.style.setProperty("--altura", `${altura}px`);
    flor.style.setProperty("--retraso", `${numero * 0.05}s`);

    const cabeza = document.createElement("div");
    cabeza.className = "cabeza";

    for (let i = 0; i < 8; i++) {
        const petalo = document.createElement("div");
        petalo.className = "petalo";
        petalo.style.transform = `rotate(${i * 45}deg)`;
        cabeza.appendChild(petalo);
    }

    const centro = document.createElement("div");
    centro.className = "centro";
    cabeza.appendChild(centro);

    const tallo = document.createElement("div");
    tallo.className = "tallo";

    const hoja1 = document.createElement("div");
    hoja1.className = "hoja izquierda";

    const hoja2 = document.createElement("div");
    hoja2.className = "hoja derecha";

    flor.append(tallo, hoja1, hoja2, cabeza);
    return flor;
}

function actualizarJardin() {
    if (!jardin) return;

    const transcurridas = obtenerSemanasTranscurridas();
    const cantidad = transcurridas + 1;

    jardin.querySelectorAll(".flor").forEach(flor => flor.remove());

    for (let i = 0; i < cantidad; i++) {
        jardin.appendChild(crearFlor(i));
    }

    if (totalFlores) totalFlores.textContent = cantidad;
    if (semanas) semanas.textContent = transcurridas;

    if (proximaFlor) {
        const siguiente = convertirFecha(FECHA_INICIO);
        siguiente.setDate(siguiente.getDate() + cantidad * 7);

        proximaFlor.textContent =
            "🌸 Próxima flor: " +
            siguiente.toLocaleDateString("es-PE", {
                day: "numeric",
                month: "long",
                year: "numeric"
            });
    }
}

// Genera partículas continuamente.
function crearParticula() {
    if (!efectos || efectos.childElementCount >= 45) return;

    const particula = document.createElement("span");
    particula.className = "particula";

    particula.textContent =
        SIMBOLOS[Math.floor(Math.random() * SIMBOLOS.length)];

    const color =
        COLORES[Math.floor(Math.random() * COLORES.length)];

    const duracion = 5 + Math.random() * 6;

    particula.style.setProperty("--color", color);
    particula.style.setProperty(
        "--izquierda",
        `${Math.random() * 100}%`
    );
    particula.style.setProperty(
        "--tamano",
        `${18 + Math.random() * 20}px`
    );
    particula.style.setProperty("--duracion", `${duracion}s`);
    particula.style.setProperty(
        "--balanceo",
        `${-70 + Math.random() * 140}px`
    );

    efectos.appendChild(particula);

    window.setTimeout(() => particula.remove(), duracion * 1000 + 500);
}

function crearCorazonFondo() {
    if (document.querySelector(".corazon-pulso")) return;

    const corazon = document.createElement("div");
    corazon.className = "corazon-pulso";
    corazon.textContent = "♥";
    corazon.setAttribute("aria-hidden", "true");

    document.body.prepend(corazon);
}

function iniciarJardin() {
    actualizarJardin();
    crearCorazonFondo();

    // Primera tanda inmediata: no hay que esperar.
    for (let i = 0; i < 12; i++) {
        window.setTimeout(crearParticula, i * 160);
    }

    // Nuevos corazones, flores y destellos.
    window.setInterval(crearParticula, 450);

    // Las estadísticas se actualizan si la página queda abierta.
    window.setInterval(actualizarJardin, 60 * 60 * 1000);
}

// Carta de despedida.
function mostrarCarta() {
    if (!modalCarta) return;

    modalCarta.classList.add("visible");
    modalCarta.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (cerrarCarta) cerrarCarta.focus();
}

function ocultarCarta() {
    if (!modalCarta) return;

    modalCarta.classList.remove("visible");
    modalCarta.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (abrirCarta) abrirCarta.focus();
}

if (abrirCarta) {
    abrirCarta.addEventListener("click", mostrarCarta);
}

if (cerrarCarta) {
    cerrarCarta.addEventListener("click", ocultarCarta);
}

if (finalizarCarta) {
    finalizarCarta.addEventListener("click", ocultarCarta);
}

if (modalCarta) {
    modalCarta.addEventListener("click", evento => {
        if (evento.target === modalCarta) ocultarCarta();
    });
}

document.addEventListener("keydown", evento => {
    if (evento.key === "Escape" &&
        modalCarta?.classList.contains("visible")) {
        ocultarCarta();
    }
});
