import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { customAlphabet } from "nanoid";
import bcrypt from "bcryptjs";
const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxy",
  21
);

const users = [
  {
    id: nanoid(),
  },
  {
    id: nanoid(),
  },
  {
    id: nanoid(),
  },
  {
    id: nanoid(),
  },
  {
    id: nanoid(),
  },
];

const teams = [
  {
    id: nanoid(),
  },
  {
    id: nanoid(),
  },
];

(async () => {
  const _db = await open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });
  await _db.run("PRAGMA foreign_keys = ON");

  console.log("Beginning seed db");

  const createUser =
    "INSERT INTO users (id,username,password,email) VALUES(?,?,?,?)";
  for (let i = 0; i < users.length; i++) {
    let hash = await bcrypt.hash("test123", 10);
    await _db.run(createUser, [
      users[i].id,
      `user${i}`,
      hash,
      `u${i}@example.com`,
    ]);
  }
  const createTeam =
    "INSERT INTO teams (id,name,tag,teamOwner) VALUES(?,?,?,?);";
  const createTeamPlayerRelation =
    "INSERT INTO player_team_realation(playerId,teamId,playerRole) VALUES(?,?,?)";
  try {
    for (let i = 0; i < teams.length; i++) {
      await _db.run(createTeam, [
        teams[i].id,
        `Team${i}`,
        `T-${i}`,
        users[i].id,
      ]);
      await _db.run(createTeamPlayerRelation, [
        users[i].id,
        teams[i].id,
        "PLAYER",
      ]);
    }
  } catch (error) {
    console.error(error);
  }

  const createTeamInvitation =
    "INSERT INTO team_invitations(id, playerid, teamid) VALUES(?,?,?)";
  try {
    for (let i = 0; i < teams.length; i++) {
      await _db.run(createTeamInvitation, [
        nanoid(),
        users[i + teams.length].id,
        teams[i].id,
      ]);
    }
  } catch (error) {
    console.error(error);
  }
  console.log("Seed db ended");
})();
