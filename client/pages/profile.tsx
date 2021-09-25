import request, { gql } from "graphql-request";
import toast from "react-hot-toast";
import useSWR, { useSWRConfig } from "swr";
import { ActionButton } from "../componets/Buttons";
import { useAuth } from "../utils/useAuth";
import useTeam from "../utils/useTeam";

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
  teamInvitations: [TTeamInvitations];
  team: TTeam | null;
};

type TProfile = {
  player: TProfilePlayer;
};

const userQuery = gql`
  query getProfile($id: String!) {
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
const doGetProfile = async (query, id) => {
  return await request(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT, query, { id });
};

const acceptInvitaionQuery = gql`
  mutation acceptInvitation($invitationId: String) {
    acceptTeamInvitation(data: { invitationId: $invitationId }) {
      id
      name
      players {
        id
        username
        role
      }
    }
  }
`;

const leaveTeamQuery = gql`
  mutation leaveTeam($playerId: String, $teamId: String) {
    removePlayer(data: { playerId: $playerId, teamId: $teamId })
  }
`;
const deleteInvitaionQuery = gql`
  mutation deleteInvitation($invitationId: String) {
    deleteTeamInvitation(data: { invitationId: $invitationId })
  }
`;

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { mutate: teamMutate } = useTeam(user.id);
  const { mutate } = useSWRConfig();
  const { data } = useSWR<TProfile>(
    !!user.id ? [userQuery, user.id] : null,
    doGetProfile
  );
  if (!data) {
    return <div>"Loading..."</div>;
  }

  const deleteTeamInvitation = async (invitationId: string) => {
    const invitationRespons = await request(
      process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
      deleteInvitaionQuery,
      { invitationId }
    );
    toast.success("Invitation deleted");

    mutate([userQuery, user.id]);
  };
  const acceptTeamInvitation = async (invitationId: string) => {
    const invitationRespons = await request(
      process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
      acceptInvitaionQuery,
      { invitationId }
    );
    toast.success("Invitation acceptet");

    mutate([userQuery, user.id]);
    teamMutate(null, true);
  };

  const leaveTeam = async (playerId: string, teamId: string) => {
    const invitationRespons = await request(
      process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
      leaveTeamQuery,
      { playerId, teamId }
    );
    toast.success("Invitation acceptet");

    mutate([userQuery, user.id]);
    teamMutate(null, true);
  };
  console.log(data);

  return (
    <div>
      {data.player.username}
      <div>
        {data.player.team?.name}
        {data.player.team ? (
          <ActionButton
            onClick={() => leaveTeam(data.player.id, data.player.team.id)}
          >
            Leave team
          </ActionButton>
        ) : null}
      </div>
      <div>
        <h1>Team Invitations</h1>
        {data.player.teamInvitations.map((invitation) => (
          <div key={invitation.id}>
            {invitation.team.name}
            <button onClick={() => deleteTeamInvitation(invitation.id)}>
              &#10060;
            </button>
            <button onClick={() => acceptTeamInvitation(invitation.id)}>
              &#9989;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
