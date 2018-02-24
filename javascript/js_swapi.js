/*
Autor: Alberto Díaz Arenas
Módulo: Desarrollo de Interfaces
Grado: Desarrollo de Aplicaciones Multiplataforma
Instituto: IES Virgen de la Paloma
*/

function descargaJSon(tipoGeneral, id, tipo) { 

	crearMenuCargando(document.body);
	
	var menuCargando = document.getElementById("menuCargando");
	var parrafoCargando = document.createElement("p");
	parrafoCargando.appendChild(document.createTextNode("Cargando..."));
	parrafoCargando.style.textAlign = "center";
	menuCargando.appendChild(parrafoCargando);	

	// Obtener la instancia del objeto XMLHttpRequest
	if(window.XMLHttpRequest) {
		peticion_http = new XMLHttpRequest();
	}
	else if(window.ActiveXObject) {
		peticion_http = new ActiveXObject("Microsoft.XMLHTTP");
	}
	// Preparar la funcion de respuesta
	peticion_http.onreadystatechange = muestraContenido;
	
	// Realizar peticion HTTP
	switch (tipoGeneral) {
	
		case 1: // peliculas
			if (tipo == "general") {
				peticion_http.open('GET', 'https://swapi.co/api/films/', true);
				tipo = "general";
			}
			else {
				peticion_http.open('GET', 'https://swapi.co/api/films/'+id+'/', true);
				tipo = "pelicula";
			}
			break;
		case 2: // personajes
			if (tipo == "general") {
				peticion_http.open('GET', 'https://swapi.co/api/people/?page=', true);
				tipo = "general";
			}
			else {
				peticion_http.open('GET', 'https://swapi.co/api/people/'+id+'/', true);
				tipo = "personaje";
			}
			break;
		case 3: // planetas
			if (tipo == "general") {
				peticion_http.open('GET', 'https://swapi.co/api/planets/?page=', true);
				tipo = "general";
			}
			else {
				peticion_http.open('GET', 'https://swapi.co/api/planets/'+id+'/', true);
				tipo = "planeta";
			}
			break;
		case 4: // especies
			if (tipo == "general") {
				peticion_http.open('GET', 'https://swapi.co/api/species/?page=', true);
				tipo = "general";
			}
			else {
				peticion_http.open('GET', 'https://swapi.co/api/species/'+id+'/', true);
				tipo = "especie";
			}
			break;
		case 5: // naves estelares
			if (tipo == "general") {
				peticion_http.open('GET', 'https://swapi.co/api/starships/?page=', true);
				tipo = "general";
			}
			else {
				peticion_http.open('GET', 'https://swapi.co/api/starships/'+id+'/', true);
				tipo = "nave";
			}
			break;
		case 6: // vehiculos
			if (tipo == "general") {
				peticion_http.open('GET', 'https://swapi.co/api/vehicles/?page=', true);
				tipo = "general";
			}
			else {
				peticion_http.open('GET', 'https://swapi.co/api/vehicles/'+id+'/', true);
				tipo = "vehiculo";
			}
			break;	
	}
	peticion_http.send(null);
	
	function muestraContenido() {
		if(peticion_http.readyState == 4) {
			if(peticion_http.status == 200) {
			
				limpiarMenuCargando();
			
				switch (tipoGeneral) {		// dependiendo de la opcion elegida se llamará a cada uno de los siguientes métodos
					case 1: // peliculas
						mostrarListadoPeliculas(tipo,JSON.parse(peticion_http.responseText));
						break;
					case 2: // personajes
						mostrarListadoPersonajes(tipo,JSON.parse(peticion_http.responseText));
						break;
					case 3: // planetas
						mostrarListadoPlanetas(tipo,JSON.parse(peticion_http.responseText));
						break;
					case 4: // especies
						mostrarListadoEspecies(tipo,JSON.parse(peticion_http.responseText));
						break;
					case 5: // naves
						mostrarListadoNaves(tipo,JSON.parse(peticion_http.responseText));
						break;
					case 6: // vehiculos
						mostrarListadoVehiculos(tipo,JSON.parse(peticion_http.responseText));
						break;
				
				}
				
			}
			
			else {	// si ha habido algún error (que los hay, la API tiene algunas páginas incompletas)
					// se muestra un mensaje de error en un menú flotante
					
				limpiarMenuCargando();
				
				var menu = document.getElementById("menuInformacion");
				var imgError = document.createElement("img");
				imgError.setAttribute("src", "./images/imgerror.gif");
				menu.appendChild(imgError);
				var msgError = document.createElement("p");
				msgError.appendChild(document.createTextNode("Ups, parece que hay algún error con la información solicitada..."));
				menu.appendChild(msgError);
			}
		}				
	}
}
			
