BEGIN TRANSACTION;

create table login
(
    id    SERIAL primary key,
    hash  VARCHAR(100) not null,
    email TEXT         not null unique
);

COMMIT;
