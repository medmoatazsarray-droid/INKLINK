-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql-medmoatazsarray789.alwaysdata.net
-- Generation Time: Mar 06, 2026 at 09:30 AM
-- Server version: 10.11.15-MariaDB
-- PHP Version: 8.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `medmoatazsarray789_inklink`
--
CREATE DATABASE IF NOT EXISTS `medmoatazsarray789_inklink` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `medmoatazsarray789_inklink`;

-- --------------------------------------------------------

--
-- Table structure for table `Admin`
--

CREATE TABLE `Admin` (
  `id_admin` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(30) NOT NULL,
  `email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Admin`
--

INSERT INTO `Admin` (`id_admin`, `username`, `password`, `role`, `email`) VALUES
(1, 'Medmoatazsarray', '$2b$10$s8AT9SfNQyAB.K/vR2Ag4ONjlIj0PMZYiUgUZB6T8UxfpQI1P0W8C', 'admin', 'tizzasarray@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `Avis`
--

CREATE TABLE `Avis` (
  `id_avis` int(11) NOT NULL,
  `note` int(11) DEFAULT NULL,
  `commentaire` text DEFAULT NULL,
  `dateCreation` datetime DEFAULT current_timestamp(),
  `statut` enum('VISIBLE','MASQUE') DEFAULT 'VISIBLE',
  `id_user` int(11) NOT NULL,
  `id_produit` int(11) NOT NULL,
  `id_admin` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Categorie`
--

CREATE TABLE `Categorie` (
  `id_categorie` int(11) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `id_admin` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `codePromo`
--

CREATE TABLE `codePromo` (
  `id_code` int(11) NOT NULL,
  `nom` varchar(50) DEFAULT NULL,
  `remise` decimal(5,2) DEFAULT NULL,
  `dateExpiration` date DEFAULT NULL,
  `id_admin` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Commande`
--

CREATE TABLE `Commande` (
  `id_commande` int(11) NOT NULL,
  `dateCommande` datetime DEFAULT current_timestamp(),
  `statut` enum('EN_ATTENTE','CONFIRMEE','EN_COURS','LIVREE','ANNULEE') DEFAULT 'EN_ATTENTE',
  `total` decimal(10,2) DEFAULT NULL,
  `methodePaiement` varchar(50) DEFAULT NULL,
  `id_user` int(11) NOT NULL,
  `id_code` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `LigneCommande`
--

CREATE TABLE `LigneCommande` (
  `id_ligne` int(11) NOT NULL,
  `quantite` int(11) NOT NULL,
  `prixUnitaire` decimal(10,2) DEFAULT NULL,
  `prixTotal` decimal(10,2) DEFAULT NULL,
  `id_commande` int(11) NOT NULL,
  `id_produit` int(11) NOT NULL,
  `id_optionP` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Livraison`
--

CREATE TABLE `Livraison` (
  `id_livraison` int(11) NOT NULL,
  `adresseLivraison` varchar(255) DEFAULT NULL,
  `ville` varchar(100) DEFAULT NULL,
  `pays` varchar(50) DEFAULT NULL,
  `methode` varchar(50) DEFAULT NULL,
  `statut` enum('EN_COURS','LIVREE','ANNULE') DEFAULT 'EN_COURS',
  `dateEstimee` datetime DEFAULT NULL,
  `id_commande` int(11) NOT NULL,
  `id_admin` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `OptionProduit`
--

CREATE TABLE `OptionProduit` (
  `id_optionP` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `valeur` varchar(100) NOT NULL,
  `prixSupplementaire` decimal(10,2) DEFAULT NULL,
  `id_produit` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `PackAI`
--

CREATE TABLE `PackAI` (
  `id_pack` int(11) NOT NULL,
  `libelle` varchar(100) DEFAULT NULL,
  `instructions` text DEFAULT NULL,
  `quantite` int(11) DEFAULT NULL,
  `id_perso` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Paiement`
--

CREATE TABLE `Paiement` (
  `id_paiement` int(11) NOT NULL,
  `montant` decimal(10,2) DEFAULT NULL,
  `methode` varchar(50) DEFAULT NULL,
  `statut` enum('EN_ATTENTE','REUSSI','ECHEC') DEFAULT 'EN_ATTENTE',
  `datePaiement` datetime DEFAULT NULL,
  `reference` varchar(50) DEFAULT NULL,
  `id_commande` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Panier`
--

CREATE TABLE `Panier` (
  `id_panier` int(11) NOT NULL,
  `dateCreation` datetime DEFAULT current_timestamp(),
  `id_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `PanierProduit`
--

CREATE TABLE `PanierProduit` (
  `id_panierP` int(11) NOT NULL,
  `id_panier` int(11) NOT NULL,
  `id_produit` int(11) NOT NULL,
  `quantite` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Personnalisation`
--

CREATE TABLE `Personnalisation` (
  `id_perso` int(11) NOT NULL,
  `fichier` varchar(255) DEFAULT NULL,
  `instructions` text DEFAULT NULL,
  `quantite` int(11) DEFAULT NULL,
  `prixCalcule` decimal(10,2) DEFAULT NULL,
  `id_ligne` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Produit`
--

CREATE TABLE `Produit` (
  `id_produit` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `prixBase` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL,
  `statutProduction` enum('EN_COURS','TERMINE','ANNULE') DEFAULT 'EN_COURS',
  `id_categorie` int(11) DEFAULT NULL,
  `id_admin` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Utilisateur`
--

CREATE TABLE `Utilisateur` (
  `id_user` int(11) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `statut` enum('ACTIF','INACTIF','BLOQUE') DEFAULT 'ACTIF',
  `dateInscription` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Admin`
--
ALTER TABLE `Admin`
  ADD PRIMARY KEY (`id_admin`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `Avis`
--
ALTER TABLE `Avis`
  ADD PRIMARY KEY (`id_avis`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_produit` (`id_produit`),
  ADD KEY `id_admin` (`id_admin`);

--
-- Indexes for table `Categorie`
--
ALTER TABLE `Categorie`
  ADD PRIMARY KEY (`id_categorie`),
  ADD KEY `id_admin` (`id_admin`);

--
-- Indexes for table `codePromo`
--
ALTER TABLE `codePromo`
  ADD PRIMARY KEY (`id_code`),
  ADD KEY `id_admin` (`id_admin`);

--
-- Indexes for table `Commande`
--
ALTER TABLE `Commande`
  ADD PRIMARY KEY (`id_commande`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_code` (`id_code`);

--
-- Indexes for table `LigneCommande`
--
ALTER TABLE `LigneCommande`
  ADD PRIMARY KEY (`id_ligne`),
  ADD KEY `id_commande` (`id_commande`),
  ADD KEY `id_produit` (`id_produit`),
  ADD KEY `id_optionP` (`id_optionP`);

--
-- Indexes for table `Livraison`
--
ALTER TABLE `Livraison`
  ADD PRIMARY KEY (`id_livraison`),
  ADD KEY `id_commande` (`id_commande`),
  ADD KEY `id_admin` (`id_admin`);

--
-- Indexes for table `OptionProduit`
--
ALTER TABLE `OptionProduit`
  ADD PRIMARY KEY (`id_optionP`),
  ADD KEY `id_produit` (`id_produit`);

--
-- Indexes for table `PackAI`
--
ALTER TABLE `PackAI`
  ADD PRIMARY KEY (`id_pack`),
  ADD KEY `id_perso` (`id_perso`);

--
-- Indexes for table `Paiement`
--
ALTER TABLE `Paiement`
  ADD PRIMARY KEY (`id_paiement`),
  ADD KEY `id_commande` (`id_commande`);

--
-- Indexes for table `Panier`
--
ALTER TABLE `Panier`
  ADD PRIMARY KEY (`id_panier`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `PanierProduit`
--
ALTER TABLE `PanierProduit`
  ADD PRIMARY KEY (`id_panierP`),
  ADD KEY `id_panier` (`id_panier`),
  ADD KEY `id_produit` (`id_produit`);

--
-- Indexes for table `Personnalisation`
--
ALTER TABLE `Personnalisation`
  ADD PRIMARY KEY (`id_perso`),
  ADD KEY `id_ligne` (`id_ligne`);

--
-- Indexes for table `Produit`
--
ALTER TABLE `Produit`
  ADD PRIMARY KEY (`id_produit`),
  ADD KEY `id_categorie` (`id_categorie`),
  ADD KEY `id_admin` (`id_admin`);

--
-- Indexes for table `Utilisateur`
--
ALTER TABLE `Utilisateur`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Admin`
--
ALTER TABLE `Admin`
  MODIFY `id_admin` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Avis`
--
ALTER TABLE `Avis`
  MODIFY `id_avis` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Categorie`
--
ALTER TABLE `Categorie`
  MODIFY `id_categorie` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `codePromo`
--
ALTER TABLE `codePromo`
  MODIFY `id_code` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Commande`
--
ALTER TABLE `Commande`
  MODIFY `id_commande` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `LigneCommande`
--
ALTER TABLE `LigneCommande`
  MODIFY `id_ligne` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Livraison`
--
ALTER TABLE `Livraison`
  MODIFY `id_livraison` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `OptionProduit`
--
ALTER TABLE `OptionProduit`
  MODIFY `id_optionP` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `PackAI`
--
ALTER TABLE `PackAI`
  MODIFY `id_pack` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Paiement`
--
ALTER TABLE `Paiement`
  MODIFY `id_paiement` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Panier`
--
ALTER TABLE `Panier`
  MODIFY `id_panier` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `PanierProduit`
--
ALTER TABLE `PanierProduit`
  MODIFY `id_panierP` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Personnalisation`
--
ALTER TABLE `Personnalisation`
  MODIFY `id_perso` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Produit`
--
ALTER TABLE `Produit`
  MODIFY `id_produit` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Utilisateur`
--
ALTER TABLE `Utilisateur`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Avis`
--
ALTER TABLE `Avis`
  ADD CONSTRAINT `Avis_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `Utilisateur` (`id_user`),
  ADD CONSTRAINT `Avis_ibfk_2` FOREIGN KEY (`id_produit`) REFERENCES `Produit` (`id_produit`),
  ADD CONSTRAINT `Avis_ibfk_3` FOREIGN KEY (`id_admin`) REFERENCES `Admin` (`id_admin`);

--
-- Constraints for table `Categorie`
--
ALTER TABLE `Categorie`
  ADD CONSTRAINT `Categorie_ibfk_1` FOREIGN KEY (`id_admin`) REFERENCES `Admin` (`id_admin`);

--
-- Constraints for table `codePromo`
--
ALTER TABLE `codePromo`
  ADD CONSTRAINT `codePromo_ibfk_1` FOREIGN KEY (`id_admin`) REFERENCES `Admin` (`id_admin`);

--
-- Constraints for table `Commande`
--
ALTER TABLE `Commande`
  ADD CONSTRAINT `Commande_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `Utilisateur` (`id_user`),
  ADD CONSTRAINT `Commande_ibfk_2` FOREIGN KEY (`id_code`) REFERENCES `codePromo` (`id_code`);

--
-- Constraints for table `LigneCommande`
--
ALTER TABLE `LigneCommande`
  ADD CONSTRAINT `LigneCommande_ibfk_1` FOREIGN KEY (`id_commande`) REFERENCES `Commande` (`id_commande`),
  ADD CONSTRAINT `LigneCommande_ibfk_2` FOREIGN KEY (`id_produit`) REFERENCES `Produit` (`id_produit`),
  ADD CONSTRAINT `LigneCommande_ibfk_3` FOREIGN KEY (`id_optionP`) REFERENCES `OptionProduit` (`id_optionP`);

--
-- Constraints for table `Livraison`
--
ALTER TABLE `Livraison`
  ADD CONSTRAINT `Livraison_ibfk_1` FOREIGN KEY (`id_commande`) REFERENCES `Commande` (`id_commande`),
  ADD CONSTRAINT `Livraison_ibfk_2` FOREIGN KEY (`id_admin`) REFERENCES `Admin` (`id_admin`);

--
-- Constraints for table `OptionProduit`
--
ALTER TABLE `OptionProduit`
  ADD CONSTRAINT `OptionProduit_ibfk_1` FOREIGN KEY (`id_produit`) REFERENCES `Produit` (`id_produit`);

--
-- Constraints for table `PackAI`
--
ALTER TABLE `PackAI`
  ADD CONSTRAINT `PackAI_ibfk_1` FOREIGN KEY (`id_perso`) REFERENCES `Personnalisation` (`id_perso`);

--
-- Constraints for table `Paiement`
--
ALTER TABLE `Paiement`
  ADD CONSTRAINT `Paiement_ibfk_1` FOREIGN KEY (`id_commande`) REFERENCES `Commande` (`id_commande`);

--
-- Constraints for table `Panier`
--
ALTER TABLE `Panier`
  ADD CONSTRAINT `Panier_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `Utilisateur` (`id_user`);

--
-- Constraints for table `PanierProduit`
--
ALTER TABLE `PanierProduit`
  ADD CONSTRAINT `PanierProduit_ibfk_1` FOREIGN KEY (`id_panier`) REFERENCES `Panier` (`id_panier`),
  ADD CONSTRAINT `PanierProduit_ibfk_2` FOREIGN KEY (`id_produit`) REFERENCES `Produit` (`id_produit`);

--
-- Constraints for table `Personnalisation`
--
ALTER TABLE `Personnalisation`
  ADD CONSTRAINT `Personnalisation_ibfk_1` FOREIGN KEY (`id_ligne`) REFERENCES `LigneCommande` (`id_ligne`);

--
-- Constraints for table `Produit`
--
ALTER TABLE `Produit`
  ADD CONSTRAINT `Produit_ibfk_1` FOREIGN KEY (`id_categorie`) REFERENCES `Categorie` (`id_categorie`),
  ADD CONSTRAINT `Produit_ibfk_2` FOREIGN KEY (`id_admin`) REFERENCES `Admin` (`id_admin`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
