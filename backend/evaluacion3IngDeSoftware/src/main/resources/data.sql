INSERT IGNORE INTO variantes (id, nombre, incremento_precio) VALUES
(1, 'Barniz', 5000.00),
(2, 'Ruedas', 15000.00),
(3, 'Cojines', 20000.00);

INSERT IGNORE INTO muebles (id, nombre, tipo, tamano, material, precio_base, stock, estado) VALUES
(1, 'Silla Escritorio', 'SILLA', 'MEDIANO', 'Plastico', 85000.00, 10, 'ACTIVO'),
(2, 'Mesa Comedor', 'MESA', 'GRANDE', 'Madera', 150000.00, 5, 'ACTIVO'),
(3, 'Sillon', 'SILLON', 'GRANDE', 'Tela', 299990.00, 3, 'ACTIVO'),
(4, 'Estante Libros', 'ESTANTE', 'GRANDE', 'Madera', 45000.00, 20, 'ACTIVO'),
(5, 'Cajonera', 'CAJON', 'PEQUENO', 'Metal', 35000.00, 0, 'ACTIVO');