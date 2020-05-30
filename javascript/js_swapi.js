/*
Autor: Alberto Díaz Arenas
Módulo: Desarrollo de Interfaces
Grado: Desarrollo de Aplicaciones Multiplataforma
Instituto: IES Virgen de la Paloma
*/

window.onload = function() {
	
	// genero un div oculto que me servirá como "punto de referencia" para alojar los mensajes de "Cargando..."
	// mientras que se realizan las consultas a la API, para que el usuario vea que está pasando "algo"
	var divOculto = document.createElement("div");
	divOculto.setAttribute("id","divOculto");
	divOculto.style.backgroundColor= "green";
	divOculto.style.width = "50px";
	divOculto.style.position = "fixed";
	divOculto.style.top = divOculto.scrollTop + 450 + "px";
	divOculto.style.left = document.body.offsetWidth/2 - 25 + "px";
	divOculto.style.marginLeft = "auto";
	divOculto.style.marginRight = "auto";
	divOculto.style.visibility = "hidden";
	var msgDivOculto = document.createElement("p");
	msgDivOculto.appendChild(document.createTextNode("ancla"));
	divOculto.appendChild(msgDivOculto);
	document.body.appendChild(divOculto);

	iniciarReproductor(); // inicio la función del reproductor
	
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
			categorias[i].setAttribute("onmouseover","cambiarFondoCategoria("+i+",true)");
			categorias[i].setAttribute("onmouseout","cambiarFondoCategoria("+i+",false)");
			categorias[i].setAttribute("onclick","obtenerInformacionGeneral("+i+",1,1)");
	}
	
	// en la variable global textoMenuInicio guardo el contenido inicial correspondiente al menú inicio. Ya que es solo texto
	// lo guardo usando el innerHTML 	
	textoMenuInicio = divContenedor.innerHTML;
	
	// cargo el cuadro de búsqueda
	inputBusqueda = document.getElementById("inputBusqueda");
	inputBusqueda.setAttribute("placeholder","Dato a buscar...");
	inputBusqueda.style.width = "180px";
	inputBusqueda.style.padding = "1px";
	inputBusqueda.onkeypress = comprobarTecla;
	
	botonBusqueda = document.getElementById("botonBusqueda");
	botonBusqueda.onclick = function(){ buscar(inputBusqueda.value,0,1,true); };
	botonBusqueda.onmouseover = function() {
		botonBusqueda.style.backgroundColor = "rgb(162, 0, 0)";
		botonBusqueda.style.color = "white";
	}
	botonBusqueda.onmouseout = function() {
		botonBusqueda.style.backgroundColor = "rgb(204, 204, 204)";
		botonBusqueda.style.color = "black";
	}
}

// función que comprueba si se pulsa la tecla enter y, si es asi, realiza la función de buscar
function comprobarTecla(evObject) {	
	if (evObject.which == 13) {
		buscar(inputBusqueda.value,0,1,true);
	}	
}

// función que realiza la búsqueda en toda la API del elemento escrito en el recuadro de búsqueda
function buscar(cadenaABuscar,indiceTipos,contador,primeraBusqueda) {

	if (cadenaABuscar != "") { // solo se hace una bsqueda si hay algo en el recuadro de búsqueda

		inputBusqueda.value = "";
		if (primeraBusqueda) { // solo si se llama a buscar por primera vez genero el menú de cargando, ya que buscar es una función recurrente
			crearMenuCargando(document.getElementById("divOculto"),true); // se crea el aviso de que se están cargando los resultados
		}
		
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
		var tipos = ["films","people","planets","species","starships","vehicles"];
		tipoEvaluado = tipos[indiceTipos];
		peticion_http.open('GET',"https://swapi.dev/api/"+tipoEvaluado+"/"+contador+"/", true);	
		peticion_http.send(null);
		
		function muestraContenido() {
			if(peticion_http.readyState == 4) {
				if(peticion_http.status == 200) {
					
					var archivoJSON = JSON.parse(peticion_http.responseText);
					
					if (archivoJSON.title) {
						if (archivoJSON.title == cadenaABuscar) {
							// como se ha completado correctamente la descarga de los datos elimino el aviso de cargando
							limpiarMenuCargando();
							crearMenu(divContenedor);
							mostrarInformacionPelicula(archivoJSON);
						}
						else {
							actualizarParametrosBusqueda(cadenaABuscar,indiceTipos,contador,tipoEvaluado);
						}
					}
					
					if (archivoJSON.name) {
						if (archivoJSON.name == cadenaABuscar) {
							// como se ha completado correctamente la descarga de los datos elimino el aviso de cargando
							limpiarMenuCargando();
							crearMenu(divContenedor);				
							switch (tipoEvaluado) {
								case "people":
									mostrarInformacionPersonaje(archivoJSON);
									break;
								case "planets":
									mostrarInformacionPlaneta(archivoJSON);
									break;
								case "species":
									mostrarInformacionEspecie(archivoJSON);
									break;
								case "starships":
									mostrarInformacionNave(archivoJSON);
									break;
								case "vehicles":
									mostrarInformacionVehiculo(archivoJSON);
									break;
							}
						}
						else {
							actualizarParametrosBusqueda(cadenaABuscar,indiceTipos,contador,tipoEvaluado);
						}
					}
					
				}
				else {
					actualizarParametrosBusqueda(cadenaABuscar,indiceTipos,contador,tipoEvaluado);
				}
			}
		}
	}
	else { // se ha dejado en blanco el recuadro de busqueda
		crearMenuBusquedaFallida(divContenedor,cadenaABuscar);
		setTimeout(limpiarMenuBusquedaFallida,3000);
	}
}