window.onload = function() {

	arrayGeneral = ["https://swapi.co/api/films/",
					"https://swapi.co/api/people/?page=1",
					"https://swapi.co/api/people/?page=2",
					"https://swapi.co/api/people/?page=3",
					"https://swapi.co/api/people/?page=4",
					"https://swapi.co/api/people/?page=5",
					"https://swapi.co/api/people/?page=6",
					"https://swapi.co/api/people/?page=7",
					"https://swapi.co/api/people/?page=8",
					"https://swapi.co/api/people/?page=9"];

	iniciarReproductor();
	
	// cargo el div que va a contener toda la información además de cada uno de los elementos de la barra de navegación
	
	divContenedor = document.getElementById("contenedor"); 
	
	var menuinicio = document.getElementById("menu");
	var categoriaPeliculas = document.getElementById("catpeliculas");
	var categoriaPersonajes = document.getElementById("catpersonajes");
	var categoriaPlanetas = document.getElementById("catplanetas");
	var categoriaEspecies = document.getElementById("catespecies");
	var categoriaNaves = document.getElementById("catnaves");
	var categoriaVehiculos = document.getElementById("catvehiculos");
	
	categorias = [];
	categorias[0] = menuinicio;	
	categorias[1] = categoriaPeliculas;
	categorias[2] = categoriaPersonajes;
	categorias[3] = categoriaPlanetas;
	categorias[4] = categoriaEspecies;
	categorias[5] = categoriaNaves;
	categorias[6] = categoriaVehiculos;
	
	// a cada elemento del menú le aplico unas funciones para cambiar el color de fondo si se pasa con el ratón por encima 
	// o si se hace click en cada uno de ellos
	
	for (var i = 0; i < categorias.length; i++) {
			categorias[i].setAttribute("onmouseover","cambiarFondo("+i+",true)");
			categorias[i].setAttribute("onmouseout","cambiarFondo("+i+",false)");
			categorias[i].setAttribute("onclick","obtenerInformacion("+i+")");
	}
	
	// en la variable global textoMenuInicio guardo el contenido inicial correspondiente al menú inicio. Ya que es solo texto
	// lo guardo usando el innerHTML 	
	textoMenuInicio = divContenedor.innerHTML;
	
	inputBusqueda = document.getElementById("inputBusqueda");
	inputBusqueda.setAttribute("placeholder","Dato a buscar...");
	inputBusqueda.style.width = "210px";
	inputBusqueda.style.padding = "1px";
	inputBusqueda.onkeypress = comprobarTecla;
	
	botonBusqueda = document.getElementById("botonBusqueda");
	botonBusqueda.onclick = function(){ buscar(inputBusqueda.textContent); };
	botonBusqueda.onmouseover = function() {
		botonBusqueda.style.backgroundColor = "rgb(162, 0, 0)";
		botonBusqueda.style.color = "white";
	}
	botonBusqueda.onmouseout = function() {
		botonBusqueda.style.backgroundColor = "rgb(204, 204, 204)";
		botonBusqueda.style.color = "black";
	}
}

function comprobarTecla(evObject) {

	var tecla = evObject.which; 
	
	if (tecla == 13) {
		buscar(inputBusqueda.textContent);
	}
	
}

function buscar(cadena) {

	inputBusqueda.value = "";
	crearMenu(divContenedor);
}


// esta función se encarga de controlar el funcionamiento del reproductor de música
function iniciarReproductor() {
	maximo = 300;
	indiceCancion = 0;
	canciones = document.getElementsByTagName('audio'); // guardo todos los audios en una variable global canciones
	cancionParaReproducir = canciones[indiceCancion]; // en todo momento y usando el índice creado antes elijo la canción en concreto que se va a reproducir
	reproducir = document.getElementById('reproducir');
	barra = document.getElementById('barra');
	progreso = document.getElementById('progreso');
	silenciar = document.getElementById('silenciar');
	prev = document.getElementById('prev');
	next = document.getElementById('next');
	settings = document.getElementById('settings');
	
	// a partir de aquí defino el funcionamiento y comportamiento de cada uno de los botones de control del reproductor
	
	reproducir.onclick = reproducirOPausar;
	reproducir.onmouseover = function() {
		reproducir.style.backgroundColor = "rgb(162, 0, 0)";
		reproducir.style.color = "white";
	}
	reproducir.onmouseout = function() {
		reproducir.style.backgroundColor = "rgb(204, 204, 204)";
		reproducir.style.color = "black";
	}
	
	silenciar.onclick = sonido;
	silenciar.onmouseover = function() {
		silenciar.style.backgroundColor = "rgb(162, 0, 0)";
		silenciar.style.color = "white";
	}
	silenciar.onmouseout = function() {
		silenciar.style.backgroundColor = "rgb(204, 204, 204)";
		silenciar.style.color = "black";
	}
	
	prev.onclick = modificarIndice;
	prev.onmouseover = function() {
		prev.style.backgroundColor = "rgb(162, 0, 0)";
		prev.style.color = "white";
	}
	prev.onmouseout = function() {
		prev.style.backgroundColor = "rgb(204, 204, 204)";
		prev.style.color = "black";
	}
	
	next.onclick = modificarIndice;
	next.onmouseover = function() {
		next.style.backgroundColor = "rgb(162, 0, 0)";
		next.style.color = "white";
	}
	next.onmouseout = function() {
		next.style.backgroundColor = "rgb(204, 204, 204)";
		next.style.color = "black";
	}
	
	settings.onclick = modificarOpciones;
	settings.onmouseover = function() {
		settings.style.backgroundColor = "rgb(162, 0, 0)";
		settings.style.color = "white";
	}
	settings.onmouseout = function() {
		settings.style.backgroundColor = "rgb(204, 204, 204)";
		settings.style.color = "black";
	}
	
	barra.onclick = mover;
}

