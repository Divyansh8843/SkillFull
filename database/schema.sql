# Database Schema for SkillEdge Platform

## Users Table
```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  picture_url TEXT,
  bio TEXT,
  skills JSON,
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Request Categories Table
```sql
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Help Requests Table
```sql
CREATE TABLE help_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  requester_id VARCHAR(255) NOT NULL,
  category_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  skills_needed JSON,
  urgency ENUM('low', 'medium', 'high') DEFAULT 'medium',
  estimated_duration VARCHAR(50),
  location VARCHAR(255),
  is_remote BOOLEAN DEFAULT true,
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  status ENUM('open', 'in_progress', 'completed', 'cancelled') DEFAULT 'open',
  helper_id VARCHAR(255),
  accepted_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (requester_id) REFERENCES users(id),
  FOREIGN KEY (helper_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

## Messages Table
```sql
CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT NOT NULL,
  sender_id VARCHAR(255) NOT NULL,
  receiver_id VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  message_type ENUM('text', 'image', 'file') DEFAULT 'text',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES help_requests(id),
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
);
```

## Reviews Table
```sql
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  request_id INT NOT NULL,
  reviewer_id VARCHAR(255) NOT NULL,
  reviewee_id VARCHAR(255) NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES help_requests(id),
  FOREIGN KEY (reviewer_id) REFERENCES users(id),
  FOREIGN KEY (reviewee_id) REFERENCES users(id)
);
```

## Notifications Table
```sql
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  type ENUM('new_request', 'request_accepted', 'message_received', 'request_completed', 'review_received') NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  related_id INT,
  is_read BOOLEAN DEFAULT false,
  email_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```
