import { customAlphabet } from "nanoid";
import bcrypt from "bcryptjs";
const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxy",
  21
);
const playerRoles = [
  "PLAYER",
  "RIFLER",
  "SUPPORT",
  "AWP",
  "LURKER",
  "ENTRY",
  "IGL",
  "COACH",
];

export const Mutation = {
  signin: async (parent, { data }, { db }) => {
    const { username, password } = data;
    const sql = "SELECT id,username, password FROM users WHERE username = (?);";
    const user = await db.get(sql, [username]);
    if (!user) {
      throw new Error("Wrong username and/or password");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error("Wrong username and/or password");
    }

    return { user, token: nanoid() };
  },
  signup: async (parent, { data }, { db }, info) => {
    const { username, password, email } = data;
    const hash = await bcrypt.hash(password, 10);
    const id = nanoid();
    const res = await db.run(
      "INSERT INTO users (id, username, password, email) VALUES(?,?,?,?)",
      [id, username, hash, email]
    );
    return { user: { username, id }, token: nanoid() };
  },
  createTeam: async (parent, { data }, { db }) => {
    const { userId, name, tag } = data;
    const id = nanoid();
    const tSql = "INSERT INTO teams(id,name,tag, teamOwner) VALUES(?,?,?,?)";
    const rSql =
      "INSERT INTO player_team_realation(playerId,teamId,playerRole) VALUES(?,?,?)";
    await db.run(tSql, [id, name, tag, userId]);
    await db.run(rSql, [userId, id, "PLAYER"]);
    return { id, name, tag };
  },
  deleteTeam: async (parent, { data }, { db }) => {
    const { teamId, ownerId } = data;

    const dtSql = "DELETE FROM teams WHERE id = (?) AND teamOwner = (?);";
    try {
      await db.run(dtSql, [teamId, ownerId]);
    } catch (error) {
      console.error(error);
      return false;
    }
    return true;
  },
  createTeamInvitation: async (parent, { data }, { db }) => {
    try {
      const { playerId, teamId } = data;
      const sql =
        "INSERT INTO team_invitations(id, playerid, teamid) VALUES(?,?,?)";
      const values = [nanoid(), playerId, teamId];
      await db.run(sql, values);
      return true;
    } catch (error) {
      console.error(error);
      throw new Error("Wrong player and/or teamid, please try again!");
    }
  },
  acceptTeamInvitation: async (parent, { data }, { db }) => {
    const { invitationId } = data;
    const iSql = "SELECT playerId, teamId from team_invitations WHERE id = (?)";
    const invite = await db.get(iSql, [invitationId]);
    if (invite) {
      const rSql =
        "INSERT INTO player_team_realation(playerId,teamId, playerRole) VALUES(?,?, 'PLAYER')";
      await db.run(rSql, [invite.playerId, invite.teamId]);
      const sSql = "SELECT id, name, tag FROM teams WHERE id=(?)";
      const team = await db.get(sSql, [invite.teamId]);
      const dSql = "DELETE FROM team_invitations WHERE id = (?)";
      await db.run(dSql, invitationId);
      return team;
    } else {
      throw new Error("No invitation with that id");
    }
  },
  deleteTeamInvitation: async (parent, { data }, { db }) => {
    const { invitationId } = data;
    const iSql = "SELECT playerId, teamId from team_invitations WHERE id = (?)";
    const invite = await db.get(iSql, [invitationId]);
    if (invite) {
      const dSql = "DELETE FROM team_invitations WHERE id = (?)";
      await db.run(dSql, invitationId);
      return true;
    } else {
      throw new Error("No invitation with that id");
    }
  },
  editPlayer: async (parent, { data }, { db }) => {
    const { role, playerId } = data;
    if (playerRoles.some((r) => r === role)) {
      const uSql =
        "UPDATE player_team_realation SET playerRole=(?) WHERE playerId = (?)";
      await db.run(uSql, [role, playerId]);
      const sSql = `SELECT users.id, username, ptr.playerRole as role FROM users
                    JOIN player_team_realation ptr
                    ON ptr.playerId = users.id
                    WHERE users.id = (?);
                `;
      const player = await db.get(sSql, [playerId]);
      return player;
    } else {
      throw new Error("Selected Role not valid");
    }
  },
  removePlayer: async (parent, { data }, { db }) => {
    const { playerId, teamId } = data;

    const dSql = `DELETE FROM player_team_realation WHERE playerId=(?) AND teamId=(?);`;
    const d = await db.run(dSql, [playerId, teamId]);
    return !!d;
  },
};
