import request, { gql } from "graphql-request";
import toast from "react-hot-toast";
import useSWR, { useSWRConfig } from "swr";
import Team from "../../componets/Team";
import { useRouter } from "next/router";
import styled from "styled-components";
import tw from "twin.macro";
import Player from "../../componets/Player";
import { ActionButton } from "../../componets/Buttons";
import React from "react";
import RoleEdit, { TRoleEditFormData } from "../../componets/RoleEdit";
import { useAuth } from "../../utils/useAuth";

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
      teamOwner {
        id
      }
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
  mutation sendInvitation($userId: String!, $teamId: String) {
    createTeamInvitation(data: { playerId: $userId, teamId: $teamId })
  }
`;

const deleteInvitaionQuery = gql`
  mutation deleteInvitation($invitationId: String) {
    deleteTeamInvitation(data: { invitationId: $invitationId })
  }
`;

const removePlayerRequest = gql`
  mutation removePlayer($playerId: String!, $teamId: String!) {
    removePlayer(data: { playerId: $playerId, teamId: $teamId })
  }
`;

const editPlayerRequest = gql`
  mutation editPlayer($role: String!, $playerId: String!) {
    editPlayer(data: { role: $role, playerId: $playerId }) {
      username
      role
    }
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
  const { user } = useAuth();
  const { teamid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: teamData, error } = useSWR(
    teamid ? [teamQuery, teamid] : null,
    doGetTeamInfo
  );
  const { data: playersData } = useSWR(playerQuery, doGetPlayers);

  const sendTeamInvitation = async (userId: string, teamId: string) => {
    try {
      const invitationRespons = await request(
        process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
        sendInvitationQuery,
        { userId, teamId }
      );
      toast.success("Invitation send");

      mutate(playerQuery);
      mutate([teamQuery, teamId]);
    } catch (error) {
      error?.response?.errors.forEach((error) => toast.error(error.message));
    }
  };
  const removePlayer = async (
    playerName: string,
    playerId: string,
    teamId: string
  ) => {
    const answer = window.confirm(`Remove ${playerName} from team?`);
    if (answer) {
      try {
        const removePlayerRespons = await request(
          process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
          removePlayerRequest,
          { playerId, teamId }
        );
        if (removePlayerRespons) {
          toast.success("Player removed successfully");
          mutate(playerQuery);
          mutate([teamQuery, teamId]);
        } else {
          toast.error("Player removed failed, try again");
        }
      } catch ({ response: { errors } }) {
        if (errors) {
          errors.forEach((err) => {
            toast.error(err.message);
          });
        } else {
          toast.error("Player removed failed, try again");
        }
      }
    }
  };
  const deleteTeamInvitation = async (invitationId: string) => {
    try {
      const invitationRespons = await request(
        process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
        deleteInvitaionQuery,
        { invitationId }
      );
      if (invitationRespons) {
        toast.success("Invitation deleted");

        mutate(playerQuery);
        mutate([teamQuery, teamid]);
      } else {
        toast.error("Invitation deletion failed, try again");
      }
    } catch ({ response: { errors } }) {
      if (errors) {
        errors.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        toast.error("Invitation deletion failed, try again");
      }
    }
  };

  if (!teamData) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.error(error);
  }

  const onRoleEditSubmit = async (formData: TRoleEditFormData) => {
    const { role, playerId } = formData;

    try {
      const roleEdited = await request(
        process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
        editPlayerRequest,
        { role, playerId }
      );
      toast.success(
        `${roleEdited.editPlayer.username} now has the role ${roleEdited.editPlayer.role}`
      );
    } catch ({ response: { errors } }) {
      if (errors) {
        errors.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        toast.error("Role edit failed, try again");
      }
    }
  };
  const { team } = teamData;
  const { playerInvitations } = team;

  const invitatedPlayers = new Set<string>();
  for (let i: number = 0; i < playerInvitations.length; i++) {
    invitatedPlayers.add(playerInvitations[i].user.id);
  }

  return (
    <div>
      {team ? (
        <Team name={team.name}>
          {team.players?.map((player) => (
            <React.Fragment key={player.id}>
              <Player {...player}>
                {user.id !== player.id && player.id !== team.teamOwner.id ? (
                  <ActionButton
                    onClick={() =>
                      removePlayer(player.username, player.id, team.id)
                    }
                  >
                    Remove player
                  </ActionButton>
                ) : (
                  <div></div>
                )}
                <RoleEdit
                  role={player.role}
                  playerId={player.id}
                  onSubmit={onRoleEditSubmit}
                />
              </Player>
            </React.Fragment>
          ))}
        </Team>
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
