import { User } from "./querys";
import { gql } from "apollo-server";
export const typeDefs = gql`
  interface U {
    id: ID!
    username: String!
    team: Team
  }

  type User implements U {
    id: ID!
    username: String!
    team: Team
    teamInvitations: [TeamInvitation]!
  }

  enum PlayerRole {
    PLAYER
    RIFLER
    SUPPORT
    AWP
    LURKER
    ENTRY
    IGL
    COACH
  }

  type Player implements U {
    id: ID!
    username: String!
    team: Team
    role: PlayerRole
  }

  type Team {
    id: ID!
    name: String!
    tag: String!
    players: [Player]!
    playerInvitations: [TeamInvitation]!
  }

  type AuthRespons {
    user: User
    token: String
  }

  type TeamInvitation {
    id: ID!
    user: User!
    team: Team!
  }

  input SignInPayload {
    username: String
    password: String
  }
  input SignUpPayLoad {
    username: String
    password: String
    email: String
  }

  input CreateTeamPayload {
    userid: String
    name: String
    tag: String
  }
  input CreateTeamInvitationPayload {
    playerid: String
    teamid: String
  }
  input AcceptTeamInvitationPayload {
    invitationid: String
  }

  input EditPlayerPayload {
    playerId: String
    role: String
  }

  input DeletePlayerPayload {
    playerId: String
    teamId: String
  }

  type Query {
    player(id: String): User
    players: [User]!
    team(id: String): Team
    teams: [Team]!
    invitation(id: String): TeamInvitation
  }

  type Mutation {
    signin(data: SignInPayload): AuthRespons!
    signup(data: SignUpPayLoad): AuthRespons!
    createTeam(data: CreateTeamPayload): Team!
    createTeamInvitation(data: CreateTeamInvitationPayload): Boolean!
    acceptTeamInvitation(data: AcceptTeamInvitationPayload): Team!
    editPlayer(data: EditPlayerPayload): Player!
    removePlayer(data: DeletePlayerPayload): Player!
  }
`;
