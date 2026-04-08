Create table usuarios(
id int auto_increment primary key,
nombre varchar (100) not null,
email varchar(150) not null,
password varchar(255) not null
);

Create table votos(
id int auto_increment primary key,
usuario_id int not null,
voto varchar(255) not null,
fecha timestamp default current_timestamp,
unique(usuario_id),
foreign key (usuario_id) references usuario(id)
);

create table resultados(
id int auto_increment primary key,
candidato varchar(100) not null,
conteo int default 0
);