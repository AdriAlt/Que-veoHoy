//paquetes necesarios para el proyecto
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var chalk = require('chalk');

var controlador = require('../servidor/controladores/controller')

var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


app.get('/peliculas', controlador.getAll);
app.get('/peliculas/recomendacion?', controlador.getRecomendarPeliculas);
app.get('/peliculas/:id', controlador.getMostrarDetalles);
app.get('/generos', controlador.getMostrarGeneros);




//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
//cambie el puerto 8080 al 3000 en todo el codigo
var puerto = '3000';

app.listen(puerto, () => {
    console.log(chalk.blue(`Escuchando al puerto ${puerto}`));
});