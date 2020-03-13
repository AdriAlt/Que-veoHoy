const con = require('../lib/conexionbd');

var mostrarPeliculas = () => {
    if (con.state === 'disconnected') {
        con.connect();
    }
};

//muestra todas las peliculas
mostrarPeliculas.getAll = (req, res) => {
    var sql = 'SELECT * FROM pelicula';
    var titulo = req.query.titulo;
    var genero = req.query.genero;
    var anio = req.query.anio;
    var filter = "WHERE";
    var columna_orden = req.query.columna_orden;
    var tipo_orden = req.query.tipo_orden;
    var cantidad = Number(req.query.cantidad);
    var pagina = Number(req.query.pagina);
    var total;

    // FILTER TITULO, GENERO Y ANIO
    filter = titulo != null && titulo != "" ? filter + " titulo LIKE '%" + titulo + "%'" : filter;
    filter = genero != null && genero != "" ? filter != "WHERE" ? filter + " AND genero_id = " + genero : filter + " genero_id = " + genero : filter;
    filter = anio != null && anio != "" ? filter != "WHERE" ? filter + " AND anio = " + anio : filter + " anio = " + anio : filter;
    sql = filter == 'WHERE' ? sql : sql + " " + filter;

    // ORDER BY
    sql = columna_orden != null && columna_orden != '' ? sql + ` ORDER BY ${columna_orden} ${tipo_orden}` : sql;

    con.query(sql, (error, resultado) => {
        if (error) {
            return res.status(404).send(`Elegi mejor ${error}`)
        }
        else {
            total = resultado.length;

            // LIMIT Y PAGINACION
            let paginacion = ((pagina - 1) * cantidad);
            sql += ` LIMIT ${cantidad} OFFSET ${paginacion}`;
            con.query(sql, (error, response) => {
                console.log(sql);
                if (error) {
                    return res.status(404).send(`Hubo un error en el pedido ${error}`)
                }
                else {
                    var respuesta = {
                        'peliculas': response,
                        'total': total        
                    }
                    res.send(JSON.stringify(respuesta))
                }
            });
        }
    });
};

// MUESTRA TODOS LOS GENEROS
mostrarPeliculas.getMostrarGeneros = (req, res) => {
    con.query('SELECT * from genero', (error, resultado) => {
        if (error) {
            return res.status(404).send(`Hubo un error en la solicitud ${error}`)
        }
        else {
            var respuesta = {
                'generos': resultado
            }
        }
        res.send(JSON.stringify(respuesta))
    });
}

// MUESTRA LA INFO DE LAS PELIS
mostrarPeliculas.getMostrarDetalles = (req, res) => {
    var { id } = req.params;

    //modificar
    var sql = `SELECT 
                    pelicula.id,
                    pelicula.poster,
                    pelicula.titulo,
                    pelicula.anio,
                    pelicula.trama,
                    pelicula.fecha_lanzamiento,
                    pelicula.director,
                    pelicula.duracion,
                    pelicula.puntuacion,
                    actor.nombre as actorName,
                    genero.nombre 
                FROM pelicula  
                INNER JOIN actor_pelicula ON pelicula.id = actor_pelicula.pelicula_id
                INNER JOIN actor ON actor.id = actor_pelicula.actor_id
                INNER JOIN genero ON genero.id = pelicula.genero_id   
                WHERE pelicula.id = ${id}`;

    con.query(sql, (error, resultado) => {
        if (error) {
            return res.status(404).send("Error en Info" + error.message)
        } else {
            var pelicula = {
                poster: resultado[0].poster,
                titulo: resultado[0].titulo,
                anio: resultado[0].anio,
                trama: resultado[0].trama,
                fecha_lanzamiento: resultado[0].fecha_lanzamiento,
                director: resultado[0].director,
                puntuacion: resultado[0].puntuacion,
                duracion: resultado[0].duracion,
                nombre: resultado[0].nombre
            };
            var actores = [];
            resultado.forEach(element => {
                var actor = { 'nombre': element.actorName }
                actores.push(actor);
            });
            var respuesta = {
                'pelicula': pelicula,
                'actores': actores,
                'genero': pelicula.nombre
            }
            res.send(JSON.stringify(respuesta));
        }
    })
}

// RECOMIENDA LAS PELICULAS
mostrarPeliculas.getRecomendarPeliculas = (req, res) => {
    // Parametros de busqueda
    var genero = req.query.genero;
    var anio_inicio = req.query.anio_inicio;
    var anio_fin = req.query.anio_fin;
    var puntuacion = req.query.puntuacion;

    // Verificamos los parametros enviados para armar el filtro de recomendacion
    var sql = `SELECT pelicula.id,
                      pelicula.poster,
                      pelicula.trama,
                      pelicula.titulo,
                      genero.nombre
               FROM pelicula 
               JOIN genero ON genero.id = pelicula.genero_id`;
    var filter = 'WHERE';

    filter = genero != null && genero != '' ? filter + " genero.nombre  ='" + genero + "'" : filter;
    filter = anio_inicio != null && anio_inicio != '' || anio_fin != null && anio_fin != '' ? filter != "WHERE" ? filter + ` AND anio BETWEEN ${anio_inicio} AND ${anio_fin} ` : filter + ` anio BETWEEN ${anio_inicio}  AND ${anio_fin} ` : filter;
    filter = puntuacion != null && puntuacion != '' ? filter != "WHERE" ? filter + ` AND puntuacion = ${puntuacion}` : filter + ` puntuacion = ${puntuacion}` : filter;
    sql = filter == 'WHERE' ? sql : sql + " " + filter;

    con.query(sql, (error, resultado) => {
        if (error) {
            return res.status(404).send(`Hubo un error engxvcxfjgmnbvsdgtjjmhnbvcvfcbnmmnbvc la solicitud jhvuvg ${error}`)
        }
        else {
            var respuesta = {
                'peliculas': resultado
            };
            res.send(JSON.stringify(respuesta))
        }
    });
}

module.exports = mostrarPeliculas;