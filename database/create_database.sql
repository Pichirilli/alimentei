CREATE SCHEMA `feeded` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin ;

use feeded;

CREATE TABLE fed(
    id INT AUTO_INCREMENT,
    fed_at DATETIME NOT NULL,
    nickname VARCHAR(20),
    avatar_src VARCHAR(25),
    ip VARCHAR(16),
    user_agent VARCHAR(200),
    PRIMARY KEY (id)
);