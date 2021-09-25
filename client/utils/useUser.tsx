import request, { gql } from "graphql-request";
import useSWR, { useSWRConfig } from "swr";

type TTeam = {
  id: string;
  name: string;
};

type TTeamInvitations = {
  id: string;
  team: TTeam;
};

type TProfilePlayer = {
  id: string;
  username: string;
  teamInvitations: [TTeamInvitations?];
  team: TTeam | null;
};

type TProfile = {
  player: TProfilePlayer;
};

const userQuery = gql`
  query getPlayerTeam($id: String!) {
    player(id: $id) {
      id
      username
      teamInvitations {
        id
        team {
          id
          name
        }
      }
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

const defaultUserValues: TProfile = {
  player: {
    id: null,
    username: null,
    teamInvitations: [],
    team: null,
  },
};

const doGetUser = async (query, id) => {
  return await request(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT, query, { id });
};
const useUser = (userId: string) => {
  const { mutate: globalMutate } = useSWRConfig();
  const { data, error, mutate } = useSWR<TProfile>(
    !!userId ? [userQuery, userId] : null,
    doGetUser,
    {
      fallbackData: defaultUserValues,
    }
  );

  const revalidate = () => {
    globalMutate([userQuery, userId], true);
  };
  const { player } = data || { ...defaultUserValues };
  const { id, username, teamInvitations, team } = player || {};
  return {
    id,
    username,
    teamInvitations,
    team,
    isLoading: !data && !error,
    error,
    mutate,
    revalidate,
  };
};

export default useUser;
