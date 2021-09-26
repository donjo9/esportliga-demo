import sqlite3 from "sqlite3";
import { open } from "sqlite";
(async () => {
  const _db = await open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });
  await _db.run("PRAGMA foreign_keys = ON");

  console.log("Beginning create db");
  const dropUsersTable = "DROP TABLE IF EXISTS users;";
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
        id text PRIMARY KEY,
        username text UNIQUE NOT NULL,
        password text NOT NULL,
        email text UNIQUE NOT NULL
    );
    `;
  await _db.run(dropUsersTable);

  await _db.run(createUsersTable);

  const dropTeamsTable = "DROP TABLE IF EXISTS teams;";
  const createTeamsTable = `
  CREATE TABLE IF NOT EXISTS teams ( 
        id text PRIMARY KEY,
        name text UNIQUE NOT NULL,
        tag text UNIQUE NOT NULL,
        teamOwner text NOT NULL,
        FOREIGN KEY (teamOwner) REFERENCES users (id) ON DELETE CASCADE
    );
  `;
  await _db.run(dropTeamsTable);

  await _db.run(createTeamsTable);

  const dropPlayerTeamRelationTable =
    "DROP TABLE IF EXISTS player_team_realation;";

  const createPlayerTeamRelationTable = `CREATE TABLE IF NOT EXISTS player_team_realation ( 
        id integer PRIMARY KEY,
        playerId text UNIQUE NOT NULL,
        teamId text NOT NULL,
        playerRole text NOT NULL,
        FOREIGN KEY (playerId) REFERENCES users (id) ON DELETE CASCADE
        FOREIGN KEY (teamId) REFERENCES teams (id) ON DELETE CASCADE
    );`;

  await _db.run(dropPlayerTeamRelationTable);

  await _db.run(createPlayerTeamRelationTable);

  const dropTeamInvitationsTable = "DROP TABLE IF EXISTS team_invitations;";
  const createTeamInvitationsTable = `CREATE TABLE IF NOT EXISTS team_invitations (
        id text PRIMARY KEY,
        playerId text NULL,
        teamId text NOT NULL,
        FOREIGN KEY (playerId) REFERENCES users (id) ON DELETE CASCADE
        FOREIGN KEY (teamId) REFERENCES teams (id) ON DELETE CASCADE
    );`;
  await _db.run(dropTeamInvitationsTable);

  await _db.run(createTeamInvitationsTable);
  console.log("Create db ended");
})();