// función para controlar las canciones, y listarlas gráficamente (en proceso)
function modificarOpciones() {

	crearMenu(divContenedor);	
	var menuSettings = document.getElementById("menuInformacion");
	
	// por cada canción del array canciones hago un div y le aplico los métodos onclick, onmouseover y onmouseout
	for (var i = 0; i < canciones.length; i++) {
		var divCancion = document.createElement("div");
		divCancion.setAttribute("id","cancion"+i);
		divCancion.style.backgroundColor = "rgb(240,240,240)";
		divCancion.style.border = "1px solid black";
		divCancion.style.borderRadius = "3px";
		divCancion.style.marginBottom = "5px";
		divCancion.style.padding = "5px";
		divCancion.style.width = "400px";
		
		// a cada div le pongo el nombre de la correspondiente canción
		var nombreCancion = document.createElement("p");
		nombreCancion.appendChild(document.createTextNode(canciones[i].getAttribute("name")));
		
		divCancion.appendChild(nombreCancion);
		menuSettings.appendChild(divCancion);
	}
	
	divsCanciones = new Array(canciones.length);
	for (var i = 0; i < divsCanciones.length; i++) {
		divsCanciones[i] = document.getElementById("cancion"+i);
		agregarOnClick(divsCanciones[i],i);
	}
	
	for (var i = 0; i < divsCanciones.length; i++) {		
		
		divsCanciones[i].onmouseover = function() {
			this.style.backgroundColor = "rgb(162, 0, 0)";
			this.style.color = "white";
		}
		divsCanciones[i].onmouseout = function() {
			this.style.backgroundColor = "rgb(240,240,240)";
			this.style.color = "black";
		}
	}
	
	
	var imgMantenimiento = document.createElement("img");
	imgMantenimiento.setAttribute("src","./images/mantenimiento.jpg");
	//menuSettings.appendChild(imgMantenimiento);
	var textoMantenimiento = document.createElement("p");
	textoMantenimiento.appendChild(document.createTextNode("Opción en proceso de construcción..."));
	//menuSettings.appendChild(textoMantenimiento);

}

// función que añade el método onclick a cada div contenido en el menú de settings
function agregarOnClick(elem,orden) {
	elem.onclick = function(){ seleccionarCancion(orden); };
}

function seleccionarCancion(idd) {

	if(!cancionParaReproducir.paused && !cancionParaReproducir.ended){
		cancionParaReproducir.pause();
		cancionParaReproducir.currentTime = 0;
		reproducir.value = 'Play';
		clearInterval(bucle);
		progreso.style.width = '0px';
		cancionParaReproducir = canciones[idd];
		cancionParaReproducir.play();
		reproducir.value = 'Pause';
		bucle = setInterval(estado, 1000);
	}
	else {
		cancionParaReproducir = canciones[idd];
		cancionParaReproducir.play();
		reproducir.value = 'Pause';
		bucle = setInterval(estado, 1000);
	}
	
}

// con esta función se cambia el índice para elegir la canción a reproducir, además de resetear la barra de estado.
// este cambio lo hago de forma "circular", de la última canción se pasa a la primera y viceversa
function modificarIndice() {
	cancionParaReproducir.pause();
	cancionParaReproducir.currentTime = 0;
	reproducir.value = 'Play';
	clearInterval(bucle);
	switch(this.id) {
		case "prev":
			if (indiceCancion == 0) {
				indiceCancion = canciones.length-1;
			}
			else {
				indiceCancion = indiceCancion - 1 ;				
			}				
			break;
			
		case "next":
			if (indiceCancion == canciones.length-1) {
				indiceCancion = 0;
			}
			else {
				indiceCancion = indiceCancion + 1 ;				
			}			
			break;
	}
	cancionParaReproducir = canciones[indiceCancion];
	cancionParaReproducir.play();
	reproducir.value = 'Pause';
	bucle = setInterval(estado, 1000);
}

// función para reproducir o pausar la canción
function reproducirOPausar(){
	if(!cancionParaReproducir.paused && !cancionParaReproducir.ended){
		cancionParaReproducir.pause();
		cancionParaReproducir.currentTime = 0;
		reproducir.value = 'Play';
		clearInterval(bucle);
	}
	else{
		cancionParaReproducir.play();
		reproducir.value = 'Pause';
		bucle = setInterval(estado, 1000);
	}
}

// función que controla el movimiento de la barra de progreso acorde a la canción mientras ésta se reproduce
function estado(){
	if(!cancionParaReproducir.ended){
		var tamano = parseInt(cancionParaReproducir.currentTime * maximo / cancionParaReproducir.duration);
		progreso.style.width = tamano + 'px';
	}
	else{
		progreso.style.width = '0px';
		reproducir.innerHTML = 'Play';
		clearInterval(bucle);
		indiceCancion = indiceCancion + 1;
		cancionParaReproducir = canciones[indiceCancion];
		reproducirOPausar();
	}
}

// si se quiere adelantar o retrasar manualmente la canción esta función se encara de ello
function mover(e){
	if(!cancionParaReproducir.paused && !cancionParaReproducir.ended){
		var ratonX = e.pageX - barra.offsetLeft;
		var nuevotiempo = ratonX * cancionParaReproducir.duration / maximo;
		cancionParaReproducir.currentTime = nuevotiempo;
		progreso.style.width = ratonX + 'px';
	}
}

