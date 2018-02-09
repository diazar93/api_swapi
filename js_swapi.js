/*
Autor: Alberto Díaz Arenas
Módulo: Desarrollo de Interfaces
Grado: Desarrollo de Aplicaciones Multiplataforma
Instituto: IES Virgen de la Paloma
*/

function descargaJSonPeliculas(tipoGeneral, id, tipo) { // descargaJSonPeliculas(id,tipoConsulta)

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
				peticion_http.open('GET', 'https://swapi.co/api/people/', true);
				tipo = "general";
			}
			else {
				peticion_http.open('GET', 'https://swapi.co/api/people/'+id+'/', true);
				tipo = "personaje";
			}
			break;
		case 3: // planetas
			if (tipo == "general") {
				peticion_http.open('GET', 'https://swapi.co/api/planets/', true);
				tipo = "general";
			}
			else {
				peticion_http.open('GET', 'https://swapi.co/api/planets/'+id+'/', true);
				tipo = "planeta";
			}
			break;
		case 4: // especies
			if (tipo == "general") {
				peticion_http.open('GET', 'https://swapi.co/api/species/', true);
				tipo = "general";
			}
			else {
				peticion_http.open('GET', 'https://swapi.co/api/species/'+id+'/', true);
				tipo = "especie";
			}
			break;
		case 5: // naves estelares
			if (tipo == "general") {
				peticion_http.open('GET', 'https://swapi.co/api/starships/', true);
				tipo = "general";
			}
			else {
				peticion_http.open('GET', 'https://swapi.co/api/starships/'+id+'/', true);
				tipo = "nave";
			}
			break;
		case 6: // vehiculos
			if (tipo == "general") {
				peticion_http.open('GET', 'https://swapi.co/api/vehicles/', true);
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
			
				switch (tipoGeneral) {
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
		}				
	}
}
			
window.onload = function() {

	iniciar();
	
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
	
	for (var i = 0; i < categorias.length; i++) {
			categorias[i].setAttribute("onmouseover","cambiarFondo("+i+",true)");
			categorias[i].setAttribute("onmouseout","cambiarFondo("+i+",false)");
			categorias[i].setAttribute("onclick","obtenerInformacion("+i+")");
	}
	
	textoMenuInicio = divContenedor.innerHTML;

}

function iniciar() {
	maximo = 400;
	mmedio = document.getElementById('medio');
	reproducir = document.getElementById('reproducir');
	barra = document.getElementById('barra');
	progreso = document.getElementById('progreso');
	silenciar = document.getElementById('silenciar');
	reproducir.onclick = cambiar;
	reproducir.onmouseover = function() {
		reproducir.style.backgroundColor = "rgb(162, 0, 0)";
	}
	reproducir.onmouseout = function() {
		reproducir.style.backgroundColor = "rgb(204, 204, 204)";
	}
	silenciar.onclick = sonido;
	silenciar.onmouseover = function() {
		silenciar.style.backgroundColor = "rgb(162, 0, 0)";
	}
	silenciar.onmouseout = function() {
		silenciar.style.backgroundColor = "rgb(204, 204, 204)";
	}
	barra.onclick = mover;
}

function cambiar(){

	if(!mmedio.paused && !mmedio.ended){
		mmedio.pause();
		reproducir.value = 'Play';
		clearInterval(bucle);
	}
	else{
		mmedio.play();
		reproducir.value = 'Pause';
		bucle = setInterval(estado, 1000);
	}
}

function estado(){
	if(!mmedio.ended){
		var tamano = parseInt(mmedio.currentTime * maximo / mmedio.duration);
		progreso.style.width = tamano + 'px';
	}
	else{
		progreso.style.width = '0px';
		reproducir.innerHTML = 'Play';
		clearInterval(bucle);
	}
}

function mover(e){
	if(!mmedio.paused && !mmedio.ended){
		var ratonX = e.pageX - barra.offsetLeft;
		var nuevotiempo = ratonX * mmedio.duration / maximo;
		mmedio.currentTime = nuevotiempo;
		progreso.style.width = ratonX + 'px';
	}
}

function sonido(){
	if(silenciar.value == 'Mute'){
		mmedio.muted = true;
		silenciar.value = 'Audio';
	}
	else{
		mmedio.muted = false;
		silenciar.value = 'Mute';
	}
}

function cambiarFondo(pos,entrar) {
	if (entrar) 
		categorias[pos].style.backgroundColor = "rgb(162, 0, 0)";
	else 
		categorias[pos].style.backgroundColor = "rgb(51, 51, 51)";
}

