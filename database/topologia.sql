-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-12-2025 a las 16:36:24
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `topologia`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(80) NOT NULL,
  `resource_type` varchar(80) NOT NULL,
  `resource_id` bigint(20) DEFAULT NULL,
  `payload` longtext DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `user_id`, `action`, `resource_type`, `resource_id`, `payload`, `created_at`) VALUES
(1, 1, 'create', 'site', 14, '{\"network_id\":1,\"name\":\"DASDAS\",\"description\":null,\"parent_id\":13}', '2025-12-01 14:59:08'),
(2, 1, 'delete', 'site', 14, '{\"name\":\"DASDAS\",\"parent_id\":13}', '2025-12-01 14:59:22'),
(3, 1, 'create', 'site', 15, '{\"network_id\":1,\"name\":\"Mezzanotte\",\"description\":null,\"parent_id\":1}', '2025-12-03 08:50:21'),
(4, 1, 'delete', 'site', 15, '{\"name\":\"Mezzanotte\",\"parent_id\":1}', '2025-12-03 08:50:28'),
(5, 1, 'update', 'site', 13, '{\"name\":\"Trujillo\",\"description\":null,\"parent_id\":1}', '2025-12-03 08:51:08'),
(6, 1, 'update', 'site', 13, '{\"name\":\"Trujillo\",\"description\":null,\"parent_id\":null}', '2025-12-03 08:51:15'),
(7, 1, 'create', 'connection', 296, '{\"network_id\":1,\"from_device_id\":155,\"to_device_id\":162,\"a_port_id\":178,\"b_port_id\":244,\"a_port_name\":\"Fa0/1\",\"b_port_name\":\"Gi0/2\",\"link_type\":\"ethernet\",\"status\":\"up\",\"vlan\":[101]}', '2025-12-03 08:51:28'),
(8, 1, 'create', 'connection', 297, '{\"network_id\":1,\"from_device_id\":166,\"to_device_id\":155,\"a_port_id\":277,\"b_port_id\":179,\"a_port_name\":\"Fa0/2\",\"b_port_name\":\"Fa0/2\",\"link_type\":\"ethernet\",\"status\":\"up\",\"vlan\":null}', '2025-12-03 11:35:49'),
(9, 1, 'delete', 'connection', 297, NULL, '2025-12-03 11:36:03'),
(10, 1, 'delete', 'connection', 296, NULL, '2025-12-03 11:36:07'),
(11, 1, 'update', 'device', 166, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":319.1675612466416,\\\"y\\\":410.3351419121948}}\"}', '2025-12-03 11:55:54'),
(12, 1, 'update', 'device', 165, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":528.7411347953664,\\\"y\\\":396.2624604645335}}\"}', '2025-12-03 11:55:56'),
(13, 1, 'update', 'device', 167, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":-405.18587904242304,\\\"y\\\":97.44947413223109}}\"}', '2025-12-03 11:55:57'),
(14, 1, 'update', 'device', 167, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":188.49751258728793,\\\"y\\\":224.56052775572087}}\"}', '2025-12-03 11:56:03'),
(15, 1, 'update', 'device', 165, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":-5.125290423290491,\\\"y\\\":544.3094523318921}}\"}', '2025-12-03 11:56:05'),
(16, 1, 'update', 'device', 167, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":737.3181794087084,\\\"y\\\":242.50561767903707}}\"}', '2025-12-03 11:56:06'),
(17, 1, 'create', 'site', 16, '{\"network_id\":1,\"name\":\"Piso 3\",\"description\":null,\"parent_id\":2}', '2025-12-03 11:56:20'),
(18, 1, 'create', 'device', 168, '{\"network_id\":1,\"name\":\"DASDASSD\",\"device_type\":\"switch\",\"ip_address\":null,\"mac_address\":null,\"location\":null,\"image_id\":null,\"site_id\":16,\"metadata\":null}', '2025-12-03 11:56:38'),
(19, 1, 'create', 'device', 169, '{\"network_id\":1,\"name\":\"DASDASDA\",\"device_type\":\"switch\",\"ip_address\":null,\"mac_address\":null,\"location\":null,\"image_id\":null,\"site_id\":16,\"metadata\":null}', '2025-12-03 11:56:54'),
(20, 1, 'create', 'connection', 298, '{\"network_id\":1,\"from_device_id\":168,\"to_device_id\":169,\"a_port_id\":296,\"b_port_id\":320,\"a_port_name\":\"Fa0/1\",\"b_port_name\":\"Fa0/1\",\"link_type\":\"ethernet\",\"status\":\"up\",\"vlan\":null}', '2025-12-03 11:57:12'),
(21, 1, 'create', 'connection', 299, '{\"network_id\":1,\"from_device_id\":169,\"to_device_id\":152,\"a_port_id\":320,\"b_port_id\":117,\"a_port_name\":\"Fa0/1\",\"b_port_name\":\"Gi0/2\",\"link_type\":\"ethernet\",\"status\":\"up\",\"vlan\":null}', '2025-12-03 11:57:24'),
(22, 1, 'update', 'device', 169, '{\"metadata\":\"{\\\"pos_site_16\\\":{\\\"x\\\":5.1643017878511035,\\\"y\\\":186.56040208612123}}\"}', '2025-12-03 11:57:37'),
(23, 1, 'update', 'device', 169, '{\"metadata\":\"{\\\"pos_site_16\\\":{\\\"x\\\":-38.909337440566254,\\\"y\\\":196.16790845572314}}\"}', '2025-12-03 11:57:49'),
(24, 1, 'update', 'device', 169, '{\"metadata\":\"{\\\"pos_site_16\\\":{\\\"x\\\":19.45468240586376,\\\"y\\\":215.62261823274818}}\"}', '2025-12-03 11:57:50'),
(25, 1, 'update', 'device', 168, '{\"metadata\":\"{\\\"pos_site_16\\\":{\\\"x\\\":418.2754390712001,\\\"y\\\":-53.500356087754405}}\"}', '2025-12-03 11:57:51'),
(26, 1, 'update', 'device', 152, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":533,\\\"y\\\":211.28},\\\"pos_site_16\\\":{\\\"x\\\":380.6050927435187,\\\"y\\\":331.25048219864374}}\"}', '2025-12-03 11:57:52'),
(27, 1, 'update', 'device', 169, '{\"metadata\":\"{\\\"pos_site_16\\\":{\\\"x\\\":-27.433371820415662,\\\"y\\\":57.52159956980543}}\"}', '2025-12-03 11:58:02'),
(28, 1, 'create', 'device', 170, '{\"network_id\":1,\"name\":\"DASDA\",\"device_type\":\"switch\",\"ip_address\":null,\"mac_address\":null,\"location\":null,\"image_id\":null,\"site_id\":16,\"metadata\":null}', '2025-12-03 11:59:54'),
(29, 1, 'update', 'device', 170, '{\"metadata\":\"{\\\"pos_site_16\\\":{\\\"x\\\":23.884895768811376,\\\"y\\\":81.98329088213633}}\"}', '2025-12-03 11:59:58'),
(30, 1, 'update', 'device', 169, '{\"metadata\":\"{\\\"pos_site_16\\\":{\\\"x\\\":-29.049197556662477,\\\"y\\\":112.3235638857616}}\"}', '2025-12-03 11:59:59'),
(31, 1, 'update', 'device', 168, '{\"metadata\":\"{\\\"pos_site_16\\\":{\\\"x\\\":117.4878656736127,\\\"y\\\":-25.175971215774148}}\"}', '2025-12-03 11:59:59'),
(32, 1, 'update', 'device', 166, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":194.4618716137201,\\\"y\\\":307.39017664474954}}\"}', '2025-12-03 12:00:28'),
(33, 1, 'update', 'device', 166, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":375.926197218139,\\\"y\\\":641.2845357568804}}\"}', '2025-12-03 12:01:02'),
(34, 1, 'update', 'device', 165, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":229.56857069175797,\\\"y\\\":339.85964548424676}}\"}', '2025-12-03 12:01:03'),
(35, 1, 'update', 'device', 167, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":702.2350764585208,\\\"y\\\":446.9554245266823}}\"}', '2025-12-03 12:01:04'),
(36, 1, 'update', 'device', 165, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":108.33674677405872,\\\"y\\\":605.7335765589253}}\"}', '2025-12-03 12:01:08'),
(37, 1, 'update', 'device', 165, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":335.50993652751663,\\\"y\\\":697.2059671233707}}\"}', '2025-12-03 12:01:10'),
(38, 1, 'update', 'device', 167, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":444.906153551949,\\\"y\\\":707.2999207485656}}\"}', '2025-12-03 12:01:12'),
(39, 1, 'update', 'device', 165, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":129.76520495063883,\\\"y\\\":816.6325067168456}}\"}', '2025-12-03 12:01:20'),
(40, 1, 'update', 'device', 167, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":535.9541094796477,\\\"y\\\":800.7127586484124}}\"}', '2025-12-03 12:01:20'),
(41, 1, 'create', 'device', 171, '{\"network_id\":1,\"name\":\"1231231\",\"device_type\":\"ap\",\"ip_address\":null,\"mac_address\":null,\"location\":null,\"image_id\":null,\"site_id\":4,\"metadata\":null}', '2025-12-03 12:01:33'),
(42, 1, 'update', 'device', 171, '{\"name\":\"1231231\",\"device_type\":\"ap\",\"ip_address\":null,\"mac_address\":null,\"location\":null,\"image_id\":null,\"site_id\":4}', '2025-12-03 12:01:53'),
(43, 1, 'delete', 'device', 171, '{\"name\":\"1231231\",\"network_id\":1}', '2025-12-03 12:02:04'),
(44, 1, 'create', 'device', 172, '{\"network_id\":1,\"name\":\"PISO 1\",\"device_type\":\"ap\",\"ip_address\":null,\"mac_address\":null,\"location\":null,\"image_id\":null,\"site_id\":4,\"metadata\":null}', '2025-12-03 12:02:20'),
(45, 1, 'update', 'device', 172, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":0,\\\"y\\\":14.004097640929572}}\"}', '2025-12-03 12:02:24'),
(46, 1, 'create', 'connection', 300, '{\"network_id\":1,\"from_device_id\":172,\"to_device_id\":166,\"a_port_id\":340,\"b_port_id\":277,\"a_port_name\":\"Fa0/1\",\"b_port_name\":\"Fa0/2\",\"link_type\":\"ethernet\",\"status\":\"up\",\"vlan\":null}', '2025-12-03 12:02:28'),
(47, 1, 'update', 'device', 172, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":0,\\\"y\\\":14.004097640929572},\\\"pos_site_4\\\":{\\\"x\\\":-213.79617929635032,\\\"y\\\":375.08208934143227}}\"}', '2025-12-03 12:02:41'),
(48, 1, 'update', 'device', 172, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":0,\\\"y\\\":14.004097640929572},\\\"pos_site_4\\\":{\\\"x\\\":658.808967313198,\\\"y\\\":622.1354520838815}}\"}', '2025-12-03 12:02:53'),
(49, 1, 'update', 'device', 165, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":308.5022672919804,\\\"y\\\":907.9870052468646}}\"}', '2025-12-03 12:03:13'),
(50, 1, 'update', 'device', 167, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":394.9504269659227,\\\"y\\\":957.6041800369235}}\"}', '2025-12-03 12:03:14'),
(51, 1, 'update', 'device', 165, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":292.6145284171945,\\\"y\\\":971.5379607460083}}\"}', '2025-12-03 12:03:15'),
(52, 1, 'update', 'device', 166, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":593.9900033411853,\\\"y\\\":545.256437647649}}\"}', '2025-12-03 12:03:21'),
(53, 1, 'update', 'device', 172, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":0,\\\"y\\\":591.1228394587729},\\\"pos_site_4\\\":{\\\"x\\\":658.808967313198,\\\"y\\\":622.1354520838815}}\"}', '2025-12-03 12:03:25'),
(54, 1, 'update', 'device', 170, '{\"metadata\":\"{\\\"pos_site_16\\\":{\\\"x\\\":23.884895768811376,\\\"y\\\":81.98329088213633},\\\"pos\\\":{\\\"x\\\":132.1490341758291,\\\"y\\\":-57.145528292250425}}\"}', '2025-12-03 12:03:29'),
(55, 1, 'update', 'device', 169, '{\"metadata\":\"{\\\"pos_site_16\\\":{\\\"x\\\":-29.049197556662477,\\\"y\\\":112.3235638857616},\\\"pos\\\":{\\\"x\\\":-35.715955182656494,\\\"y\\\":115.48158842392273}}\"}', '2025-12-03 12:03:30'),
(56, 1, 'update', 'device', 170, '{\"metadata\":\"{\\\"pos_site_16\\\":{\\\"x\\\":23.884895768811376,\\\"y\\\":81.98329088213633},\\\"pos\\\":{\\\"x\\\":159.5312664825324,\\\"y\\\":-26.191700467281443}}\"}', '2025-12-03 12:03:31'),
(57, 1, 'update', 'device', 170, '{\"metadata\":\"{\\\"pos_site_16\\\":{\\\"x\\\":94.76370640236692,\\\"y\\\":238.85708386078045},\\\"pos\\\":{\\\"x\\\":159.5312664825324,\\\"y\\\":-26.191700467281443}}\"}', '2025-12-03 12:03:43'),
(58, 1, 'update', 'device', 168, '{\"metadata\":\"{\\\"pos_site_16\\\":{\\\"x\\\":-60.78186407523224,\\\"y\\\":260.0666643218953}}\"}', '2025-12-03 12:03:44'),
(59, 1, 'update', 'device', 170, '{\"metadata\":\"{\\\"pos_site_16\\\":{\\\"x\\\":94.76370640236692,\\\"y\\\":238.85708386078045},\\\"pos\\\":{\\\"x\\\":145.77442305787207,\\\"y\\\":36.33940600844733}}\"}', '2025-12-03 12:04:40'),
(60, 1, 'update', 'device', 170, '{\"metadata\":\"{\\\"pos_site_16\\\":{\\\"x\\\":112.29255237365882,\\\"y\\\":-44.97370851035627},\\\"pos\\\":{\\\"x\\\":145.77442305787207,\\\"y\\\":36.33940600844733}}\"}', '2025-12-03 12:05:01'),
(61, 1, 'update', 'device', 170, '{\"metadata\":\"{\\\"pos_site_16\\\":{\\\"x\\\":-8.652164179519596,\\\"y\\\":-68.88933042765143},\\\"pos\\\":{\\\"x\\\":145.77442305787207,\\\"y\\\":36.33940600844733}}\"}', '2025-12-03 12:05:02'),
(62, 1, 'update', 'device', 170, '{\"metadata\":\"{\\\"pos_site_16\\\":{\\\"x\\\":-70.14947768113576,\\\"y\\\":14.473694541206022},\\\"pos\\\":{\\\"x\\\":145.77442305787207,\\\"y\\\":36.33940600844733}}\"}', '2025-12-03 12:05:03'),
(63, 1, 'update', 'device', 170, '{\"metadata\":\"{\\\"pos_site_16\\\":{\\\"x\\\":-87.91536824826932,\\\"y\\\":15.15699802455733},\\\"pos\\\":{\\\"x\\\":145.77442305787207,\\\"y\\\":36.33940600844733}}\"}', '2025-12-03 12:05:07'),
(64, 1, 'update', 'device', 168, '{\"metadata\":\"{\\\"pos_site_16\\\":{\\\"x\\\":97.02909463588325,\\\"y\\\":-66.96374136842648}}\"}', '2025-12-03 12:05:41'),
(65, 1, 'update', 'device', 168, '{\"metadata\":\"{\\\"pos_site_16\\\":{\\\"x\\\":-39.63160203437486,\\\"y\\\":227.54005995597976}}\"}', '2025-12-03 12:05:53'),
(66, 1, 'update', 'device', 170, '{\"metadata\":\"{\\\"pos_site_16\\\":{\\\"x\\\":136.66069667025812,\\\"y\\\":0}}\"}', '2025-12-03 12:07:25'),
(67, 1, 'update', 'device', 170, '{\"metadata\":\"{\\\"pos_site_16\\\":{\\\"x\\\":51.2477612513468,\\\"y\\\":209.09086590549492}}\"}', '2025-12-03 12:07:42'),
(68, 1, 'update', 'device', 170, '{\"metadata\":\"{\\\"pos_site_16\\\":{\\\"x\\\":-99.76230856928844,\\\"y\\\":-79.26320406874972}}\"}', '2025-12-03 12:07:44'),
(69, 1, 'update', 'device', 170, '{\"metadata\":\"{\\\"pos_site_16\\\":{\\\"x\\\":-99.76230856928844,\\\"y\\\":-79.26320406874972},\\\"pos\\\":{\\\"x\\\":175.00818039501692,\\\"y\\\":-11.905318394218845}}\"}', '2025-12-03 12:07:47'),
(70, 1, 'update', 'device', 170, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":175.00818039501692,\\\"y\\\":-11.905318394218845},\\\"pos_site_16\\\":{\\\"x\\\":103.9446181264827,\\\"y\\\":201.9686718947351}}\"}', '2025-12-03 12:08:18'),
(71, 1, 'update', 'device', 172, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":0,\\\"y\\\":591.1228394587729},\\\"pos_site_4\\\":{\\\"x\\\":122.39066452288507,\\\"y\\\":454.53215308516644}}\"}', '2025-12-03 12:12:27'),
(72, 1, 'update', 'device', 166, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":593.9900033411853,\\\"y\\\":545.256437647649},\\\"pos_site_4\\\":{\\\"x\\\":305.25622570984876,\\\"y\\\":471.55156232723743}}\"}', '2025-12-03 12:12:29'),
(73, 1, 'create', 'device', 173, '{\"network_id\":1,\"name\":\"nuevo\",\"device_type\":\"switch\",\"ip_address\":null,\"mac_address\":null,\"location\":null,\"image_id\":null,\"site_id\":4,\"metadata\":null}', '2025-12-03 12:16:16'),
(74, 1, 'create', 'connection', 301, '{\"network_id\":1,\"from_device_id\":164,\"to_device_id\":173,\"a_port_id\":262,\"b_port_id\":350,\"a_port_name\":\"Fa0/2\",\"b_port_name\":\"Fa0/1\",\"link_type\":\"ethernet\",\"status\":\"up\",\"vlan\":null}', '2025-12-03 12:16:29'),
(75, 1, 'update', 'device', 173, '{\"metadata\":\"{\\\"pos_site_4\\\":{\\\"x\\\":967.9023854499916,\\\"y\\\":490.49911784181614}}\"}', '2025-12-03 12:16:38'),
(76, 1, 'update', 'device', 173, '{\"metadata\":\"{\\\"pos_site_4\\\":{\\\"x\\\":967.9023854499916,\\\"y\\\":490.49911784181614},\\\"pos\\\":{\\\"x\\\":970.6229492937299,\\\"y\\\":454.25641165189614}}\"}', '2025-12-03 12:16:42'),
(77, 1, 'update', 'device', 170, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":58.095002061016885,\\\"y\\\":-60.61914270005222},\\\"pos_site_16\\\":{\\\"x\\\":103.9446181264827,\\\"y\\\":201.9686718947351}}\"}', '2025-12-03 12:16:44'),
(78, 1, 'delete', 'device', 170, '{\"name\":\"DASDA\",\"network_id\":1}', '2025-12-03 12:16:45'),
(79, 1, 'update', 'device', 173, '{\"metadata\":\"{\\\"pos_site_4\\\":{\\\"x\\\":967.9023854499916,\\\"y\\\":490.49911784181614},\\\"pos\\\":{\\\"x\\\":973.4856174713631,\\\"y\\\":464.27575027361223}}\"}', '2025-12-03 12:16:49'),
(80, 1, 'update', 'device', 173, '{\"metadata\":\"{\\\"pos_site_4\\\":{\\\"x\\\":967.9023854499916,\\\"y\\\":490.49911784181614},\\\"pos\\\":{\\\"x\\\":970.6229492937298,\\\"y\\\":200.91027793136163}}\"}', '2025-12-03 12:16:51'),
(81, 1, 'update', 'device', 168, '{\"metadata\":\"{\\\"pos_site_16\\\":{\\\"x\\\":-39.63160203437486,\\\"y\\\":227.54005995597976},\\\"pos\\\":{\\\"x\\\":-127.38690681814154,\\\"y\\\":107.14786554796953}}\"}', '2025-12-03 12:17:00'),
(82, 1, 'delete', 'connection', 301, NULL, '2025-12-03 12:17:46'),
(83, 1, 'create', 'connection', 302, '{\"network_id\":1,\"from_device_id\":164,\"to_device_id\":173,\"a_port_id\":262,\"b_port_id\":350,\"a_port_name\":\"Fa0/2\",\"b_port_name\":\"Fa0/1\",\"link_type\":\"ethernet\",\"status\":\"up\",\"vlan\":[110,120,150]}', '2025-12-03 12:18:13'),
(84, 1, 'update', 'device', 173, '{\"metadata\":\"{\\\"pos_site_4\\\":{\\\"x\\\":967.9023854499916,\\\"y\\\":490.49911784181614},\\\"pos\\\":{\\\"x\\\":984.1921744201022,\\\"y\\\":123.19562493486549}}\"}', '2025-12-03 12:18:16'),
(85, 1, 'update', 'device', 173, '{\"metadata\":\"{\\\"pos_site_4\\\":{\\\"x\\\":967.9023854499916,\\\"y\\\":490.49911784181614},\\\"pos\\\":{\\\"x\\\":975.5572129760471,\\\"y\\\":121.96205901428621}}\"}', '2025-12-03 12:18:16'),
(86, 1, 'delete', 'connection', 252, NULL, '2025-12-03 12:18:21'),
(87, 1, 'create', 'connection', 303, '{\"network_id\":1,\"from_device_id\":152,\"to_device_id\":164,\"a_port_id\":120,\"b_port_id\":261,\"a_port_name\":\"Gi0/5\",\"b_port_name\":\"Fa0/1\",\"link_type\":\"ethernet\",\"status\":\"up\",\"vlan\":[110,120,150]}', '2025-12-03 12:18:27'),
(88, 1, 'update', 'connection', 302, '{\"from_device_id\":164,\"to_device_id\":173,\"link_type\":\"ethernet\",\"status\":\"up\",\"vlan\":120}', '2025-12-03 12:18:35'),
(89, 1, 'create', 'connection', 304, '{\"network_id\":1,\"from_device_id\":156,\"to_device_id\":169,\"a_port_id\":195,\"b_port_id\":321,\"a_port_name\":\"Gi0/2\",\"b_port_name\":\"Fa0/2\",\"link_type\":\"ethernet\",\"status\":\"up\",\"vlan\":null}', '2025-12-03 12:20:29'),
(90, 1, 'delete', 'connection', 304, NULL, '2025-12-03 12:20:35'),
(91, 1, 'create', 'device', 174, '{\"network_id\":1,\"name\":\"TRUJILLO\",\"device_type\":\"switch\",\"ip_address\":null,\"mac_address\":null,\"location\":null,\"image_id\":null,\"site_id\":13,\"metadata\":null}', '2025-12-03 12:20:51'),
(92, 1, 'create', 'connection', 305, '{\"network_id\":1,\"from_device_id\":174,\"to_device_id\":156,\"a_port_id\":360,\"b_port_id\":195,\"a_port_name\":\"Fa0/1\",\"b_port_name\":\"Gi0/2\",\"link_type\":\"ethernet\",\"status\":\"up\",\"vlan\":null}', '2025-12-03 12:21:04'),
(93, 1, 'update', 'connection', 305, '{\"from_device_id\":174,\"to_device_id\":156,\"link_type\":\"ethernet\",\"status\":\"up\",\"vlan\":100}', '2025-12-03 12:21:21'),
(94, 1, 'update', 'device', 174, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":204.7719428161644,\\\"y\\\":500.82776375519717}}\"}', '2025-12-03 12:21:28'),
(95, 1, 'delete', 'device', 172, '{\"name\":\"PISO 1\",\"network_id\":1}', '2025-12-03 13:32:45'),
(96, 1, 'delete', 'device', 166, '{\"name\":\"dadasda\",\"network_id\":1}', '2025-12-03 13:32:47'),
(97, 1, 'delete', 'device', 167, '{\"name\":\"adasda\",\"network_id\":1}', '2025-12-03 13:32:53'),
(98, 1, 'delete', 'device', 165, '{\"name\":\"1312321\",\"network_id\":1}', '2025-12-03 13:32:57'),
(99, 1, 'delete', 'device', 168, '{\"name\":\"DASDASSD\",\"network_id\":1}', '2025-12-03 13:33:01'),
(100, 1, 'delete', 'device', 169, '{\"name\":\"DASDASDA\",\"network_id\":1}', '2025-12-03 13:33:04'),
(101, 1, 'update', 'device', 174, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":204.7719428161644,\\\"y\\\":500.82776375519717},\\\"pos_site_13\\\":{\\\"x\\\":164.6215868350085,\\\"y\\\":480.4003789113492}}\"}', '2025-12-03 13:47:24'),
(102, 1, 'create', 'device', 175, '{\"network_id\":1,\"name\":\"ROUTER\",\"device_type\":\"router\",\"ip_address\":null,\"mac_address\":null,\"location\":null,\"image_id\":null,\"site_id\":13,\"metadata\":null}', '2025-12-03 13:48:46'),
(103, 1, 'create', 'connection', 306, '{\"network_id\":1,\"from_device_id\":175,\"to_device_id\":153,\"a_port_id\":370,\"b_port_id\":144,\"a_port_name\":\"Fa0/1\",\"b_port_name\":\"Gi0/1\",\"link_type\":\"ethernet\",\"status\":\"up\",\"vlan\":null}', '2025-12-03 13:51:18'),
(104, 1, 'delete', 'device', 175, '{\"name\":\"ROUTER\",\"network_id\":1}', '2025-12-03 13:52:23'),
(105, 1, 'update', 'device', 174, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":204.7719428161644,\\\"y\\\":500.82776375519717},\\\"pos_site_13\\\":{\\\"x\\\":123.95736078111538,\\\"y\\\":450.64877490990534}}\"}', '2025-12-03 13:53:24'),
(106, 1, 'update', 'device', 174, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":166.24943986923526,\\\"y\\\":482.58026235928344},\\\"pos_site_13\\\":{\\\"x\\\":123.95736078111538,\\\"y\\\":450.64877490990534}}\"}', '2025-12-03 13:53:29'),
(107, 1, 'update', 'device', 174, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":200.09581276396548,\\\"y\\\":157.05779363643677},\\\"pos_site_13\\\":{\\\"x\\\":123.95736078111538,\\\"y\\\":450.64877490990534}}\"}', '2025-12-03 13:53:36'),
(108, 1, 'update', 'device', 158, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":530.7086406238078,\\\"y\\\":362.24199220240234}}\"}', '2025-12-03 14:16:20'),
(109, 1, 'update', 'device', 156, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":239.84999999999997,\\\"y\\\":333.6},\\\"pos_site_5\\\":{\\\"x\\\":240.6775316555758,\\\"y\\\":394.0098108570349}}\"}', '2025-12-03 14:16:29'),
(110, 1, 'update', 'device', 156, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":279.6692622290944,\\\"y\\\":332.6045184442727},\\\"pos_site_5\\\":{\\\"x\\\":240.6775316555758,\\\"y\\\":394.0098108570349}}\"}', '2025-12-03 14:16:38'),
(111, 1, 'update', 'device', 174, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":200.09581276396548,\\\"y\\\":157.05779363643677},\\\"pos_site_13\\\":{\\\"x\\\":-212.51776991779275,\\\"y\\\":340.9286235950439}}\"}', '2025-12-03 14:16:43'),
(112, 1, 'create', 'device', 176, '{\"network_id\":1,\"name\":\"DADSA\",\"device_type\":\"switch\",\"ip_address\":null,\"mac_address\":null,\"location\":null,\"image_id\":null,\"site_id\":5,\"metadata\":null}', '2025-12-03 14:18:31'),
(113, 1, 'delete', 'connection', 305, NULL, '2025-12-03 14:20:03'),
(114, 1, 'update', 'device', 174, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":298.10978177084627,\\\"y\\\":186.70907837801417},\\\"pos_site_13\\\":{\\\"x\\\":-212.51776991779275,\\\"y\\\":340.9286235950439}}\"}', '2025-12-03 14:24:22'),
(115, 1, 'update', 'device', 174, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":241.27815268282296,\\\"y\\\":179.29625719261983},\\\"pos_site_13\\\":{\\\"x\\\":-212.51776991779275,\\\"y\\\":340.9286235950439}}\"}', '2025-12-03 14:24:22'),
(116, 1, 'create', 'device', 177, '{\"network_id\":1,\"name\":\"SDAS\",\"device_type\":\"switch\",\"ip_address\":null,\"mac_address\":null,\"location\":null,\"image_id\":null,\"site_id\":13,\"metadata\":null}', '2025-12-03 14:30:04'),
(117, 1, 'update', 'device', 177, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":121.04407332071742,\\\"y\\\":8.723897176267917}}\"}', '2025-12-03 14:30:09'),
(118, 1, 'create', 'device', 178, '{\"network_id\":1,\"name\":\"13123\",\"device_type\":\"ap\",\"ip_address\":null,\"mac_address\":null,\"location\":null,\"image_id\":null,\"site_id\":1,\"metadata\":null}', '2025-12-03 14:58:10'),
(119, 1, 'update', 'device', 178, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":533,\\\"y\\\":370.6666666666667}}\"}', '2025-12-03 14:58:18'),
(120, 1, 'delete', 'device', 178, '{\"name\":\"13123\",\"network_id\":1}', '2025-12-03 14:58:30'),
(121, 1, 'create', 'device', 179, '{\"network_id\":1,\"name\":\"2342\",\"device_type\":\"router\",\"ip_address\":null,\"mac_address\":null,\"location\":null,\"image_id\":null,\"site_id\":1,\"metadata\":null}', '2025-12-03 15:31:23'),
(122, 1, 'update', 'device', 179, '{\"metadata\":\"{\\\"pos_site_1\\\":{\\\"x\\\":533,\\\"y\\\":370.6666666666667}}\"}', '2025-12-03 15:31:25'),
(123, 1, 'update', 'device', 179, '{\"name\":\"2342\",\"device_type\":\"other\",\"ip_address\":null,\"mac_address\":null,\"location\":null,\"image_id\":null,\"site_id\":1}', '2025-12-03 15:31:33'),
(124, 1, 'update', 'device', 179, '{\"metadata\":\"{\\\"pos_site_1\\\":{\\\"x\\\":331.8001191377017,\\\"y\\\":40.889347146804866}}\"}', '2025-12-03 15:31:39'),
(125, 1, 'update', 'device', 179, '{\"metadata\":\"{\\\"pos_site_1\\\":{\\\"x\\\":275.84512268487305,\\\"y\\\":149.22774453419626}}\"}', '2025-12-03 15:31:45'),
(126, 1, 'update', 'device', 179, '{\"metadata\":\"{\\\"pos_site_1\\\":{\\\"x\\\":275.84512268487305,\\\"y\\\":149.22774453419626},\\\"pos\\\":{\\\"x\\\":8.333722875953173,\\\"y\\\":84.52776059895373}}\"}', '2025-12-03 15:31:50'),
(127, 1, 'update', 'device', 179, '{\"name\":\"2342\",\"device_type\":\"router\",\"ip_address\":null,\"mac_address\":null,\"location\":null,\"image_id\":null,\"site_id\":1}', '2025-12-03 15:33:40'),
(128, 1, 'create', 'device', 180, '{\"network_id\":1,\"name\":\"11231\",\"device_type\":\"router\",\"ip_address\":null,\"mac_address\":null,\"location\":null,\"image_id\":null,\"site_id\":13,\"metadata\":null}', '2025-12-04 10:26:35'),
(129, 1, 'update', 'device', 180, '{\"metadata\":\"{\\\"pos_site_13\\\":{\\\"x\\\":551,\\\"y\\\":447.3333333333333}}\"}', '2025-12-04 10:26:53'),
(130, 1, 'create', 'device', 181, '{\"network_id\":1,\"name\":\"wifi\",\"device_type\":\"router\",\"ip_address\":null,\"mac_address\":null,\"location\":null,\"image_id\":null,\"site_id\":1,\"metadata\":null}', '2025-12-04 10:27:16'),
(131, 1, 'update', 'device', 181, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":64.44384855990467,\\\"y\\\":-9.764216228078014}}\"}', '2025-12-04 10:27:29'),
(132, 1, 'update', 'device', 181, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":74.36010997176204,\\\"y\\\":-7.450421898644626}}\"}', '2025-12-04 10:27:37'),
(133, 1, 'update', 'device', 181, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":105.70872463315098,\\\"y\\\":-4.942532725733508}}\"}', '2025-12-04 10:27:51'),
(134, 1, 'update', 'device', 181, '{\"name\":\"wifi\",\"device_type\":\"other\",\"ip_address\":null,\"mac_address\":null,\"location\":null,\"image_id\":null,\"site_id\":1}', '2025-12-04 10:28:02'),
(135, 1, 'update', 'device', 180, '{\"metadata\":\"{\\\"pos_site_13\\\":{\\\"x\\\":551,\\\"y\\\":447.3333333333333},\\\"pos\\\":{\\\"x\\\":-101.20117236049377,\\\"y\\\":-3.723120053396089}}\"}', '2025-12-04 10:28:06'),
(136, 1, 'update', 'device', 176, '{\"name\":\"DADSA\",\"device_type\":\"other\",\"ip_address\":null,\"mac_address\":null,\"location\":null,\"image_id\":null,\"site_id\":5}', '2025-12-04 10:29:24'),
(137, 1, 'update', 'device', 180, '{\"name\":\"11231\",\"device_type\":\"other\",\"ip_address\":null,\"mac_address\":null,\"location\":null,\"image_id\":null,\"site_id\":13}', '2025-12-04 10:35:10'),
(138, 1, 'update', 'device', 174, '{\"name\":\"TRUJILLOa\",\"device_type\":\"switch\",\"ip_address\":null,\"mac_address\":null,\"location\":null,\"image_id\":null,\"site_id\":13}', '2025-12-04 10:42:57'),
(139, 1, 'update', 'device', 179, '{\"metadata\":\"{\\\"pos_site_1\\\":{\\\"x\\\":275.84512268487305,\\\"y\\\":149.22774453419626},\\\"pos\\\":{\\\"x\\\":173.38201650119464,\\\"y\\\":84.52776059895373}}\"}', '2025-12-04 10:52:46'),
(140, 1, 'create', 'device', 182, '{\"network_id\":1,\"name\":\"OTRO\",\"device_type\":\"other\",\"ip_address\":null,\"mac_address\":null,\"location\":null,\"image_id\":null,\"site_id\":null,\"metadata\":null}', '2025-12-04 10:52:57'),
(141, 1, 'update', 'device', 181, '{\"metadata\":\"{\\\"pos\\\":{\\\"x\\\":105.70872463315098,\\\"y\\\":-4.942532725733508},\\\"pos_site_1\\\":{\\\"x\\\":228.74472533560368,\\\"y\\\":56.07532128117396}}\"}', '2025-12-04 10:53:30'),
(142, 1, 'update', 'device', 180, '{\"metadata\":\"{\\\"pos_site_13\\\":{\\\"x\\\":507.47336715770206,\\\"y\\\":369.2617537907989},\\\"pos\\\":{\\\"x\\\":-101.20117236049377,\\\"y\\\":-3.723120053396089}}\"}', '2025-12-04 10:53:50'),
(143, 1, 'update', 'device', 180, '{\"name\":\"11231\",\"device_type\":\"router\",\"ip_address\":null,\"mac_address\":null,\"location\":null,\"image_id\":null,\"site_id\":13}', '2025-12-04 10:54:00'),
(144, 1, 'delete', 'device', 176, '{\"name\":\"DADSA\",\"network_id\":1}', '2025-12-04 10:54:21'),
(145, 1, 'delete', 'device', 181, '{\"name\":\"wifi\",\"network_id\":1}', '2025-12-04 10:54:25'),
(146, 1, 'create', 'connection', 307, '{\"network_id\":1,\"from_device_id\":177,\"to_device_id\":174,\"a_port_id\":390,\"b_port_id\":360,\"a_port_name\":\"Gi0/1\",\"b_port_name\":\"Fa0/1\",\"link_type\":\"ethernet\",\"status\":\"up\",\"vlan\":null}', '2025-12-04 10:54:35'),
(147, 1, 'delete', 'connection', 307, NULL, '2025-12-04 10:54:50'),
(148, 1, 'update', 'device', 180, '{\"name\":\"11231\",\"device_type\":\"other\",\"ip_address\":null,\"mac_address\":null,\"location\":null,\"image_id\":null,\"site_id\":13}', '2025-12-04 11:20:22'),
(149, 1, 'delete', 'device', 182, '{\"name\":\"OTRO\",\"network_id\":1}', '2025-12-04 11:20:48'),
(150, 1, 'update', 'device', 180, '{\"metadata\":\"{\\\"pos_site_13\\\":{\\\"x\\\":476.20534274001767,\\\"y\\\":327.17018245930075},\\\"pos\\\":{\\\"x\\\":-101.20117236049377,\\\"y\\\":-3.723120053396089}}\"}', '2025-12-04 11:31:14'),
(151, 1, 'update', 'device', 180, '{\"name\":\"11231\",\"device_type\":\"router\",\"ip_address\":null,\"mac_address\":null,\"location\":null,\"image_id\":null,\"site_id\":13}', '2025-12-04 11:31:45'),
(152, 1, 'update', 'device', 180, '{\"name\":\"11231\",\"device_type\":\"other\",\"ip_address\":null,\"mac_address\":null,\"location\":null,\"image_id\":null,\"site_id\":13}', '2025-12-04 11:31:50'),
(153, 1, 'update', 'device', 180, '{\"name\":\"11231\",\"device_type\":\"router\",\"ip_address\":null,\"mac_address\":null,\"location\":null,\"image_id\":null,\"site_id\":13}', '2025-12-04 11:35:05'),
(154, 1, 'create', 'device', 183, '{\"network_id\":1,\"name\":\"13123\",\"device_type\":\"other\",\"ip_address\":null,\"mac_address\":null,\"location\":null,\"image_id\":null,\"site_id\":13,\"metadata\":\"{\\\"created_view\\\":\\\"wifi\\\"}\"}', '2025-12-04 11:35:31');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `blacklisted_tokens`
--

CREATE TABLE `blacklisted_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `access_hash` varchar(128) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `blacklisted_tokens`
--

INSERT INTO `blacklisted_tokens` (`id`, `access_hash`, `user_id`, `expires_at`, `reason`, `created_at`) VALUES
(1, 'b864c812be136ef1cb7c811d9c7b8b97bf81620a3d181c4b1472d4a6b02573c3', 3, '2025-12-02 03:11:57', 'logout', '2025-12-01 15:12:00'),
(2, '75fdb2d80f86ee943fa5abb400d63268c2c3f98736b57dcf14e2aa7857d93d17', 1, '2025-12-02 03:12:46', 'logout', '2025-12-01 15:12:55'),
(3, '844b0512da79aa041e46ef18ad9ee859442862ed817f180e00f9dc2c20aa58ef', 3, '2025-12-02 03:16:26', 'logout', '2025-12-01 15:16:35'),
(4, 'db26b75a38641615d6c8afdb3f129b67f2bdf02b64192f078dd945c5a6a0ee45', 3, '2025-12-02 03:17:55', 'logout', '2025-12-01 15:32:30'),
(5, '0fb166e8d5e8cf600cb93ec690aec084c5ba0efb97f512339a1d13548e97dbfe', 1, '2025-12-02 03:32:33', 'logout', '2025-12-01 15:33:09'),
(6, 'ac7e31c8cbfcd117a61f3c8353dc095f4578322fc79e3c279eee3aa6dea17d33', 3, '2025-12-02 03:33:10', 'logout', '2025-12-01 15:33:14'),
(7, '39711f9298dc2e5d3e00fd3409164d490f2d4ee698abf4a493bcbc2123e23015', 1, '2025-12-02 03:33:18', 'logout', '2025-12-01 15:33:39'),
(8, '162b0fb0a5ff5d2cc17f3f63a3139af1d4e4e754d72dd8f2c018127725abc74e', 3, '2025-12-02 03:34:10', 'logout', '2025-12-01 15:37:33'),
(9, '839b183da8511671affb96fa7ce65d5e4218b58284c0ea46dcdea88a0538774e', 1, '2025-12-02 03:33:51', 'logout', '2025-12-01 15:50:12'),
(10, '684a3a726a267d18b275b2425739da85c19d372cbb183e5778a79f75c0bcb289', 1, '2025-12-02 03:57:44', 'logout', '2025-12-01 15:57:53'),
(11, 'd90a64c314e5327dbc390c114babe5ae75e238daf7ea6eb849eebc2933d578fd', 1, '2025-12-02 22:47:04', 'logout', '2025-12-02 10:47:12'),
(12, '62670cbc6f805edbe2301d8c959e7e9c22fac52e7191ea634e387d20253b6741', 1, '2025-12-02 22:53:17', 'logout', '2025-12-02 10:53:20'),
(13, '728eb1a0da8eb9bbec312157ea857a18bab94c33097340966f5d299d437c7836', 1, '2025-12-03 20:46:54', 'logout', '2025-12-03 08:47:04'),
(14, '91d53780c1887e14a494385f2f0636bf62eb28d52e81e2942b8f8351d4dc93ac', 1, '2025-12-03 20:47:06', 'logout', '2025-12-03 08:47:24'),
(15, '88f1e051c7328396321e1b8bb0f7d214aeda969dd4e19f08c4ab17d6b187baa5', 1, '2025-12-03 23:00:53', 'logout', '2025-12-03 11:02:43'),
(16, '3b3c4c408b4581a7ccd06e68e278986cc798db01524ba18932bd0e1c819205a3', 1, '2025-12-04 00:00:53', 'logout', '2025-12-03 13:46:51'),
(17, 'a127585b1d923e2bb31e02c52562144d374debf5560e6407c91c1ebdadc7d445', 1, '2025-12-04 01:46:59', 'logout', '2025-12-03 13:50:31'),
(18, 'b1896325b9aab980064675fb680a08b2a3a2ff27c923d25c452730d4f60998bc', 1, '2025-12-04 01:50:34', 'logout', '2025-12-03 13:51:55'),
(19, 'ed4ad673966fbf9703e92f1cd30f1876538fd4113ecbcf2135564d097cb3e8f9', 1, '2025-12-04 22:23:39', 'logout', '2025-12-04 10:29:38'),
(20, '6fc01cb92278da8e0c0a8e125e7716828c63623eced8c175b1c0e2ae3a8d92bc', 1, '2025-12-04 22:29:39', 'logout', '2025-12-04 10:47:51');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `connections`
--

CREATE TABLE `connections` (
  `id` int(11) NOT NULL,
  `network_id` int(11) NOT NULL,
  `from_device_id` int(11) NOT NULL,
  `a_port_id` int(11) DEFAULT NULL,
  `to_device_id` int(11) NOT NULL,
  `b_port_id` int(11) DEFAULT NULL,
  `link_type` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `vlan` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`vlan`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `from_id_norm` int(11) GENERATED ALWAYS AS (least(`from_device_id`,`to_device_id`)) STORED,
  `to_id_norm` int(11) GENERATED ALWAYS AS (greatest(`from_device_id`,`to_device_id`)) STORED,
  `a_port_name` varchar(64) DEFAULT NULL,
  `b_port_name` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `connections`
--

INSERT INTO `connections` (`id`, `network_id`, `from_device_id`, `a_port_id`, `to_device_id`, `b_port_id`, `link_type`, `status`, `vlan`, `created_at`, `a_port_name`, `b_port_name`) VALUES
(247, 1, 152, 138, 156, 194, 'ethernet', 'up', NULL, '2025-11-14 17:58:54', 'Gi0/23', 'Gi0/1'),
(248, 1, 152, 122, 153, 168, 'ethernet', 'up', '101', '2025-11-14 17:59:34', 'Gi0/7', 'Gi0/25'),
(249, 1, 153, 166, 162, 255, 'ethernet', 'up', NULL, '2025-11-14 18:01:28', 'Gi0/23', 'Gi0/13'),
(250, 1, 153, 165, 155, 185, 'ethernet', 'up', NULL, '2025-11-14 18:01:50', 'Gi0/22', 'Fa0/8'),
(253, 1, 152, 116, 158, 230, 'ethernet', 'up', NULL, '2025-11-14 18:05:43', 'Gi0/1', 'Gi0/7'),
(254, 1, 152, 130, 159, 234, 'ethernet', 'up', NULL, '2025-11-14 18:06:44', 'Gi0/15', 'Gi0/1'),
(256, 1, 152, 118, 157, 223, 'ethernet', 'up', NULL, '2025-11-14 18:08:19', 'Gi0/3', 'Fa0/4'),
(257, 1, 152, 119, 163, 257, 'ethernet', 'up', NULL, '2025-11-20 12:49:18', 'Gi0/4', 'Fa0/2'),
(302, 1, 164, 262, 173, 350, 'ethernet', 'up', '120', '2025-12-03 16:18:13', 'Fa0/2', 'Fa0/1'),
(303, 1, 152, 120, 164, 261, 'ethernet', 'up', '[110,120,150]', '2025-12-03 16:18:27', 'Gi0/5', 'Fa0/1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `devices`
--

CREATE TABLE `devices` (
  `id` int(11) NOT NULL,
  `network_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `mac_address` varchar(50) DEFAULT NULL,
  `device_type` varchar(50) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `image_id` int(11) DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `site_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `devices`
--

INSERT INTO `devices` (`id`, `network_id`, `name`, `ip_address`, `mac_address`, `device_type`, `location`, `image_id`, `metadata`, `created_at`, `updated_at`, `site_id`) VALUES
(152, 1, 'SW HUAWEI S230', '198.168.1.1', '7c:86:00:8b:3d:23', 'switch', 'NODO PISO 1 TORRE UNION', 12, '{\"pos\":{\"x\":533,\"y\":211.28},\"pos_site_16\":{\"x\":380.6050927435187,\"y\":331.25048219864374}}', '2025-11-14 17:39:15', '2025-12-03 15:57:52', 4),
(153, 1, 'SW 3COM', '198.168.1.1', '7c:86:00:8b:3d:23', 'switch', 'CAUC COMERCIAL PISO 1', NULL, '{\"pos\":{\"x\":93.27499999999998,\"y\":333.6}}', '2025-11-14 17:40:49', '2025-11-21 15:24:02', 4),
(155, 1, 'SW D-LINK', '198.168.1.1', '7c:86:00:8b:3d:23', 'switch', 'FAURE PISO 1', NULL, '{\"pos\":{\"x\":337.5666666666667,\"y\":455.92}}', '2025-11-14 17:42:13', '2025-11-21 15:24:02', 4),
(156, 1, 'SW CISCO CATALYST', '198.168.1.1', '7c:86:00:8b:3d:23', 'switch', 'ATIT PISO 5', NULL, '{\"pos\":{\"x\":279.6692622290944,\"y\":332.6045184442727},\"pos_site_5\":{\"x\":240.6775316555758,\"y\":394.0098108570349}}', '2025-11-14 17:43:15', '2025-12-03 18:16:38', 5),
(157, 1, 'ROUTER HUAWEI AR 2941', '198.168.1.1', '7c:86:00:8b:3d:23', 'switch', 'NODO PISO 1', NULL, '{\"pos\":{\"x\":386.42499999999995,\"y\":333.6}}', '2025-11-14 17:44:12', '2025-11-21 15:24:02', 4),
(158, 1, 'ZTE S200', '198.168.1.1', '7c:86:00:8b:3d:23', 'switch', 'NODO PISO 1 TORRE UNION', NULL, '{\"pos\":{\"x\":530.7086406238078,\"y\":362.24199220240234}}', '2025-11-14 17:53:52', '2025-12-03 18:16:20', 4),
(159, 1, 'MIKROTIK RB5009', '198.168.1.1', '7c:86:00:8b:3d:23', 'switch', 'NODO PISO 1 TORRE UNION', NULL, '{\"pos\":{\"x\":679.575,\"y\":333.6}}', '2025-11-14 17:54:32', '2025-11-21 15:24:02', 4),
(162, 1, 'SW ENCORE UREE', '198.168.1.1', '7c:86:00:8b:3d:23', 'switch', 'UREE PISO 1', NULL, '{\"pos\":{\"x\":728.4333333333333,\"y\":455.92}}', '2025-11-14 18:01:02', '2025-11-21 15:24:02', 4),
(163, 1, 'BIOMETRICO', '198.168.1.1', '7c:86:00:8b:3d:23', 'switch', 'Planta Baja', NULL, '{\"pos\":{\"x\":826.1500000000001,\"y\":333.6}}', '2025-11-14 18:04:05', '2025-11-21 15:24:02', 4),
(164, 1, 'SERVIDOR BIOMETRICO', '198.168.1.1', '7c:86:00:8b:3d:23', 'switch', 'Piso 1', NULL, '{\"pos\":{\"x\":972.725,\"y\":333.6}}', '2025-11-14 18:04:30', '2025-11-21 15:24:02', 4),
(173, 1, 'nuevo', NULL, NULL, 'switch', NULL, NULL, '{\"pos_site_4\":{\"x\":967.9023854499916,\"y\":490.49911784181614},\"pos\":{\"x\":975.5572129760471,\"y\":121.96205901428621}}', '2025-12-03 16:16:15', '2025-12-03 16:18:16', 4),
(174, 1, 'TRUJILLOa', NULL, NULL, 'switch', NULL, NULL, '{\"pos\":{\"x\":241.27815268282296,\"y\":179.29625719261983},\"pos_site_13\":{\"x\":-212.51776991779275,\"y\":340.9286235950439}}', '2025-12-03 16:20:50', '2025-12-04 14:42:57', 13),
(177, 1, 'SDAS', NULL, NULL, 'switch', NULL, NULL, '{\"pos\":{\"x\":121.04407332071742,\"y\":8.723897176267917}}', '2025-12-03 18:30:03', '2025-12-03 18:30:09', 13),
(179, 1, '2342', NULL, NULL, 'router', NULL, NULL, '{\"pos_site_1\":{\"x\":275.84512268487305,\"y\":149.22774453419626},\"pos\":{\"x\":173.38201650119464,\"y\":84.52776059895373}}', '2025-12-03 19:31:23', '2025-12-04 14:52:46', 1),
(180, 1, '11231', NULL, NULL, 'router', NULL, NULL, '{\"pos_site_13\":{\"x\":476.20534274001767,\"y\":327.17018245930075},\"pos\":{\"x\":-101.20117236049377,\"y\":-3.723120053396089}}', '2025-12-04 14:26:34', '2025-12-04 15:35:05', 13),
(183, 1, '13123', NULL, NULL, 'other', NULL, NULL, '{\"created_view\":\"wifi\"}', '2025-12-04 15:35:31', '2025-12-04 15:35:31', 13);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `device_positions`
--

CREATE TABLE `device_positions` (
  `id` int(11) NOT NULL,
  `device_id` int(11) NOT NULL,
  `view` enum('wifi','switch') NOT NULL,
  `x` double NOT NULL,
  `y` double NOT NULL,
  `zoom` double DEFAULT NULL,
  `pan_x` double DEFAULT NULL,
  `pan_y` double DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `images`
--

CREATE TABLE `images` (
  `id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `size_bytes` bigint(20) NOT NULL,
  `path` varchar(500) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `images`
--

INSERT INTO `images` (`id`, `file_name`, `mime_type`, `size_bytes`, `path`, `created_at`) VALUES
(1, 'Tulips.jpg', 'image/jpeg', 620888, 'C:/Users/TelGefferson/topologia-corpoelec/uploads/1761839539346-Tulips.jpg', '2025-10-30 15:52:19'),
(2, 'Koala.jpg', 'image/jpeg', 780831, 'C:/Users/TelGefferson/topologia-corpoelec/uploads/1761839550584-Koala.jpg', '2025-10-30 15:52:30'),
(4, 'Chrysanthemum.jpg', 'image/jpeg', 879394, 'C:/Users/TelGefferson/topologia-corpoelec/uploads/1761850774789-Chrysanthemum.jpg', '2025-10-30 18:59:34'),
(5, 'Estrctura 1.PNG', 'image/png', 14536, 'C:/Users/TelGefferson/topologia-corpoelec/uploads/1761925208648-Estrctura 1.PNG', '2025-10-31 15:40:08'),
(6, 'Sin tÃ­tulo.png', 'image/png', 6856, 'C:/Users/TelGefferson/topologia-corpoelec/uploads/1762866261578-Sin tÃ­tulo.png', '2025-11-11 13:04:21'),
(7, 'Penguins.jpg', 'image/jpeg', 777835, 'C:/Users/TelGefferson/topologia-corpoelec/uploads/1762869743511-Penguins.jpg', '2025-11-11 14:02:23'),
(8, 'Tulips.jpg', 'image/jpeg', 620888, 'C:/Users/TelGefferson/topologia-corpoelec/uploads/1762869792637-Tulips.jpg', '2025-11-11 14:03:12'),
(9, 'Penguins.jpg', 'image/jpeg', 777835, 'C:/Users/TelGefferson/topologia-corpoelec/uploads/1762869807780-Penguins.jpg', '2025-11-11 14:03:27'),
(10, 'Penguins.jpg', 'image/jpeg', 777835, 'C:/Users/TelGefferson/topologia-corpoelec/uploads/1762869812555-Penguins.jpg', '2025-11-11 14:03:32'),
(11, 'Koala.jpg', 'image/jpeg', 780831, 'C:/Users/TelGefferson/topologia-corpoelec/uploads/1762869920350-Koala.jpg', '2025-11-11 14:05:20'),
(12, 'Chrysanthemum.jpg', 'image/jpeg', 879394, 'C:/Users/TelGefferson/topologia-corpoelec/uploads/1763145698263-Chrysanthemum.jpg', '2025-11-14 18:41:38');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `login_attempts`
--

CREATE TABLE `login_attempts` (
  `id` bigint(20) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `ip` varchar(64) DEFAULT NULL,
  `success` tinyint(1) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `login_attempts`
--

INSERT INTO `login_attempts` (`id`, `user_id`, `username`, `ip`, `success`, `created_at`) VALUES
(1, 1, 'admin', '::ffff:127.0.0.1', 0, '2025-10-15 13:07:36'),
(2, 1, 'admin', '::ffff:127.0.0.1', 0, '2025-10-15 13:13:13'),
(3, 1, 'admin', '::ffff:127.0.0.1', 0, '2025-10-15 13:13:19'),
(4, 1, 'admin', '::ffff:127.0.0.1', 0, '2025-10-15 13:13:33'),
(5, 1, 'admin', '::ffff:127.0.0.1', 0, '2025-10-15 13:16:07'),
(6, 1, 'admin', '::ffff:127.0.0.1', 0, '2025-10-15 13:27:01'),
(7, 1, 'admin', '::ffff:127.0.0.1', 0, '2025-10-15 13:27:17'),
(8, 1, 'admin', '::ffff:127.0.0.1', 1, '2025-10-15 13:30:57'),
(9, 1, 'admin', '::ffff:127.0.0.1', 1, '2025-10-15 13:32:45'),
(10, 1, 'admin', '::ffff:127.0.0.1', 1, '2025-10-15 16:42:59'),
(11, 1, 'admin', '::ffff:127.0.0.1', 1, '2025-10-16 14:48:57'),
(12, 1, 'admin', '::ffff:127.0.0.1', 1, '2025-10-16 15:01:55'),
(13, 1, 'admin', '::ffff:127.0.0.1', 0, '2025-10-16 15:02:31'),
(14, 1, 'admin', '::ffff:127.0.0.1', 0, '2025-10-16 15:02:34'),
(15, 1, 'admin', '::ffff:127.0.0.1', 0, '2025-10-16 15:02:35'),
(16, 1, 'admin', '::ffff:127.0.0.1', 0, '2025-10-16 15:02:35'),
(17, 1, 'admin', '::ffff:127.0.0.1', 0, '2025-10-16 15:02:35'),
(18, 1, 'admin', '::ffff:127.0.0.1', 1, '2025-10-20 17:17:05'),
(19, 1, 'admin', '::ffff:127.0.0.1', 1, '2025-10-20 17:17:30'),
(20, 1, 'admin', '::1', 0, '2025-10-20 17:17:48'),
(21, 1, 'admin', '::1', 1, '2025-10-20 17:18:01'),
(22, 1, 'admin', '::ffff:127.0.0.1', 1, '2025-10-20 17:25:17'),
(23, 1, 'admin', '::ffff:127.0.0.1', 1, '2025-10-20 17:26:42'),
(24, 1, 'admin', '::ffff:127.0.0.1', 1, '2025-10-20 17:30:42'),
(25, 1, 'admin', '::ffff:127.0.0.1', 1, '2025-10-20 17:44:43'),
(26, 1, 'admin', '::ffff:127.0.0.1', 1, '2025-10-20 18:12:43'),
(27, 1, 'admin', '::1', 1, '2025-10-20 18:42:06'),
(28, 1, 'admin', '::1', 1, '2025-10-20 18:45:23'),
(29, 1, 'admin', '::1', 0, '2025-10-20 18:45:35'),
(30, 1, 'admin', '::1', 1, '2025-10-20 18:45:38'),
(31, 1, 'admin', '::1', 1, '2025-10-20 18:45:46'),
(32, 1, 'admin', '::1', 1, '2025-10-20 18:49:23'),
(33, 1, 'admin', '::1', 1, '2025-10-20 18:49:45'),
(34, 1, 'admin', '::ffff:127.0.0.1', 1, '2025-10-20 18:53:59'),
(35, 1, 'admin', '::ffff:127.0.0.1', 1, '2025-10-20 18:54:56'),
(36, 1, 'admin', '::1', 1, '2025-10-22 13:29:23'),
(37, 1, 'admin', '::1', 1, '2025-10-22 13:31:40'),
(38, 1, 'admin', '::1', 1, '2025-10-22 13:32:03'),
(39, 1, 'admin', '::1', 1, '2025-10-22 14:04:45'),
(40, 3, 'normal', '::1', 1, '2025-10-22 14:05:02'),
(41, 3, 'normal', '::ffff:127.0.0.1', 1, '2025-10-22 14:06:36'),
(42, 3, 'normal', '::ffff:127.0.0.1', 1, '2025-10-22 14:09:32'),
(43, 3, 'normal', '::ffff:127.0.0.1', 1, '2025-10-22 14:09:47'),
(44, 3, 'normal', '::ffff:127.0.0.1', 1, '2025-10-22 14:09:55'),
(45, 1, 'admin', '::ffff:127.0.0.1', 1, '2025-10-22 14:12:23'),
(46, 3, 'normal', '::ffff:127.0.0.1', 1, '2025-10-22 14:30:33'),
(47, 3, 'normal', '::ffff:127.0.0.1', 0, '2025-10-22 14:31:08'),
(48, 3, 'normal', '::ffff:127.0.0.1', 0, '2025-10-22 14:31:14'),
(49, 1, 'admin', '::ffff:127.0.0.1', 1, '2025-10-22 14:31:18'),
(50, 3, 'normal', '::ffff:127.0.0.1', 1, '2025-10-22 14:37:19'),
(51, 1, 'admin', '::ffff:127.0.0.1', 1, '2025-10-22 14:37:40'),
(52, 1, 'admin', '::1', 1, '2025-10-22 15:00:17'),
(53, 1, 'admin', '::ffff:127.0.0.1', 1, '2025-10-22 15:00:21'),
(54, 1, 'admin', '::ffff:127.0.0.1', 1, '2025-10-22 17:33:15'),
(55, 1, 'admin', '::ffff:127.0.0.1', 1, '2025-10-22 17:33:33'),
(56, 1, 'admin', '::ffff:127.0.0.1', 1, '2025-10-22 17:33:57'),
(57, 3, 'normal', '::ffff:127.0.0.1', 1, '2025-10-22 17:38:32'),
(58, 1, 'admin', '::ffff:127.0.0.1', 1, '2025-10-22 17:47:01'),
(59, 1, 'admin', '::ffff:127.0.0.1', 1, '2025-10-22 18:16:36'),
(60, 1, 'admin', '::1', 1, '2025-10-22 18:38:37'),
(61, 1, 'admin', '::ffff:127.0.0.1', 1, '2025-10-23 13:04:27'),
(62, 1, 'admin', '::1', 1, '2025-10-23 13:08:18'),
(63, 1, 'admin', '::1', 1, '2025-10-23 13:19:00'),
(64, 1, 'admin', '::1', 1, '2025-10-23 13:29:46'),
(65, 3, 'normal', '::1', 1, '2025-10-23 14:22:52'),
(66, 3, 'normal', '::1', 1, '2025-10-23 14:31:51'),
(67, 3, 'normal', '::1', 1, '2025-10-23 14:37:16'),
(68, 3, 'normal', '::1', 1, '2025-10-23 14:37:18'),
(69, 3, 'normal', '::1', 1, '2025-10-23 14:37:21'),
(70, 1, 'admin', '::1', 1, '2025-10-23 14:37:23'),
(71, 1, 'admin', '::1', 1, '2025-10-23 14:37:37'),
(72, 1, 'admin', '::1', 1, '2025-10-23 14:38:03'),
(73, 1, 'admin', '::1', 1, '2025-10-23 16:20:55'),
(74, 1, 'admin', '::1', 1, '2025-10-23 16:20:56'),
(75, 1, 'admin', '::1', 1, '2025-10-23 16:21:16'),
(76, 1, 'admin', '::1', 1, '2025-10-23 16:46:27'),
(77, 1, 'admin', '::1', 1, '2025-10-23 16:46:52'),
(78, 1, 'admin', '::1', 1, '2025-10-23 16:49:25'),
(79, 1, 'admin', '::1', 1, '2025-10-23 16:49:29'),
(80, 1, 'admin', '::1', 1, '2025-10-23 16:49:56'),
(81, 1, 'admin', '::1', 1, '2025-10-23 16:57:29'),
(82, 1, 'admin', '::ffff:127.0.0.1', 1, '2025-10-23 17:41:11'),
(83, 3, 'normal', '::ffff:127.0.0.1', 0, '2025-10-23 17:41:50'),
(84, 3, 'normal', '::ffff:127.0.0.1', 0, '2025-10-23 17:41:55'),
(85, 3, 'normal', '::ffff:127.0.0.1', 0, '2025-10-23 17:42:01'),
(86, 1, 'admin', '::1', 1, '2025-10-23 17:43:31'),
(87, 1, 'admin', '::1', 1, '2025-10-23 18:05:10'),
(88, 1, 'admin', '::1', 1, '2025-10-23 18:06:05'),
(89, 1, 'admin', '::1', 1, '2025-10-23 18:06:10'),
(90, 1, 'admin', '::1', 1, '2025-10-23 18:49:35'),
(91, 3, 'normal', '::1', 1, '2025-10-23 19:06:55'),
(92, 3, 'normal', '::1', 1, '2025-10-24 13:03:05'),
(93, 1, 'admin', '::1', 1, '2025-10-24 13:03:11'),
(94, 1, 'admin', '::ffff:127.0.0.1', 1, '2025-10-24 13:16:45'),
(95, 1, 'admin', '::1', 1, '2025-10-24 13:30:02'),
(96, 1, 'admin', '::1', 1, '2025-10-24 16:13:01'),
(97, 1, 'admin', '::1', 1, '2025-10-24 16:15:41'),
(98, 1, 'admin', '::1', 1, '2025-10-24 16:15:55'),
(99, 1, 'admin', '::1', 1, '2025-10-24 16:21:14'),
(100, 3, 'normal', '::1', 1, '2025-10-27 12:58:13'),
(101, 3, 'normal', '::1', 1, '2025-10-27 13:00:32'),
(102, 3, 'normal', '::1', 1, '2025-10-27 13:57:49'),
(103, 3, 'normal', '::1', 1, '2025-10-27 13:58:02'),
(104, 1, 'admin', '::1', 1, '2025-10-27 13:58:08'),
(105, 1, 'admin', '::1', 1, '2025-10-27 14:04:14'),
(106, 3, 'normal', '::1', 1, '2025-10-27 14:23:06'),
(107, 1, 'admin', '::1', 1, '2025-10-27 14:23:22'),
(108, 1, 'admin', '::1', 1, '2025-10-27 14:50:09'),
(109, 3, 'normal', '::1', 1, '2025-10-27 14:51:56'),
(110, 3, 'normal', '::1', 1, '2025-10-27 15:07:50'),
(111, 1, 'admin', '::1', 1, '2025-10-27 15:16:08'),
(112, 1, 'admin', '::1', 1, '2025-10-27 15:48:06'),
(113, 1, 'admin', '::1', 1, '2025-10-27 15:48:41'),
(114, 1, 'admin', '::1', 1, '2025-10-27 17:43:54'),
(115, 3, 'normal', '::1', 1, '2025-10-27 17:48:18'),
(116, 1, 'admin', '::1', 1, '2025-10-27 17:48:23'),
(117, 3, 'normal', '::1', 1, '2025-10-27 17:49:11'),
(118, 1, 'admin', '::1', 1, '2025-10-27 18:35:43'),
(119, 1, 'admin', '::1', 1, '2025-10-27 19:17:51'),
(120, 1, 'admin', '::1', 1, '2025-10-27 19:19:53'),
(121, 1, 'admin', '::1', 1, '2025-10-27 19:24:10'),
(122, 1, 'admin', '::1', 1, '2025-10-27 19:29:09'),
(123, 3, 'normal', '::1', 1, '2025-10-28 13:42:52'),
(124, 1, 'admin', '::1', 1, '2025-10-28 13:42:58'),
(125, 1, 'admin', '::1', 1, '2025-10-28 14:03:31'),
(126, 1, 'admin', '::1', 1, '2025-10-28 14:39:51'),
(127, 1, 'admin', '::1', 1, '2025-10-28 14:39:53'),
(128, 1, 'admin', '::1', 1, '2025-10-28 14:39:54'),
(129, 1, 'admin', '::1', 1, '2025-10-28 14:41:04'),
(130, 1, 'admin', '::1', 1, '2025-10-28 14:41:05'),
(131, 1, 'admin', '::1', 1, '2025-10-28 14:41:28'),
(132, 1, 'admin', '::1', 1, '2025-10-28 14:41:29'),
(133, 1, 'admin', '::1', 1, '2025-10-28 14:41:30'),
(134, 1, 'admin', '::1', 1, '2025-10-28 14:42:06'),
(135, 1, 'admin', '::1', 1, '2025-10-28 14:42:46'),
(136, 1, 'admin', '::1', 1, '2025-10-28 14:43:14'),
(137, 1, 'admin', '::1', 1, '2025-10-28 14:43:44'),
(138, 1, 'admin', '::1', 1, '2025-10-28 14:43:49'),
(139, 1, 'admin', '::1', 1, '2025-10-28 14:44:26'),
(140, 1, 'admin', '::1', 1, '2025-10-28 14:44:43'),
(141, 1, 'admin', '::1', 1, '2025-10-28 14:44:45'),
(142, 1, 'admin', '::1', 1, '2025-10-28 14:44:45'),
(143, 1, 'admin', '::1', 1, '2025-10-28 14:44:46'),
(144, 1, 'admin', '::1', 1, '2025-10-28 14:44:55'),
(145, 1, 'admin', '::1', 1, '2025-10-28 14:44:56'),
(146, 1, 'admin', '::1', 1, '2025-10-28 14:44:57'),
(147, 1, 'admin', '::1', 1, '2025-10-28 14:45:12'),
(148, 1, 'admin', '::1', 1, '2025-10-28 18:13:44'),
(149, 1, 'admin', '::1', 1, '2025-10-28 18:14:43'),
(150, 3, 'normal', '::1', 1, '2025-10-28 18:16:56'),
(151, 1, 'admin', '::1', 1, '2025-10-28 18:17:54'),
(152, 1, 'admin', '::1', 1, '2025-10-28 19:06:07'),
(153, 3, 'normal', '::1', 1, '2025-10-29 15:07:52'),
(154, 1, 'admin', '::1', 1, '2025-10-29 15:08:25'),
(155, 1, 'admin', '::1', 1, '2025-10-29 16:39:38'),
(156, 1, 'admin', '::1', 1, '2025-10-29 18:17:59'),
(157, 1, 'admin', '::1', 1, '2025-10-29 18:30:33'),
(158, 1, 'admin', '::ffff:127.0.0.1', 1, '2025-10-30 13:31:44'),
(159, 1, 'admin', '::1', 1, '2025-10-30 14:33:06'),
(160, 1, 'admin', '::1', 1, '2025-10-30 14:59:59'),
(161, 1, 'admin', '::1', 1, '2025-10-30 15:21:50'),
(162, 3, 'normal', '::1', 1, '2025-10-30 15:22:21'),
(163, 3, 'normal', '::1', 1, '2025-10-30 15:25:37'),
(164, 1, 'admin', '::1', 1, '2025-10-30 15:27:44'),
(165, 1, 'admin', '::1', 1, '2025-10-30 15:32:12'),
(166, 1, 'admin', '::1', 1, '2025-10-30 16:24:07'),
(167, 1, 'admin', '::1', 1, '2025-10-30 17:49:11'),
(168, 1, 'admin', '::1', 1, '2025-10-30 17:53:37'),
(169, 1, 'admin', '::1', 1, '2025-10-30 17:54:27'),
(170, 3, 'normal', '::1', 1, '2025-10-30 17:54:36'),
(171, 1, 'admin', '::1', 1, '2025-10-30 18:02:18'),
(172, 1, 'admin', '::1', 1, '2025-10-30 18:08:35'),
(173, 1, 'admin', '::1', 1, '2025-10-30 18:13:53'),
(174, 1, 'admin', '::1', 1, '2025-10-30 18:14:43'),
(175, 1, 'admin', '::1', 1, '2025-10-30 18:23:06'),
(176, 1, 'admin', '::1', 1, '2025-10-30 18:24:14'),
(177, 1, 'admin', '::1', 1, '2025-10-30 18:26:44'),
(178, 1, 'admin', '::1', 1, '2025-10-30 18:33:08'),
(179, 1, 'admin', '::1', 1, '2025-10-30 18:59:12'),
(180, 1, 'admin', '::1', 1, '2025-10-30 19:01:23'),
(181, 3, 'normal', '::1', 1, '2025-10-31 14:34:05'),
(182, 1, 'admin', '::1', 1, '2025-10-31 14:34:13'),
(183, 1, 'admin', '::1', 1, '2025-10-31 15:24:32'),
(184, 1, 'admin', '::1', 1, '2025-11-03 15:02:29'),
(185, 1, 'admin', '::1', 1, '2025-11-04 17:38:12'),
(186, 1, 'admin', '::1', 1, '2025-11-06 14:37:03'),
(187, 1, 'admin', '::1', 1, '2025-11-06 14:37:21'),
(188, 1, 'admin', '::1', 1, '2025-11-06 14:56:23'),
(189, 1, 'admin', '::1', 1, '2025-11-06 15:44:30'),
(190, 1, 'admin', '::1', 1, '2025-11-06 15:56:28'),
(191, 1, 'admin', '::1', 1, '2025-11-06 17:31:21'),
(192, 1, 'admin', '::1', 1, '2025-11-07 13:24:19'),
(193, 1, 'admin', '::1', 1, '2025-11-07 13:57:54'),
(194, 1, 'admin', '::1', 1, '2025-11-07 14:10:08'),
(195, 1, 'admin', '::1', 1, '2025-11-07 14:11:51'),
(196, 1, 'admin', '::1', 1, '2025-11-10 15:29:41'),
(197, 1, 'admin', '::1', 1, '2025-11-10 17:53:35'),
(198, 1, 'admin', '::1', 1, '2025-11-10 17:54:18'),
(199, 1, 'admin', '::1', 1, '2025-11-10 17:55:13'),
(200, 1, 'admin', '::1', 1, '2025-11-11 14:05:55'),
(201, 1, 'admin', '::1', 1, '2025-11-12 14:46:55'),
(202, 1, 'admin', '::1', 1, '2025-11-14 17:34:11'),
(203, 1, 'admin', '::1', 1, '2025-11-14 17:34:36'),
(204, 1, 'admin', '::1', 1, '2025-11-14 17:39:27'),
(205, 1, 'admin', '::1', 1, '2025-11-14 18:08:22'),
(206, 1, 'admin', '::1', 1, '2025-11-14 18:10:31'),
(207, 1, 'admin', '::1', 1, '2025-11-14 18:11:42'),
(208, 1, 'admin', '::1', 1, '2025-11-24 13:07:54'),
(209, 1, 'admin', '::1', 1, '2025-11-24 13:11:55'),
(210, 1, 'admin', '::1', 1, '2025-11-28 18:00:35'),
(211, 1, 'admin', '::1', 1, '2025-11-28 18:00:41'),
(212, 1, 'admin', '::1', 1, '2025-12-01 13:38:48'),
(213, 3, 'normal', '::1', 1, '2025-12-01 13:45:40'),
(214, 1, 'admin', '::1', 1, '2025-12-01 13:45:52'),
(215, 3, 'normal', '::ffff:127.0.0.1', 1, '2025-12-01 18:17:44'),
(216, 1, 'admin', '::1', 1, '2025-12-01 18:18:31'),
(217, 1, 'admin', '::1', 1, '2025-12-01 18:18:53'),
(218, 1, 'admin', '::1', 1, '2025-12-01 18:20:49'),
(219, 1, 'admin', '::1', 1, '2025-12-01 18:21:38'),
(220, 1, 'admin', '::1', 1, '2025-12-01 18:30:00'),
(221, 1, 'admin', '::1', 1, '2025-12-01 18:30:34'),
(222, 1, 'admin', '::1', 1, '2025-12-01 18:31:17'),
(223, 1, 'admin', '::1', 1, '2025-12-01 18:33:59'),
(224, 1, 'admin', '::1', 1, '2025-12-01 18:56:58'),
(225, 1, 'admin', '::1', 1, '2025-12-01 18:57:56'),
(226, 1, 'admin', '::1', 1, '2025-12-01 18:58:54'),
(227, 3, 'normal', '::1', 1, '2025-12-01 19:01:45'),
(228, 1, 'admin', '::1', 1, '2025-12-01 19:09:40'),
(229, 3, 'normal', '::1', 1, '2025-12-01 19:10:03'),
(230, 3, 'normal', '::1', 1, '2025-12-01 19:11:57'),
(231, 1, 'admin', '::1', 1, '2025-12-01 19:12:46'),
(232, 3, 'normal', '::1', 1, '2025-12-01 19:16:26'),
(233, 3, 'normal', '::1', 1, '2025-12-01 19:17:54'),
(234, 1, 'admin', '::1', 1, '2025-12-01 19:32:33'),
(235, 3, 'normal', '::1', 1, '2025-12-01 19:33:10'),
(236, 1, 'admin', '::1', 1, '2025-12-01 19:33:17'),
(237, 1, 'admin', '::1', 1, '2025-12-01 19:33:51'),
(238, 3, 'normal', '::1', 1, '2025-12-01 19:34:10'),
(239, 1, 'admin', '::1', 1, '2025-12-01 19:49:26'),
(240, 1, 'admin', '::1', 1, '2025-12-01 19:57:43'),
(241, 1, 'admin', '::1', 1, '2025-12-02 14:47:04'),
(242, 1, 'admin', '::1', 1, '2025-12-02 14:53:17'),
(243, 1, 'admin', '::1', 1, '2025-12-03 12:46:54'),
(244, 1, 'admin', '::1', 1, '2025-12-03 12:47:05'),
(245, 1, 'admin', '::1', 1, '2025-12-03 12:47:25'),
(246, 3, 'normal', '::1', 1, '2025-12-03 12:51:51'),
(247, 3, 'normal', '::1', 1, '2025-12-03 12:52:37'),
(248, 1, 'admin', '::1', 1, '2025-12-03 12:53:18'),
(249, 1, 'admin', '::1', 1, '2025-12-03 15:00:53'),
(250, 1, 'admin', '::1', 1, '2025-12-03 15:02:44'),
(251, 1, 'admin', '::1', 1, '2025-12-03 16:00:52'),
(252, 1, 'admin', '::1', 1, '2025-12-03 17:46:58'),
(253, 1, 'admin', '::1', 1, '2025-12-03 17:50:34'),
(254, 1, 'admin', '::1', 1, '2025-12-03 17:51:56'),
(255, 1, 'admin', '::1', 1, '2025-12-04 14:29:39'),
(256, 3, 'normal', '::1', 1, '2025-12-04 14:47:54'),
(257, 1, 'admin', '::1', 1, '2025-12-04 14:52:43');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `networks`
--

CREATE TABLE `networks` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `type` enum('wifi','switch') NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `networks`
--

INSERT INTO `networks` (`id`, `name`, `type`, `description`, `created_at`) VALUES
(1, 'Red WiFi Principal', 'wifi', 'Cobertura WiFi', '2025-10-14 17:51:23'),
(2, 'Backbone de Switches', 'switch', 'Distribución cableada', '2025-10-14 17:51:23'),
(3, 'AP-01', 'wifi', NULL, '2025-10-22 17:37:00'),
(4, 'test', '', NULL, '2025-10-23 16:57:17'),
(5, 'ConexioN Nueva', 'switch', NULL, '2025-10-23 17:45:05'),
(6, 'Router', 'switch', 'DJASDJASJDA', '2025-10-27 14:22:19'),
(7, 'Router', 'switch', 'adsada', '2025-10-27 14:23:32'),
(8, 'Router', 'wifi', 'adsada', '2025-10-27 14:23:34'),
(9, 'SWTICHES', 'wifi', 'DASDASDA', '2025-10-27 18:37:06');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ping_logs`
--

CREATE TABLE `ping_logs` (
  `id` bigint(20) NOT NULL,
  `device_id` int(11) NOT NULL,
  `success` tinyint(1) NOT NULL,
  `latency_ms` int(11) DEFAULT NULL,
  `ran_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ports`
--

CREATE TABLE `ports` (
  `id` int(11) NOT NULL,
  `device_id` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `kind` enum('fast-ethernet','gigabit-ethernet','wifi','sfp','sfp+','other') DEFAULT 'other',
  `speed_mbps` int(11) DEFAULT NULL,
  `admin_status` enum('up','down') DEFAULT 'up',
  `oper_status` enum('up','down') DEFAULT 'down',
  `position` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ports`
--

INSERT INTO `ports` (`id`, `device_id`, `name`, `kind`, `speed_mbps`, `admin_status`, `oper_status`, `position`, `notes`, `created_at`, `updated_at`) VALUES
(116, 152, 'Gi0/1', 'gigabit-ethernet', 1000, 'up', 'down', 1, NULL, '2025-11-14 17:39:15', '2025-11-14 17:39:15'),
(117, 152, 'Gi0/2', 'gigabit-ethernet', 1000, 'up', 'down', 2, NULL, '2025-11-14 17:39:15', '2025-11-14 17:39:15'),
(118, 152, 'Gi0/3', 'gigabit-ethernet', 1000, 'up', 'down', 3, NULL, '2025-11-14 17:39:15', '2025-11-14 17:39:15'),
(119, 152, 'Gi0/4', 'gigabit-ethernet', 1000, 'up', 'down', 4, NULL, '2025-11-14 17:39:15', '2025-11-14 17:39:15'),
(120, 152, 'Gi0/5', 'gigabit-ethernet', 1000, 'up', 'down', 5, NULL, '2025-11-14 17:39:15', '2025-11-14 17:39:15'),
(121, 152, 'Gi0/6', 'gigabit-ethernet', 1000, 'up', 'down', 6, NULL, '2025-11-14 17:39:15', '2025-11-14 17:39:15'),
(122, 152, 'Gi0/7', 'gigabit-ethernet', 1000, 'up', 'down', 7, NULL, '2025-11-14 17:39:15', '2025-11-14 17:39:15'),
(123, 152, 'Gi0/8', 'gigabit-ethernet', 1000, 'up', 'down', 8, NULL, '2025-11-14 17:39:15', '2025-11-14 17:39:15'),
(124, 152, 'Gi0/9', 'gigabit-ethernet', 1000, 'up', 'down', 9, NULL, '2025-11-14 17:39:15', '2025-11-14 17:39:15'),
(125, 152, 'Gi0/10', 'gigabit-ethernet', 1000, 'up', 'down', 10, NULL, '2025-11-14 17:39:15', '2025-11-14 17:39:15'),
(126, 152, 'Gi0/11', 'gigabit-ethernet', 1000, 'up', 'down', 11, NULL, '2025-11-14 17:39:15', '2025-11-14 17:39:15'),
(127, 152, 'Gi0/12', 'gigabit-ethernet', 1000, 'up', 'down', 12, NULL, '2025-11-14 17:39:15', '2025-11-14 17:39:15'),
(128, 152, 'Gi0/13', 'gigabit-ethernet', 1000, 'up', 'down', 13, NULL, '2025-11-14 17:39:15', '2025-11-14 17:39:15'),
(129, 152, 'Gi0/14', 'gigabit-ethernet', 1000, 'up', 'down', 14, NULL, '2025-11-14 17:39:15', '2025-11-14 17:39:15'),
(130, 152, 'Gi0/15', 'gigabit-ethernet', 1000, 'up', 'down', 15, NULL, '2025-11-14 17:39:15', '2025-11-14 17:39:15'),
(131, 152, 'Gi0/16', 'gigabit-ethernet', 1000, 'up', 'down', 16, NULL, '2025-11-14 17:39:15', '2025-11-14 17:39:15'),
(132, 152, 'Gi0/17', 'gigabit-ethernet', 1000, 'up', 'down', 17, NULL, '2025-11-14 17:39:15', '2025-11-14 17:39:15'),
(133, 152, 'Gi0/18', 'gigabit-ethernet', 1000, 'up', 'down', 18, NULL, '2025-11-14 17:39:15', '2025-11-14 17:39:15'),
(134, 152, 'Gi0/19', 'gigabit-ethernet', 1000, 'up', 'down', 19, NULL, '2025-11-14 17:39:15', '2025-11-14 17:39:15'),
(135, 152, 'Gi0/20', 'gigabit-ethernet', 1000, 'up', 'down', 20, NULL, '2025-11-14 17:39:16', '2025-11-14 17:39:16'),
(136, 152, 'Gi0/21', 'gigabit-ethernet', 1000, 'up', 'down', 21, NULL, '2025-11-14 17:39:16', '2025-11-14 17:39:16'),
(137, 152, 'Gi0/22', 'gigabit-ethernet', 1000, 'up', 'down', 22, NULL, '2025-11-14 17:39:16', '2025-11-14 17:39:16'),
(138, 152, 'Gi0/23', 'gigabit-ethernet', 1000, 'up', 'down', 23, NULL, '2025-11-14 17:39:16', '2025-11-14 17:39:16'),
(139, 152, 'Gi0/24', 'gigabit-ethernet', 1000, 'up', 'down', 24, NULL, '2025-11-14 17:39:16', '2025-11-14 17:39:16'),
(140, 152, 'Gi0/25', 'gigabit-ethernet', 1000, 'up', 'down', 25, NULL, '2025-11-14 17:39:16', '2025-11-14 17:39:16'),
(141, 152, 'Gi0/26', 'gigabit-ethernet', 1000, 'up', 'down', 26, NULL, '2025-11-14 17:39:16', '2025-11-14 17:39:16'),
(142, 152, 'Gi0/27', 'gigabit-ethernet', 1000, 'up', 'down', 27, NULL, '2025-11-14 17:39:16', '2025-11-14 17:39:16'),
(143, 152, 'Gi0/28', 'gigabit-ethernet', 1000, 'up', 'down', 28, NULL, '2025-11-14 17:39:16', '2025-11-14 17:39:16'),
(144, 153, 'Gi0/1', 'gigabit-ethernet', 1000, 'up', 'down', 1, NULL, '2025-11-14 17:40:49', '2025-11-14 17:40:49'),
(145, 153, 'Gi0/2', 'gigabit-ethernet', 1000, 'up', 'down', 2, NULL, '2025-11-14 17:40:49', '2025-11-14 17:40:49'),
(146, 153, 'Gi0/3', 'gigabit-ethernet', 1000, 'up', 'down', 3, NULL, '2025-11-14 17:40:49', '2025-11-14 17:40:49'),
(147, 153, 'Gi0/4', 'gigabit-ethernet', 1000, 'up', 'down', 4, NULL, '2025-11-14 17:40:49', '2025-11-14 17:40:49'),
(148, 153, 'Gi0/5', 'gigabit-ethernet', 1000, 'up', 'down', 5, NULL, '2025-11-14 17:40:49', '2025-11-14 17:40:49'),
(149, 153, 'Gi0/6', 'gigabit-ethernet', 1000, 'up', 'down', 6, NULL, '2025-11-14 17:40:49', '2025-11-14 17:40:49'),
(150, 153, 'Gi0/7', 'gigabit-ethernet', 1000, 'up', 'down', 7, NULL, '2025-11-14 17:40:49', '2025-11-14 17:40:49'),
(151, 153, 'Gi0/8', 'gigabit-ethernet', 1000, 'up', 'down', 8, NULL, '2025-11-14 17:40:49', '2025-11-14 17:40:49'),
(152, 153, 'Gi0/9', 'gigabit-ethernet', 1000, 'up', 'down', 9, NULL, '2025-11-14 17:40:49', '2025-11-14 17:40:49'),
(153, 153, 'Gi0/10', 'gigabit-ethernet', 1000, 'up', 'down', 10, NULL, '2025-11-14 17:40:49', '2025-11-14 17:40:49'),
(154, 153, 'Gi0/11', 'gigabit-ethernet', 1000, 'up', 'down', 11, NULL, '2025-11-14 17:40:49', '2025-11-14 17:40:49'),
(155, 153, 'Gi0/12', 'gigabit-ethernet', 1000, 'up', 'down', 12, NULL, '2025-11-14 17:40:49', '2025-11-14 17:40:49'),
(156, 153, 'Gi0/13', 'gigabit-ethernet', 1000, 'up', 'down', 13, NULL, '2025-11-14 17:40:49', '2025-11-14 17:40:49'),
(157, 153, 'Gi0/14', 'gigabit-ethernet', 1000, 'up', 'down', 14, NULL, '2025-11-14 17:40:49', '2025-11-14 17:40:49'),
(158, 153, 'Gi0/15', 'gigabit-ethernet', 1000, 'up', 'down', 15, NULL, '2025-11-14 17:40:49', '2025-11-14 17:40:49'),
(159, 153, 'Gi0/16', 'gigabit-ethernet', 1000, 'up', 'down', 16, NULL, '2025-11-14 17:40:49', '2025-11-14 17:40:49'),
(160, 153, 'Gi0/17', 'gigabit-ethernet', 1000, 'up', 'down', 17, NULL, '2025-11-14 17:40:49', '2025-11-14 17:40:49'),
(161, 153, 'Gi0/18', 'gigabit-ethernet', 1000, 'up', 'down', 18, NULL, '2025-11-14 17:40:49', '2025-11-14 17:40:49'),
(162, 153, 'Gi0/19', 'gigabit-ethernet', 1000, 'up', 'down', 19, NULL, '2025-11-14 17:40:49', '2025-11-14 17:40:49'),
(163, 153, 'Gi0/20', 'gigabit-ethernet', 1000, 'up', 'down', 20, NULL, '2025-11-14 17:40:50', '2025-11-14 17:40:50'),
(164, 153, 'Gi0/21', 'gigabit-ethernet', 1000, 'up', 'down', 21, NULL, '2025-11-14 17:40:50', '2025-11-14 17:40:50'),
(165, 153, 'Gi0/22', 'gigabit-ethernet', 1000, 'up', 'down', 22, NULL, '2025-11-14 17:40:50', '2025-11-14 17:40:50'),
(166, 153, 'Gi0/23', 'gigabit-ethernet', 1000, 'up', 'down', 23, NULL, '2025-11-14 17:40:50', '2025-11-14 17:40:50'),
(167, 153, 'Gi0/24', 'gigabit-ethernet', 1000, 'up', 'down', 24, NULL, '2025-11-14 17:40:50', '2025-11-14 17:40:50'),
(168, 153, 'Gi0/25', 'gigabit-ethernet', 1000, 'up', 'down', 25, NULL, '2025-11-14 17:40:50', '2025-11-14 17:40:50'),
(169, 153, 'Gi0/26', 'gigabit-ethernet', 1000, 'up', 'down', 26, NULL, '2025-11-14 17:40:50', '2025-11-14 17:40:50'),
(178, 155, 'Fa0/1', 'fast-ethernet', 100, 'up', 'down', 1, NULL, '2025-11-14 17:42:13', '2025-11-14 17:42:13'),
(179, 155, 'Fa0/2', 'fast-ethernet', 100, 'up', 'down', 2, NULL, '2025-11-14 17:42:14', '2025-11-14 17:42:14'),
(180, 155, 'Fa0/3', 'fast-ethernet', 100, 'up', 'down', 3, NULL, '2025-11-14 17:42:14', '2025-11-14 17:42:14'),
(181, 155, 'Fa0/4', 'fast-ethernet', 100, 'up', 'down', 4, NULL, '2025-11-14 17:42:14', '2025-11-14 17:42:14'),
(182, 155, 'Fa0/5', 'fast-ethernet', 100, 'up', 'down', 5, NULL, '2025-11-14 17:42:14', '2025-11-14 17:42:14'),
(183, 155, 'Fa0/6', 'fast-ethernet', 100, 'up', 'down', 6, NULL, '2025-11-14 17:42:14', '2025-11-14 17:42:14'),
(184, 155, 'Fa0/7', 'fast-ethernet', 100, 'up', 'down', 7, NULL, '2025-11-14 17:42:14', '2025-11-14 17:42:14'),
(185, 155, 'Fa0/8', 'fast-ethernet', 100, 'up', 'down', 8, NULL, '2025-11-14 17:42:14', '2025-11-14 17:42:14'),
(186, 155, 'Fa0/9', 'fast-ethernet', 100, 'up', 'down', 9, NULL, '2025-11-14 17:42:14', '2025-11-14 17:42:14'),
(187, 155, 'Fa0/10', 'fast-ethernet', 100, 'up', 'down', 10, NULL, '2025-11-14 17:42:14', '2025-11-14 17:42:14'),
(188, 155, 'Fa0/11', 'fast-ethernet', 100, 'up', 'down', 11, NULL, '2025-11-14 17:42:14', '2025-11-14 17:42:14'),
(189, 155, 'Fa0/12', 'fast-ethernet', 100, 'up', 'down', 12, NULL, '2025-11-14 17:42:14', '2025-11-14 17:42:14'),
(190, 155, 'Fa0/13', 'fast-ethernet', 100, 'up', 'down', 13, NULL, '2025-11-14 17:42:14', '2025-11-14 17:42:14'),
(191, 155, 'Fa0/14', 'fast-ethernet', 100, 'up', 'down', 14, NULL, '2025-11-14 17:42:14', '2025-11-14 17:42:14'),
(192, 155, 'Fa0/15', 'fast-ethernet', 100, 'up', 'down', 15, NULL, '2025-11-14 17:42:14', '2025-11-14 17:42:14'),
(193, 155, 'Fa0/16', 'fast-ethernet', 100, 'up', 'down', 16, NULL, '2025-11-14 17:42:14', '2025-11-14 17:42:14'),
(194, 156, 'Gi0/1', 'gigabit-ethernet', 1000, 'up', 'down', 1, NULL, '2025-11-14 17:43:16', '2025-11-14 17:43:16'),
(195, 156, 'Gi0/2', 'gigabit-ethernet', 1000, 'up', 'down', 2, NULL, '2025-11-14 17:43:16', '2025-11-14 17:43:16'),
(196, 156, 'Gi0/3', 'gigabit-ethernet', 1000, 'up', 'down', 3, NULL, '2025-11-14 17:43:16', '2025-11-14 17:43:16'),
(197, 156, 'Gi0/4', 'gigabit-ethernet', 1000, 'up', 'down', 4, NULL, '2025-11-14 17:43:16', '2025-11-14 17:43:16'),
(198, 156, 'Gi0/5', 'gigabit-ethernet', 1000, 'up', 'down', 5, NULL, '2025-11-14 17:43:16', '2025-11-14 17:43:16'),
(199, 156, 'Gi0/6', 'gigabit-ethernet', 1000, 'up', 'down', 6, NULL, '2025-11-14 17:43:16', '2025-11-14 17:43:16'),
(200, 156, 'Gi0/7', 'gigabit-ethernet', 1000, 'up', 'down', 7, NULL, '2025-11-14 17:43:16', '2025-11-14 17:43:16'),
(201, 156, 'Gi0/8', 'gigabit-ethernet', 1000, 'up', 'down', 8, NULL, '2025-11-14 17:43:16', '2025-11-14 17:43:16'),
(202, 156, 'Gi0/9', 'gigabit-ethernet', 1000, 'up', 'down', 9, NULL, '2025-11-14 17:43:16', '2025-11-14 17:43:16'),
(203, 156, 'Gi0/10', 'gigabit-ethernet', 1000, 'up', 'down', 10, NULL, '2025-11-14 17:43:16', '2025-11-14 17:43:16'),
(204, 156, 'Gi0/11', 'gigabit-ethernet', 1000, 'up', 'down', 11, NULL, '2025-11-14 17:43:16', '2025-11-14 17:43:16'),
(205, 156, 'Gi0/12', 'gigabit-ethernet', 1000, 'up', 'down', 12, NULL, '2025-11-14 17:43:16', '2025-11-14 17:43:16'),
(206, 156, 'Gi0/13', 'gigabit-ethernet', 1000, 'up', 'down', 13, NULL, '2025-11-14 17:43:16', '2025-11-14 17:43:16'),
(207, 156, 'Gi0/14', 'gigabit-ethernet', 1000, 'up', 'down', 14, NULL, '2025-11-14 17:43:16', '2025-11-14 17:43:16'),
(208, 156, 'Gi0/15', 'gigabit-ethernet', 1000, 'up', 'down', 15, NULL, '2025-11-14 17:43:16', '2025-11-14 17:43:16'),
(209, 156, 'Gi0/16', 'gigabit-ethernet', 1000, 'up', 'down', 16, NULL, '2025-11-14 17:43:16', '2025-11-14 17:43:16'),
(210, 156, 'Gi0/17', 'gigabit-ethernet', 1000, 'up', 'down', 17, NULL, '2025-11-14 17:43:16', '2025-11-14 17:43:16'),
(211, 156, 'Gi0/18', 'gigabit-ethernet', 1000, 'up', 'down', 18, NULL, '2025-11-14 17:43:16', '2025-11-14 17:43:16'),
(212, 156, 'Gi0/19', 'gigabit-ethernet', 1000, 'up', 'down', 19, NULL, '2025-11-14 17:43:16', '2025-11-14 17:43:16'),
(213, 156, 'Gi0/20', 'gigabit-ethernet', 1000, 'up', 'down', 20, NULL, '2025-11-14 17:43:16', '2025-11-14 17:43:16'),
(214, 156, 'Gi0/21', 'gigabit-ethernet', 1000, 'up', 'down', 21, NULL, '2025-11-14 17:43:16', '2025-11-14 17:43:16'),
(215, 156, 'Gi0/22', 'gigabit-ethernet', 1000, 'up', 'down', 22, NULL, '2025-11-14 17:43:16', '2025-11-14 17:43:16'),
(216, 156, 'Gi0/23', 'gigabit-ethernet', 1000, 'up', 'down', 23, NULL, '2025-11-14 17:43:16', '2025-11-14 17:43:16'),
(217, 156, 'Gi0/24', 'gigabit-ethernet', 1000, 'up', 'down', 24, NULL, '2025-11-14 17:43:17', '2025-11-14 17:43:17'),
(218, 156, 'Gi0/25', 'gigabit-ethernet', 1000, 'up', 'down', 25, NULL, '2025-11-14 17:43:17', '2025-11-14 17:43:17'),
(219, 156, 'Gi0/26', 'gigabit-ethernet', 1000, 'up', 'down', 26, NULL, '2025-11-14 17:43:17', '2025-11-14 17:43:17'),
(220, 157, 'Fa0/1', 'fast-ethernet', 100, 'up', 'down', 1, NULL, '2025-11-14 17:44:12', '2025-11-14 17:44:12'),
(221, 157, 'Fa0/2', 'fast-ethernet', 100, 'up', 'down', 2, NULL, '2025-11-14 17:44:12', '2025-11-14 17:44:12'),
(222, 157, 'Fa0/3', 'fast-ethernet', 100, 'up', 'down', 3, NULL, '2025-11-14 17:44:12', '2025-11-14 17:44:12'),
(223, 157, 'Fa0/4', 'fast-ethernet', 100, 'up', 'down', 4, NULL, '2025-11-14 17:44:12', '2025-11-14 17:44:12'),
(224, 158, 'Gi0/1', 'gigabit-ethernet', 1000, 'up', 'down', 1, NULL, '2025-11-14 17:53:52', '2025-11-14 17:53:52'),
(225, 158, 'Gi0/2', 'gigabit-ethernet', 1000, 'up', 'down', 2, NULL, '2025-11-14 17:53:52', '2025-11-14 17:53:52'),
(226, 158, 'Gi0/3', 'gigabit-ethernet', 1000, 'up', 'down', 3, NULL, '2025-11-14 17:53:52', '2025-11-14 17:53:52'),
(227, 158, 'Gi0/4', 'gigabit-ethernet', 1000, 'up', 'down', 4, NULL, '2025-11-14 17:53:52', '2025-11-14 17:53:52'),
(228, 158, 'Gi0/5', 'gigabit-ethernet', 1000, 'up', 'down', 5, NULL, '2025-11-14 17:53:52', '2025-11-14 17:53:52'),
(229, 158, 'Gi0/6', 'gigabit-ethernet', 1000, 'up', 'down', 6, NULL, '2025-11-14 17:53:52', '2025-11-14 17:53:52'),
(230, 158, 'Gi0/7', 'gigabit-ethernet', 1000, 'up', 'down', 7, NULL, '2025-11-14 17:53:52', '2025-11-14 17:53:52'),
(231, 158, 'Gi0/8', 'gigabit-ethernet', 1000, 'up', 'down', 8, NULL, '2025-11-14 17:53:52', '2025-11-14 17:53:52'),
(232, 158, 'Gi0/9', 'gigabit-ethernet', 1000, 'up', 'down', 9, NULL, '2025-11-14 17:53:52', '2025-11-14 17:53:52'),
(233, 158, 'Gi0/10', 'gigabit-ethernet', 1000, 'up', 'down', 10, NULL, '2025-11-14 17:53:52', '2025-11-14 17:53:52'),
(234, 159, 'Gi0/1', 'gigabit-ethernet', 1000, 'up', 'down', 1, NULL, '2025-11-14 17:54:32', '2025-11-14 17:54:32'),
(235, 159, 'Gi0/2', 'gigabit-ethernet', 1000, 'up', 'down', 2, NULL, '2025-11-14 17:54:32', '2025-11-14 17:54:32'),
(236, 159, 'Gi0/3', 'gigabit-ethernet', 1000, 'up', 'down', 3, NULL, '2025-11-14 17:54:33', '2025-11-14 17:54:33'),
(237, 159, 'Gi0/4', 'gigabit-ethernet', 1000, 'up', 'down', 4, NULL, '2025-11-14 17:54:33', '2025-11-14 17:54:33'),
(238, 159, 'Gi0/5', 'gigabit-ethernet', 1000, 'up', 'down', 5, NULL, '2025-11-14 17:54:33', '2025-11-14 17:54:33'),
(239, 159, 'Gi0/6', 'gigabit-ethernet', 1000, 'up', 'down', 6, NULL, '2025-11-14 17:54:33', '2025-11-14 17:54:33'),
(240, 159, 'Gi0/7', 'gigabit-ethernet', 1000, 'up', 'down', 7, NULL, '2025-11-14 17:54:33', '2025-11-14 17:54:33'),
(241, 159, 'Gi0/8', 'gigabit-ethernet', 1000, 'up', 'down', 8, NULL, '2025-11-14 17:54:33', '2025-11-14 17:54:33'),
(242, 159, 'Gi0/9', 'gigabit-ethernet', 1000, 'up', 'down', 9, NULL, '2025-11-14 17:54:33', '2025-11-14 17:54:33'),
(243, 162, 'Gi0/1', 'gigabit-ethernet', 1000, 'up', 'down', 1, NULL, '2025-11-14 18:01:02', '2025-11-14 18:01:02'),
(244, 162, 'Gi0/2', 'gigabit-ethernet', 1000, 'up', 'down', 2, NULL, '2025-11-14 18:01:02', '2025-11-14 18:01:02'),
(245, 162, 'Gi0/3', 'gigabit-ethernet', 1000, 'up', 'down', 3, NULL, '2025-11-14 18:01:02', '2025-11-14 18:01:02'),
(246, 162, 'Gi0/4', 'gigabit-ethernet', 1000, 'up', 'down', 4, NULL, '2025-11-14 18:01:02', '2025-11-14 18:01:02'),
(247, 162, 'Gi0/5', 'gigabit-ethernet', 1000, 'up', 'down', 5, NULL, '2025-11-14 18:01:02', '2025-11-14 18:01:02'),
(248, 162, 'Gi0/6', 'gigabit-ethernet', 1000, 'up', 'down', 6, NULL, '2025-11-14 18:01:02', '2025-11-14 18:01:02'),
(249, 162, 'Gi0/7', 'gigabit-ethernet', 1000, 'up', 'down', 7, NULL, '2025-11-14 18:01:02', '2025-11-14 18:01:02'),
(250, 162, 'Gi0/8', 'gigabit-ethernet', 1000, 'up', 'down', 8, NULL, '2025-11-14 18:01:02', '2025-11-14 18:01:02'),
(251, 162, 'Gi0/9', 'gigabit-ethernet', 1000, 'up', 'down', 9, NULL, '2025-11-14 18:01:02', '2025-11-14 18:01:02'),
(252, 162, 'Gi0/10', 'gigabit-ethernet', 1000, 'up', 'down', 10, NULL, '2025-11-14 18:01:02', '2025-11-14 18:01:02'),
(253, 162, 'Gi0/11', 'gigabit-ethernet', 1000, 'up', 'down', 11, NULL, '2025-11-14 18:01:02', '2025-11-14 18:01:02'),
(254, 162, 'Gi0/12', 'gigabit-ethernet', 1000, 'up', 'down', 12, NULL, '2025-11-14 18:01:02', '2025-11-14 18:01:02'),
(255, 162, 'Gi0/13', 'gigabit-ethernet', 1000, 'up', 'down', 13, NULL, '2025-11-14 18:01:02', '2025-11-14 18:01:02'),
(256, 163, 'Fa0/1', 'fast-ethernet', 100, 'up', 'down', 1, NULL, '2025-11-14 18:04:05', '2025-11-14 18:04:05'),
(257, 163, 'Fa0/2', 'fast-ethernet', 100, 'up', 'down', 2, NULL, '2025-11-14 18:04:05', '2025-11-14 18:04:05'),
(258, 163, 'Fa0/3', 'fast-ethernet', 100, 'up', 'down', 3, NULL, '2025-11-14 18:04:05', '2025-11-14 18:04:05'),
(259, 163, 'Fa0/4', 'fast-ethernet', 100, 'up', 'down', 4, NULL, '2025-11-14 18:04:05', '2025-11-14 18:04:05'),
(260, 163, 'Fa0/5', 'fast-ethernet', 100, 'up', 'down', 5, NULL, '2025-11-14 18:04:05', '2025-11-14 18:04:05'),
(261, 164, 'Fa0/1', 'fast-ethernet', 100, 'up', 'down', 1, NULL, '2025-11-14 18:04:30', '2025-11-14 18:04:30'),
(262, 164, 'Fa0/2', 'fast-ethernet', 100, 'up', 'down', 2, NULL, '2025-11-14 18:04:30', '2025-11-14 18:04:30'),
(263, 164, 'Fa0/3', 'fast-ethernet', 100, 'up', 'down', 3, NULL, '2025-11-14 18:04:30', '2025-11-14 18:04:30'),
(264, 164, 'Fa0/4', 'fast-ethernet', 100, 'up', 'down', 4, NULL, '2025-11-14 18:04:30', '2025-11-14 18:04:30'),
(265, 164, 'Fa0/5', 'fast-ethernet', 100, 'up', 'down', 5, NULL, '2025-11-14 18:04:30', '2025-11-14 18:04:30'),
(350, 173, 'Fa0/1', 'fast-ethernet', 100, 'up', 'down', 1, NULL, '2025-12-03 16:16:15', '2025-12-03 16:16:15'),
(351, 173, 'Fa0/2', 'fast-ethernet', 100, 'up', 'down', 2, NULL, '2025-12-03 16:16:16', '2025-12-03 16:16:16'),
(352, 173, 'Fa0/3', 'fast-ethernet', 100, 'up', 'down', 3, NULL, '2025-12-03 16:16:16', '2025-12-03 16:16:16'),
(353, 173, 'Fa0/4', 'fast-ethernet', 100, 'up', 'down', 4, NULL, '2025-12-03 16:16:16', '2025-12-03 16:16:16'),
(354, 173, 'Fa0/5', 'fast-ethernet', 100, 'up', 'down', 5, NULL, '2025-12-03 16:16:16', '2025-12-03 16:16:16'),
(355, 173, 'Fa0/6', 'fast-ethernet', 100, 'up', 'down', 6, NULL, '2025-12-03 16:16:16', '2025-12-03 16:16:16'),
(356, 173, 'Fa0/7', 'fast-ethernet', 100, 'up', 'down', 7, NULL, '2025-12-03 16:16:16', '2025-12-03 16:16:16'),
(357, 173, 'Fa0/8', 'fast-ethernet', 100, 'up', 'down', 8, NULL, '2025-12-03 16:16:16', '2025-12-03 16:16:16'),
(358, 173, 'Fa0/9', 'fast-ethernet', 100, 'up', 'down', 9, NULL, '2025-12-03 16:16:16', '2025-12-03 16:16:16'),
(359, 173, 'Fa0/10', 'fast-ethernet', 100, 'up', 'down', 10, NULL, '2025-12-03 16:16:16', '2025-12-03 16:16:16'),
(360, 174, 'Fa0/1', 'fast-ethernet', 100, 'up', 'down', 1, NULL, '2025-12-03 16:20:50', '2025-12-03 16:20:50'),
(361, 174, 'Fa0/2', 'fast-ethernet', 100, 'up', 'down', 2, NULL, '2025-12-03 16:20:50', '2025-12-03 16:20:50'),
(362, 174, 'Fa0/3', 'fast-ethernet', 100, 'up', 'down', 3, NULL, '2025-12-03 16:20:50', '2025-12-03 16:20:50'),
(363, 174, 'Fa0/4', 'fast-ethernet', 100, 'up', 'down', 4, NULL, '2025-12-03 16:20:50', '2025-12-03 16:20:50'),
(364, 174, 'Fa0/5', 'fast-ethernet', 100, 'up', 'down', 5, NULL, '2025-12-03 16:20:51', '2025-12-03 16:20:51'),
(365, 174, 'Fa0/6', 'fast-ethernet', 100, 'up', 'down', 6, NULL, '2025-12-03 16:20:51', '2025-12-03 16:20:51'),
(366, 174, 'Fa0/7', 'fast-ethernet', 100, 'up', 'down', 7, NULL, '2025-12-03 16:20:51', '2025-12-03 16:20:51'),
(367, 174, 'Fa0/8', 'fast-ethernet', 100, 'up', 'down', 8, NULL, '2025-12-03 16:20:51', '2025-12-03 16:20:51'),
(368, 174, 'Fa0/9', 'fast-ethernet', 100, 'up', 'down', 9, NULL, '2025-12-03 16:20:51', '2025-12-03 16:20:51'),
(369, 174, 'Fa0/10', 'fast-ethernet', 100, 'up', 'down', 10, NULL, '2025-12-03 16:20:51', '2025-12-03 16:20:51'),
(390, 177, 'Gi0/1', 'gigabit-ethernet', 1000, 'up', 'down', 1, NULL, '2025-12-03 18:30:03', '2025-12-03 18:30:03'),
(391, 177, 'Gi0/2', 'gigabit-ethernet', 1000, 'up', 'down', 2, NULL, '2025-12-03 18:30:03', '2025-12-03 18:30:03'),
(392, 177, 'Gi0/3', 'gigabit-ethernet', 1000, 'up', 'down', 3, NULL, '2025-12-03 18:30:03', '2025-12-03 18:30:03'),
(393, 177, 'Gi0/4', 'gigabit-ethernet', 1000, 'up', 'down', 4, NULL, '2025-12-03 18:30:03', '2025-12-03 18:30:03'),
(394, 177, 'Gi0/5', 'gigabit-ethernet', 1000, 'up', 'down', 5, NULL, '2025-12-03 18:30:03', '2025-12-03 18:30:03'),
(395, 177, 'Gi0/6', 'gigabit-ethernet', 1000, 'up', 'down', 6, NULL, '2025-12-03 18:30:03', '2025-12-03 18:30:03'),
(396, 177, 'Gi0/7', 'gigabit-ethernet', 1000, 'up', 'down', 7, NULL, '2025-12-03 18:30:03', '2025-12-03 18:30:03'),
(397, 177, 'Gi0/8', 'gigabit-ethernet', 1000, 'up', 'down', 8, NULL, '2025-12-03 18:30:03', '2025-12-03 18:30:03'),
(398, 177, 'Gi0/9', 'gigabit-ethernet', 1000, 'up', 'down', 9, NULL, '2025-12-03 18:30:03', '2025-12-03 18:30:03'),
(399, 177, 'Gi0/10', 'gigabit-ethernet', 1000, 'up', 'down', 10, NULL, '2025-12-03 18:30:03', '2025-12-03 18:30:03'),
(400, 177, 'Fa0/1', 'fast-ethernet', 100, 'up', 'down', 11, NULL, '2025-12-03 18:30:03', '2025-12-03 18:30:03'),
(401, 177, 'Fa0/2', 'fast-ethernet', 100, 'up', 'down', 12, NULL, '2025-12-03 18:30:03', '2025-12-03 18:30:03'),
(402, 177, 'Fa0/3', 'fast-ethernet', 100, 'up', 'down', 13, NULL, '2025-12-03 18:30:03', '2025-12-03 18:30:03'),
(403, 177, 'Fa0/4', 'fast-ethernet', 100, 'up', 'down', 14, NULL, '2025-12-03 18:30:03', '2025-12-03 18:30:03'),
(404, 177, 'Fa0/5', 'fast-ethernet', 100, 'up', 'down', 15, NULL, '2025-12-03 18:30:03', '2025-12-03 18:30:03'),
(405, 177, 'Fa0/6', 'fast-ethernet', 100, 'up', 'down', 16, NULL, '2025-12-03 18:30:03', '2025-12-03 18:30:03'),
(406, 177, 'Fa0/7', 'fast-ethernet', 100, 'up', 'down', 17, NULL, '2025-12-03 18:30:03', '2025-12-03 18:30:03'),
(407, 177, 'Fa0/8', 'fast-ethernet', 100, 'up', 'down', 18, NULL, '2025-12-03 18:30:03', '2025-12-03 18:30:03'),
(408, 177, 'Fa0/9', 'fast-ethernet', 100, 'up', 'down', 19, NULL, '2025-12-03 18:30:03', '2025-12-03 18:30:03'),
(409, 177, 'Fa0/10', 'fast-ethernet', 100, 'up', 'down', 20, NULL, '2025-12-03 18:30:03', '2025-12-03 18:30:03'),
(430, 179, 'Gi0/1', 'gigabit-ethernet', 1000, 'up', 'down', 1, NULL, '2025-12-03 19:31:23', '2025-12-03 19:31:23'),
(431, 179, 'Gi0/2', 'gigabit-ethernet', 1000, 'up', 'down', 2, NULL, '2025-12-03 19:31:23', '2025-12-03 19:31:23'),
(432, 179, 'Gi0/3', 'gigabit-ethernet', 1000, 'up', 'down', 3, NULL, '2025-12-03 19:31:23', '2025-12-03 19:31:23'),
(433, 179, 'Gi0/4', 'gigabit-ethernet', 1000, 'up', 'down', 4, NULL, '2025-12-03 19:31:23', '2025-12-03 19:31:23'),
(434, 179, 'Gi0/5', 'gigabit-ethernet', 1000, 'up', 'down', 5, NULL, '2025-12-03 19:31:23', '2025-12-03 19:31:23'),
(435, 179, 'Gi0/6', 'gigabit-ethernet', 1000, 'up', 'down', 6, NULL, '2025-12-03 19:31:23', '2025-12-03 19:31:23'),
(436, 179, 'Gi0/7', 'gigabit-ethernet', 1000, 'up', 'down', 7, NULL, '2025-12-03 19:31:23', '2025-12-03 19:31:23'),
(437, 179, 'Gi0/8', 'gigabit-ethernet', 1000, 'up', 'down', 8, NULL, '2025-12-03 19:31:23', '2025-12-03 19:31:23'),
(438, 179, 'Gi0/9', 'gigabit-ethernet', 1000, 'up', 'down', 9, NULL, '2025-12-03 19:31:23', '2025-12-03 19:31:23'),
(439, 179, 'Gi0/10', 'gigabit-ethernet', 1000, 'up', 'down', 10, NULL, '2025-12-03 19:31:23', '2025-12-03 19:31:23'),
(440, 180, 'Gi0/1', 'gigabit-ethernet', 1000, 'up', 'down', 1, NULL, '2025-12-04 14:26:34', '2025-12-04 14:26:34'),
(441, 180, 'Gi0/2', 'gigabit-ethernet', 1000, 'up', 'down', 2, NULL, '2025-12-04 14:26:34', '2025-12-04 14:26:34'),
(442, 180, 'Gi0/3', 'gigabit-ethernet', 1000, 'up', 'down', 3, NULL, '2025-12-04 14:26:34', '2025-12-04 14:26:34'),
(443, 180, 'Gi0/4', 'gigabit-ethernet', 1000, 'up', 'down', 4, NULL, '2025-12-04 14:26:34', '2025-12-04 14:26:34'),
(444, 180, 'Gi0/5', 'gigabit-ethernet', 1000, 'up', 'down', 5, NULL, '2025-12-04 14:26:34', '2025-12-04 14:26:34'),
(445, 180, 'Gi0/6', 'gigabit-ethernet', 1000, 'up', 'down', 6, NULL, '2025-12-04 14:26:34', '2025-12-04 14:26:34'),
(446, 180, 'Gi0/7', 'gigabit-ethernet', 1000, 'up', 'down', 7, NULL, '2025-12-04 14:26:34', '2025-12-04 14:26:34'),
(447, 180, 'Gi0/8', 'gigabit-ethernet', 1000, 'up', 'down', 8, NULL, '2025-12-04 14:26:35', '2025-12-04 14:26:35'),
(448, 180, 'Gi0/9', 'gigabit-ethernet', 1000, 'up', 'down', 9, NULL, '2025-12-04 14:26:35', '2025-12-04 14:26:35'),
(449, 180, 'Gi0/10', 'gigabit-ethernet', 1000, 'up', 'down', 10, NULL, '2025-12-04 14:26:35', '2025-12-04 14:26:35'),
(450, 180, 'SFP1', 'sfp', NULL, 'up', 'down', 11, NULL, '2025-12-04 14:26:35', '2025-12-04 14:26:35'),
(451, 180, 'SFP2', 'sfp', NULL, 'up', 'down', 12, NULL, '2025-12-04 14:26:35', '2025-12-04 14:26:35'),
(452, 180, 'SFP3', 'sfp', NULL, 'up', 'down', 13, NULL, '2025-12-04 14:26:35', '2025-12-04 14:26:35'),
(453, 180, 'SFP4', 'sfp', NULL, 'up', 'down', 14, NULL, '2025-12-04 14:26:35', '2025-12-04 14:26:35'),
(454, 180, 'SFP5', 'sfp', NULL, 'up', 'down', 15, NULL, '2025-12-04 14:26:35', '2025-12-04 14:26:35'),
(455, 180, 'SFP6', 'sfp', NULL, 'up', 'down', 16, NULL, '2025-12-04 14:26:35', '2025-12-04 14:26:35'),
(456, 180, 'SFP7', 'sfp', NULL, 'up', 'down', 17, NULL, '2025-12-04 14:26:35', '2025-12-04 14:26:35'),
(457, 180, 'SFP8', 'sfp', NULL, 'up', 'down', 18, NULL, '2025-12-04 14:26:35', '2025-12-04 14:26:35'),
(458, 180, 'SFP9', 'sfp', NULL, 'up', 'down', 19, NULL, '2025-12-04 14:26:35', '2025-12-04 14:26:35'),
(459, 180, 'SFP10', 'sfp', NULL, 'up', 'down', 20, NULL, '2025-12-04 14:26:35', '2025-12-04 14:26:35');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`permissions`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `name`, `permissions`) VALUES
(1, 'admin', NULL),
(2, 'normal', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL,
  `jti` varchar(128) NOT NULL,
  `refresh_hash` varchar(128) NOT NULL,
  `ip` varchar(64) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `jti`, `refresh_hash`, `ip`, `user_agent`, `expires_at`, `created_at`) VALUES
(27, 3, '36dff901f3c0b95491fddfe6c2c2117d', '0fa6d490fcb976db77979f09e008b149096795c01a86be124e36868dc3e117ce', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36', '2025-12-10 09:51:51', '2025-12-03 08:51:51'),
(28, 3, '5793d86acf56838230b16ec50d4fb585', '2565803197d6bcbe7ce38df83d1acda93406e8fc19bd955e37ab12b1dc652573', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36', '2025-12-10 09:52:37', '2025-12-03 08:52:37'),
(38, 3, 'a571be700cee7d1f34fa981aa3c51b6d', '98b55d270ae3715ebc636ffebddd3216c12688ca874850483191fbe23aa8f8b9', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36', '2025-12-11 11:47:54', '2025-12-04 10:47:54'),
(39, 1, 'd8cc473e4a63f9d9e64c2e8e49d9dfd8', '4536da995b027be5f800bd5b9e25d0faafd49ac16be09ef48138c24f9fe454bc', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36', '2025-12-11 11:52:43', '2025-12-04 10:52:43');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sites`
--

CREATE TABLE `sites` (
  `id` int(11) NOT NULL,
  `network_id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sites`
--

INSERT INTO `sites` (`id`, `network_id`, `parent_id`, `name`, `description`, `created_at`) VALUES
(1, 1, NULL, 'Sede Principal', 'Ubicación central', '2025-11-06 17:10:50'),
(2, 1, 1, 'Torre Union', 'Zona norte', '2025-11-06 17:10:50'),
(4, 1, 2, 'Piso 1', NULL, '2025-11-06 18:21:19'),
(5, 1, 2, 'Piso 5', 'Torre Union', '2025-11-12 16:29:27'),
(13, 1, NULL, 'Trujillo', NULL, '2025-12-01 16:19:23'),
(16, 1, 2, 'Piso 3', NULL, '2025-12-03 15:56:20');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role_id` int(11) NOT NULL,
  `status` enum('active','disabled') NOT NULL DEFAULT 'active',
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `role_id`, `status`, `last_login`, `created_at`, `updated_at`, `is_active`) VALUES
(1, 'admin', 'admin@local', '$2b$10$xBCl/od4qYezgJ939oUcK.qfW/h2vr.dKZJBXfAuvRxi6rxWc/Rw.', 1, 'active', '2025-12-04 14:52:43', '2025-10-14 17:51:23', '2025-12-04 14:52:43', 1),
(3, 'normal', 'normal@local', '$2b$10$vJNZ4QVQyem5iZ/Xs5DiyuuW.Qnz22ZpiaUDswy9FlWnswleZvm0O', 2, 'active', '2025-12-04 14:47:54', '2025-10-22 14:03:03', '2025-12-04 14:47:54', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_locks`
--

CREATE TABLE `user_locks` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `until` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `view_backgrounds`
--

CREATE TABLE `view_backgrounds` (
  `id` int(11) NOT NULL,
  `network_id` int(11) NOT NULL,
  `view` enum('wifi','switch') NOT NULL,
  `image_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `blacklisted_tokens`
--
ALTER TABLE `blacklisted_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_access_hash` (`access_hash`);

--
-- Indices de la tabla `connections`
--
ALTER TABLE `connections`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_conn_ports` (`network_id`,`a_port_id`,`b_port_id`),
  ADD KEY `fk_conn_from` (`from_device_id`),
  ADD KEY `fk_conn_to` (`to_device_id`),
  ADD KEY `idx_conn_network` (`network_id`),
  ADD KEY `fk_conn_a_port` (`a_port_id`),
  ADD KEY `fk_conn_b_port` (`b_port_id`);

--
-- Indices de la tabla `devices`
--
ALTER TABLE `devices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_devices_image` (`image_id`),
  ADD KEY `idx_devices_network` (`network_id`),
  ADD KEY `idx_devices_type` (`device_type`),
  ADD KEY `idx_devices_ip` (`ip_address`),
  ADD KEY `idx_devices_mac` (`mac_address`),
  ADD KEY `fk_devices_site` (`site_id`);

--
-- Indices de la tabla `device_positions`
--
ALTER TABLE `device_positions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_device_view` (`device_id`,`view`);

--
-- Indices de la tabla `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `login_attempts`
--
ALTER TABLE `login_attempts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_login_user_time` (`user_id`,`created_at`),
  ADD KEY `idx_login_username_time` (`username`,`created_at`),
  ADD KEY `idx_login_ip_time` (`ip`,`created_at`);

--
-- Indices de la tabla `networks`
--
ALTER TABLE `networks`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `ping_logs`
--
ALTER TABLE `ping_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ping_device_time` (`device_id`,`ran_at`);

--
-- Indices de la tabla `ports`
--
ALTER TABLE `ports`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_device_port_name` (`device_id`,`name`),
  ADD KEY `idx_port_device` (`device_id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_jti` (`jti`),
  ADD KEY `idx_user_id` (`user_id`);

--
-- Indices de la tabla `sites`
--
ALTER TABLE `sites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_sites_network` (`network_id`),
  ADD KEY `fk_sites_parent` (`parent_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `fk_users_role` (`role_id`);

--
-- Indices de la tabla `user_locks`
--
ALTER TABLE `user_locks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_locks_user_until` (`user_id`,`until`);

--
-- Indices de la tabla `view_backgrounds`
--
ALTER TABLE `view_backgrounds`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_bg` (`network_id`,`view`),
  ADD KEY `fk_bg_image` (`image_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=155;

--
-- AUTO_INCREMENT de la tabla `blacklisted_tokens`
--
ALTER TABLE `blacklisted_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `connections`
--
ALTER TABLE `connections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=308;

--
-- AUTO_INCREMENT de la tabla `devices`
--
ALTER TABLE `devices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=184;

--
-- AUTO_INCREMENT de la tabla `device_positions`
--
ALTER TABLE `device_positions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `images`
--
ALTER TABLE `images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `login_attempts`
--
ALTER TABLE `login_attempts`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=258;

--
-- AUTO_INCREMENT de la tabla `networks`
--
ALTER TABLE `networks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `ping_logs`
--
ALTER TABLE `ping_logs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ports`
--
ALTER TABLE `ports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=463;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT de la tabla `sites`
--
ALTER TABLE `sites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `user_locks`
--
ALTER TABLE `user_locks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `view_backgrounds`
--
ALTER TABLE `view_backgrounds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `connections`
--
ALTER TABLE `connections`
  ADD CONSTRAINT `fk_conn_a_port` FOREIGN KEY (`a_port_id`) REFERENCES `ports` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_conn_b_port` FOREIGN KEY (`b_port_id`) REFERENCES `ports` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_conn_from` FOREIGN KEY (`from_device_id`) REFERENCES `devices` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_conn_network` FOREIGN KEY (`network_id`) REFERENCES `networks` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_conn_to` FOREIGN KEY (`to_device_id`) REFERENCES `devices` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `devices`
--
ALTER TABLE `devices`
  ADD CONSTRAINT `fk_devices_image` FOREIGN KEY (`image_id`) REFERENCES `images` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_devices_network` FOREIGN KEY (`network_id`) REFERENCES `networks` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_devices_site` FOREIGN KEY (`site_id`) REFERENCES `sites` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `device_positions`
--
ALTER TABLE `device_positions`
  ADD CONSTRAINT `fk_pos_device` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `login_attempts`
--
ALTER TABLE `login_attempts`
  ADD CONSTRAINT `fk_login_attempts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `ping_logs`
--
ALTER TABLE `ping_logs`
  ADD CONSTRAINT `fk_ping_device` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `ports`
--
ALTER TABLE `ports`
  ADD CONSTRAINT `fk_port_device` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `sites`
--
ALTER TABLE `sites`
  ADD CONSTRAINT `fk_sites_network` FOREIGN KEY (`network_id`) REFERENCES `networks` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_sites_parent` FOREIGN KEY (`parent_id`) REFERENCES `sites` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

--
-- Filtros para la tabla `user_locks`
--
ALTER TABLE `user_locks`
  ADD CONSTRAINT `fk_user_locks_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `view_backgrounds`
--
ALTER TABLE `view_backgrounds`
  ADD CONSTRAINT `fk_bg_image` FOREIGN KEY (`image_id`) REFERENCES `images` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_bg_network` FOREIGN KEY (`network_id`) REFERENCES `networks` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