// función para mutear o desmutear la canción
function sonido(){
	if(silenciar.value == 'Mute'){
		cancionParaReproducir.muted = true;
		silenciar.value = 'Audio';
	}
	else{
		cancionParaReproducir.muted = false;
		silenciar.value = 'Mute';
	}
}

// función para cambiar el color de fondo de los elementos del menú de navegación comforme pasas el ratón por encima de ellos
function cambiarFondo(pos,entrar) {
	if (entrar) // onmouseover
		categorias[pos].style.backgroundColor = "rgb(162, 0, 0)";
	else	// onmouseout
		categorias[pos].style.backgroundColor = "rgb(51, 51, 51)";
}


// método que limpia el contenido del div contenedor
function limpiarContenedor() { 
	while (divContenedor.firstChild) {
		divContenedor.removeChild(divContenedor.firstChild);
	}
}


// una vez se hace click en un elemento del menú de navegación se llama a esta función, que crea en el div contenedor
// un título orientativo además de realizar la llamada correspondiente a la API.
function obtenerInformacion(posicion) {

	var titulo = document.createElement("h2");
	titulo.style.textAlign = "center";
	titulo.style.marginBottom = "20px";

	switch (posicion) {	

		case 0: // menú inicio
			divContenedor.innerHTML = textoMenuInicio;
			break;
			
		case 1: // peliculas
			limpiarContenedor();
			titulo.appendChild(document.createTextNode("Listado de películas"));
			divContenedor.appendChild(titulo);
			descargaJSon(posicion,0,"general"); 
			
			break;
			
		case 2: // personajes
			limpiarContenedor();
			titulo.appendChild(document.createTextNode("Listado de personajes"));
			divContenedor.appendChild(titulo);
			descargaJSon(posicion,0,"general"); 
			break;
			
		case 3: // planetas
			limpiarContenedor();
			titulo.appendChild(document.createTextNode("Listado de planetas"));
			divContenedor.appendChild(titulo);
			descargaJSon(posicion,0,"general"); 
			break;
			
		case 4: // especies
			limpiarContenedor();
			titulo.appendChild(document.createTextNode("Listado de especies"));
			divContenedor.appendChild(titulo);
			descargaJSon(posicion,0,"general"); 
			break;
		
		case 5: // naves
			limpiarContenedor();
			titulo.appendChild(document.createTextNode("Listado de naves"));
			divContenedor.appendChild(titulo);
			descargaJSon(posicion,0,"general"); 
			break;
			
		case 6: // vehículos
			limpiarContenedor();
			titulo.appendChild(document.createTextNode("Listado de vehículos"));
			divContenedor.appendChild(titulo);
			descargaJSon(posicion,0,"general"); 
			break;
	}
	
}


// esta función crea un menú flotante cuando se hace click en un elemento en concreto de los que devuelve la API 
// cuando se ha hecho click anteriormente en una categoría del menú de navegación
function crearMenu(elem) {

	var contenedorGeneral = document.createElement("div");
	contenedorGeneral.setAttribute("id","contenedorGeneral");
	contenedorGeneral.style.backgroundColor = "rgb(204,204,204)";
	var anchoContenedorGeneral = 538;
	var altoContenedorGeneral = 352;
	contenedorGeneral.style.width = anchoContenedorGeneral + "px";
	contenedorGeneral.style.height = altoContenedorGeneral + "px";	
	contenedorGeneral.style.borderRadius = "5px";
	contenedorGeneral.style.border = "4px solid red";
	contenedorGeneral.style.position = "absolute";
	contenedorGeneral.style.top = elem.offsetTop - 200 + "px";
	contenedorGeneral.style.left = document.body.offsetWidth/2 - anchoContenedorGeneral/2 + "px";
	
	var tituloSettings = document.createElement("p");
	tituloSettings.appendChild(document.createTextNode("Seleccione una canción para reproducir:"));
	tituloSettings.style.marginTop = "10px";
	tituloSettings.style.marginLeft = "10px";
	contenedorGeneral.appendChild(tituloSettings);

	var menu = document.createElement("div");
	menu.setAttribute("id","menuInformacion");
	menu.style.backgroundColor = "rgb(204,204,204)";
	var altoMenu = 300;
	var anchoMenu = 520;
	menu.style.width = anchoMenu + "px";
	menu.style.height = altoMenu + "px";
	menu.style.top = 45 + "px";
	menu.style.left = 4 + "px";
	menu.style.marginLeft = "auto";
	menu.style.marginRight = "auto";
	menu.style.position = "absolute";
	menu.style.paddingLeft = "8px";
	menu.style.borderRadius = "5px";
	menu.style.overflow = "scroll";
	
	var botonSalir = document.createElement("button");
	botonSalir.setAttribute("type","button");
	botonSalir.setAttribute("name","botonSalir");
	botonSalir.setAttribute("id","botonSalir");
	botonSalir.appendChild(document.createTextNode("X"));
	var altoBoton = 40;
	var anchoBoton = 40;
	botonSalir.style.position = "absolute";
	botonSalir.style.top = "1px";
	botonSalir.style.left = (anchoContenedorGeneral - anchoBoton + 7) + "px";
	botonSalir.style.padding = "5px";
	botonSalir.style.margin = "5px";
	botonSalir.style.borderRadius = "5px";
	botonSalir.style.border = "2px solid black";
	botonSalir.style.color = "white";
	botonSalir.style.backgroundColor = "rgb(60, 60, 170)";
	
	botonSalir.onmouseover = function() {
		botonSalir.style.backgroundColor = "rgb(162, 0, 0)";
	}
	botonSalir.onmouseout = function() {
		botonSalir.style.backgroundColor = "rgb(60, 60, 170)";
	}
	botonSalir.onclick = function() {
		document.body.removeChild(document.getElementById("contenedorGeneral")); // borramos el menú
	}
	
	contenedorGeneral.appendChild(botonSalir);
	contenedorGeneral.appendChild(menu);
	document.body.appendChild(contenedorGeneral); 
}


