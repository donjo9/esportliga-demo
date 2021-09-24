import request, { gql } from "graphql-request";
import useSWR from "swr";

type TTeamPlayers = {
  id: string;
  username: string;
  role: string;
};

type TPlayerTeam = {
  player: {
    id: string;
    team: {
      id: string;
      name: string;
      players: [TTeamPlayers];
    } | null;
  };
};

const userQuery = gql`
  query getPlayerTeam($id: String!) {
    player(id: $id) {
      team {
        id
        name
        players {
          id
          username
          role
        }
      }
    }
  }
`;

const doGetTeam = async (query, id) => {
  return await request(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT, query, { id });
};
const useTeam = (id: string) => {
  const { data, error, mutate } = useSWR<TPlayerTeam>(
    !!id ? [userQuery, id] : null,
    doGetTeam
  );

  return {
    data,
    isLoading: !data && !error,
    error,
    mutate,
  };
};

export default useTeam;
