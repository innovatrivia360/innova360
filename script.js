const registrarBtn = document.getElementById("registrar");
const nombreInput = document.getElementById("nombre");
const apellidoInput = document.getElementById("apellido");
const registroDiv = document.getElementById("registro");
const menu = document.getElementById("menu");
const saludo = document.getElementById("saludo");
const clickSound = document.getElementById("clickSound");

const btnJugar = document.getElementById("btnJugar");
const btnInstrucciones = document.getElementById("btnInstrucciones");
const btnCerrarInstrucciones = document.getElementById("btnCerrarInstrucciones");
const instrucciones = document.getElementById("instrucciones");
const btnYoutube = document.getElementById("btnYoutube");

function playClick() {
  clickSound.currentTime = 0;
  clickSound.play();
}

registrarBtn.addEventListener("click", () => {
  playClick();
  const nombre = nombreInput.value.trim();
  const apellido = apellidoInput.value.trim();

  if (!nombre || !apellido) {
    alert("Por favor ingresa nombre y apellido.");
    return;
  }

  localStorage.setItem("nombreJugador", nombre);
  localStorage.setItem("apellidoJugador", apellido);

  saludo.textContent = `¡Bienvenido, ${nombre} ${apellido}!`;
  registroDiv.classList.add("hidden");
  menu.classList.remove("hidden");
});

btnInstrucciones.addEventListener("click", () => {
  playClick();
  menu.classList.add("hidden");
  instrucciones.classList.remove("hidden");
});

btnCerrarInstrucciones.addEventListener("click", () => {
  playClick();
  instrucciones.classList.add("hidden");
  menu.classList.remove("hidden");
});

btnJugar.addEventListener("click", () => {
  playClick();
  window.location = "game.html";
});

// ✅ Enlace actualizado a tu YouTube correcto
btnYoutube.addEventListener("click", () => {
  playClick();
  window.open("https://youtube.com/watch?v=CZDsCoPLUj4&si=PP9C7kYSoBWqbiWR", "_blank");
});
