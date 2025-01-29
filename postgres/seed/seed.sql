BEGIN TRANSACTION;
INSERT into users (name, email, entries, joined) values ('Tim', 'tim@mail.com', 0, '2021-01-01');
INSERT into login (hash,email) values ('$2a$10$towtVVM1X2QxiS4lDQXCu.rR3mFlanxugM9XiQqbYmSXhGhA0T30O', 'tim@mail.com');
INSERT into users (name, email, entries, joined, pet, age) values ('john', 'john@mail.com', 0, '2021-01-01', 'dog', 35);
INSERT into users (name, email, entries, joined, age) values ('Mark', 'mark@mail.com', 0, '2021-01-01', 18);
INSERT into login (hash,email) values ('$2a$10$towtVVM1X2QxiS4lDQXCu.rR3mFlanxugM9XiQqbYmSXhGhA0T30O', 'john@mail.com');
INSERT into login (hash,email) values ('$2a$10$towtVVM1X2QxiS4lDQXCu.rR3mFlanxugM9XiQqbYmSXhGhA0T30O', 'mark@mail.com');

COMMIT;
