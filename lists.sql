DROP DATABASE IF EXISTS todolist;
CREATE DATABASE todolist;

\c todolist;

CREATE TABLE users (
	-- user_id	serial primary	key,
	username text primary key,
	password text	
);

CREATE TABLE list
(
 id serial PRIMARY KEY,
 usernameref text references users(username),
 todo text NOT NULL,
 description text 
);

INSERT INTO users(username,password) VALUES
('islam','1234'),
('mahedi','2345'),
('jack','3456');
INSERT INTO list(usernameref,todo,description) VALUES
('islam','Wake Up','Stretch fully, make the bed and wash up!'), 
('mahedi','Eat Lunch', 'Eat as much as you can!'),
('jack','Eat Some More','Attempt to stuff more food in stomach.');