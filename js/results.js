const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbyVXempkgX9Rgnn8yfG1_f5Zg3tYTTwrs6hINrr8jiFUi2zv61OpaFmMPMOAUPqu4I/exec"; // ¡URL DE GOOGLE SHEETS ACTUALIZADA!

// Obtener nombre y apellido
const nombre = localStorage.getItem("nombreJugador") || "";
const apellido = localStorage.getItem("apellidoJugador") || "";

// Nombre completo
const participante = `${nombre} ${apellido}`.trim();

// Datos del juego
const score = parseInt(localStorage.getItem("score")) || 0;
const correctasBrutas = parseInt(localStorage.getItem("correctCount")) || 0;
const incorrectasBrutas = parseInt(localStorage.getItem("incorrectCount")) || 0;

// --- Lógica del Descuento de Aciertos ---
let hitsDeducidos = 0;

if (score < 0) {
    // 1 acierto deducido por cada 10 puntos negativos (p.ej. -10 = 1, -19 = 1, -20 = 2)
    hitsDeducidos = Math.floor(Math.abs(score) / 10);
}

// El número final de aciertos es el total de correctas menos los descuentos, sin bajar de 0.
const correctasFinales = Math.max(0, correctasBrutas - hitsDeducidos);
const incorrectasFinales = 12 - correctasFinales;

const scoreFinalDisplay = score; 
const porcentaje = ((correctasFinales / 12) * 100).toFixed(1);

// Mostrar resultados en pantalla
document.getElementById("finalScore").textContent = `Tu puntuación: ${scoreFinalDisplay} puntos`;
document.getElementById("summary").textContent =
  `Respondiste correctamente ${correctasFinales} de 12 preguntas (${porcentaje}%) después de la deducción.`;

// 🟢 Enviar a Google Sheets (ACTIVO)
fetch(WEBAPP_URL, {
  method: "POST",
  body: JSON.stringify({
    participante: participante,
    puntaje: scoreFinalDisplay,
    correctas: correctasFinales, // Se envían las correctas con la deducción aplicada
    incorrectas: incorrectasFinales
  }),
  headers: { "Content-Type": "application/x-www-form-urlencoded" } 
})
.then(r => r.text())
.then(t => console.log("ENVIADO:", t))
.catch(err => console.error("ERROR:", err));

// Gráfico
const ctx = document.getElementById("resultChart").getContext("2d");

new Chart(ctx, {
  type: "pie",
  data: {
    labels: ["Correctas", "Incorrectas"],
    datasets: [{
      data: [correctasFinales, incorrectasFinales],
      backgroundColor: ["#00ffc8", "#ff3b3b"],
      hoverOffset: 4
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#e0f7ff'
        }
      }
    }
  }
});
