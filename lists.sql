DROP DATABASE IF EXISTS todolist;
CREATE DATABASE todolist;

\c todolist;



CREATE TABLE list
(
 id serial PRIMARY KEY,
 todo text NOT NULL,
 description text 
);

INSERT INTO list(todo,description)
VALUES('Wake Up',
	'Stretch fully, make the bed and wash up!'), 
('Eat Lunch', 'Eat as much as you can!'),
('Eat Some More','Attempt to stuff more food in stomach.');