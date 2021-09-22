import { ApolloServer } from "apollo-server";
import { typeDefs } from "./graphql/typeDefs";
import { Mutation } from "./graphql/mutations";
import { Query, User, Team, Player, TeamInvitation } from "./graphql/querys";

import { db as database } from "./utils/db";
import DataLoader from "dataloader";
import {
  getBatchInvitationTeams,
  getBatchInvitationUsers,
  getBatchPlayerTeamInvitation,
  getBatchPlayerTeams,
  getBatchTeamPlayers,
} from "./utils/dataloaders";

const resolvers = {
  Query,
  User,
  Team,
  Mutation,
  Player,
  TeamInvitation,
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async () => {
    const db = await database();

    const teamPlayerLoader = new DataLoader(getBatchTeamPlayers);
    const playerTeamLoader = new DataLoader(getBatchPlayerTeams);

    const playerTeamInvitationsLoader = new DataLoader(
      getBatchPlayerTeamInvitation
    );

    const invitationTeamLoader = new DataLoader(getBatchInvitationTeams);

    const invitationUserLoader = new DataLoader(getBatchInvitationUsers);
    return {
      db,
      teamPlayerLoader,
      playerTeamLoader,
      playerTeamInvitationsLoader,
      invitationTeamLoader,
      invitationUserLoader,
    };
  },
});

server.listen(3000).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
