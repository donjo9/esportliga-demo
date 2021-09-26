DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
    id text PRIMARY KEY,
    username text UNIQUE NOT NULL,
    password text NOT NULL,
    email text UNIQUE NOT NULL
);

DROP TABLE IF EXISTS teams;
CREATE TABLE IF NOT EXISTS teams ( 
    id text PRIMARY KEY,
    name text UNIQUE NOT NULL,
    tag text UNIQUE NOT NULL,
    teamOwner text NOT NULL,
    FOREIGN KEY (teamOwner) REFERENCES users (id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS player_team_realation;
CREATE TABLE IF NOT EXISTS player_team_realation ( 
    id integer PRIMARY KEY,
    playerId text UNIQUE NOT NULL,
    teamId text NOT NULL,
    playerRole text NOT NULL,
    FOREIGN KEY (playerId) REFERENCES users (id) ON DELETE CASCADE
    FOREIGN KEY (teamId) REFERENCES teams (id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS team_invitations;
CREATE TABLE IF NOT EXISTS team_invitations (
    id text PRIMARY KEY,
    playerId text NULL,
    teamId text NOT NULL,
    FOREIGN KEY (playerId) REFERENCES users (id) ON DELETE CASCADE
    FOREIGN KEY (teamId) REFERENCES teams (id) ON DELETE CASCADE
);
SELECT * from player_team_realation;

SELECT * from player_team_realation WHERE playerId = 'u2l4UStXbZh4nfjRpcG27' AND teamId = '25O2txdHyWFRQqPbkXJSU';

DELETE FROM team_invitations WHERE TRUE;