// para evitar que se puedan superponer varios menús se borra el que hay anteriormente si se hace click en otro elemento
// que asu vez genere otro menú
function limpiarMenusInformacion() {
	var aux = document.getElementById("menuInformacion");
	if (aux) {
		document.body.removeChild(aux); // borramos el menú
	}
}

// Funciones relativas a las peliculas

// esta función hace la llamada a la API para obtener los datos de una película en concreto. Como en la API las
// películas vienen en el orden tal cual se publicaron he tendio que hacer un arreglo básico para consultarlas 
// en el orden que quiero. Si quiero consultar los datos del Episodio 1, que me muestre los del Episodio 1 y no
// los del Episodio 4 (que en teoría es la primera película de Star Wars)
function mostrarInformacionPelicula(id) {

	limpiarMenusInformacion();
	crearMenu(document.getElementById("pelicula"+id));
	
	var listadoPeliculas = [0,4,5,6,1,2,3,7];	
	var res;
	
	for (var i = 0; i < listadoPeliculas.length; i++) {	
		if (listadoPeliculas[i] == id) {
			res = i;
			break;
		}
	}	
	descargaJSon(1,res,"pelicula");	 
}


// dependiendo de como hemos llamado a la función que descarga el JSON correspondiente se mostrará en el div contenedor
// el listado de todas las películas o se mostrará en el menú flotante creado la información de una película en concreto
function mostrarListadoPeliculas(tipo,fichero) {

	var lista = document.createElement("ul");
	lista.style.listStyleType = "none";		
	lista.style.margin = "0px";
	lista.style.padding = "0px";
	
	switch (tipo) {
	
		case "pelicula":
		
			var idPeli = fichero.episode_id;
			var menu = document.getElementById("menuInformacion");
			
			var titulo = document.createElement("p");			
			titulo.appendChild(document.createTextNode("Episodio " + idPeli + ": " + fichero.title));
			var director = document.createElement("p");
			director.appendChild(document.createTextNode("Director: " + fichero.director));
			var producer = document.createElement("p");
			producer.appendChild(document.createTextNode("Producer: " + fichero.producer));
			var releaseDate = document.createElement("p");
			releaseDate.appendChild(document.createTextNode("Release Date: " + fichero.release_date));
			var espacio = document.createElement("p");
			espacio.appendChild(document.createTextNode("-------------------------------------------"));
			var opening = document.createElement("p");
			opening.appendChild(document.createTextNode("Opening: "));
			var textoOpening = document.createElement("p");
			textoOpening.appendChild(document.createTextNode(fichero.opening_crawl));
			
			var menu = document.getElementById("menuInformacion");
			menu.appendChild(titulo);
			menu.appendChild(director);
			menu.appendChild(producer);
			menu.appendChild(releaseDate);
			menu.appendChild(espacio);
			menu.appendChild(opening);
			menu.appendChild(textoOpening);
			break;
			
		case "general":
	
			var numPelis = fichero.count;
			var arrayPeliculas = fichero.results;
			
			for (var i = 1; i <= numPelis; i++) {
				var elementos = document.createElement("li");
				elementos.style.width = "270px";
				elementos.style.margin = "5px";
				elementos.style.border = "1px solid black";
				elementos.style.float = "left";
				elementos.setAttribute("onclick","mostrarInformacionPelicula("+i+")");
				elementos.setAttribute("id","pelicula"+i);
				
				var enlace = document.createElement("a");				
				enlace.style.display = "block";
				enlace.style.textAlign = "center";	
				enlace.style.padding = "15px";	
				
				switch(i) {
					case 1:
						enlace.appendChild(document.createTextNode(arrayPeliculas[2].title));
						break;
					case 2:
						enlace.appendChild(document.createTextNode(arrayPeliculas[1].title));
						break;
					case 3:
						enlace.appendChild(document.createTextNode(arrayPeliculas[3].title));
						break;
					case 4:
						enlace.appendChild(document.createTextNode(arrayPeliculas[0].title));
						break;
					case 5:
						enlace.appendChild(document.createTextNode(arrayPeliculas[5].title));
						break;
					case 6:
						enlace.appendChild(document.createTextNode(arrayPeliculas[4].title));
						break;
					case 7:
						enlace.appendChild(document.createTextNode(arrayPeliculas[6].title));
						break;
				}
				
				elementos.appendChild(enlace);
				lista.appendChild(elementos);
			}
			break;
	}
	divContenedor.appendChild(lista);
}

// Funciones relativas a los personajes

function mostrarInformacionPersonaje(id) { 

	limpiarMenusInformacion();
	crearMenu(document.getElementById("personaje"+id));
	descargaJSon(2,id,"personaje");
}

