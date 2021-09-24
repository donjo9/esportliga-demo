import request, { gql } from "graphql-request";
import toast from "react-hot-toast";
import useSWR, { useSWRConfig } from "swr";
import Team from "../../componets/Team";
import { useRouter } from "next/router";
import styled from "styled-components";
import tw from "twin.macro";

const PlayersContainer = styled.div`
  ${tw`grid p-2 border border-gray-700 bg-gray-600 m-2`}
`;

const playerQuery = gql`
  query {
    players(filter: { freePlayer: true }) {
      id
      username
    }
  }
`;

const teamQuery = gql`
  query getTeamInfo($id: String!) {
    team(id: $id) {
      id
      name
      playerInvitations {
        id
        user {
          id
          username
        }
      }
      players {
        id
        username
        role
      }
    }
  }
`;

const sendInvitationQuery = gql`
  mutation sendInvitation($userid: String!, $teamid: String) {
    createTeamInvitation(data: { playerid: $userid, teamid: $teamid })
  }
`;

const deleteInvitaionQuery = gql`
  mutation deleteInvitation($invitationid: String) {
    deleteTeamInvitation(data: { invitationid: $invitationid })
  }
`;

const doGetPlayers = async (query) => {
  return await request(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT, query);
};
const doGetTeamInfo = async (query, id) => {
  return await request(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT, query, { id });
};

const TeamPage: React.FC = () => {
  const router = useRouter();
  const { teamid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: teamData, error } = useSWR(
    teamid ? [teamQuery, teamid] : null,
    doGetTeamInfo
  );
  const { data: playersData } = useSWR(playerQuery, doGetPlayers);

  const sendTeamInvitation = async (userid: string, teamid: string) => {
    const invitationRespons = await request(
      process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
      sendInvitationQuery,
      { userid, teamid }
    );
    toast.success("Invitation send");

    mutate(playerQuery);
    mutate([teamQuery, teamid]);
  };
  const deleteTeamInvitation = async (invitationid: string) => {
    const invitationRespons = await request(
      process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
      deleteInvitaionQuery,
      { invitationid }
    );
    toast.success("Invitation deleted");

    mutate(playerQuery);
    mutate([teamQuery, teamid]);
  };
  console.log(teamData);

  if (!teamData) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error(error);
  }

  const { team } = teamData;
  const { playerInvitations } = team;

  const invitatedPlayers = new Set<string>();
  for (let i: number = 0; i < playerInvitations.length; i++) {
    invitatedPlayers.add(playerInvitations[i].user.id);
  }

  return (
    <div>
      {team ? (
        <Team name={team.name} players={team.players} />
      ) : (
        "You don't have a team yet"
      )}
      <div className="flex">
        <PlayersContainer>
          <h1>Invited players</h1>
          {playerInvitations
            ? playerInvitations.map((invitation) => (
                <button
                  key={invitation.id}
                  onClick={() => {
                    deleteTeamInvitation(invitation.id);
                  }}
                >
                  {invitation.user.username}&#10060;
                </button>
              ))
            : null}
        </PlayersContainer>
        <PlayersContainer>
          <h1>Free players</h1>
          {playersData
            ? playersData.players
                .filter((player) => !invitatedPlayers.has(player.id))
                .map((player) => (
                  <button
                    key={player.id}
                    onClick={() => {
                      sendTeamInvitation(player.id, team.id);
                    }}
                  >
                    {player.username}
                    &#9989;
                  </button>
                ))
            : null}
        </PlayersContainer>
      </div>
    </div>
  );
};

export default TeamPage;