function actualizarParametrosBusqueda(cadenaABuscar,indiceTipos,contador,tipoEvaluado) {

	switch (tipoEvaluado) {
		case "films":
			topeContador = 7;
			break;
		case "people":
			topeContador = 88;
			break;
		case "planets":
			topeContador = 61;
			break;
		case "species":
			topeContador = 37;
			break;
		case "starships":
			topeContador = 77;
			break;
		case "vehicles":
			topeContador = 76;
			break;
	}

	if (contador < topeContador) {
		contador = contador + 1;
		buscar(cadenaABuscar,indiceTipos,contador,false); 
	}
	else {
		if (tipoEvaluado != "vehicles") { // sólo se da este caso si no llegado al útimo elemento de la categoría vehículos
			indiceTipos = indiceTipos + 1;
			contador = 1;
		
			buscar(cadenaABuscar,indiceTipos,contador,false); 
		}
		else { // si hemos llegado al último elemento de la categoría vehículos mostramos un mensaje de búsqueda fallida
			limpiarMenuCargando();
			crearMenuBusquedaFallida(divContenedor,cadenaABuscar);
			setTimeout(limpiarMenuBusquedaFallida,3000);
		}
	}
	
	
	// uso el false para indicar que ya NO es una primera búsqueda y así evitar 
	//la formación de tantos menús de cargando como elementos haya evaluado en la búsqueda
}

// función que borra el menú de búsqueda fallida 
function limpiarMenuBusquedaFallida() {
	var aux = document.getElementById("menuBusquedaFallida");
	if (aux) {
		document.body.removeChild(aux); 
	}
}

// función que crea el menú con el aviso de que se no se ha encontrado un elemento
function crearMenuBusquedaFallida(elem,cadenaABuscar) {

	var menu = document.createElement("div");
	menu.setAttribute("id","menuBusquedaFallida");
	menu.style.backgroundColor = "rgb(204,204,204)";
	var altoMenu = 160;
	var anchoMenu = 200;
	menu.style.width = anchoMenu + "px";
	menu.style.height = altoMenu + "px";
	menu.style.top = elem.offsetTop + "px";
	menu.style.left = document.body.offsetWidth/2 - anchoMenu/2 + "px";
	menu.style.marginLeft = "auto";
	menu.style.marginRight = "auto";
	menu.style.position = "absolute";
	menu.style.padding = "20px";
	menu.style.borderRadius = "5px";
	menu.style.border = "4px solid red";
	
	var parrafoCargando = document.createElement("p");
	if (cadenaABuscar == "") {
		parrafoCargando.appendChild(document.createTextNode("Debe introducir algún dato para poder buscar información"));
	}
	else {
		parrafoCargando.appendChild(document.createTextNode("Lo sentimos, no se ha encontrado ningún archivo que coincida con '"+cadenaABuscar+"'"));
	}
	
	parrafoCargando.style.textAlign = "center";
	menu.appendChild(parrafoCargando);
	
	document.body.appendChild(menu); 
}

// función para cambiar el color de fondo de los elementos del menú de navegación comforme pasas el ratón por encima de ellos
function cambiarFondoCategoria(pos,entrar) {
	if (entrar) // onmouseover
		categorias[pos].style.backgroundColor = "rgb(162, 0, 0)";
	else	// onmouseout
		categorias[pos].style.backgroundColor = "rgb(51, 51, 51)";
}

// una vez se hace click en un elemento del menú de navegación se llama a esta función, que crea en el div contenedor
// un título orientativo además de realizar la llamada correspondiente a la API.
function obtenerInformacionGeneral(posicion, indiceActual, idPagina) {

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
			navegarA("films",indiceActual,idPagina,0,false);			
			break;
			
		case 2: // personajes
			limpiarContenedor();
			titulo.appendChild(document.createTextNode("Listado de personajes"));
			divContenedor.appendChild(titulo);
			navegarA("people",indiceActual,idPagina,0,false);
			break;
			
		case 3: // planetas
			limpiarContenedor();
			titulo.appendChild(document.createTextNode("Listado de planetas"));
			divContenedor.appendChild(titulo);
			navegarA("planets",indiceActual,idPagina,0,false);
			break;
			
		case 4: // especies
			limpiarContenedor();
			titulo.appendChild(document.createTextNode("Listado de especies"));
			divContenedor.appendChild(titulo);
			navegarA("species",indiceActual,idPagina,0,false); 
			break;
		
		case 5: // naves
			limpiarContenedor();
			titulo.appendChild(document.createTextNode("Listado de naves"));
			divContenedor.appendChild(titulo);
			navegarA("starships",indiceActual,idPagina,0,false); 
			break;
			
		case 6: // vehículos
			limpiarContenedor();
			titulo.appendChild(document.createTextNode("Listado de vehículos"));
			divContenedor.appendChild(titulo);
			navegarA("vehicles",indiceActual,idPagina,0,false); 
			break;
	}	
}

// método que limpia el contenido del div contenedor
function limpiarContenedor() { 
	while (divContenedor.firstChild) {
		divContenedor.removeChild(divContenedor.firstChild);
	}
}

