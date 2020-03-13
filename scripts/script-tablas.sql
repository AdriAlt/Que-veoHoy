CREATE DATABASE 'QueVeo';

USE 'QueVeo';

CREATE TABLE pelicula (
  id INT NOT NULL AUTO_INCREMENT,
  titulo VARCHAR (100),
  duracion INT(5),
  director VARCHAR(400),
  anio INT (5),
  fecha_lanzamiento DATE,
  puntuacion INT (2),
  poster VARCHAR (300),
  trama VARCHAR (700),
  PRIMARY KEY (id),
  FOREIGN KEY (genero_id) REFERENCES genero(id)
); 

-- source /Users/negra/Desktop/Proyectos Acamica/que-veo-hoy-recursos/scripts/script-paso-1-peliculas.sql

CREATE TABLE genero (
  id INT(11) NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(30) NOT NULL ,
  PRIMARY KEY (id)
); 

-- source /Users/negra/Desktop/Proyectos Acamica/que-veo-hoy-recursos/scripts/script-paso-2-generos.sql

CREATE TABLE actor (
  id INT(11) NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(70),
  PRIMARY KEY (id)
); 

-- source /Users/negra/Desktop/Proyectos Acamica/que-veo-hoy-recursos/scripts/script-paso-3-actores.sql

CREATE TABLE actor_pelicula (
  id INT AUTO_INCREMENT PRIMARY KEY,
  FOREIGN KEY (actor_id) REFERENCES actor(id),
  FOREIGN KEY (pelicula_id) REFERENCES pelicula(id)
);