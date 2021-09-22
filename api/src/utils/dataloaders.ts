import { db as database } from "./db";

type TUser = {
  id: string;
  username: string;
  email: string;
};

type TPlayer = {
  id: string;
  username: string;
  email: string;
  role: string;
};

type TTeam = {
  id: string;
  name: string;
  tag: string;
};

type TInvitation = {
  id: string;
};

export const getBatchPlayerTeams = async (
  playerIds: readonly string[]
): Promise<Array<TTeam>> => {
  const db = await database();
  const placeholder = playerIds.map(() => "?").join(",");
  const sql = `SELECT teams.id as tid, teams.name, teams.tag, user.id as uid FROM teams
  JOIN player_team_realation ptr
  ON teams.id = ptr.teamId
  JOIN users user
  on ptr.playerId = user.id
  WHERE user.id IN (${placeholder})`;
  const rows = await db.all(sql, playerIds);
  let mappedInput = {};
  if (rows) {
    rows.forEach((r) => {
      mappedInput[r.uid] = {
        id: r.tid,
        name: r.name,
        tag: r.tag,
      };
    });
  }
  const playerArray = playerIds.map((key) => mappedInput[key]);
  return playerArray;
};

export const getBatchTeamPlayers = async (
  teamIds: readonly string[]
): Promise<Array<TPlayer>> => {
  const db = await database();
  const placeholder = teamIds.map(() => "?").join(",");
  const sql = `SELECT users.id as uid, users.username as username, users.email as email, team.id as tid, ptr.playerRole as role  FROM users
  JOIN player_team_realation ptr
  ON users.id = ptr.playerId
  JOIN teams team
  on ptr.teamId = team.id
  WHERE team.id IN (${placeholder})`;
  const rows = await db.all(sql, teamIds);
  let mappedInput = {};
  if (rows) {
    rows.forEach((r) => {
      if (mappedInput[r.tid] !== undefined) {
        mappedInput[r.tid].push({
          id: r.uid,
          username: r.username,
          email: r.email,
          role: r.role,
        });
      } else {
        mappedInput[r.tid] = [];
        mappedInput[r.tid].push({
          id: r.uid,
          username: r.username,
          email: r.email,
          role: r.role,
        });
      }
    });
  }
  const teamArray = teamIds.map((key) => mappedInput[key]);
  return teamArray;
};

export const getBatchPlayerTeamInvitation = async (
  playerIds: readonly string[]
): Promise<Array<TInvitation>> => {
  const db = await database();
  const placeholder = playerIds.map(() => "?").join(",");
  const sql = `SELECT ti.id as tiid, users.id as uid FROM team_invitations ti
  JOIN users
  ON users.id = ti.playerId
  WHERE users.id IN (${placeholder})`;
  const rows = await db.all(sql, playerIds);
  let mappedInput = {};
  if (rows) {
    rows.forEach((r) => {
      if (mappedInput[r.uid] !== undefined) {
        mappedInput[r.uid].push({
          id: r.tiid,
        });
      } else {
        mappedInput[r.uid] = [];
        mappedInput[r.uid].push({
          id: r.tiid,
        });
      }
    });
  }

  const invitationsArray = playerIds.map((key) => mappedInput[key] || []);
  return invitationsArray;
};

export const getBatchInvitationTeams = async (
  invitationIds: readonly string[]
): Promise<Array<TTeam>> => {
  const db = await database();
  const placeholder = invitationIds.map(() => "?").join(",");
  const sql = `SELECT teams.id as tid, teams.name, teams.tag, ti.id as tiid FROM teams
  JOIN team_invitations ti
  ON ti.teamId = teams.id
  WHERE ti.id IN (${placeholder})`;
  const rows = await db.all(sql, invitationIds);
  let mappedInput = {};
  if (rows) {
    rows.forEach((r) => {
      mappedInput[r.tiid] = {
        id: r.tid,
        name: r.name,
        tag: r.tag,
      };
    });
  }
  const teamArray = invitationIds.map((key) => mappedInput[key]);
  return teamArray;
};

export const getBatchInvitationUsers = async (
  invitationIds: readonly string[]
): Promise<Array<TUser>> => {
  const db = await database();
  const placeholder = invitationIds.map(() => "?").join(",");
  const sql = `SELECT users.id as uid, users.username, ti.id as tiid FROM users
  JOIN team_invitations ti
  ON ti.playerId = users.id
  WHERE ti.id IN (${placeholder})`;
  const rows = await db.all(sql, invitationIds);
  let mappedInput = {};
  if (rows) {
    rows.forEach((r) => {
      mappedInput[r.tiid] = {
        id: r.uid,
        username: r.username,
        email: r.email,
      };
    });
  }
  const teamArray = invitationIds.map((key) => mappedInput[key]);
  return teamArray;
};
