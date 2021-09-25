import request, { gql } from "graphql-request";
import toast from "react-hot-toast";
import useSWR, { useSWRConfig } from "swr";
import { ActionButton } from "../componets/Buttons";
import { useAuth } from "../utils/useAuth";
import useUser from "../utils/useUser";

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
  const { user: authUser } = useAuth();

  const {
    id: userId,
    username,
    team,
    teamInvitations,
    mutate,
    revalidate,
  } = useUser(authUser.id);

  const deleteTeamInvitation = async (invitationId: string) => {
    const invitationRespons = await request(
      process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
      deleteInvitaionQuery,
      { invitationId }
    );
    toast.success("Invitation deleted");

    revalidate();
  };
  const acceptTeamInvitation = async (invitationId: string) => {
    const invitationRespons = await request(
      process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
      acceptInvitaionQuery,
      { invitationId }
    );
    toast.success("Invitation acceptet");

    mutate(null, true);
    revalidate();
  };

  const leaveTeam = async (playerId: string, teamId: string) => {
    const invitationRespons = await request(
      process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
      leaveTeamQuery,
      { playerId, teamId }
    );
    toast.success("Left team successfully");

    mutate(null, true);
    revalidate();
  };

  return (
    <div>
      {username}
      <div>
        {team?.name}
        {team ? (
          <ActionButton onClick={() => leaveTeam(userId, team.id)}>
            Leave team
          </ActionButton>
        ) : null}
      </div>
      <div>
        <h1>Team Invitations</h1>
        {teamInvitations
          ? teamInvitations.map((invitation) => (
              <div key={invitation.id}>
                {invitation.team.name}
                <button onClick={() => deleteTeamInvitation(invitation.id)}>
                  &#10060;
                </button>
                <button onClick={() => acceptTeamInvitation(invitation.id)}>
                  &#9989;
                </button>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default ProfilePage;
