-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 03, 2024 at 08:26 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_basdat`
--

-- --------------------------------------------------------

--
-- Table structure for table `data_mobil`
--

CREATE TABLE `data_mobil` (
  `id_produk` int(5) NOT NULL,
  `nama_mobil` varchar(50) DEFAULT NULL,
  `pabrikan` varchar(20) DEFAULT NULL,
  `jenis_mobil` varchar(20) DEFAULT NULL,
  `harga` int(20) DEFAULT NULL,
  `jumlah_unit` int(10) DEFAULT NULL,
  `kondisi` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `data_mobil`
--

INSERT INTO `data_mobil` (`id_produk`, `nama_mobil`, `pabrikan`, `jenis_mobil`, `harga`, `jumlah_unit`, `kondisi`) VALUES
(1, 'Audi RS6', 'Audi', 'Wagon', 2147483647, 2, 'Baru'),
(2, 'BMW 3 Series', 'BMW', 'Sedan', 850000000, 1, 'Baru'),
(3, 'Volkswagen Passat', 'Volkswagen', 'Sedan', 700000000, 7, 'Bekas'),
(4, 'Mercedes-Benz GLC', 'Mercedes-Benz', 'SUV', 1000000000, 4, 'Bekas'),
(5, 'Volvo XC90', 'Volvo', 'SUV', 1100000000, 1, 'Baru'),
(6, 'Toyota Corolla', 'Toyota', 'Sedan', 200000000, 10, 'Bekas'),
(7, 'Honda Civic', 'Honda', 'Sedan', 220000000, 8, 'Baru'),
(8, 'Suzuki Baleno', 'Suzuki', 'Hatchback', 460000000, 15, 'Bekas'),
(9, 'Mitsubishi Pajero', 'Mitsubishi', 'SUV', 580000000, 2, 'Baru'),
(10, 'Nissan X-Trail', 'Nissan', 'SUV', 350000000, 7, 'Baru'),
(11, 'Mazda 3', 'Mazda', 'Sedan', 280000000, 7, 'Baru'),
(12, 'Daihatsu Ayla', 'Daihatsu', 'Hatchback', 100000000, 10, 'Baru'),
(13, 'Ford Ranger', 'Ford', 'Pickup', 400000000, 6, 'Bekas'),
(14, 'Chevrolet Spark', 'Chevrolet', 'Hatchback', 150000000, 10, 'Bekas'),
(15, 'BMW X5', 'BMW', 'SUV', 1200000000, 3, 'Baru'),
(16, 'Audi A4', 'Audi', 'Sedan', 600000000, 5, 'Bekas'),
(17, 'Kia Seltos', 'Kia', 'SUV', 300000000, 10, 'Bekas'),
(18, 'Hyundai Tueson', 'Hyundai', 'SUV', 320000000, 7, 'Bekas'),
(19, 'Volkswagen Golf', 'Volkswagen', 'Hatchback', 350000000, 7, 'Bekas'),
(20, 'Mercedes-Benz C-Class', 'Mercedes-Benz', 'Sedan', 800000000, 4, 'Baru'),
(21, 'Peugeot 3008', 'Peugeot', 'SUV', 400000000, 6, 'Bekas'),
(22, 'Renault Kwid', 'Renault', 'Hatchback', 120000000, 18, 'Bekas'),
(23, 'Subaru Forester', 'Subaru', 'SUV', 370000000, 8, 'Bekas'),
(24, 'Mitsubishi Lancer Evo X', 'Mitsubishi', 'Sedan', 830000000, 2, 'Baru'),
(25, 'Honda CRV', 'Honda', 'SUV', 560000000, 12, 'Baru');

--
-- Triggers `data_mobil`
--
DELIMITER $$
CREATE TRIGGER `data_mobil_delete` AFTER DELETE ON `data_mobil` FOR EACH ROW BEGIN
INSERT INTO info_data_mobil(keterangan, waktu, nama_mobil, pabrikan, jenis_mobil, harga, jumlah_unit, kondisi) VALUES ('Data Dihapus', NOW(), old.nama_mobil, old.pabrikan, old.jenis_mobil, old.harga, old.jumlah_unit, old.kondisi);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `data_mobil_insert` AFTER INSERT ON `data_mobil` FOR EACH ROW INSERT INTO info_data_mobil (keterangan, waktu, nama_mobil, pabrikan,
jenis_mobil, harga, jumlah_unit, kondisi) VALUES ('Mobil Baru Masuk', NOW()
, new.nama_mobil, new.pabrikan, new.jenis_mobil, new.harga, new.jumlah_unit,
new.kondisi)
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `data_mobil_update` AFTER UPDATE ON `data_mobil` FOR EACH ROW BEGIN
DECLARE nama_mobil VARCHAR(50) DEFAULT '';
DECLARE jenis VARCHAR(50) DEFAULT '';
DECLARE harga INT unsigned DEFAULT 0;
IF (new.nama_mobil <> old.nama_mobil) THEN
SET nama_mobil = new.nama_mobil;
END IF;
IF (new.jenis_mobil <> old.jenis_mobil) THEN
SET jenis = new.jenis_mobil;
END IF;
IF (new.harga <> old.harga) THEN
SET harga = new.harga;
END IF;
INSERT INTO info_data_mobil(keterangan, waktu, nama_mobil, pabrikan, jenis_mobil, harga, jumlah_unit, kondisi) VALUES ('Updated', NOW(), nama_mobil, new.pabrikan, jenis, harga, new.jumlah_unit, new.kondisi);
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `info_data_mobil`
--

CREATE TABLE `info_data_mobil` (
  `id_log` int(5) NOT NULL,
  `keterangan` varchar(50) DEFAULT NULL,
  `waktu` datetime DEFAULT NULL,
  `nama_mobil` varchar(50) DEFAULT NULL,
  `pabrikan` varchar(20) DEFAULT NULL,
  `jenis_mobil` varchar(20) DEFAULT NULL,
  `harga` int(11) DEFAULT NULL,
  `jumlah_unit` int(10) DEFAULT NULL,
  `kondisi` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `info_data_mobil`
--

INSERT INTO `info_data_mobil` (`id_log`, `keterangan`, `waktu`, `nama_mobil`, `pabrikan`, `jenis_mobil`, `harga`, `jumlah_unit`, `kondisi`) VALUES
(2, 'Mobil Baru Masuk', '2024-08-12 14:08:04', 'Audi A6', 'Audi', 'Sedan', 900000000, 5, 'Baru'),
(3, 'Mobil Baru Masuk', '2024-08-12 14:13:21', 'BMW 3 Series', 'BMW', 'Sedan', 850000000, 6, 'Baru'),
(4, 'Mobil Baru Masuk', '2024-08-12 14:13:21', 'Volkswagen Passat', 'Volkswagen', 'Sedan', 700000000, 7, 'Bekas'),
(5, 'Mobil Baru Masuk', '2024-08-12 14:13:21', 'Mercedes-Benz GLC', 'Mercedes-Benz', 'SUV', 1000000000, 4, 'Bekas'),
(6, 'Mobil Baru Masuk', '2024-08-12 14:13:21', 'Volvo XC90', 'Volvo', 'SUV', 1100000000, 3, 'Baru'),
(9, 'Updated', '2024-08-28 20:37:07', 'Audi RS6', 'Audi', 'Wagon', 2147483647, 5, 'Baru'),
(10, 'Updated', '2024-08-28 20:40:10', 'Honda CRV', 'Honda', 'SUV', 560000000, 12, 'Baru'),
(11, 'Updated', '2024-08-28 20:40:37', '', 'Mitsubishi', '', 580000000, 5, 'Baru'),
(12, 'Updated', '2024-08-28 20:41:35', 'Suzuki Baleno', 'Suzuki', '', 460000000, 15, 'Bekas'),
(13, 'Updated', '2024-08-28 20:42:15', 'Mitsubishi Lancer Evo X', 'Mitsubishi', 'Sedan', 830000000, 7, 'Baru'),
(14, 'Updated', '2024-08-30 14:14:04', '', 'Mazda', '', 0, 5, 'Baru'),
(15, 'Updated', '2024-08-30 14:14:11', '', 'Mazda', '', 0, -2, 'Baru'),
(16, 'Updated', '2024-08-30 14:14:43', '', 'Mazda', '', 0, 5, 'Baru'),
(17, 'Updated', '2024-08-30 14:17:35', '', 'Mazda', '', 0, 7, 'Baru'),
(18, 'Updated', '2024-08-30 14:17:35', '', 'Mazda', '', 0, 9, 'Baru'),
(19, 'Updated', '2024-08-30 14:19:01', '', 'Mazda', '', 0, 7, 'Baru'),
(20, 'Updated', '2024-08-30 14:19:01', '', 'Mazda', '', 0, 5, 'Baru'),
(21, 'Updated', '2024-08-30 14:19:13', '', 'Mazda', '', 0, 8, 'Baru'),
(22, 'Updated', '2024-08-30 14:19:13', '', 'Mazda', '', 0, 11, 'Baru'),
(23, 'Updated', '2024-08-30 14:21:26', '', 'Mazda', '', 0, 9, 'Baru'),
(24, 'Updated', '2024-08-30 14:21:26', '', 'Mazda', '', 0, 7, 'Baru'),
(25, 'Updated', '2024-08-30 14:21:47', '', 'Mazda', '', 0, 10, 'Baru'),
(26, 'Updated', '2024-08-30 14:21:47', '', 'Mazda', '', 0, 13, 'Baru'),
(27, 'Updated', '2024-08-30 14:27:19', '', 'Mazda', '', 0, 10, 'Baru'),
(28, 'Updated', '2024-08-30 14:27:19', '', 'Mazda', '', 0, 7, 'Baru'),
(29, 'Updated', '2024-08-30 14:27:34', '', 'Mazda', '', 0, 8, 'Baru'),
(30, 'Updated', '2024-08-30 14:27:34', '', 'Mazda', '', 0, 9, 'Baru'),
(31, 'Updated', '2024-08-30 14:27:43', '', 'Mazda', '', 0, 6, 'Baru'),
(32, 'Updated', '2024-08-30 14:27:43', '', 'Mazda', '', 0, 3, 'Baru'),
(33, 'Updated', '2024-08-30 14:29:19', '', 'Mazda', '', 0, 12, 'Baru'),
(34, 'Updated', '2024-08-30 14:29:42', '', 'Mazda', '', 0, 5, 'Baru'),
(35, 'Updated', '2024-08-30 14:30:04', '', 'Mazda', '', 0, 5, 'Baru'),
(36, 'Updated', '2024-08-30 14:31:26', '', 'Mazda', '', 0, 0, 'Baru'),
(37, 'Updated', '2024-08-30 14:31:45', '', 'Mazda', '', 0, 5, 'Baru'),
(38, 'Updated', '2024-08-30 14:33:19', '', 'Mazda', '', 0, 12, 'Baru'),
(39, 'Updated', '2024-08-30 14:48:24', '', 'Mazda', '', 0, 5, 'Baru'),
(40, 'Updated', '2024-08-30 14:52:46', '', 'Mazda', '', 0, 2, 'Baru'),
(41, 'Updated', '2024-08-30 14:52:46', '', 'Daihatsu', '', 0, 15, 'Baru'),
(42, 'Updated', '2024-08-30 14:52:46', '', 'Audi', '', 0, 4, 'Baru'),
(43, 'Updated', '2024-08-30 14:52:46', '', 'BMW', '', 0, 1, 'Baru'),
(44, 'Updated', '2024-08-30 14:52:46', '', 'Mitsubishi', '', 0, 2, 'Baru'),
(45, 'Updated', '2024-08-30 14:52:46', '', 'Volvo', '', 0, 2, 'Baru'),
(46, 'Updated', '2024-08-30 14:52:46', '', 'Mitsubishi', '', 0, 4, 'Baru'),
(47, 'Updated', '2024-08-30 14:54:23', '', 'Mazda', '', 0, 5, 'Baru'),
(48, 'Updated', '2024-08-30 15:17:48', '', 'Daihatsu', '', 0, 10, 'Baru'),
(49, 'Updated', '2024-08-30 15:17:48', '', 'Mazda', '', 0, 7, 'Baru'),
(50, 'Updated', '2024-08-30 15:17:48', '', 'Audi', '', 0, 2, 'Baru'),
(51, 'Updated', '2024-08-30 15:17:48', '', 'Volvo', '', 0, 1, 'Baru'),
(52, 'Updated', '2024-08-30 15:17:48', '', 'Mitsubishi', '', 0, 2, 'Baru');

-- --------------------------------------------------------

--
-- Table structure for table `test`
--

CREATE TABLE `test` (
  `test` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `test2`
--

CREATE TABLE `test2` (
  `test` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transaksi`
