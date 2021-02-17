INSERT INTO role (id, name, description)
VALUES (1, 'ADMIN', 'Admin user role');
INSERT INTO role (id, name, description)
VALUES (2, 'STAFF', 'Staff user role');

INSERT INTO users (id, first_name, last_name, email, activated, last_seen_at, instance_quota)
VALUES (1001, 'John', 'Doe', 'john.doe@mail.net', true, '10-02-2021', 10);
INSERT INTO users (id, first_name, last_name, email, activated, last_seen_at, instance_quota)
VALUES (1002, 'Jane', 'Murphy', 'jane.murphy@mail.net', true, '09-02-2021', 2);
INSERT INTO users (id, first_name, last_name, email, activated, last_seen_at, instance_quota)
VALUES (1003, 'Ben', 'Smith', 'ben.smith@mail.net', true, '10-02-2021', 2);

INSERT INTO account (id, user_id, username, uid, gid, home_path)
VALUES (1, 1001, 'doe', 1000, 2000, '/home/doe');
INSERT INTO account (id, user_id, username, uid, gid, home_path)
VALUES (2, 1002, 'murphy', 1001, 2001, '/home/murphy');
INSERT INTO account (id, user_id, username, uid, gid, home_path)
VALUES (3, 1003, 'smith', 1002, 2002, '/home/smith');

INSERT INTO user_role (user_id, role_id)
VALUES (1001, 1);
INSERT INTO user_role (user_id, role_id)
VALUES (1001, 2);
INSERT INTO user_role (user_id, role_id)
VALUES (1002, 2);