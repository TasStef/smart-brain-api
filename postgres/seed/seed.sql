BEGIN TRANSACION;
INSERT into users (name, email, entries, join) values ('Tim', 'tim@mail.com', 0, '2021-01-01');
INSERT into login (hash,email) values ('$2a$10$towtVVM1X2QxiS4lDQXCu.rR3mFlanxugM9XiQqbYmSXhGhA0T30O', 'tim@mail.com');

COMMIT;