// función que se va a encargar de realizar la consulta a la API para listar los elementos en el div contenedor
// de forma paginada llamando a la función correspondiente
function navegarA(tipo,idPag,indiceActual,esAvance,existenBotones) {

	crearMenuCargando(document.getElementById("divOculto"),false); // se crea el aviso de que se están cargando los resultados	

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
	peticion_http.open('GET',"https://swapi.dev/api/"+tipo+"/?page="+idPag, true);
	peticion_http.send(null);
	function muestraContenido() {
		if(peticion_http.readyState == 4) {
			if(peticion_http.status == 200) {
				
				// como se ha completado correctamente la descarga de los datos elimino el aviso de cargando
				limpiarMenuCargando();
				
				// si se ha llamado a la función navegarA desde el botón de página anterior reducimos el índice actual
				if (esAvance == -1) { 
					indiceActual = indiceActual - 1;
					mostrarDatosPaginados(tipo,JSON.parse(peticion_http.responseText),indiceActual,existenBotones);
				}
				// si se ha llamado a la función navegarA desde el botón de página siguiente  aumentamos el índice actual
				else if (esAvance == 1){
					indiceActual = indiceActual + 1;
					mostrarDatosPaginados(tipo,JSON.parse(peticion_http.responseText),indiceActual,existenBotones);
				}
				// si se ha llamado a la función navegarA desde alguna de las categorías de la barra de navegación
				else {
					mostrarDatosPaginados(tipo,JSON.parse(peticion_http.responseText),indiceActual,existenBotones);
				}
			}
		}				
	}
}

// función que crea el menú con el aviso de que se está cargando la página
function crearMenuCargando(elem,esBusqueda) {

	var menu = document.createElement("div");
	menu.setAttribute("id","menuCargando");
	menu.style.backgroundColor = "rgb(204,204,204)";
	var altoMenu = 160;
	var anchoMenu = 200;
	menu.style.width = anchoMenu + "px";
	menu.style.height = altoMenu + "px";
	menu.style.top = elem.offsetTop + "px";
	menu.style.left = document.body.offsetWidth/2 - anchoMenu/2 + "px";
	menu.style.marginLeft = "auto";
	menu.style.marginRight = "auto";
	menu.style.position = "absolute";
	menu.style.padding = "20px";
	menu.style.borderRadius = "5px";
	menu.style.border = "4px solid red";
	
	var parrafoCargando = document.createElement("p");
	if (esBusqueda) {
		parrafoCargando.appendChild(document.createTextNode("Realizando la búsqueda..."));
	}
	else {
		parrafoCargando.appendChild(document.createTextNode("Cargando..."));
	}
	parrafoCargando.style.textAlign = "center";
	menu.appendChild(parrafoCargando);
	
	var gifCargando = new Image();
	gifCargando.src = "./images/cargando.gif";
	gifCargando.style.position = "absolute";
	gifCargando.style.marginLeft = "auto";
	gifCargando.style.marginRight = "auto";
	menu.appendChild(gifCargando);
	
	document.body.appendChild(menu); 
}


// función que borra el menú de cargando cuando la página se ha cargado por completo
function limpiarMenuCargando() {
	var aux = document.getElementById("menuCargando");
	if (aux) {
		document.body.removeChild(aux); 
	}
}

// función que muestra los datos de la consulta de forma paginada
function mostrarDatosPaginados(tipo,fichero,indiceActual,existenBotones) {

	borrarLista();

	var numTotalPaginas = Math.floor(fichero.count/10) + 1;
	if (!existenBotones) {
		crearBotones(tipo,indiceActual,numTotalPaginas,true);
	}
	else {
		actualizarBotones(tipo,indiceActual,numTotalPaginas,true);
	}

	var lista = document.createElement("ul");
	lista.setAttribute("id","listaElementosPaginados");
	lista.style.listStyleType = "none";		
	lista.style.margin = "0px";
	lista.style.padding = "0px";
	
	var arrayDatos = fichero.results;	
			
	for (var i = 0; i < arrayDatos.length; i++) {
		var elementos = document.createElement("li");
		var idElemento = "elem_"+tipo+"_"+i;
		elementos.setAttribute("id",idElemento);
		elementos.style.width = "270px";
		elementos.style.margin = "5px";
		elementos.style.border = "1px solid black";
		elementos.style.float = "left";	
		
		var enlace = document.createElement("a");				
		enlace.style.display = "block";
		enlace.style.textAlign = "center";	
		enlace.style.padding = "15px";	

		switch (tipo) {
			case "films":
				agregarOnClickElemento(elementos,idElemento,tipo,arrayDatos[i].episode_id);
				enlace.appendChild(document.createTextNode(arrayDatos[i].title));
				break;
			default:
				var numeroElemento = obtenerNumeroElemento(arrayDatos[i].url);
				agregarOnClickElemento(elementos,idElemento,tipo,numeroElemento);
				enlace.appendChild(document.createTextNode(arrayDatos[i].name));
				break;
		}
		
		
		elementos.appendChild(enlace);
		lista.appendChild(elementos);
	}
	divContenedor.appendChild(lista);
}

// función que agrega el atributo onclick a cada elemento de la lista del div contenedor
function agregarOnClickElemento(elementoReceptor,idElemento,tipo,idDato) {
	elementoReceptor.onclick = function() { obtenerInformacion(idElemento,tipo,idDato); };
}

// función que obtiene el número del elemento en la API correspondiente a partir de su campo url
function obtenerNumeroElemento(cadena) {
	var res = "";
	for(var i = 0; i < cadena.length; i++) {
		if (!isNaN(cadena.charAt(i))) {
			res = res + cadena.charAt(i) + "";
		}
	}
	return res;
}

// función que borra la lista existente en el div contenedor
function borrarLista() {
	var lista = document.getElementById("listaElementosPaginados");
	if (lista) {
		divContenedor.removeChild(lista);
	}
}

