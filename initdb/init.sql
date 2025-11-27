CREATE TABLE tipo_usuario (
    id_tipoUsuario INT PRIMARY KEY,
    tipoUsuario VARCHAR(50) NOT NULL
);
CREATE TABLE Usuarios (
    id_usuario INT PRIMARY KEY,
    correo_electronico VARCHAR(100) UNIQUE,
    contraseña VARCHAR(100) NOT NULL,
    tipoUsuario INT,
    FOREIGN KEY (tipoUsuario) REFERENCES tipo_usuario(id_tipoUsuario)
);
CREATE TABLE tipo_Reporte (
    id_tipoReporte INT PRIMARY KEY , 
    tipoReporte VARCHAR(50) NOT NULL
);
CREATE TABLE Estado(
    id_Estado INT PRIMARY KEY,
    estado VARCHAR(50) NOT NULL
);
CREATE TABLE Consecionaria(
    id_Concesionaria INT PRIMARY KEY,
    numAutorizado VARCHAR(50) NOT NULL,
    dependencia VARCHAR(100) NOT NULL,
    localidad VARCHAR(200),
    autorizado  VARCHAR(100) NOT NULL,
    horario_atencion VARCHAR(100)
);
CREATE TABLE Reportes (
    id_Reporte INT PRIMARY KEY,
    usuario INT,
    tipoReporte INT,
    estado INT,
    concesionaria INT,
    descripcion VARCHAR (300) NOT NULL,
    imagen VARCHAR(200),
    fecha_reporte DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (tipoReporte) REFERENCES tipo_Reporte(id_tipoReporte),
    FOREIGN KEY (estado) REFERENCES Estado(id_Estado),
    FOREIGN KEY (concesionaria) REFERENCES Consecionaria(id_Concesionaria)
);

/*Introduccion de datos*/

/*Tipos de usuario*/
INSERT INTO tipo_usuario (id_tipoUsuario, tipoUsuario) VALUES
(1, 'Administrador'),
(2, 'Comunidad Fes'),
(3, 'Externo');
/*Tipos de reporte*/
INSERT INTO tipo_Reporte (id_tipoReporte, tipoReporte) VALUES
(1, 'Malas practicas de higiene'),
(2, 'Comida en mal estado'),
(3, 'Trato inadecuado'),
(4, 'Precios injustos'),
(5, 'Productos caducados'),
(6, 'Malas condiciones en instalaciones'),
(7, 'Uso de areas no designadas'),
(8, 'Mal funcionamiento de maquinas expendedoras'),
(9, 'Falta de seguridad y proteccion civil'),
(10, 'Porciones inadecuadas');

/*Estados de reporte*/
INSERT INTO Estado (id_Estado, estado) VALUES
(1, 'Pendiente'),
(2, 'En Proceso'),
(3, 'Resuelto'),
(4, 'Cerrado');
/*Consecionarias*/
INSERT INTO Consecionaria (id_Concesionaria, numAutorizado, dependencia, localidad, autorizado, horario_atencion) VALUES

(1, '1062', 'Facultad de Estudios Superiores Acatlán', 'M' , 'Grupo Mondainz 8, S.A. de C.V.', 'L-V 8:00-20:30; S 8:00-16:00'),
(2, '1064', 'Facultad de Estudios Superiores Acatlán', 'M', 'Operadora de Barras, S.A. de C.V.', 'L-S 8:00-20:00'),
(3, '2006', 'Facultad de Estudios Superiores Acatlán', 'M', 'Valentina Beatriz Carreño Fierros', 'L-V 7:00-20:00; S 8:00-14:00'),
(4, '2011', 'Facultad de Estudios Superiores Acatlán', 'M', 'Marcos Covarrubias Rojas', 'L-V 7:00-20:00; S 8:00-14:00'),
(5, '2019', 'Facultad de Estudios Superiores Acatlán', 'M', 'Ihali Contreras Galicia', 'L-V 7:00-20:00; S 8:00-14:00'),
(6, '2035', 'Facultad de Estudios Superiores Acatlán', 'M', 'José Manuel Moad Martín', 'L-V 7:00-20:00; S 8:00-14:00'),
(7, '2046', 'Facultad de Estudios Superiores Acatlán', 'M', 'Adoración Rojas Ruiz', 'L-V 7:00-20:00; S 8:00-14:00'),
(8, '2208', 'Facultad de Estudios Superiores Acatlán', 'M', 'Esther Gómez Mendoza', 'L-V 7:00-20:00; S 8:00-14:00'),
(9,  '3271', 'Facultad de Estudios Superiores Acatlán', 'M', 'Guadalupe García Posadas', 'L-V 7:00-20:00; S 9:00-14:00'),
(10, '3272', 'Facultad de Estudios Superiores Acatlán', 'M', 'Manuel Ramírez Flores', 'L-V 8:00-20:00; S 9:00-13:00'),
(11, '3273', 'Facultad de Estudios Superiores Acatlán', 'M', 'Alicia Hernández Cruz', 'L-V 7:00-20:00; S 8:00-13:00'),
(12, '3274', 'Facultad de Estudios Superiores Acatlán', 'M', 'Norma Angélica Cruz González', 'L-V 7:00-20:00; S 8:00-13:00'),
(13, '3275', 'Facultad de Estudios Superiores Acatlán', 'M', 'Aniceto Suárez Jacobo', 'L-V 7:00-20:00; S 8:00-13:00'),
(14, '3276', 'Facultad de Estudios Superiores Acatlán', 'M', 'Inés Francisco Monroy González', 'L-V 7:00-20:00; S 8:00-13:00'),
(15, '3277', 'Facultad de Estudios Superiores Acatlán', 'M', 'Javier Saúl Martínez Estrada', 'L-V 7:00-20:00; S 8:00-13:00'),
(16, '3278', 'Facultad de Estudios Superiores Acatlán', 'M', 'Alma Patricia Lemus Leyva', 'L-V 7:00-20:00; S 8:00-13:00'),
(17, '3279', 'Facultad de Estudios Superiores Acatlán', 'M', 'José Carlos Pérez Ramírez', 'L-V 7:00-21:00; S 8:00-15:00'),
(18, '3280', 'Facultad de Estudios Superiores Acatlán', 'M', 'Nicolás Vieyra González', 'L-V 7:00-20:00; S 8:00-13:00'),
(19, '7029', 'Facultad de Estudios Superiores Acatlán', 'M', 'Saúl Lozano Gazga y Miguel Ángel Lozano Gazga', 'L-V 7:00-20:00; S 8:00-14:00');



