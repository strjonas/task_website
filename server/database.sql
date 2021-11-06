CREATE TABLE note(
    id SERIAL PRIMARY KEY,
    description TEXT
);

CREATE TABLE tasks(
    id TEXT,
    kategorie TEXT,
    inhalt TEXT,
    done BOOLEAN
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
    liste text
);

CREATE TABLE pastebin(
    id SERIAL PRIMARY KEY,
    description text
);
