INSERT INTO role
    (id, name, description)
VALUES
    (1, 'admin', 'admin user role');
INSERT INTO role
    (id, name, description)
VALUES
    (2, 'user', 'normal user role');

INSERT INTO account
    (id, user_id, username, uid, gid, email, home_path)
VALUES
    (1, 1001, 'doe', 1000, 2000, 'john.doe@mail.net', '/home/doe');
INSERT INTO account
    (id, user_id, username, uid, gid, email, home_path)
VALUES
    (2, 1002, 'murphy', 1001, 2001, 'jane.murphy@mail.net', '/home/murphy');
INSERT INTO account
    (id, user_id, username, uid, gid, email, home_path)
VALUES
    (3, 1003, 'smith', 1002, 2002, 'ben.smith@mail.net', '/home/smith');

INSERT INTO user_role
    (user_id, role_id)
VALUES
    (1, 1);
INSERT INTO user_role
    (user_id, role_id)
VALUES
    (2, 2);
INSERT INTO user_role
    (user_id, role_id)
VALUES
    (3, 2);