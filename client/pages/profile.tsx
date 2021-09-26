import request, { gql } from "graphql-request";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import styled from "styled-components";
import tw from "twin.macro";
import { ActionButton, ButtonBase } from "../componets/Buttons";
import { useAuth } from "../utils/useAuth";
import useUser from "../utils/useUser";

const CreateTeamForm = styled.form`
  ${tw`flex w-max flex-col`}
`;

const CreateTeamInput = styled.input`
  ${tw`bg-gray-600 text-gray-900 w-max border m-2 p-1 rounded-lg text-gray-100`}
`;

const CreateTeamButton = styled.input`
  ${ButtonBase}
  ${tw`cursor-pointer text-center m-2 p-1`}
`;

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

const createTeamQuery = gql`
  mutation createTeam($name: String, $tag: String, $userId: String) {
    createTeam(data: { name: $name, tag: $tag, userId: $userId }) {
      id
    }
  }
`;
const deleteTeamQuery = gql`
  mutation deleteTeam($teamId: String!, $ownerId: String!) {
    deleteTeam(data: { teamId: $teamId, ownerId: $ownerId })
  }
`;
const ProfilePage: React.FC = () => {
  const { user: authUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    id: userId,
    username,
    team,
    teamInvitations,
    mutate,
    revalidate,
  } = useUser(authUser.id);

  const deleteTeamInvitation = async (invitationId: string) => {
    try {
      const invitationRespons = await request(
        process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
        deleteInvitaionQuery,
        { invitationId }
      );
      if (invitationRespons) {
        toast.success("Invitation deleted");

        revalidate();
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
  const acceptTeamInvitation = async (invitationId: string) => {
    try {
      const invitationRespons = await request(
        process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
        acceptInvitaionQuery,
        { invitationId }
      );
      if (invitationRespons) {
        toast.success("Invitation acceptet");
        mutate(null, true);
        revalidate();
      } else {
        toast.error("Invitation accept failed, try again");
      }
    } catch ({ response: { errors } }) {
      if (errors) {
        errors.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        toast.error("Invitation accept failed, try again");
      }
    }
  };

  const leaveTeam = async (playerId: string, teamId: string) => {
    try {
      const leaveTeamRespons = await request(
        process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
        leaveTeamQuery,
        { playerId, teamId }
      );
      if (leaveTeamRespons) {
        toast.success("Left team successfully");

        mutate(null, true);
        revalidate();
      } else {
        toast.error("Left team unsucessfull, try again");
      }
    } catch ({ response: { errors } }) {
      if (errors) {
        errors.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        toast.error("Left team unsucessfull, try again");
      }
    }
  };

  const deleteTeam = async (teamId: string, ownerId: string) => {
    try {
      const deleteTeamRespons = await request(
        process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
        deleteTeamQuery,
        { teamId, ownerId }
      );
      if (deleteTeamRespons) {
        toast.success("Team deleted sucessfully");
        revalidate();
      }
    } catch ({ response: { errors } }) {
      if (errors) {
        errors.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        toast.error("Left team unsucessfull, try again");
      }
    }
  };

  type CreateTeamFormData = {
    name: string;
    tag: string;
    userId: string;
  };

  const onSubmit = async (formData: CreateTeamFormData) => {
    try {
      const { name, tag, userId } = formData;

      const createTeamRespons = await request(
        process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
        createTeamQuery,
        { name, tag, userId }
      );
      if (createTeamRespons) {
        toast.success("Team created sucessfully");
        revalidate();
      }
    } catch ({ response: { errors } }) {
      if (errors) {
        errors.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        toast.error("Left team unsucessfull, try again");
      }
    }
  };
  return (
    <div>
      {username}
      <div>
        {team?.name}
        {team ? (
          userId != team.teamOwner.id ? (
            <ActionButton onClick={() => leaveTeam(userId, team.id)}>
              Leave team
            </ActionButton>
          ) : (
            <ActionButton onClick={() => deleteTeam(team.id, userId)}>
              Delete team
            </ActionButton>
          )
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
      {!team && userId ? (
        <CreateTeamForm onSubmit={handleSubmit(onSubmit)}>
          <label>Create New Team:</label>
          <CreateTeamInput
            type="text"
            {...register("name")}
            placeholder="Team Name"
          />
          <CreateTeamInput
            type="text"
            {...register("tag")}
            placeholder="Tag/Short Name"
          />
          <input type="hidden" defaultValue={userId} {...register("userId")} />
          <CreateTeamButton type="submit" value="Save" />
        </CreateTeamForm>
      ) : null}
    </div>
  );
};

export default ProfilePage;
