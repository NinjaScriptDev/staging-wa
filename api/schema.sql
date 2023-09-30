CREATE TABLE cuser
(
    id            SERIAL PRIMARY KEY,
    full_name     VARCHAR(255),
    email         VARCHAR(255) UNIQUE,
    password      VARCHAR(255),
    date_of_birth DATE,
    country       VARCHAR(255),
    image         VARCHAR(255),
    role          integer NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_post
(
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255),
    date        timestamp without time zone,
    start_time  time without time zone,
    end_time    time without time zone,
    location    VARCHAR(255),
    description TEXT,
    category    VARCHAR(255),
    images      text[],
    is_featured BOOLEAN,
    user_id     INT REFERENCES cuser (id),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_comment
(
    id         serial PRIMARY KEY,
    event_id   integer NOT NULL,
    user_id    integer NOT NULL,
    text       text    NOT NULL,
    created_at timestamp DEFAULT current_timestamp,
    FOREIGN KEY (event_id) REFERENCES event_post (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES cuser (id) ON DELETE CASCADE
);

CREATE TABLE friendship
(
    id         SERIAL PRIMARY KEY,
    user_id_1  INT REFERENCES cuser (id),
    user_id_2  INT REFERENCES cuser (id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_favorite
(
    id         SERIAL PRIMARY KEY,
    user_id    INT REFERENCES cuser (id),
    event_id   INT REFERENCES event_post (id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_favorite UNIQUE (user_id, event_id)
);

CREATE TABLE blog_post
(
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255),
    description TEXT,
    image       VARCHAR(255),
    user_id     INT REFERENCES cuser (id),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_category
(
    id   SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE event_wishlist
(
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255),
    location    VARCHAR(255),
    description TEXT,
    category    VARCHAR(50),
    user_id     INT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES cuser (id)
);

CREATE TABLE invitation
(
    id             SERIAL PRIMARY KEY,
    sender_id      INT          NOT NULL,
    receiver_id    INT,
    receiver_email VARCHAR(255) NOT NULL,
    token          VARCHAR(255) NOT NULL,
    is_accepted    BOOLEAN,
    created_at     TIMESTAMP    NOT NULL DEFAULT NOW(),
    FOREIGN KEY (sender_id) REFERENCES cuser (id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES cuser (id) ON DELETE CASCADE
);

