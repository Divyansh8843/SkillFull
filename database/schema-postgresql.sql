-- PostgreSQL Schema for SkillWave Platform

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  picture_url TEXT,
  bio TEXT,
  skills JSONB DEFAULT '[]',
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Request Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Help Requests Table
CREATE TABLE IF NOT EXISTS help_requests (
  id SERIAL PRIMARY KEY,
  requester_id VARCHAR(255) NOT NULL,
  category_id INTEGER,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  skills_needed JSONB DEFAULT '[]',
  urgency VARCHAR(20) CHECK (urgency IN ('low', 'medium', 'high')) DEFAULT 'medium',
  estimated_duration VARCHAR(50),
  location VARCHAR(255),
  is_remote BOOLEAN DEFAULT true,
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  status VARCHAR(20) CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')) DEFAULT 'open',
  helper_id VARCHAR(255),
  accepted_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (requester_id) REFERENCES users(id),
  FOREIGN KEY (helper_id) REFERENCES users(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  request_id INTEGER NOT NULL,
  sender_id VARCHAR(255) NOT NULL,
  receiver_id VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  message_type VARCHAR(20) CHECK (message_type IN ('text', 'image', 'file')) DEFAULT 'text',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES help_requests(id),
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  request_id INTEGER NOT NULL,
  reviewer_id VARCHAR(255) NOT NULL,
  reviewee_id VARCHAR(255) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES help_requests(id),
  FOREIGN KEY (reviewer_id) REFERENCES users(id),
  FOREIGN KEY (reviewee_id) REFERENCES users(id)
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  type VARCHAR(50) CHECK (type IN ('new_request', 'request_accepted', 'message_received', 'request_completed', 'review_received')) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  related_id INTEGER,
  is_read BOOLEAN DEFAULT false,
  email_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_help_requests_status ON help_requests(status);
CREATE INDEX IF NOT EXISTS idx_help_requests_category ON help_requests(category_id);
CREATE INDEX IF NOT EXISTS idx_help_requests_created_at ON help_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_request_id ON messages(request_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_help_requests_updated_at BEFORE UPDATE ON help_requests 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
