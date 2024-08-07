CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
)

INSERT INTO blogs (author, url, title, likes) VALUES ('Dan Davies', 'www.book.pizza', 'Unaccountability Machine', 3)
INSERT INTO blogs (author, url, title) VALUES ('AC Grayling', 'www.book2.pizza', 'History of Philosophy')