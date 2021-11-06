CREATE TABLE note(
    id SERIAL PRIMARY KEY,
    description TEXT
);

CREATE TABLE tasks(
    unusedid SERIAL PRIMARY KEY,
    id TEXT,
    kategorie TEXT,
    inhalt TEXT,
    done BOOLEAN,
    email TEXT
);

CREATE TABLE bookmarks(
    id SERIAL PRIMARY KEY,
    link TEXT,
    folder TEXT,
    isfolder TEXT
)

CREATE TABLE pictures(
    id SERIAL PRIMARY KEY,
    url TEXT
);

CREATE TABLE categories(
    id SERIAL PRIMARY KEY,
    liste text,
    email text
);

CREATE TABLE pastebin(
    id SERIAL PRIMARY KEY,
    description text
);
