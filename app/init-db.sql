-- Create second WordPress database if it doesn't exist
CREATE DATABASE IF NOT EXISTS wp2;

-- Grant privileges to the WordPress user for both databases
GRANT ALL PRIVILEGES ON wp2.* TO SUBSTRING_INDEX(USER(), '@', 1)@'%';
FLUSH PRIVILEGES;