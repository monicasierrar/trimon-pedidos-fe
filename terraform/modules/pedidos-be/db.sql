CREATE TABLE pedidosDB.estado (
  `id` int NOT NULL AUTO_INCREMENT,
  `estado` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Estado_UNIQUE` (`estado`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE pedidosDB.pedido (
	id INTEGER auto_increment NOT NULL,
	id_estado INTEGER NOT NULL,
	nit varchar(100) NOT NULL,
	email_vendedor  varchar(300) NOT NULL,
	id_vendedor INTEGER NOT NULL,
	subtotal DOUBLE NOT NULL,
	total DOUBLE NOT NULL,
	formaPagoId INTEGER NOT NULL,
	sucursal json NULL,
	CONSTRAINT pedido_pk PRIMARY KEY (id),
	CONSTRAINT pedido_estado_fk FOREIGN KEY (id_estado) REFERENCES pedidosDB.estado(id) ON DELETE RESTRICT ON UPDATE CASCADE
)
AUTO_INCREMENT=40001000
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE pedidosDB.detalle_pedido (
	id INTEGER auto_increment NOT NULL,
	pedido_id INTEGER NOT NULL,
	id_producto varchar(100) NOT NULL,
	id_unidad varchar(100) NOT NULL,
	unidad INTEGER NOT NULL,
	CONSTRAINT detalle_pedido_pk PRIMARY KEY (id),
	CONSTRAINT detalle_pedido_pedido_FK FOREIGN KEY (pedido_id) REFERENCES pedidosDB.pedido(id) ON DELETE RESTRICT ON UPDATE CASCADE
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE pedidosDB.error_pedido (
	id INTEGER auto_increment NOT NULL,
	id_pedido INTEGER NOT NULL,
	error TEXT NOT NULL,
	CONSTRAINT error_pedido_pk PRIMARY KEY (id),
	CONSTRAINT error_pedido_pedido_FK FOREIGN KEY (id_pedido) REFERENCES pedidosDB.pedido(id) ON DELETE RESTRICT ON UPDATE CASCADE
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO pedidosDB.estado (id, estado) VALUES
	 (1, 'Nuevo'),
	 (2, 'Procesando'),
    (3, 'Finalizado'),
	 (4, 'Error');
