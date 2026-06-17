-- Smart Waste Management System Database Schema
-- MySQL Database

-- Create Database
CREATE DATABASE IF NOT EXISTS waste_management_system;
USE waste_management_system;

-- Users Table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'worker', 'citizen') NOT NULL DEFAULT 'citizen',
  address TEXT,
  city VARCHAR(50),
  avatar_url VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Workers Table (Extended info for collection workers)
CREATE TABLE workers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  employee_id VARCHAR(50) UNIQUE,
  vehicle_type VARCHAR(50),
  vehicle_plate VARCHAR(50),
  assigned_area VARCHAR(100),
  is_available BOOLEAN DEFAULT TRUE,
  current_location_latitude DECIMAL(10, 8),
  current_location_longitude DECIMAL(11, 8),
  total_collections INT DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_assigned_area (assigned_area)
);

-- Smart Bins Table
CREATE TABLE smart_bins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bin_id VARCHAR(50) UNIQUE NOT NULL,
  location_name VARCHAR(100) NOT NULL,
  location_latitude DECIMAL(10, 8) NOT NULL,
  location_longitude DECIMAL(11, 8) NOT NULL,
  bin_type ENUM('small', 'medium', 'large') DEFAULT 'medium',
  capacity_liters INT DEFAULT 1000,
  fill_level DECIMAL(5, 2) DEFAULT 0,
  status ENUM('empty', 'half_full', 'full', 'needs_maintenance') DEFAULT 'empty',
  last_collection_time TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_bin_id (bin_id),
  INDEX idx_status (status),
  INDEX idx_location (location_latitude, location_longitude)
);

-- Complaints Table
CREATE TABLE complaints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  complaint_id VARCHAR(50) UNIQUE NOT NULL,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(255),
  waste_dumped ENUM('dumped', 'not_dumped') DEFAULT 'dumped',
  material_type ENUM('biodegradable', 'non_biodegradable') DEFAULT 'biodegradable',
  location_latitude DECIMAL(10, 8),
  location_longitude DECIMAL(11, 8),
  category ENUM('garbage_overflow', 'bin_damage', 'collection_delay', 'other') DEFAULT 'other',
  status ENUM('pending', 'in_progress', 'resolved', 'rejected') DEFAULT 'pending',
  priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  assigned_worker_id INT,
  resolution_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_worker_id) REFERENCES workers(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_priority (priority)
);

-- Routes Table
CREATE TABLE routes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  route_id VARCHAR(50) UNIQUE NOT NULL,
  route_name VARCHAR(100) NOT NULL,
  assigned_worker_id INT NOT NULL,
  assigned_date DATE NOT NULL,
  scheduled_time TIME,
  status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  estimated_duration_minutes INT,
  total_bins_in_route INT DEFAULT 0,
  bins_collected INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_worker_id) REFERENCES workers(id) ON DELETE CASCADE,
  INDEX idx_assigned_worker_id (assigned_worker_id),
  INDEX idx_assigned_date (assigned_date),
  INDEX idx_status (status)
);

-- Route Bins (Many-to-Many relationship between Routes and Bins)
CREATE TABLE route_bins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  route_id INT NOT NULL,
  bin_id INT NOT NULL,
  sequence_order INT,
  collection_status ENUM('pending', 'completed') DEFAULT 'pending',
  collection_time TIMESTAMP,
  waste_weight_kg DECIMAL(8, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
  FOREIGN KEY (bin_id) REFERENCES smart_bins(id) ON DELETE CASCADE,
  UNIQUE KEY unique_route_bin (route_id, bin_id),
  INDEX idx_route_id (route_id)
);

-- Collection Logs Table
CREATE TABLE collection_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bin_id INT NOT NULL,
  worker_id INT NOT NULL,
  route_id INT,
  collection_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  waste_weight_kg DECIMAL(8, 2),
  fill_level_before DECIMAL(5, 2),
  fill_level_after DECIMAL(5, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bin_id) REFERENCES smart_bins(id) ON DELETE CASCADE,
  FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE,
  FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE SET NULL,
  INDEX idx_bin_id (bin_id),
  INDEX idx_worker_id (worker_id),
  INDEX idx_collection_time (collection_time)
);

-- Predictions Table (AI-based fill level predictions)
CREATE TABLE predictions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bin_id INT NOT NULL,
  prediction_date DATE NOT NULL,
  predicted_fill_level DECIMAL(5, 2),
  predicted_collection_date DATE,
  confidence_score DECIMAL(5, 2),
  alert_status ENUM('no_alert', 'warning', 'critical') DEFAULT 'no_alert',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (bin_id) REFERENCES smart_bins(id) ON DELETE CASCADE,
  INDEX idx_bin_id (bin_id),
  INDEX idx_prediction_date (prediction_date),
  INDEX idx_alert_status (alert_status)
);

-- Analytics Table (Aggregated data for reports)
CREATE TABLE analytics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  analytics_date DATE NOT NULL,
  total_bins INT DEFAULT 0,
  full_bins INT DEFAULT 0,
  complaints_received INT DEFAULT 0,
  complaints_resolved INT DEFAULT 0,
  collections_completed INT DEFAULT 0,
  total_waste_collected_kg DECIMAL(10, 2) DEFAULT 0,
  average_collection_time_minutes DECIMAL(8, 2),
  average_worker_efficiency DECIMAL(5, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_date (analytics_date),
  INDEX idx_analytics_date (analytics_date)
);

-- Notifications Table
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  notification_type ENUM('bin_full', 'complaint_update', 'route_assigned', 'system_alert') DEFAULT 'system_alert',
  is_read BOOLEAN DEFAULT FALSE,
  related_bin_id INT,
  related_complaint_id INT,
  related_route_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (related_bin_id) REFERENCES smart_bins(id) ON DELETE SET NULL,
  FOREIGN KEY (related_complaint_id) REFERENCES complaints(id) ON DELETE SET NULL,
  FOREIGN KEY (related_route_id) REFERENCES routes(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_is_read (is_read)
);

-- Create Indexes for better query performance
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_complaints_created_at ON complaints(created_at);
CREATE INDEX idx_bins_updated_at ON smart_bins(updated_at);
CREATE INDEX idx_collection_logs_worker_date ON collection_logs(worker_id, collection_time);
