CREATE TABLE users_revenue (
                               user_id VARCHAR(255) PRIMARY KEY,
                               revenue INTEGER
);

-- Add unique constraint on user_id
ALTER TABLE users_revenue ADD CONSTRAINT unique_user_id UNIQUE (user_id);
