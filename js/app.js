// Seleccionamos algunos elementos esenciales del DOM que serán utilizados en las funciones posteriores.
const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

// Cuando la página haya cargado completamente, añadimos un event listener al formulario.
// Al enviar el formulario, se llamará a la función 'buscarClima'.
window.addEventListener('load', () => {
  formulario.addEventListener('submit', buscarClima);
});

function buscarClima(e) {
  e.preventDefault(); // Evita que el formulario se envíe de la forma tradicional.

  // Seleccionamos los valores ingresados por el usuario en los campos 'ciudad' y 'pais'.
  const ciudad = document.querySelector('#ciudad').value
  const pais = document.querySelector('#pais').value

  // Si alguno de los campos está vacío, muestra un error.
  if (ciudad === '' || pais === '') {
    mostrarError('Ambos campos son obligatorios...!')
    return;  // Termina la ejecución de la función aquí si hay un error.
  }
  // Si todo está bien, realiza la consulta a la API.
  consultarAPI(ciudad, pais);
}

// Función para mostrar mensajes de error al usuario.
function mostrarError(mensaje) {
  // Si ya hay un mensaje de error visible, no hagas nada.
  const alerta = document.querySelector('.bg-red-100');
  if (!alerta) {
    // Crea un nuevo elemento 'div' para mostrar el mensaje.
    const alerta = document.createElement('div');
    // Añade varias clases para estilizar el error (probablemente usando TailwindCSS).
    // El mensaje de error se mostrará en rojo.
    alerta.classList.add('bg-red-100', "border-red-400", "text-red-700", "px-4", "py-3", "rounded", "relative", "max-w-md", "mx-auto", "mt-6", "text-center");
    alerta.innerHTML = `
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline">${mensaje}</span>
    `;
    container.appendChild(alerta); // Inserta el mensaje en el contenedor principal.

    // Después de 3 segundos, el mensaje de error desaparecerá.
    setTimeout(() => {
      alerta.remove();
    }, 3000);
  }
}

// Función para consultar la API de clima.
function consultarAPI(ciudad, pais) {
  const appId = 'KEY';
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`; // Construye la URL con la ciudad, país y API key.
  console.log(url);  // Muestra la URL en la consola.

  Spinner();  // Muestra una animación mientras se espera la respuesta de la API.

  fetch(url) // Realiza la petición a la API.
    .then(respuesta => respuesta.json())  // Convierte la respuesta en JSON.
    .then(datos => {
      limpiarHTML();  // Limpia el contenido anterior.
      if (datos.cod === "404") {
        mostrarError('Ciudad No Encontrada');  // Si la respuesta es 404, muestra un mensaje de error.
        return;  // Termina la ejecución de la función aquí si hay un error.
      } else {
        mostrarClima(datos);  // Si todo sale bien, muestra el clima de la ciudad especificada.
      }
    })
    .catch(error => {
      console.log(error)  // Si hay un error en la petición, se registra en la consola.
    });
}

// Función para mostrar el clima en la página.
function mostrarClima(datos) {
  // Desestructura y extrae los datos relevantes.
  const { name, main: { temp, temp_max, temp_min } } = datos; 
  // Convierte las temperaturas de Kelvin a grados centígrados.
  const grados = KelvinACentigrados(temp); 
  // Convierte las temperaturas máximas y mínimas de Kelvin a grados centígrados.
  const min = KelvinACentigrados(temp_max); 
  const max = KelvinACentigrados(temp_min);  

  // Aquí, se crea el contenido HTML con los datos del clima y se añade al DOM.
  const nombreCiudad = document.createElement('p');
  nombreCiudad.innerHTML = `Clima en: ${name}`;  // Agrega el nombre de la ciudad al contenido HTML.
  nombreCiudad.classList.add('font-bold', 'text-2xl');

  const actual = document.createElement('p'); 
  actual.innerHTML = `${grados} &#8451;`;  // Agrega la temperatura actual al contenido HTML.
  actual.classList.add('font-bold', 'text-6xl')

  const tempMaxima = document.createElement('p');
  tempMaxima.innerHTML = `Max: ${max} &#8451;`;  // Agrega la temperatura máxima al contenido HTML.
  tempMaxima.classList.add('text-xl')


  const tempMinima = document.createElement('p');
  tempMinima.innerHTML = `Min: ${min} &#8451;`;  // Agrega la temperatura mínima al contenido HTML.
  tempMinima.classList.add('text-xl')


  const resultadoDiv = document.createElement('div');
  resultadoDiv.classList.add('text-center', 'text-white')
  resultadoDiv.appendChild(nombreCiudad);
  resultadoDiv.appendChild(actual);
  resultadoDiv.appendChild(tempMaxima);
  resultadoDiv.appendChild(tempMinima);

  // Elimina la animación de carga.
  resultado.appendChild(resultadoDiv);
}

// Función para convertir temperaturas de Kelvin a Centígrados.
function KelvinACentigrados(grados) {
  return parseInt(grados - 273.15); 
}

// Función para limpiar cualquier contenido previo en el elemento 'resultado'.
function limpiarHTML() {
  while (resultado.firstChild) { 
    resultado.removeChild(resultado.firstChild); 
  }
}

// Función para mostrar una animación (spinner) mientras se carga la información.
function Spinner() {

  limpiarHTML();

  const divSpinner = document.createElement('div'); 
  divSpinner.classList.add('sk-fading-circle');

  divSpinner.innerHTML = `
    <div class="sk-circle1 sk-circle"></div>
    <div class="sk-circle2 sk-circle"></div>
    <div class="sk-circle3 sk-circle"></div>
    <div class="sk-circle4 sk-circle"></div>
    <div class="sk-circle5 sk-circle"></div>
    <div class="sk-circle6 sk-circle"></div>
    <div class="sk-circle7 sk-circle"></div>
    <div class="sk-circle8 sk-circle"></div>
    <div class="sk-circle9 sk-circle"></div>
    <div class="sk-circle10 sk-circle"></div>
    <div class="sk-circle11 sk-circle"></div>
    <div class="sk-circle12 sk-circle"></div>
  `;

  resultado.appendChild(divSpinner);  
}