// función que crea los botones para recorrer las distintas páginas
function crearBotones(tipo,indiceActual,numTotalPaginas,botonesCreados) {

	var divBotonesPaginas = document.createElement("div");
	divBotonesPaginas.setAttribute("id","divBotonesPaginas");
	var anchoDivBotones = 270;
	divBotonesPaginas.style.width = anchoDivBotones + "px";	
	divBotonesPaginas.style.display = "inline";
	divBotonesPaginas.style.position = "relative";	
	divBotonesPaginas.style.padding = "10px";	
	divBotonesPaginas.style.left = divContenedor.offsetWidth/2 - anchoDivBotones + 70 + "px";

	var botonAnterior = document.createElement("div");
	botonAnterior.setAttribute("id","botonPaginaAnterior");
	botonAnterior.appendChild(document.createTextNode("Página anterior"));
	botonAnterior.style.width = "120px";
	botonAnterior.style.marginRight = "20px";
	botonAnterior.style.padding = "2px 6px";
	botonAnterior.style.border = "1px solid #000000";
	botonAnterior.style.borderRadius = "10px";
	botonAnterior.style.backgroundColor = "rgb(204, 204, 204)";
	botonAnterior.style.fontWeight = "bold";
	botonAnterior.style.marginBottom = "20px";
	botonAnterior.style.display = "inline";
	
	var botonSiguiente = document.createElement("div");
	botonSiguiente.setAttribute("id","botonPaginaSiguiente");
	botonSiguiente.appendChild(document.createTextNode("Página siguiente"));
	botonSiguiente.style.width = "120px";
	botonSiguiente.style.padding = "2px 6px";
	botonSiguiente.style.border = "1px solid #000000";
	botonSiguiente.style.borderRadius = "10px";
	botonSiguiente.style.backgroundColor = "rgb(204, 204, 204)";
	botonSiguiente.style.fontWeight = "bold";
	botonSiguiente.style.marginBottom = "20px";
	botonSiguiente.style.display = "inline";
	
	if (1 == indiceActual) {
		botonAnterior.onclick = "null";
		botonAnterior.style.visibility = "hidden";
	}	
	else { // (1 < indiceActual) 		
		botonAnterior.onclick = function(){ 
			var paginaAnterior = indiceActual - 1;
			navegarA(tipo,paginaAnterior,indiceActual,-1,botonesCreados); 
		};
		botonAnterior.onmouseover = function() {
			botonAnterior.style.backgroundColor = "rgb(162, 0, 0)";
			botonAnterior.style.color = "white";
		};
		botonAnterior.onmouseout = function() {
			botonAnterior.style.backgroundColor = "rgb(204, 204, 204)";
			botonAnterior.style.color = "black";
		};
	}
	if (indiceActual < numTotalPaginas) {	
		botonSiguiente.onclick = function(){ 
			var paginaSiguiente = indiceActual + 1;
			navegarA(tipo,paginaSiguiente,indiceActual,1,botonesCreados); 
		};
		botonSiguiente.onmouseover = function() {
			botonSiguiente.style.backgroundColor = "rgb(162, 0, 0)";
			botonSiguiente.style.color = "white";
		};
		botonSiguiente.onmouseout = function() {
			botonSiguiente.style.backgroundColor = "rgb(204, 204, 204)";
			botonSiguiente.style.color = "black";
		};
	}	
	else { //(indiceActual == numTotalPaginas)
		botonSiguiente.onclick = "null";
	}
	
	var contadorPagina = document.createElement("div");
	contadorPagina.setAttribute("id","contadorPagina");
	contadorPagina.textContent = indiceActual;
	contadorPagina.style.width = "40px";
	contadorPagina.style.textAlign = "center";
	contadorPagina.style.padding = "2px 6px";
	contadorPagina.style.border = "1px solid #000000";
	contadorPagina.style.borderRadius = "10px";
	contadorPagina.style.backgroundColor = "rgb(204, 204, 204)";
	contadorPagina.style.fontWeight = "bold";
	contadorPagina.style.marginBottom = "20px";
	contadorPagina.style.display = "inline";
	contadorPagina.style.marginRight = "20px";
	
	divBotonesPaginas.appendChild(botonAnterior);
	divBotonesPaginas.appendChild(contadorPagina);
	divBotonesPaginas.appendChild(botonSiguiente);
	divContenedor.appendChild(divBotonesPaginas);
	var espacio = document.createElement("p");
	espacio.appendChild(document.createTextNode("."));
	espacio.style.visibility = "hidden";
	divContenedor.appendChild(espacio);
}

// función que actualiza el direccionamiento de los botones anterior y siguiente
function actualizarBotones(tipo,indiceActual,numTotalPaginas,botonesCreados) {

	var botonAnterior = document.getElementById("botonPaginaAnterior");	
	var botonSiguiente = document.getElementById("botonPaginaSiguiente");
	var contadorPagina = document.getElementById("contadorPagina");

	if (1 == indiceActual) {
		botonAnterior.onclick = "null";
		botonAnterior.style.visibility = "hidden";
	}	
	else { // (1 < indiceActual) 
		botonAnterior.style.visibility = "visible";
		botonAnterior.onclick = function(){ 
			var paginaAnterior = indiceActual - 1;
			navegarA(tipo,paginaAnterior,indiceActual,-1,botonesCreados); 
		};
		botonAnterior.onmouseover = function() {
			botonAnterior.style.backgroundColor = "rgb(162, 0, 0)";
			botonAnterior.style.color = "white";
		};
		botonAnterior.onmouseout = function() {
			botonAnterior.style.backgroundColor = "rgb(204, 204, 204)";
			botonAnterior.style.color = "black";
		};
	}
	if (indiceActual < numTotalPaginas) {
		botonSiguiente.style.visibility = "visible";
		botonSiguiente.onclick = function(){ 
			var paginaSiguiente = indiceActual + 1;
			navegarA(tipo,paginaSiguiente,indiceActual,1,botonesCreados); 
		};
		botonSiguiente.onmouseover = function() {
			botonSiguiente.style.backgroundColor = "rgb(162, 0, 0)";
			botonSiguiente.style.color = "white";
		};
		botonSiguiente.onmouseout = function() {
			botonSiguiente.style.backgroundColor = "rgb(204, 204, 204)";
			botonSiguiente.style.color = "black";
		};
	}	
	else { // (indiceActual == numTotalPaginas)
		botonSiguiente.onclick = "null";
		botonSiguiente.style.visibility = "hidden";
	}
	
	contadorPagina.textContent = indiceActual;
}

