-- Sample Data for Smart Waste Management System
-- Insert demo data for testing

USE waste_management_system;

-- Insert Sample Users
INSERT INTO users (name, email, password, phone, role, address, city, is_verified, is_active) VALUES
('Admin User', 'admin@test.com', '$2a$10$n5ZLfxG3Y/yG/G5m5G5G5uFvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv', '9876543210', 'admin', '123 Admin Street', 'New York', 1, 1),
('John Worker', 'worker@test.com', '$2a$10$n5ZLfxG3Y/yG/G5m5G5G5uFvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv', '9876543211', 'worker', '456 Worker Ave', 'New York', 1, 1),
('Jane Citizen', 'citizen@test.com', '$2a$10$n5ZLfxG3Y/yG/G5m5G5G5uFvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv', '9876543212', 'citizen', '789 Citizen Rd', 'New York', 1, 1),
('Mike Worker', 'mike@test.com', '$2a$10$n5ZLfxG3Y/yG/G5m5G5G5uFvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv', '9876543213', 'worker', '321 Worker Lane', 'New York', 1, 1),
('Sarah Citizen', 'sarah@test.com', '$2a$10$n5ZLfxG3Y/yG/G5m5G5G5uFvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv', '9876543214', 'citizen', '654 Citizen St', 'New York', 1, 1);

-- Note: Passwords are hashed using bcrypt (all are "password123")
-- Replace these hashes with your own when deploying

-- Insert Workers Info
INSERT INTO workers (user_id, employee_id, vehicle_type, vehicle_plate, assigned_area, is_available, total_collections) VALUES
(2, 'W001', 'Truck', 'NYC-001', 'Downtown', 1, 45),
(4, 'W002', 'Van', 'NYC-002', 'Uptown', 1, 38);

-- Insert Smart Bins
INSERT INTO smart_bins (bin_id, location_name, location_latitude, location_longitude, bin_type, capacity_liters, fill_level, status) VALUES
('BIN-001', 'Times Square', 40.758, -73.985, 'large', 1000, 75, 'half_full'),
('BIN-002', 'Central Park', 40.785, -73.968, 'large', 1000, 45, 'half_full'),
('BIN-003', 'Broadway', 40.761, -73.979, 'medium', 800, 90, 'full'),
('BIN-004', 'Wall Street', 40.707, -74.013, 'medium', 800, 30, 'empty'),
('BIN-005', 'Brooklyn Bridge', 40.706, -73.997, 'large', 1000, 60, 'half_full'),
('BIN-006', 'Union Square', 40.735, -73.991, 'small', 500, 15, 'empty'),
('BIN-007', 'Madison Square', 40.750, -73.988, 'medium', 800, 85, 'half_full'),
('BIN-008', 'Fifth Avenue', 40.758, -73.975, 'large', 1000, 95, 'full'),
('BIN-009', 'Park Avenue', 40.775, -73.967, 'medium', 800, 40, 'empty'),
('BIN-010', 'Lexington Ave', 40.753, -73.969, 'medium', 800, 70, 'half_full');

-- Insert Sample Complaints
INSERT INTO complaints (complaint_id, user_id, title, description, category, waste_dumped, material_type, status, priority, created_at) VALUES
('COMP-001', 3, 'Overflowing Garbage', 'The garbage bin at Times Square is overflowing', 'garbage_overflow', 'dumped', 'non_biodegradable', 'pending', 'high', NOW()),
('COMP-002', 5, 'Damaged Bin', 'Bin at Union Square is damaged and open', 'bin_damage', 'dumped', 'non_biodegradable', 'in_progress', 'medium', NOW() - INTERVAL 2 DAY),
('COMP-003', 3, 'Late Collection', 'Bins at Central Park were not collected today', 'collection_delay', 'not_dumped', 'biodegradable', 'pending', 'high', NOW()),
('COMP-004', 5, 'Garbage on Street', 'Scattered garbage near Broadway station', 'garbage_overflow', 'dumped', 'non_biodegradable', 'resolved', 'critical', NOW() - INTERVAL 5 DAY),
('COMP-005', 3, 'Bin Missing', 'The bin near Wall Street is missing', 'other', 'not_dumped', 'biodegradable', 'pending', 'medium', NOW() - INTERVAL 1 DAY);

-- Insert Sample Routes
INSERT INTO routes (route_id, route_name, assigned_worker_id, assigned_date, scheduled_time, status, estimated_duration_minutes, total_bins_in_route, bins_collected) VALUES
('ROUTE-001', 'Downtown Collection A', 1, CURDATE(), '08:00:00', 'in_progress', 120, 5, 3),
('ROUTE-002', 'Uptown Collection B', 2, CURDATE(), '10:00:00', 'pending', 90, 4, 0),
('ROUTE-003', 'Evening Collection C', 1, CURDATE(), '18:00:00', 'pending', 100, 5, 0),
('ROUTE-004', 'Yesterday Route', 2, CURDATE() - INTERVAL 1 DAY, '08:00:00', 'completed', 110, 5, 5);