--

CREATE TABLE `transaksi` (
  `id_transaksi` int(5) NOT NULL,
  `id_produk` int(5) DEFAULT NULL,
  `jumlah` int(5) DEFAULT NULL,
  `tanggal` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaksi`
--

INSERT INTO `transaksi` (`id_transaksi`, `id_produk`, `jumlah`, `tanggal`) VALUES
(12, 11, 5, '2024-08-30'),
(14, 12, 10, '2024-08-30'),
(15, 1, 3, '2024-08-30'),
(16, 2, 5, '2024-08-30'),
(17, 9, 3, '2024-08-30'),
(18, 5, 2, '2024-08-30'),
(19, 24, 5, '2024-08-30');

--
-- Triggers `transaksi`
--
DELIMITER $$
CREATE TRIGGER `transaksi_create` AFTER INSERT ON `transaksi` FOR EACH ROW BEGIN
UPDATE data_mobil SET jumlah_unit = jumlah_unit - new.jumlah WHERE data_mobil.id_produk = new.id_produk;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `transaksi_delete` AFTER DELETE ON `transaksi` FOR EACH ROW BEGIN
UPDATE data_mobil SET jumlah_unit = jumlah_unit + OLD.jumlah WHERE id_produk = OLD.id_produk;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `transaksi_update` AFTER UPDATE ON `transaksi` FOR EACH ROW BEGIN
UPDATE data_mobil SET jumlah_unit = jumlah_unit - (NEW.jumlah - OLD.jumlah) WHERE id_produk = NEW.id_produk;
END
$$
DELIMITER ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `data_mobil`
--
ALTER TABLE `data_mobil`
  ADD PRIMARY KEY (`id_produk`);

--
-- Indexes for table `info_data_mobil`
--
ALTER TABLE `info_data_mobil`
  ADD PRIMARY KEY (`id_log`);

--
-- Indexes for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD PRIMARY KEY (`id_transaksi`),
  ADD KEY `id_produk` (`id_produk`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `data_mobil`
--
ALTER TABLE `data_mobil`
  MODIFY `id_produk` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `info_data_mobil`
--
ALTER TABLE `info_data_mobil`
  MODIFY `id_log` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `transaksi`
--
ALTER TABLE `transaksi`
  MODIFY `id_transaksi` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD CONSTRAINT `transaksi_ibfk_1` FOREIGN KEY (`id_produk`) REFERENCES `data_mobil` (`id_produk`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