function mostrarListadoPersonajes(tipo,fichero) { 

	var lista = document.createElement("ul");
	lista.style.listStyleType = "none";		
	lista.style.margin = "0px";
	lista.style.padding = "0px";
	
	switch (tipo) {
	
		case "personaje":
		
			var menu = document.getElementById("menuInformacion");
			
			var nombre = document.createElement("p");			
			nombre.appendChild(document.createTextNode("Name: " + fichero.name));
			var height = document.createElement("p");
			height.appendChild(document.createTextNode("Height: " + fichero.height));
			var mass = document.createElement("p");
			mass.appendChild(document.createTextNode("Mass: " + fichero.mass));
			var hairColor = document.createElement("p");
			hairColor.appendChild(document.createTextNode("Hair Color: " + fichero.hair_color));
			var skinColor = document.createElement("p");
			skinColor.appendChild(document.createTextNode("Skin Color: " + fichero.skin_color));
			var eyeColor = document.createElement("p");
			eyeColor.appendChild(document.createTextNode("Eye Color: " + fichero.eye_color));
			var birth = document.createElement("p");
			birth.appendChild(document.createTextNode("Birth year: " + fichero.birth_year));
			var gender = document.createElement("p");
			gender.appendChild(document.createTextNode("Gender: " + fichero.gender));
			
			var menu = document.getElementById("menuInformacion");
			menu.appendChild(nombre);
			menu.appendChild(height);
			menu.appendChild(mass);
			menu.appendChild(hairColor);
			menu.appendChild(skinColor);
			menu.appendChild(eyeColor);
			menu.appendChild(birth);
			menu.appendChild(gender);
			break;
			
		case "general":
	
			var numPersonajes = fichero.count;
			
			for (var i = 1; i < numPersonajes; i++) {
			
				var elementos = document.createElement("li");
				elementos.style.width = "270px";
				elementos.style.margin = "5px";
				elementos.style.border = "1px solid black";
				elementos.style.float = "left";
				elementos.setAttribute("onclick","mostrarInformacionPersonaje("+i+")");
				elementos.setAttribute("id","personaje"+i);
				
				var enlace = document.createElement("a");				
				enlace.style.display = "block";
				enlace.style.textAlign = "center";	
				enlace.style.padding = "15px";	
				enlace.appendChild(document.createTextNode("Personaje #" + i));
				
				elementos.appendChild(enlace);
				lista.appendChild(elementos);
			}
			break;
	}
	divContenedor.appendChild(lista);
}

// Funciones relativas a los planetas

function mostrarInformacionPlaneta(id) { 

	limpiarMenusInformacion();
	crearMenu(document.getElementById("planeta"+id));
	descargaJSon(3,id,"planeta");
}

function mostrarListadoPlanetas(tipo,fichero) { 

	var lista = document.createElement("ul");
	lista.style.listStyleType = "none";		
	lista.style.margin = "0px";
	lista.style.padding = "0px";
	
	switch (tipo) {
	
		case "planeta":
		
			var menu = document.getElementById("menuInformacion");
			
			var nombre = document.createElement("p");			
			nombre.appendChild(document.createTextNode("Name: " + fichero.name));
			var rotation = document.createElement("p");
			rotation.appendChild(document.createTextNode("Rotation Period: " + fichero.rotation_period));
			var orbital = document.createElement("p");
			orbital.appendChild(document.createTextNode("Orbital Period: " + fichero.orbital_period));
			var diameter = document.createElement("p");
			diameter.appendChild(document.createTextNode("Diameter: " + fichero.diameter));
			var climate = document.createElement("p");
			climate.appendChild(document.createTextNode("Climate: " + fichero.climate));
			var gravity = document.createElement("p");
			gravity.appendChild(document.createTextNode("Gravity: " + fichero.gravity));
			var terrain = document.createElement("p");
			terrain.appendChild(document.createTextNode("Terrain: " + fichero.terrain));
			var surfaceWater = document.createElement("p");
			surfaceWater.appendChild(document.createTextNode("Surface Water: " + fichero.surface_water));
			var population = document.createElement("p");
			population.appendChild(document.createTextNode("Population: " + fichero.population));
			
			var menu = document.getElementById("menuInformacion");
			menu.appendChild(nombre);
			menu.appendChild(rotation);
			menu.appendChild(orbital);
			menu.appendChild(diameter);
			menu.appendChild(climate);
			menu.appendChild(gravity);
			menu.appendChild(terrain);
			menu.appendChild(surfaceWater);
			menu.appendChild(population);
			break;
			
		case "general":
	
			var numPlanetas = fichero.count;
			
			for (var i = 1; i <= numPlanetas; i++) {
				var elementos = document.createElement("li");
				elementos.style.width = "270px";
				elementos.style.margin = "5px";
				elementos.style.border = "1px solid black";
				elementos.style.float = "left";
				elementos.setAttribute("onclick","mostrarInformacionPlaneta("+i+")");
				elementos.setAttribute("id","planeta"+i);
				
				var enlace = document.createElement("a");				
				enlace.style.display = "block";
				enlace.style.textAlign = "center";	
				enlace.style.padding = "15px";				
				enlace.appendChild(document.createTextNode("Planeta #" + i));
				
				elementos.appendChild(enlace);
				lista.appendChild(elementos);
			}
			break;
	}
	divContenedor.appendChild(lista);
}

// Funciones relativas a las especies