-- Insert Route Bins
INSERT INTO route_bins (route_id, bin_id, sequence_order, collection_status) VALUES
(1, 1, 1, 'completed'),
(1, 3, 2, 'completed'),
(1, 5, 3, 'completed'),
(1, 7, 4, 'pending'),
(1, 9, 5, 'pending'),
(2, 2, 1, 'pending'),
(2, 4, 2, 'pending'),
(2, 6, 3, 'pending'),
(2, 8, 4, 'pending'),
(3, 1, 1, 'pending'),
(3, 3, 2, 'pending'),
(3, 5, 3, 'pending'),
(3, 7, 4, 'pending'),
(3, 9, 5, 'pending'),
(4, 2, 1, 'completed'),
(4, 4, 2, 'completed'),
(4, 6, 3, 'completed'),
(4, 8, 4, 'completed'),
(4, 10, 5, 'completed');

-- Insert Collection Logs
INSERT INTO collection_logs (bin_id, worker_id, route_id, waste_weight_kg, fill_level_before, fill_level_after, collection_time) VALUES
(1, 1, 1, 45.5, 75, 0, NOW()),
(3, 1, 1, 38.2, 90, 0, NOW() - INTERVAL 30 MINUTE),
(5, 1, 1, 52.1, 60, 0, NOW() - INTERVAL 60 MINUTE),
(2, 2, 4, 40.0, 50, 0, NOW() - INTERVAL 1 DAY),
(4, 2, 4, 35.5, 30, 0, NOW() - INTERVAL 1 DAY - INTERVAL 30 MINUTE),
(6, 2, 4, 28.3, 15, 0, NOW() - INTERVAL 1 DAY - INTERVAL 60 MINUTE),
(8, 2, 4, 55.7, 95, 0, NOW() - INTERVAL 1 DAY - INTERVAL 90 MINUTE),
(10, 2, 4, 42.1, 70, 0, NOW() - INTERVAL 1 DAY - INTERVAL 120 MINUTE);

-- Insert Predictions
INSERT INTO predictions (bin_id, prediction_date, predicted_fill_level, predicted_collection_date, confidence_score, alert_status) VALUES
(1, CURDATE(), 82, CURDATE() + INTERVAL 1 DAY, 85, 'warning'),
(3, CURDATE(), 98, CURDATE(), 90, 'critical'),
(5, CURDATE(), 70, CURDATE() + INTERVAL 2 DAY, 80, 'no_alert'),
(7, CURDATE(), 88, CURDATE() + INTERVAL 1 DAY, 82, 'warning'),
(8, CURDATE(), 105, CURDATE(), 95, 'critical'),
(2, CURDATE(), 55, CURDATE() + INTERVAL 3 DAY, 75, 'no_alert'),
(4, CURDATE(), 40, CURDATE() + INTERVAL 4 DAY, 70, 'no_alert'),
(6, CURDATE(), 25, CURDATE() + INTERVAL 5 DAY, 65, 'no_alert');

-- Insert Analytics for Today
INSERT INTO analytics (analytics_date, total_bins, full_bins, complaints_received, complaints_resolved, collections_completed, total_waste_collected_kg, average_collection_time_minutes, average_worker_efficiency) VALUES
(CURDATE(), 10, 2, 2, 0, 3, 135.8, 45, 85.0);

-- Insert Notifications
INSERT INTO notifications (user_id, title, message, notification_type, is_read, related_bin_id) VALUES
(3, 'Bin Full Alert', 'Bin BIN-003 at Broadway is full', 'bin_full', 0, 3),
(3, 'Complaint Updated', 'Your complaint about Times Square has been assigned', 'complaint_update', 0, NULL),
(2, 'New Route Assigned', 'You have been assigned route ROUTE-002', 'route_assigned', 0, NULL),
(1, 'System Alert', 'Daily analysis complete - 2 critical bins detected', 'system_alert', 0, NULL);

-- Verify data insertion
SELECT 'Users' as Table_Name, COUNT(*) as Record_Count FROM users
UNION ALL
SELECT 'Workers', COUNT(*) FROM workers
UNION ALL
SELECT 'Smart Bins', COUNT(*) FROM smart_bins
UNION ALL
SELECT 'Complaints', COUNT(*) FROM complaints
UNION ALL
SELECT 'Routes', COUNT(*) FROM routes
UNION ALL
SELECT 'Collection Logs', COUNT(*) FROM collection_logs
UNION ALL
SELECT 'Predictions', COUNT(*) FROM predictions
UNION ALL
SELECT 'Analytics', COUNT(*) FROM analytics
UNION ALL
SELECT 'Notifications', COUNT(*) FROM notifications;