// función que se va a encargar de realizar la consulta a la API para obtener la información de cada elemento 
// que hay en el div contenedor
function obtenerInformacion(elemento,tipo,idDato) {
	
	limpiarMenusInformacion();
	crearMenu(document.getElementById(elemento));
	
	// si se va a obtener informacion de una pelicula hago el siguiente arreglo
	// ya que las peliculas están alojadas en una url con un código identificador
	// que no se corresponde con su número de episodio
	if (tipo == "films") {
		var listadoPeliculas = [0,4,5,6,1,2,3,7];	
		var res;
		encontrado = false;
		
		for (var i = 0; i < listadoPeliculas.length && !encontrado; i++) {	
			if (listadoPeliculas[i] == idDato) {
				res = i;
				encontrado = true;
			}
		}
		descargaJSon(tipo,res);
	}
	else {
		descargaJSon(tipo,idDato);
	}
}

// para evitar que se puedan superponer varios menús se borra el que hay anteriormente si se hace click en otro elemento
// que a su vez genere otro menú
function limpiarMenusInformacion() {
	var aux = document.getElementById("contenedorGeneral");
	if (aux) {
		document.body.removeChild(aux); // borramos el menú
	}
}

// esta función crea un menú flotante cuando se hace click en un elemento en concreto de los que devuelve la API 
// cuando se ha hecho click anteriormente en una categoría del menú de navegación
function crearMenu(elem,opcionSettings) {

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
	
	if (opcionSettings) {
		var tituloSettings = document.createElement("p");
		tituloSettings.appendChild(document.createTextNode("Seleccione una canción para reproducir:"));
		tituloSettings.style.marginTop = "10px";
		tituloSettings.style.marginLeft = "10px";
		contenedorGeneral.appendChild(tituloSettings);
	}

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
	botonSalir.appendChild(document.createTextNode("Close"));
	var altoBoton = 40;
	var anchoBoton = 40;
	botonSalir.style.position = "absolute";
	botonSalir.style.top = "1px";
	botonSalir.style.left = (anchoContenedorGeneral - anchoBoton - 32 ) + "px";
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

function descargaJSon(tipo,idDato) {

	crearMenuCargando(document.getElementById("divOculto"),false); // se crea el aviso de que se están cargando los resultados	

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
	peticion_http.open('GET',"https://swapi.dev/api/"+tipo+"/"+idDato+"/", true);
	peticion_http.send(null);
	function muestraContenido() {
		if(peticion_http.readyState == 4) {
			if(peticion_http.status == 200) {
				
				// como se ha completado correctamente la descarga de los datos elimino el aviso de cargando
				limpiarMenuCargando();

				switch (tipo) {
					case "films":
						mostrarInformacionPelicula(JSON.parse(peticion_http.responseText));
						break;
					case "people":
						mostrarInformacionPersonaje(JSON.parse(peticion_http.responseText));
						break;
					case "planets":
						mostrarInformacionPlaneta(JSON.parse(peticion_http.responseText));
						break;
					case "species":
						mostrarInformacionEspecie(JSON.parse(peticion_http.responseText));
						break;
					case "starships":
						mostrarInformacionNave(JSON.parse(peticion_http.responseText));
						break;
					case "vehicles":
						mostrarInformacionVehiculo(JSON.parse(peticion_http.responseText));
						break;
				}
				
			}
		}				
	}
}

// ya que el modelo a seguir para ver la información de un elemento tiene la estructura de:
//	IMAGEN ELEMENTO
// 	DATOS ELEMENTO
// pues esta función mostrarConTabulacion alinea los datos con la imagen, para que se vea todo al mismo nivel
function mostrarConTabulacion(menu,elem) {
	elem.style.position = "relative";	
	elem.style.left = ( menu.offsetWidth/2 - 175 ) + "px";
}

// función que muestra en el div de información la información de la película seleccionada
function mostrarInformacionPelicula(fichero) {
	var menu = document.getElementById("menuInformacion");
			
	var codPelicula = fichero.episode_id;
	
	var imagenPelicula = new Image();
	imagenPelicula.src = "./images/films/"+codPelicula+".jpg";
	imagenPelicula.setAttribute("id","film"+codPelicula);
	imagenPelicula.style.position = "relative";			
	imagenPelicula.style.left = ( menu.offsetWidth/2 - 175 ) + "px";
	menu.appendChild(imagenPelicula);
	
	var divDatos = document.createElement("div");
	divDatos.style.position = "relative";	
	divDatos.style.top = ( imagenPelicula.height + 5 ) + "px";
	divDatos.style.width = "350px";
	
	var titulo = document.createElement("p");			
	titulo.appendChild(document.createTextNode("Episodio " + codPelicula + ": " + fichero.title));
	mostrarConTabulacion(menu,titulo);
	
	var director = document.createElement("p");
	director.appendChild(document.createTextNode("Director: " + fichero.director));
	mostrarConTabulacion(menu,director);
	
	var producer = document.createElement("p");
	producer.appendChild(document.createTextNode("Producer: " + fichero.producer));
	mostrarConTabulacion(menu,producer);
	
	var releaseDate = document.createElement("p");
	releaseDate.appendChild(document.createTextNode("Release Date: " + fichero.release_date));
	mostrarConTabulacion(menu,releaseDate);
	
	var espacio = document.createElement("p");
	espacio.appendChild(document.createTextNode("-------------------------------------------"));
	mostrarConTabulacion(menu,espacio);
	
	var opening = document.createElement("p");
	opening.appendChild(document.createTextNode("Opening: "));
	mostrarConTabulacion(menu,opening);
	
	var textoOpening = document.createElement("p");
	textoOpening.appendChild(document.createTextNode(fichero.opening_crawl));
	mostrarConTabulacion(menu,textoOpening);
	
	divDatos.appendChild(titulo);
	divDatos.appendChild(director);
	divDatos.appendChild(producer);
	divDatos.appendChild(releaseDate);
	divDatos.appendChild(espacio);
	divDatos.appendChild(opening);
	divDatos.appendChild(textoOpening);
	menu.appendChild(divDatos);
}

// función que muestra en el div de información la información del personaje seleccionado
function mostrarInformacionPersonaje(fichero) {

	var menu = document.getElementById("menuInformacion");
			
	var codPersonaje = obtenerNumeroElemento(fichero.url);
	
	var imagenPersonaje = new Image();
	imagenPersonaje.src = "./images/people/"+codPersonaje+".jpg";
	imagenPersonaje.setAttribute("id","people"+codPersonaje);
	imagenPersonaje.style.position = "relative";			
	imagenPersonaje.style.left = ( menu.offsetWidth/2 - 175 ) + "px";
	menu.appendChild(imagenPersonaje);
	
	var divDatos = document.createElement("div");
	divDatos.style.position = "relative";	
	divDatos.style.top = ( imagenPersonaje.height + 5 ) + "px";
	
	var nombre = document.createElement("p");			
	nombre.appendChild(document.createTextNode("Name: " + fichero.name));
	mostrarConTabulacion(menu,nombre); // tabulamos el nombre
	
	var height = document.createElement("p");
	height.appendChild(document.createTextNode("Height: " + fichero.height));
	mostrarConTabulacion(menu,height); // tabulamos la altura
	
	var mass = document.createElement("p");
	mass.appendChild(document.createTextNode("Mass: " + fichero.mass));
	mostrarConTabulacion(menu,mass); // tabulamos el peso
	
	var hairColor = document.createElement("p");
	hairColor.appendChild(document.createTextNode("Hair Color: " + fichero.hair_color));
	mostrarConTabulacion(menu,hairColor); // tabulamos el color de pelo
	
	var skinColor = document.createElement("p");
	skinColor.appendChild(document.createTextNode("Skin Color: " + fichero.skin_color));
	mostrarConTabulacion(menu,skinColor); // tabulamos el color de piel
	
	var eyeColor = document.createElement("p");
	eyeColor.appendChild(document.createTextNode("Eye Color: " + fichero.eye_color));
	mostrarConTabulacion(menu,eyeColor); // tabulamos el color de ojos
	
	var birth = document.createElement("p");
	birth.appendChild(document.createTextNode("Birth year: " + fichero.birth_year));
	mostrarConTabulacion(menu,birth); // tabulamos el año de nacimiento
	
	var gender = document.createElement("p");
	gender.appendChild(document.createTextNode("Gender: " + fichero.gender));
	mostrarConTabulacion(menu,gender); // tabulamos el género
	
	divDatos.appendChild(nombre);
	divDatos.appendChild(height);
	divDatos.appendChild(mass);
	divDatos.appendChild(hairColor);
	divDatos.appendChild(skinColor);
	divDatos.appendChild(eyeColor);
	divDatos.appendChild(birth);
	divDatos.appendChild(gender);
	menu.appendChild(divDatos);
}

// función que muestra en el div de información la información del planeta seleccionado
function mostrarInformacionPlaneta(fichero) {
	var menu = document.getElementById("menuInformacion");
			
	var codPlaneta = obtenerNumeroElemento(fichero.url);
	
	var imagenPlaneta = new Image();
	imagenPlaneta.src = "./images/planets/"+codPlaneta+".jpg";
	imagenPlaneta.setAttribute("id","planet"+codPlaneta);
	imagenPlaneta.style.position = "relative";			
	imagenPlaneta.style.left = ( menu.offsetWidth/2 - 175 ) + "px";
	menu.appendChild(imagenPlaneta);
	
	var divDatos = document.createElement("div");
	divDatos.style.position = "relative";	
	divDatos.style.top = ( imagenPlaneta.height + 5 ) + "px";
	
	var nombre = document.createElement("p");			
	nombre.appendChild(document.createTextNode("Name: " + fichero.name));
	mostrarConTabulacion(menu,nombre);
	
	var rotation = document.createElement("p");
	rotation.appendChild(document.createTextNode("Rotation Period: " + fichero.rotation_period));
	mostrarConTabulacion(menu,rotation);
	
	var orbital = document.createElement("p");
	orbital.appendChild(document.createTextNode("Orbital Period: " + fichero.orbital_period));
	mostrarConTabulacion(menu,orbital);
	
	var diameter = document.createElement("p");
	diameter.appendChild(document.createTextNode("Diameter: " + fichero.diameter));
	mostrarConTabulacion(menu,diameter);
	
	var climate = document.createElement("p");
	climate.appendChild(document.createTextNode("Climate: " + fichero.climate));
	mostrarConTabulacion(menu,climate);
	
	var gravity = document.createElement("p");
	gravity.appendChild(document.createTextNode("Gravity: " + fichero.gravity));
	mostrarConTabulacion(menu,gravity);
	
	var terrain = document.createElement("p");
	terrain.appendChild(document.createTextNode("Terrain: " + fichero.terrain));
	mostrarConTabulacion(menu,terrain);
	
	var surfaceWater = document.createElement("p");
	surfaceWater.appendChild(document.createTextNode("Surface Water: " + fichero.surface_water));
	mostrarConTabulacion(menu,surfaceWater);
	
	var population = document.createElement("p");
	population.appendChild(document.createTextNode("Population: " + fichero.population));
	mostrarConTabulacion(menu,population);
	
	divDatos.appendChild(nombre);
	divDatos.appendChild(rotation);
	divDatos.appendChild(orbital);
	divDatos.appendChild(diameter);
	divDatos.appendChild(climate);
	divDatos.appendChild(gravity);
	divDatos.appendChild(terrain);
	divDatos.appendChild(surfaceWater);
	divDatos.appendChild(population);
	menu.appendChild(divDatos);
}

// función que muestra en el div de información la información de la especie seleccionada
function mostrarInformacionEspecie(fichero) {
	var menu = document.getElementById("menuInformacion");
			
	var codEspecie = obtenerNumeroElemento(fichero.url);
	
	var imagenEspecie = new Image();
	imagenEspecie.src = "./images/species/"+codEspecie+".jpg";
	imagenEspecie.setAttribute("id","specie"+codEspecie);
	imagenEspecie.style.position = "relative";			
	imagenEspecie.style.left = ( menu.offsetWidth/2 - 175 ) + "px";
	menu.appendChild(imagenEspecie);
	
	var divDatos = document.createElement("div");
	divDatos.style.position = "relative";	
	divDatos.style.top = ( imagenEspecie.height + 5 ) + "px";
	
	var nombre = document.createElement("p");			
	nombre.appendChild(document.createTextNode("Name: " + fichero.name));
	mostrarConTabulacion(menu,nombre);
	
	var clasificacion = document.createElement("p");
	clasificacion.appendChild(document.createTextNode("Classification: " + fichero.classification));
	mostrarConTabulacion(menu,clasificacion);
	
	var designation = document.createElement("p");
	designation.appendChild(document.createTextNode("Designation: " + fichero.designation));
	mostrarConTabulacion(menu,designation);
	
	var heightE = document.createElement("p");
	heightE.appendChild(document.createTextNode("Average Height: " + fichero.average_height));
	mostrarConTabulacion(menu,heightE);
	
	var hairColors = document.createElement("p");
	hairColors.appendChild(document.createTextNode("Hair Colors: " + fichero.hair_colors));
	mostrarConTabulacion(menu,hairColors);
	
	var skinColors = document.createElement("p");
	skinColors.appendChild(document.createTextNode("Skin Colors: " + fichero.skin_colors));
	mostrarConTabulacion(menu,skinColors);
	
	var eyeColors = document.createElement("p");
	eyeColors.appendChild(document.createTextNode("Eye Colors: " + fichero.eye_colors));
	mostrarConTabulacion(menu,eyeColors);
	
	var lifespan = document.createElement("p");
	lifespan.appendChild(document.createTextNode("Average Lifespan: " + fichero.average_lifespan));
	mostrarConTabulacion(menu,lifespan);
	
	var language = document.createElement("p");
	language.appendChild(document.createTextNode("Language: " + fichero.language));
	mostrarConTabulacion(menu,language);
	
	divDatos.appendChild(nombre);
	divDatos.appendChild(clasificacion);
	divDatos.appendChild(designation);
	divDatos.appendChild(heightE);
	divDatos.appendChild(hairColors);
	divDatos.appendChild(skinColors);
	divDatos.appendChild(eyeColors);
	divDatos.appendChild(lifespan);
	divDatos.appendChild(language);
	menu.appendChild(divDatos);
}

// función que muestra en el div de información la información de la nave estelar seleccionada
function mostrarInformacionNave(fichero) {
	var menu = document.getElementById("menuInformacion");
			
	var codNave = obtenerNumeroElemento(fichero.url);
	
	var imagenNave = new Image();
	imagenNave.src = "./images/starships/"+codNave+".jpg";
	imagenNave.setAttribute("id","starship"+codNave);
	imagenNave.style.position = "relative";			
	imagenNave.style.left = ( menu.offsetWidth/2 - 175 ) + "px";
	menu.appendChild(imagenNave);
	
	var divDatos = document.createElement("div");
	divDatos.style.position = "relative";	
	divDatos.style.top = ( imagenNave.height + 5 ) + "px";
	
	var nombre = document.createElement("p");			
	nombre.appendChild(document.createTextNode("Name: " + fichero.name));
	mostrarConTabulacion(menu,nombre);
	
	var model = document.createElement("p");
	model.appendChild(document.createTextNode("Model: " + fichero.model));
	mostrarConTabulacion(menu,model);
	
	var manufacturer = document.createElement("p");
	manufacturer.appendChild(document.createTextNode("Manufacturer: " + fichero.manufacturer));
	mostrarConTabulacion(menu,manufacturer);
	
	var cost = document.createElement("p");
	cost.appendChild(document.createTextNode("Cost: " + fichero.cost_in_credits));
	mostrarConTabulacion(menu,cost);
	
	var longitud = document.createElement("p");
	longitud.appendChild(document.createTextNode("Length: " + fichero.length));
	mostrarConTabulacion(menu,longitud);
	
	var speed = document.createElement("p");
	speed.appendChild(document.createTextNode("Max Atmosphering Speed: " + fichero.max_atmosphering_speed));
	mostrarConTabulacion(menu,speed);
	
	var crew = document.createElement("p");
	crew.appendChild(document.createTextNode("Crew: " + fichero.crew));
	mostrarConTabulacion(menu,crew);
	
	var passengers = document.createElement("p");
	passengers.appendChild(document.createTextNode("Passengers: " + fichero.passengers));
	mostrarConTabulacion(menu,passengers);
	
	var cargo = document.createElement("p");
	cargo.appendChild(document.createTextNode("Cargo Capacity: " + fichero.cargo_capacity));
	mostrarConTabulacion(menu,cargo);
	
	var consumables = document.createElement("p");
	consumables.appendChild(document.createTextNode("Consumables: " + fichero.consumables));
	mostrarConTabulacion(menu,consumables);
	
	var hyperdrive = document.createElement("p");
	hyperdrive.appendChild(document.createTextNode("Hyperdrive Rating: " + fichero.hyperdrive_rating));
	mostrarConTabulacion(menu,hyperdrive);
	
	var mglt = document.createElement("p");
	mglt.appendChild(document.createTextNode("MGLT: " + fichero.mglt));
	mostrarConTabulacion(menu,mglt);
	
	var sclass = document.createElement("p");
	sclass.appendChild(document.createTextNode("Starship Class: " + fichero.starship_class));
	mostrarConTabulacion(menu,sclass);
	
	divDatos.appendChild(nombre);
	divDatos.appendChild(model);
	divDatos.appendChild(manufacturer);
	divDatos.appendChild(cost);
	divDatos.appendChild(longitud);
	divDatos.appendChild(speed);
	divDatos.appendChild(crew);
	divDatos.appendChild(passengers);
	divDatos.appendChild(cargo);
	divDatos.appendChild(consumables);
	divDatos.appendChild(hyperdrive);
	divDatos.appendChild(mglt);
	divDatos.appendChild(sclass);
	menu.appendChild(divDatos);
}

// función que muestra en el div de información la información del vehículo seleccionado
function mostrarInformacionVehiculo(fichero) {

	var menu = document.getElementById("menuInformacion");
			
	var codVehiculo = obtenerNumeroElemento(fichero.url);
	
	var imagenVehiculo = new Image();
	imagenVehiculo.src = "./images/vehicles/"+codVehiculo+".jpg";
	imagenVehiculo.setAttribute("id","vehicle"+codVehiculo);
	imagenVehiculo.style.position = "relative";			
	imagenVehiculo.style.left = ( menu.offsetWidth/2 - 175 ) + "px";
	menu.appendChild(imagenVehiculo);
	
	var divDatos = document.createElement("div");
	divDatos.style.position = "relative";	
	divDatos.style.top = ( imagenVehiculo.height + 5 ) + "px";
	divDatos.style.width = "350px";
	
	var nombre = document.createElement("p");			
	nombre.appendChild(document.createTextNode("Name: " + fichero.name)); 
	mostrarConTabulacion(menu,nombre);
	
	var model = document.createElement("p");
	model.appendChild(document.createTextNode("Model: " + fichero.model));
	mostrarConTabulacion(menu,model);
	
	var manufacturer = document.createElement("p");
	manufacturer.appendChild(document.createTextNode("Manufacturer: " + fichero.manufacturer));
	mostrarConTabulacion(menu,manufacturer);
	
	var cost = document.createElement("p");
	cost.appendChild(document.createTextNode("Cost: " + fichero.cost_in_credits));
	mostrarConTabulacion(menu,cost);
	
	var longitud = document.createElement("p");
	longitud.appendChild(document.createTextNode("Length: " + fichero.length));
	mostrarConTabulacion(menu,longitud);
	
	var speed = document.createElement("p");
	speed.appendChild(document.createTextNode("Max Atmosphering Speed: " + fichero.max_atmosphering_speed));
	mostrarConTabulacion(menu,speed);
	
	var crew = document.createElement("p");
	crew.appendChild(document.createTextNode("Crew: " + fichero.crew));
	mostrarConTabulacion(menu,crew);
	
	var passengers = document.createElement("p");
	passengers.appendChild(document.createTextNode("Passengers: " + fichero.passengers));
	mostrarConTabulacion(menu,passengers);
	
	var cargo = document.createElement("p");
	cargo.appendChild(document.createTextNode("Cargo Capacity: " + fichero.cargo_capacity));
	mostrarConTabulacion(menu,cargo);
	
	var consumables = document.createElement("p");
	consumables.appendChild(document.createTextNode("Consumables: " + fichero.consumables));
	mostrarConTabulacion(menu,consumables);
	
	var vclass = document.createElement("p");
	vclass.appendChild(document.createTextNode("Vehicle Class: " + fichero.vehicle_class));
	mostrarConTabulacion(menu,vclass);
	
	divDatos.appendChild(nombre);
	divDatos.appendChild(model);
	divDatos.appendChild(manufacturer);
	divDatos.appendChild(cost);
	divDatos.appendChild(longitud);
	divDatos.appendChild(speed);
	divDatos.appendChild(crew);
	divDatos.appendChild(passengers);
	divDatos.appendChild(cargo);
	divDatos.appendChild(consumables);
	divDatos.appendChild(vclass);
	menu.appendChild(divDatos);
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

	crearMenu(divContenedor,true);	
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

}

// función que añade el método onclick a cada div contenido en el menú de settings
function agregarOnClick(elem,orden) {
	elem.onclick = function(){ seleccionarCancion(orden); };
}

// función que permite seleccionar una canción del menú de settings y reproducirla
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
