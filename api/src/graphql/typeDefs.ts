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
    teamOwner: User!
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
    userId: String
    name: String
    tag: String
  }

  input DeleteTeamPayload {
    teamId: String!
    ownerId: String!
  }
  input CreateTeamInvitationPayload {
    playerId: String
    teamId: String
  }
  input AcceptTeamInvitationPayload {
    invitationId: String
  }

  input DeleteTeamInvitationPayload {
    invitationId: String
  }

  input EditPlayerPayload {
    playerId: String
    role: String
  }

  input DeletePlayerPayload {
    playerId: String
    teamId: String
  }

  input PlayerFilter {
    freePlayer: Boolean!
  }

  type Query {
    player(id: String): User
    players(filter: PlayerFilter): [User]!
    team(id: String): Team
    teams: [Team]!
    invitation(id: String): TeamInvitation
  }

  type Mutation {
    signin(data: SignInPayload): AuthRespons!
    signup(data: SignUpPayLoad): AuthRespons!
    createTeam(data: CreateTeamPayload): Team!
    deleteTeam(data: DeleteTeamPayload): Boolean!
    createTeamInvitation(data: CreateTeamInvitationPayload): Boolean!
    acceptTeamInvitation(data: AcceptTeamInvitationPayload): Team!
    deleteTeamInvitation(data: DeleteTeamInvitationPayload): Boolean!
    editPlayer(data: EditPlayerPayload): Player!
    removePlayer(data: DeletePlayerPayload): Boolean!
  }
`;
