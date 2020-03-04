INSERT INTO role (id, name, description) VALUES (1, 'admin', 'admin user role');
INSERT INTO role (id, name, description) VALUES (2, 'user', 'normal user role');

INSERT INTO user (id, username, uid, gid, email, homedir, role_id) VALUES (1,'doe',1000,2000,'john.doe@mail.net','/home/doe',1);
INSERT INTO user (id, username, uid, gid, email, homedir, role_id) VALUES (2,'murphy',1001,2001,'jane.murphy@mail.net','/home/murphy',2);
INSERT INTO user (id, username, uid, gid, email, homedir, role_id) VALUES (3,'smith',1002,2002,'ben.smith@mail.net','/home/smith',2);