function mostrarInformacionEspecie(id) { 

	limpiarMenusInformacion();
	crearMenu(document.getElementById("especie"+id));
	descargaJSon(4,id,"especie");
}

function mostrarListadoEspecies(tipo,fichero) { 

	var lista = document.createElement("ul");
	lista.style.listStyleType = "none";		
	lista.style.margin = "0px";
	lista.style.padding = "0px";
	
	switch (tipo) {
	
		case "especie":
		
			var menu = document.getElementById("menuInformacion");
			
			var nombre = document.createElement("p");			
			nombre.appendChild(document.createTextNode("Name: " + fichero.name));
			var clasificacion = document.createElement("p");
			clasificacion.appendChild(document.createTextNode("Classification: " + fichero.classification));
			var designation = document.createElement("p");
			designation.appendChild(document.createTextNode("Designation: " + fichero.designation));
			var height = document.createElement("p");
			height.appendChild(document.createTextNode("Average Height: " + fichero.average_height));
			var hairColors = document.createElement("p");
			hairColors.appendChild(document.createTextNode("Hair Colors: " + fichero.hair_colors));
			var skinColors = document.createElement("p");
			skinColors.appendChild(document.createTextNode("Skin Colors: " + fichero.skin_colors));
			var eyeColors = document.createElement("p");
			eyeColors.appendChild(document.createTextNode("Eye Colors: " + fichero.eye_colors));
			var lifespan = document.createElement("p");
			lifespan.appendChild(document.createTextNode("Average Lifespan: " + fichero.average_lifespan));
			var language = document.createElement("p");
			language.appendChild(document.createTextNode("Language: " + fichero.language));
			
			var menu = document.getElementById("menuInformacion");
			menu.appendChild(nombre);
			menu.appendChild(clasificacion);
			menu.appendChild(designation);
			menu.appendChild(height);
			menu.appendChild(hairColors);
			menu.appendChild(skinColors);
			menu.appendChild(eyeColors);
			menu.appendChild(lifespan);
			menu.appendChild(language);
			break;
			
		case "general":
	
			var numEspecies = fichero.count;
			
			for (var i = 1; i <= numEspecies; i++) {
				var elementos = document.createElement("li");
				elementos.style.width = "270px";
				elementos.style.margin = "5px";
				elementos.style.border = "1px solid black";
				elementos.style.float = "left";
				elementos.setAttribute("onclick","mostrarInformacionEspecie("+i+")");
				elementos.setAttribute("id","especie"+i);
				
				var enlace = document.createElement("a");				
				enlace.style.display = "block";
				enlace.style.textAlign = "center";	
				enlace.style.padding = "15px";				
				enlace.appendChild(document.createTextNode("Especie #" + i));
				
				elementos.appendChild(enlace);
				lista.appendChild(elementos);
			}
			break;
	}
	divContenedor.appendChild(lista);
}

// Funciones relativas a las naves estelares

function mostrarInformacionNave(id) { 

	limpiarMenusInformacion();
	crearMenu(document.getElementById("nave"+id));
	descargaJSon(5,id,"nave");
}

function mostrarListadoNaves(tipo,fichero) { 

	var lista = document.createElement("ul");
	lista.style.listStyleType = "none";		
	lista.style.margin = "0px";
	lista.style.padding = "0px";
	
	switch (tipo) {
	
		case "nave":
		
			var menu = document.getElementById("menuInformacion");
			
			var nombre = document.createElement("p");			
			nombre.appendChild(document.createTextNode("Name: " + fichero.name));
			var model = document.createElement("p");
			model.appendChild(document.createTextNode("Model: " + fichero.model));
			var manufacturer = document.createElement("p");
			manufacturer.appendChild(document.createTextNode("Manufacturer: " + fichero.manufacturer));
			var cost = document.createElement("p");
			cost.appendChild(document.createTextNode("Cost: " + fichero.cost_in_credits));
			var longitud = document.createElement("p");
			longitud.appendChild(document.createTextNode("Length: " + fichero.length));
			var speed = document.createElement("p");
			speed.appendChild(document.createTextNode("Max Atmosphering Speed: " + fichero.max_atmosphering_speed));
			var crew = document.createElement("p");
			crew.appendChild(document.createTextNode("Crew: " + fichero.crew));
			var passengers = document.createElement("p");
			passengers.appendChild(document.createTextNode("Passengers: " + fichero.passengers));
			var cargo = document.createElement("p");
			cargo.appendChild(document.createTextNode("Cargo Capacity: " + fichero.cargo_capacity));
			var consumables = document.createElement("p");
			consumables.appendChild(document.createTextNode("Consumables: " + fichero.consumables));
			var hyperdrive = document.createElement("p");
			hyperdrive.appendChild(document.createTextNode("Hyperdrive Rating: " + fichero.hyperdrive_rating));
			var mglt = document.createElement("p");
			mglt.appendChild(document.createTextNode("MGLT: " + fichero.mglt));
			var sclass = document.createElement("p");
			sclass.appendChild(document.createTextNode("Starship Class: " + fichero.starship_class));
			
			var menu = document.getElementById("menuInformacion");
			menu.appendChild(nombre);
			menu.appendChild(model);
			menu.appendChild(manufacturer);
			menu.appendChild(cost);
			menu.appendChild(longitud);
			menu.appendChild(speed);
			menu.appendChild(crew);
			menu.appendChild(passengers);
			menu.appendChild(cargo);
			menu.appendChild(consumables);
			menu.appendChild(hyperdrive);
			menu.appendChild(mglt);
			menu.appendChild(sclass);
			break;
			
		case "general":
	
			var numNaves = fichero.count;
			
			for (var i = 1; i <= numNaves; i++) {
				var elementos = document.createElement("li");
				elementos.style.width = "270px";
				elementos.style.margin = "5px";
				elementos.style.border = "1px solid black";
				elementos.style.float = "left";
				elementos.setAttribute("onclick","mostrarInformacionNave("+i+")");
				elementos.setAttribute("id","nave"+i);
				
				var enlace = document.createElement("a");				
				enlace.style.display = "block";
				enlace.style.textAlign = "center";	
				enlace.style.padding = "15px";				
				enlace.appendChild(document.createTextNode("Nave Estelar #" + i));
				
				elementos.appendChild(enlace);
				lista.appendChild(elementos);
			}
			break;
	}
	divContenedor.appendChild(lista);
}