function limpiarContenedor() { // método que limpia el contenido del div contenedor
	while (divContenedor.firstChild) {
		divContenedor.removeChild(divContenedor.firstChild);
	}
}

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
			descargaJSonPeliculas(posicion,0,"general"); 
			
			break;
			
		case 2: // personajes
			limpiarContenedor();
			titulo.appendChild(document.createTextNode("Listado de personajes"));
			divContenedor.appendChild(titulo);
			descargaJSonPeliculas(posicion,0,"general"); 
			break;
			
		case 3: // planetas
			limpiarContenedor();
			titulo.appendChild(document.createTextNode("Listado de planetas"));
			divContenedor.appendChild(titulo);
			descargaJSonPeliculas(posicion,0,"general"); 
			break;
			
		case 4: // especies
			limpiarContenedor();
			titulo.appendChild(document.createTextNode("Listado de especies"));
			divContenedor.appendChild(titulo);
			descargaJSonPeliculas(posicion,0,"general"); 
			break;
		
		case 5: // naves
			limpiarContenedor();
			titulo.appendChild(document.createTextNode("Listado de naves"));
			divContenedor.appendChild(titulo);
			descargaJSonPeliculas(posicion,0,"general"); 
			break;
			
		case 6: // vehículos
			limpiarContenedor();
			titulo.appendChild(document.createTextNode("Listado de vehículos"));
			divContenedor.appendChild(titulo);
			descargaJSonPeliculas(posicion,0,"general"); 
			break;
	}
	
}

function crearMenu(elem) {

	var menu = document.createElement("div");
	menu.setAttribute("id","menuInformacion");
	menu.style.backgroundColor = "rgb(204,204,204)";
	var altoMenu = 300;
	var anchoMenu = 520;
	menu.style.width = anchoMenu + "px";
	menu.style.height = altoMenu + "px";
	menu.style.top = elem.offsetTop - 300 + "px";
	menu.style.left = document.body.offsetWidth/2 - anchoMenu/2 + "px";
	menu.style.marginLeft = "auto";
	menu.style.marginRight = "auto";
	menu.style.position = "absolute";
	menu.style.padding = "20px";
	menu.style.borderRadius = "5px";
	menu.style.border = "4px solid red";
	menu.style.overflow = "scroll";
	
	var botonSalir = document.createElement("button");
	botonSalir.setAttribute("type","button");
	botonSalir.setAttribute("name","botonSalir");
	botonSalir.setAttribute("id","botonSalir");
	botonSalir.appendChild(document.createTextNode("X"));
	var altoBoton = 40;
	var anchoBoton = 40;
	botonSalir.style.position = "absolute";
	botonSalir.style.top = "5px";
	botonSalir.style.left = (anchoMenu - anchoBoton/2)+"px";
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
		document.body.removeChild(document.getElementById("menuInformacion")); // borramos el menú
	}
	
	menu.appendChild(botonSalir);
	document.body.appendChild(menu); 
}

function limpiarMenusInformacion() {
	var aux = document.getElementById("menuInformacion");
	if (aux) {
		document.body.removeChild(aux); // borramos el menú
	}
}

// Funciones relativas a las peliculas

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
	descargaJSonPeliculas(1,res,"pelicula");	 
}

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
			var arrayResults = fichero.results;
			
			for (var i = 1; i < numPelis; i++) {
				var elementos = document.createElement("li");
				elementos.style.width = "280px";
				elementos.style.margin = "5px";
				elementos.style.border = "1px solid black";
				elementos.style.float = "left";
				elementos.setAttribute("onclick","mostrarInformacionPelicula("+i+")");
				elementos.setAttribute("id","pelicula"+i);
				
				var enlace = document.createElement("a");				
				enlace.style.display = "block";
				enlace.style.textAlign = "center";	
				enlace.style.padding = "15px";	
				enlace.appendChild(document.createTextNode("Episodio #" + i));
				
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
	descargaJSonPeliculas(2,id,"personaje");
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
			
			for (var i = 1; i <= numPersonajes; i++) {
				var elementos = document.createElement("li");
				elementos.style.width = "280px";
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
	descargaJSonPeliculas(3,id,"planeta");
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
				elementos.style.width = "280px";
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
	descargaJSonPeliculas(4,id,"especie");
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
				elementos.style.width = "280px";
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
	descargaJSonPeliculas(5,id,"nave");
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
				elementos.style.width = "280px";
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
	descargaJSonPeliculas(6,id,"vehiculo");
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
				elementos.style.width = "280px";
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

