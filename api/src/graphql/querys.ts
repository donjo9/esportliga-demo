import { GraphQLResolveInfo } from "graphql";

const team = async (parent, data, { playerTeamLoader }) => {
  const teams = await playerTeamLoader.load(parent.id);
  return teams;
};

const players = async (parent, data, { teamPlayerLoader }) => {
  const players = await teamPlayerLoader.load(parent.id);
  return players;
};

const teamInvitations = async (
  parent,
  data,
  { playerTeamInvitationsLoader }
) => {
  const invitations = await playerTeamInvitationsLoader.load(parent.id);
  return invitations;
};

const playerInvitations = async (
  parent,
  data,
  { teamPlayerInvitationsLoader }
) => {
  const invitations = await teamPlayerInvitationsLoader.load(parent.id);
  return invitations;
};

const invitationTeam = async (parent, data, { invitationTeamLoader }) => {
  const invitations = await invitationTeamLoader.load(parent.id);
  return invitations;
};

const invitationUser = async (parent, data, { invitationUserLoader }) => {
  const invitations = await invitationUserLoader.load(parent.id);
  return invitations;
};

export const User = {
  team,
  teamInvitations,
};

export const Player = {
  team,
};

export const Team = {
  players,
  playerInvitations,
};

export const TeamInvitation = {
  team: invitationTeam,
  user: invitationUser,
};

export const Query = {
  player: async (parent, { id }, { db }, info: GraphQLResolveInfo) => {
    const sql = "SELECT id, username from users WHERE id=(?);";
    const user = await db.get(sql, id);

    return user;
  },
  players: async (parent, { filter }, { db }, info) => {
    let sql = "SELECT users.id, users.username FROM users ";
    if (filter?.freePlayer === true) {
      sql += `LEFT JOIN player_team_realation ptr
              ON users.id =  ptr.playerId
              WHERE ptr.playerId IS NULL`;
    } else if (filter?.freePlayer === false) {
      sql += `JOIN player_team_realation ptr
              ON users.id =  ptr.playerId`;
    }

    const users = await db.all(sql);
    return users || [];
  },
  teams: async (parent, args, { db }) => {
    const sql = "SELECT id, name, tag FROM teams;";
    const t = await db.all(sql);
    return t;
  },
  team: async (parent, { id }, { db }) => {
    const sql = "SELECT id, name, tag FROM teams WHERE id=(?)";
    const team = await db.get(sql, [id]);
    return team;
  },
};
