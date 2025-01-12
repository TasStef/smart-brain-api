BEGIN TRANSACTION;

create table users
(
    id      SERIAL primary key,
    name    VARCHAR(100),
    email   TEXT      not null unique,
    entries BIGINT default 0,
    joined  TIMESTAMP not null
);

COMMIT;