// Funciones relativas a los vehiculos

function mostrarInformacionVehiculo(id) { 

	limpiarMenusInformacion();
	crearMenu(document.getElementById("vehiculo"+id));
	descargaJSon(6,id,"vehiculo");
}

function mostrarListadoVehiculos(tipo,fichero) { 

	var lista = document.createElement("ul");
	lista.style.listStyleType = "none";		
	lista.style.margin = "0px";
	lista.style.padding = "0px";
	
	switch (tipo) {
	
		case "vehiculo":
		
			var menu = document.getElementById("menuInformacion");
			
			var nombre = document.createElement("p");			
			nombre.appendChild(document.createTextNode("Name: " + fichero.name));
			var model = document.createElement("p");
			model.appendChild(document.createTextNode("Model: " + fichero.model));
			var manufacturer = document.createElement("p");
			manufacturer.appendChild(document.createTextNode("Manufacturer: " + fichero.manufacturer));
			var cost = document.createElement("p");
			cost.appendChild(document.createTextNode("Cost: " + fichero.cost_in_credits));
			var longitud = document.createElement("p");
			longitud.appendChild(document.createTextNode("Length: " + fichero.length));
			var speed = document.createElement("p");
			speed.appendChild(document.createTextNode("Max Atmosphering Speed: " + fichero.max_atmosphering_speed));
			var crew = document.createElement("p");
			crew.appendChild(document.createTextNode("Crew: " + fichero.crew));
			var passengers = document.createElement("p");
			passengers.appendChild(document.createTextNode("Passengers: " + fichero.passengers));
			var cargo = document.createElement("p");
			cargo.appendChild(document.createTextNode("Cargo Capacity: " + fichero.cargo_capacity));
			var consumables = document.createElement("p");
			consumables.appendChild(document.createTextNode("Consumables: " + fichero.consumables));
			var vclass = document.createElement("p");
			vclass.appendChild(document.createTextNode("Vehicle Class: " + fichero.vehicle_class));
			
			var menu = document.getElementById("menuInformacion");
			menu.appendChild(nombre);
			menu.appendChild(model);
			menu.appendChild(manufacturer);
			menu.appendChild(cost);
			menu.appendChild(longitud);
			menu.appendChild(speed);
			menu.appendChild(crew);
			menu.appendChild(passengers);
			menu.appendChild(cargo);
			menu.appendChild(consumables);
			menu.appendChild(vclass);
			break;
			
		case "general":
	
			var numVehiculos = fichero.count;			
			
			for (var i = 1; i <= numVehiculos; i++) {
				var elementos = document.createElement("li");
				elementos.style.width = "270px";
				elementos.style.margin = "5px";
				elementos.style.border = "1px solid black";
				elementos.style.float = "left";
				elementos.setAttribute("onclick","mostrarInformacionVehiculo("+i+")");
				elementos.setAttribute("id","vehiculo"+i);
				
				var enlace = document.createElement("a");				
				enlace.style.display = "block";
				enlace.style.textAlign = "center";	
				enlace.style.padding = "15px";				
				enlace.appendChild(document.createTextNode("Vehículo #" + i));
				
				elementos.appendChild(enlace);
				lista.appendChild(elementos);
			}
			break;
	}
	divContenedor.appendChild(lista);
}


// función que crea el menú con el aviso de que se está cargando la página
function crearMenuCargando(elem) {

	var menu = document.createElement("div");
	menu.setAttribute("id","menuCargando");
	menu.style.backgroundColor = "rgb(204,204,204)";
	var altoMenu = 50;
	var anchoMenu = 180;
	menu.style.width = anchoMenu + "px";
	menu.style.height = altoMenu + "px";
	menu.style.top = elem.offsetTop + 300 + "px";
	menu.style.left = document.body.offsetWidth/2 - anchoMenu/2 + "px";
	menu.style.marginLeft = "auto";
	menu.style.marginRight = "auto";
	menu.style.position = "absolute";
	menu.style.padding = "20px";
	menu.style.borderRadius = "5px";
	menu.style.border = "4px solid red";
	
	document.body.appendChild(menu); 
}


// función que borra el menú de cargando cuando la página se ha cargado por completo
function limpiarMenuCargando() {
	var aux = document.getElementById("menuCargando");
	if (aux) {
		document.body.removeChild(aux); // borramos el menú
	}
}
