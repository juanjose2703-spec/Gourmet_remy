-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-06-2026 a las 21:54:57
-- Versión del servidor: 10.4.14-MariaDB
-- Versión de PHP: 7.4.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `remy`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id_categoria` varchar(12) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id_categoria`, `nombre`) VALUES
('CAT03', 'Carnes'),
('CAT04', 'Lácteos'),
('CAT05', 'Granos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias_platos`
--

CREATE TABLE `categorias_platos` (
  `id_categoria` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `estado` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `categorias_platos`
--

INSERT INTO `categorias_platos` (`id_categoria`, `nombre`, `estado`) VALUES
(1, 'Entrada', 'Activo'),
(2, 'Plato Fuerte', 'Activo'),
(3, 'Postre', 'Activo'),
(4, 'Bebida', 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria_ingredientes`
--

CREATE TABLE `categoria_ingredientes` (
  `id_categoria` varchar(12) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `categoria_ingredientes`
--

INSERT INTO `categoria_ingredientes` (`id_categoria`, `nombre`) VALUES
('CAT01', 'Frutas'),
('CAT02', 'Verduras'),
('CAT03', 'Carnes'),
('CAT04', 'Lácteos'),
('CAT05', 'Granos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `correo_pk` varchar(64) NOT NULL,
  `fecha_registro` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contiene`
--

CREATE TABLE `contiene` (
  `id_menu` varchar(16) NOT NULL,
  `id_plato` varchar(7) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `contiene`
--

INSERT INTO `contiene` (`id_menu`, `id_plato`) VALUES
('MN260624-001', 'PLBE001'),
('MN260624-001', 'PLEN002'),
('MN260624-001', 'PLFU003'),
('MN260624-001', 'PLPO001'),
('MN260624-002', 'PLEN003'),
('MN260624-002', 'PLFU004'),
('MN260624-002', 'PLPO002'),
('MN260624-003', 'PLBE004'),
('MN260624-003', 'PLEN006'),
('MN260624-003', 'PLFU006'),
('MN260624-003', 'PLPO003'),
('MN260624-004', 'PLEN005'),
('MN260624-004', 'PLFU009'),
('MN260624-004', 'PLPO004'),
('MN260624-005', 'PLBE005'),
('MN260624-005', 'PLEN009'),
('MN260624-005', 'PLFU007'),
('MN260624-005', 'PLPO005'),
('MN260624-006', 'PLEN002'),
('MN260624-006', 'PLFU008'),
('MN260624-006', 'PLPO006');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entradas`
--

CREATE TABLE `entradas` (
  `id_entrada` int(11) NOT NULL,
  `id_ingrediente` varchar(16) DEFAULT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  `fecha_hora` datetime DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `unidad_medida` varchar(10) DEFAULT NULL,
  `id_proveedor` varchar(12) DEFAULT NULL,
  `factura` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eventos`
--

CREATE TABLE `eventos` (
  `id_evento` varchar(15) NOT NULL,
  `id_tipo_servicio_fk` varchar(19) NOT NULL,
  `estado` varchar(10) DEFAULT NULL,
  `correo_fk` varchar(64) NOT NULL,
  `franja_horaria` varchar(6) DEFAULT NULL,
  `fecha_inicio` datetime DEFAULT NULL,
  `fecha_fin` datetime DEFAULT NULL,
  `numero_personas` int(11) DEFAULT NULL,
  `experiencia` varchar(14) DEFAULT NULL,
  `id_menu_fk` varchar(16) NOT NULL,
  `fecha_creacion` datetime DEFAULT NULL,
  `fecha_modificacion` datetime DEFAULT NULL,
  `usuario_modificacion` varchar(128) DEFAULT NULL,
  `lider_cocina` varchar(15) DEFAULT NULL,
  `lider_servicio` varchar(15) DEFAULT NULL,
  `costo_total` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ingredientes`
--

CREATE TABLE `ingredientes` (
  `id_ingrediente` varchar(16) NOT NULL,
  `categoria` varchar(12) NOT NULL,
  `nombre` varchar(256) NOT NULL,
  `stock` int(11) DEFAULT NULL,
  `unidad_minima` varchar(6) DEFAULT NULL,
  `stock_minimo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `ingredientes`
--

INSERT INTO `ingredientes` (`id_ingrediente`, `categoria`, `nombre`, `stock`, `unidad_minima`, `stock_minimo`) VALUES
('CAR001', 'CAT03', 'Pollo', 10000, 'gr', 2000),
('CAR002', 'CAT03', 'Res', 8000, 'gr', 1600),
('CAR003', 'CAT03', 'Cerdo', 7000, 'gr', 1400),
('CAR004', 'CAT03', 'Pescado', 6000, 'gr', 1200),
('CAR005', 'CAT03', 'Cordero', 3000, 'gr', 600),
('FRU001', 'CAT01', 'Manzana', 5000, 'gr', 1000),
('FRU002', 'CAT01', 'Plátano', 8000, 'gr', 1500),
('FRU003', 'CAT01', 'Naranja', 6000, 'gr', 1200),
('FRU004', 'CAT01', 'Uva', 4000, 'gr', 800),
('FRU005', 'CAT01', 'Mango', 3000, 'gr', 600),
('GRA001', 'CAT05', 'Arroz', 10000, 'gr', 2000),
('GRA002', 'CAT05', 'Frijol', 8000, 'gr', 1600),
('GRA003', 'CAT05', 'Lenteja', 6000, 'gr', 1200),
('GRA004', 'CAT05', 'Garbanzo', 4000, 'gr', 800),
('GRA005', 'CAT05', 'Maíz', 7000, 'gr', 1400),
('LAC001', 'CAT04', 'Leche', 12000, 'ml', 2400),
('LAC002', 'CAT04', 'Queso', 5000, 'gr', 1000),
('LAC003', 'CAT04', 'Yogur', 4000, 'ml', 800),
('LAC004', 'CAT04', 'Mantequilla', 2500, 'gr', 500),
('LAC005', 'CAT04', 'Crema de leche', 3000, 'ml', 600),
('VER001', 'CAT02', 'Zanahoria', 7000, 'gr', 1400),
('VER002', 'CAT02', 'Tomate', 9000, 'gr', 1800),
('VER003', 'CAT02', 'Lechuga', 4000, 'gr', 800),
('VER004', 'CAT02', 'Cebolla', 6000, 'gr', 1200),
('VER005', 'CAT02', 'Pimiento', 5000, 'gr', 1000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `menu`
--

CREATE TABLE `menu` (
  `id_menu` varchar(16) NOT NULL,
  `nombre` varchar(64) NOT NULL,
  `tiempos_menu` tinyint(4) DEFAULT NULL,
  `precio` int(11) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `estado` varchar(10) DEFAULT NULL,
  `fecha_creacion` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `menu`
--

INSERT INTO `menu` (`id_menu`, `nombre`, `tiempos_menu`, `precio`, `descripcion`, `estado`, `fecha_creacion`) VALUES
('MN260624-001', 'Menú Ejecutivo Remy Especial', 4, 45000, 'Un espectacular recorrido de 4 tiempos: Entrada típica o ligera, plato fuerte de alta cocina, postre artesanal y bebida refrescante.', 'Activo', '2026-06-24'),
('MN260624-002', 'Menú Deleitante de 3 Tiempos', 3, 38000, 'Una combinación perfecta de tres tiempos que incluye una entrada ligera y fresca, un plato fuerte tradicional de la casa y un cierre dulce artesanal.', 'Activo', '2026-06-24'),
('MN260624-003', 'Menú Selección Marina Italiana', 4, 52000, 'Un sofisticado viaje gastronómico de 4 tiempos con temática marina e italiana.', 'Activo', '2026-06-24'),
('MN260624-004', 'Menú Urbano Mexicano', 3, 34000, 'Un recorrido dinámico e intenso de 3 tiempos inspirado en la cocina urbana mexicana.', 'Activo', '2026-06-24'),
('MN260624-005', 'Menú Delicia Campestre Americana', 4, 48000, 'Una robusta combinación de 4 tiempos perfecta para los amantes de la parrilla y el chocolate.', 'Activo', '2026-06-24'),
('MN260624-006', 'Menú Ligero y Vegetariano', 3, 31000, 'Una exquisita propuesta saludable de 3 tiempos balanceada, fresca y libre de carnes.', 'Activo', '2026-06-24');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `platos`
--

CREATE TABLE `platos` (
  `id_plato` varchar(7) NOT NULL,
  `nombre` varchar(64) NOT NULL,
  `categoria` int(11) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `img_plato` varchar(256) DEFAULT NULL,
  `fecha_creacion` date DEFAULT NULL,
  `estado` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `platos`
--

INSERT INTO `platos` (`id_plato`, `nombre`, `categoria`, `descripcion`, `img_plato`, `fecha_creacion`, `estado`) VALUES
('PLBE001', 'Limonada de Coco Imperial', 4, 'Bebida refrescante y granizada que combina el zumo ácido de limones verdes recién exprimidos con una base cremosa de leche de coco natural y un toque equilibrado de azúcar. Servida muy fría y decorada con ralladura de limón.', 'https://lasoleta.com/wp-content/uploads/2023/08/F1-2.jpg', '2026-06-24', 'Activo'),
('PLBE002', 'Té Helado de Frutos Rojos y Menta', 4, 'Infusión fría de hojas seleccionadas de té negro mezcladas con extracto natural de cerezas, frambuesas y uvas espinosas. Endulzado suavemente con almíbar artesanal y refrescado con hojas de menta fresca machacadas.', 'https://lalagunaahora.com/wp-content/uploads/2024/08/te-helado-.jpg', '2026-06-24', 'Activo'),
('PLBE003', 'Jugo Natural de Maracuyá', 4, 'Bebida refrescante preparada con pulpa de maracuyá 100% natural, agua helada y azúcar equilibrada.', 'https://buenprovecho.hn/wp-content/uploads/2020/01/Jugo-de-maracuya-pi%C3%B1a-y-mango.jpg', '2026-06-24', 'Activo'),
('PLBE004', 'Soda Saborizada de Lychee', 4, 'Bebida gasificada artesanal infusionada con almíbar concentrado de lychees orientales y decorada con menta.', 'https://i.ytimg.com/vi/Xtr__1GAo44/maxresdefault.jpg', '2026-06-24', 'Activo'),
('PLBE005', 'Smoothie de Fresa y Banano', 4, 'Batido cremoso granizado combinando fresas frescas maduras, banano y una base ligera de leche entera.', 'https://i.pinimg.com/474x/9b/8e/22/9b8e225ad1b9a32448c6ac0214a1fe44.jpg', '2026-06-24', 'Activo'),
('PLBE006', 'Café Latte Helado Cremoso', 4, 'Un shot de café expreso intenso mezclado con leche fría espumada y cubos de hielo, endulzado ligeramente.', 'https://static.solopostres.com/uploads/2015/11/cafe-helado-crema.jpg', '2026-06-24', 'Activo'),
('PLBE007', 'Agua de Horchata Artesanal', 4, 'Bebida tradicional preparada a base de arroz, leche, canela en polvo y un sutil aroma de esencia de vainilla.', 'https://www.recetasnestle.com.mx/sites/default/files/srh_recipes/9a75bce4a881d276adf97fb65e0c948e.jpg', '2026-06-24', 'Activo'),
('PLEN001', 'Sancocho Paisa', 1, 'El sancocho es una sopa elaborada con carnes, tubérculos, verduras y condimentos, típico de varios países hispanoamericanos, especialmente de aquellos que pertenecieron al antiguo Virreinato de Nueva Granada, así como en las islas del Caribe hispano', 'https://www.labuena.com.co/wp-content/uploads/2023/04/La-Buena-Sancocho-antioqueno-780.webp', '2026-06-24', 'Activo'),
('PLEN002', 'Ceviche de Champiñones y Aguacate', 1, 'Una alternativa fresca y ligera ideal como entrada. Champiñones parís finamente laminados y marinados en zumo de limón natural, acompañados de cubos de aguacate cremoso, cebolla morada en julianas, cilantro fresco picado y un toque de ají dulce.', 'https://content-cocina.lecturas.com/medio/2019/05/30/ceviche-de-champinones-y-aguacate_65232731_800x800.jpg', '2026-06-24', 'Activo'),
('PLEN003', 'Crema de Ahuyama Rostizada', 1, 'Una reconfortante y suave crema elaborada a base de ahuyamas horneadas lentamente con finas hierbas, ajo asado y un toque secreto de jengibre. Se sirve decorada con semillas de girasol tostadas y un sutil hilo de crema de leche fresca.', 'https://blog.renaware.com/wp-content/uploads/2025/02/Crema-de-Calabaza-1-800x530.jpg', '2026-06-24', 'Activo'),
('PLEN004', 'Empanada', 1, 'Empanada tradicional rellena de carne y papa', 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgITCbG0T3uK_t8E7kP4TPe6A5zqRhykkzEKSD2mpjSkbbxmLBlJdbHMUes8R4_Nz5XrNwVxceDAFjhxL7CMl4G9k3HSYfnS6kc6NuRd_3Eqeg_QfTI_oCwKUSpRiugyEYL4M5ZggAIr7QtoLQ6Cqx3amzalLM-jADTeBzpkmAMFAjThGuGmqYGau-ok7Q/s1600/e', '2026-06-23', 'Activo'),
('PLEN005', 'Sopa de Tortilla Crujiente', 1, 'Sopa tradicional a base de tomate y chiles secos, servida con tiras de tortilla de maíz frita y un toque de crema agria.', 'https://www.vvsupremo.com/wp-content/uploads/2015/11/Sopa-de-Tortilla.jpg', '2026-06-24', 'Activo'),
('PLEN006', 'Bruschetta de Tomate y Albahaca', 1, 'Rebanadas de pan artesanal tostado, frotadas con ajo y cubiertas con una mezcla de tomates frescos, albahaca y aceite de oliva.', 'https://www.oviahealth.com/wp-content/uploads/2021/04/article_2515.jpg', '2026-06-24', 'Activo'),
('PLEN007', 'Rollitos de Primavera Primavera', 1, 'Rollos crujientes rellenos de vegetales frescos salteados al estilo oriental, acompañados de salsa agridulce artesanal.', 'https://i.blogs.es/40e6e2/rollitos_primavera/840_560.jpg', '2026-06-24', 'Activo'),
('PLEN008', 'Carpaccio de Res con Alcaparras', 1, 'Láminas ultrafinas de lomo de res marinadas en limón, aceite de oliva virgen extra, lascas de parmesano y alcaparras.', 'https://gourmet.iprospect.cl/wp-content/uploads/2016/09/carpaccio-filete.png', '2026-06-24', 'Activo'),
('PLEN009', 'Bastones de Mozzarella Fritos', 1, 'Dedos de queso mozzarella empanizados con finas hierbas y fritos a la perfección, servidos con salsa pomodoro caliente.', 'https://hips.hearstapps.com/hmg-prod/images/palitos-de-mozzarella-elle-gourmet-1-655f307405e8d.jpg?crop=0.668xw:1.00xh;0.129xw,0&resize=1200:*', '2026-06-24', 'Activo'),
('PLFU001', 'Arroz Meloso de Marisco Local', 2, 'Arroz húmedo y caldoso cocinado a fuego lento en un concentrado bisque de camarones. Viene cargado de calamares, mejillones y langostinos frescos, aromatizado con pimentón ahumado, un toque de azafrán y terminado con queso parmesano.', 'https://latapadelcocopanama.com/cdn/shop/files/One_Pot_Colonense.jpg?v=1733278078&width=3200', '2026-06-24', 'Activo'),
('PLFU002', 'Pechuga a la Cordon Bleu Remy', 2, 'Suprema de pechuga de pollo deshuesada, rellena con láminas de jamón ahumado de primera calidad y queso doble crema fundido. Empanizada con panko crujiente, frita a temperatura óptima y servida con ensalada fresca de la casa.', 'https://www.recetasnestle.com.mx/sites/default/files/srh_recipes/251b8b129d7921156b7f132cc6538ebd.png', '2026-06-24', 'Activo'),
('PLFU003', 'Lomo de Cerdo en Salsa de Ciruelas', 2, 'Medallones de lomo de cerdo seleccionados, sellados a la perfección y bañados en una reducción artesanal de ciruelas pasas, vino tinto y especias aromáticas. Acompañado de un puré de papa criolla cremoso y vegetales salteados al wok.', 'https://www.recetasnestle.com.mx/sites/default/files/srh_recipes/91f266f667a668a9a70bfdcacafcdce3.png', '2026-06-24', 'Activo'),
('PLFU004', 'Lasaña Artesanal de Carne Boloñesa', 2, 'Capas intercaladas de pasta fresca artesanal, una robusta salsa boloñesa cocinada durante cuatro horas con carne de res seleccionada, salsa bechamel aromática con nuez moscada y una generosa capa de queso mozzarella gratinado al horno.', 'https://cdn.colombia.com/gastronomia/2015/06/09/lasana-de-carne-y-queso-2977-1.jpg', '2026-06-24', 'Activo'),
('PLFU005', 'Salmon Teriyaki Glaseado', 2, 'Filete de salmón fresco sellado a la plancha y bañado en una reducción de salsa teriyaki casera, servido sobre una cama de arroz blanco.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3awGBwv3LEbTa6LYWiq_5i22IHN36CY85Iw&s', '2026-06-24', 'Activo'),
('PLFU006', 'Fettuccine Alfredo con Pollo', 2, 'Pasta fettuccine bañada en una cremosa salsa Alfredo a base de mantequilla y queso parmesano, acompañada de pechuga de pollo a la parrilla.', 'https://storage.googleapis.com/logi-ingredient-images/thumbnails/chicken_breast_greek_yogurt_thumb.webp', '2026-06-24', 'Activo'),
('PLFU007', 'Costillas de Cerdo en Salsa BBQ', 2, 'Costillas tiernas de cerdo cocinadas lentamente al horno, bañadas en una ahumada salsa BBQ artesanal de la casa.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxrfyAy2PJT6WJZ7EKM_eE2zf9J6GJt4g3uw&s', '2026-06-24', 'Activo'),
('PLFU008', 'Risotto de Champiñones Salvajes', 2, 'Arroz arborio cocinado pacientemente con caldo de vegetales, Champiñones parís y portobellos, terminado con mantequilla.', 'https://www.drvegan.com/cdn/shop/articles/Untitled_11_520x500_2758d4b5-11a3-45f3-8ee0-2f258fd30a17.png?v=1741758865&width=2048', '2026-06-24', 'Activo'),
('PLFU009', 'Tacos de Pescado estilo Ensenada', 2, 'Tres tacos de pescado blanco rebozado en tempura crujiente, servidos en tortilla de maíz con ensalada de col y aderezo chipotle.', 'https://laroussecocina.mx/wp-content/uploads/2021/08/Tacos-de-pescado-estilo-Ensenada_David-Tonelson.png', '2026-06-24', 'Activo'),
('PLPO001', 'Volcán de Chocolate con Centro Líquido', 3, 'Bizcocho horneado al momento a base de chocolate amargo al 70%. Al romper su corteza exterior, libera un delicioso y denso centro líquido de chocolate caliente. Ideal para acompañar con una bola de helado artesanal de vainilla.', 'https://alusweet.com/cdn/shop/articles/FotosRecetasWeb_VolcanChocolate_jpg_17674675-5c26-4720-8f64-1633f2299738.jpg?v=1781711817&width=1100', '2026-06-24', 'Activo'),
('PLPO002', 'Cheesecake Frutos del Bosque', 3, 'Postre frío clásico con una base crujiente de galletas de mantequilla y una capa alta de crema suave de queso tipo Philadelphia. Viene cubierto por una deliciosa mermelada casera espesa de fresas, moras y arándanos silvestres.', 'https://www.bavette.es/wp-content/uploads/Cheesecake-de-frutos-rojos-copia.jpg', '2026-06-24', 'Activo'),
('PLPO003', 'Tiramisú Tradicional Italiano', 3, 'Postre frío en capas con bizcochos soletilla humedecidos en café expreso fuerte, licor y una suave crema de queso mascarpone.', 'https://bresca.es/wp-content/uploads/2023/02/receta-original-del-tiramisu-italiano.jpg', '2026-06-24', 'Activo'),
('PLPO004', 'Flan de Caramelo de la Abuela', 3, 'Un clásico flan horneado a baño de María con una textura sedosa, cubierto por una generosa capa de caramelo líquido dorado.', 'https://content-cocina.lecturas.com/medio/2024/03/20/paso-a-paso-para-hacer-flanes-de-melocoton-con-nata-resultado-final_00000000_45ab1397_240320180203_1200x1200.jpg', '2026-06-24', 'Activo'),
('PLPO005', 'Brownie con Nueces Crujientes', 3, 'Bizcocho denso y meloso de chocolate oscuro al 60% mezclado con nueces picadas, servido tibio.', 'https://i.ytimg.com/vi/YY3eW-cwt4A/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBB0BE2y-3FBNpKElf0SDV_DkHd2w', '2026-06-24', 'Activo'),
('PLPO006', 'Mousse de Maracuyá Refrescante', 3, 'Postre aireado y ligero que equilibra perfectamente el sabor dulce y la acidez natural de la fruta de la pasión.', 'https://www.iberoexpress.es/wp-content/uploads/2019/10/pulpa_maracuya.jpg', '2026-06-24', 'Activo'),
('PLPO007', 'Crumble de Manzana y Canela', 3, 'Manzanas horneadas con canela y cubiertas de una costra crujiente de mantequilla y avena, servido caliente.', 'https://alicante.com.ar/wp-content/uploads/2023/12/2671_receta.jpg', '2026-06-24', 'Activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `plato_ingrediente`
--

CREATE TABLE `plato_ingrediente` (
  `id_plato` varchar(7) NOT NULL,
  `id_ingrediente` varchar(16) NOT NULL,
  `cantidad` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `programacion_dia`
--

CREATE TABLE `programacion_dia` (
  `Fecha_Reserva` datetime NOT NULL,
  `id_menu` varchar(16) DEFAULT NULL,
  `lider_servicio` varchar(15) DEFAULT NULL,
  `lider_cocina` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `id_proveedor` varchar(12) NOT NULL,
  `nombre` varchar(40) NOT NULL,
  `telefono` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas_dia`
--

CREATE TABLE `reservas_dia` (
  `id_reserva` varchar(15) NOT NULL,
  `correo_fk` varchar(64) NOT NULL,
  `cantidad_menus` int(11) DEFAULT NULL,
  `Fecha_reserva` datetime DEFAULT NULL,
  `estado` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `responsable_cargo`
--

CREATE TABLE `responsable_cargo` (
  `idUsuarioFK` varchar(15) NOT NULL,
  `ficha` varchar(8) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `salidas`
--

CREATE TABLE `salidas` (
  `id_salida` int(11) NOT NULL,
  `id_ingrediente` varchar(16) DEFAULT NULL,
  `fecha_hora` datetime DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `motivo_salida` varchar(60) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_servicio`
--

CREATE TABLE `tipos_servicio` (
  `id_tipo_servicio` varchar(19) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `descripcion` varchar(128) DEFAULT NULL,
  `codigo_iniciales` varchar(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` varchar(15) NOT NULL,
  `nombre` varchar(80) DEFAULT NULL,
  `apellido` varchar(64) DEFAULT NULL,
  `correo` varchar(64) DEFAULT NULL,
  `rol_usuario` tinyint(4) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT NULL,
  `contrasena` varchar(128) DEFAULT NULL,
  `ficha` varchar(8) DEFAULT NULL,
  `estado` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `categorias_platos`
--
ALTER TABLE `categorias_platos`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `categoria_ingredientes`
--
ALTER TABLE `categoria_ingredientes`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`correo_pk`);

--
-- Indices de la tabla `contiene`
--
ALTER TABLE `contiene`
  ADD PRIMARY KEY (`id_menu`,`id_plato`),
  ADD KEY `Contiene_ibfk_2` (`id_plato`);

--
-- Indices de la tabla `entradas`
--
ALTER TABLE `entradas`
  ADD PRIMARY KEY (`id_entrada`),
  ADD KEY `id_ingrediente` (`id_ingrediente`),
  ADD KEY `id_proveedor` (`id_proveedor`);

--
-- Indices de la tabla `eventos`
--
ALTER TABLE `eventos`
  ADD PRIMARY KEY (`id_evento`),
  ADD KEY `id_tipo_servicio_fk` (`id_tipo_servicio_fk`),
  ADD KEY `correo_fk` (`correo_fk`),
  ADD KEY `id_menu_fk` (`id_menu_fk`);

--
-- Indices de la tabla `ingredientes`
--
ALTER TABLE `ingredientes`
  ADD PRIMARY KEY (`id_ingrediente`),
  ADD KEY `categoria` (`categoria`);

--
-- Indices de la tabla `menu`
--
ALTER TABLE `menu`
  ADD PRIMARY KEY (`id_menu`);

--
-- Indices de la tabla `platos`
--
ALTER TABLE `platos`
  ADD PRIMARY KEY (`id_plato`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD KEY `categoria` (`categoria`);

--
-- Indices de la tabla `plato_ingrediente`
--
ALTER TABLE `plato_ingrediente`
  ADD PRIMARY KEY (`id_plato`,`id_ingrediente`),
  ADD KEY `id_ingrediente` (`id_ingrediente`);

--
-- Indices de la tabla `programacion_dia`
--
ALTER TABLE `programacion_dia`
  ADD PRIMARY KEY (`Fecha_Reserva`),
  ADD KEY `id_menu` (`id_menu`),
  ADD KEY `lider_servicio` (`lider_servicio`),
  ADD KEY `lider_cocina` (`lider_cocina`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id_proveedor`);

--
-- Indices de la tabla `reservas_dia`
--
ALTER TABLE `reservas_dia`
  ADD PRIMARY KEY (`id_reserva`),
  ADD KEY `correo_fk` (`correo_fk`),
  ADD KEY `Fecha_reserva` (`Fecha_reserva`);

--
-- Indices de la tabla `responsable_cargo`
--
ALTER TABLE `responsable_cargo`
  ADD PRIMARY KEY (`idUsuarioFK`);

--
-- Indices de la tabla `salidas`
--
ALTER TABLE `salidas`
  ADD PRIMARY KEY (`id_salida`),
  ADD KEY `id_ingrediente` (`id_ingrediente`);

--
-- Indices de la tabla `tipos_servicio`
--
ALTER TABLE `tipos_servicio`
  ADD PRIMARY KEY (`id_tipo_servicio`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias_platos`
--
ALTER TABLE `categorias_platos`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `entradas`
--
ALTER TABLE `entradas`
  MODIFY `id_entrada` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `salidas`
--
ALTER TABLE `salidas`
  MODIFY `id_salida` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `entradas`
--
ALTER TABLE `entradas`
  ADD CONSTRAINT `entradas_ibfk_1` FOREIGN KEY (`id_ingrediente`) REFERENCES `ingredientes` (`id_ingrediente`),
  ADD CONSTRAINT `entradas_ibfk_2` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`);

--
-- Filtros para la tabla `eventos`
--
ALTER TABLE `eventos`
  ADD CONSTRAINT `eventos_ibfk_2` FOREIGN KEY (`correo_fk`) REFERENCES `cliente` (`correo_pk`),
  ADD CONSTRAINT `eventos_ibfk_3` FOREIGN KEY (`id_menu_fk`) REFERENCES `menu` (`id_menu`);

--
-- Filtros para la tabla `ingredientes`
--
ALTER TABLE `ingredientes`
  ADD CONSTRAINT `Ingredientes_ibfk_1` FOREIGN KEY (`categoria`) REFERENCES `categoria_ingredientes` (`id_categoria`);

--
-- Filtros para la tabla `platos`
--
ALTER TABLE `platos`
  ADD CONSTRAINT `Platos_ibfk_1` FOREIGN KEY (`categoria`) REFERENCES `categorias_platos` (`id_categoria`);

--
-- Filtros para la tabla `plato_ingrediente`
--
ALTER TABLE `plato_ingrediente`
  ADD CONSTRAINT `Plato_Ingrediente_ibfk_1` FOREIGN KEY (`id_plato`) REFERENCES `platos` (`id_plato`),
  ADD CONSTRAINT `Plato_Ingrediente_ibfk_2` FOREIGN KEY (`id_ingrediente`) REFERENCES `ingredientes` (`id_ingrediente`);

--
-- Filtros para la tabla `programacion_dia`
--
ALTER TABLE `programacion_dia`
  ADD CONSTRAINT `programacion_dia_ibfk_2` FOREIGN KEY (`lider_servicio`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `programacion_dia_ibfk_3` FOREIGN KEY (`lider_cocina`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `reservas_dia`
--
ALTER TABLE `reservas_dia`
  ADD CONSTRAINT `reservas_dia_ibfk_1` FOREIGN KEY (`correo_fk`) REFERENCES `cliente` (`correo_pk`),
  ADD CONSTRAINT `reservas_dia_ibfk_2` FOREIGN KEY (`Fecha_reserva`) REFERENCES `programacion_dia` (`Fecha_Reserva`);

--
-- Filtros para la tabla `responsable_cargo`
--
ALTER TABLE `responsable_cargo`
  ADD CONSTRAINT `responsable_Cargo_ibfk_1` FOREIGN KEY (`idUsuarioFK`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `salidas`
--
ALTER TABLE `salidas`
  ADD CONSTRAINT `salidas_ibfk_1` FOREIGN KEY (`id_ingrediente`) REFERENCES `ingredientes` (`id_ingrediente`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
