import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import tw from "twin.macro";
import { ButtonBase } from "./Buttons";

const playerRoles = [
  "PLAYER",
  "RIFLER",
  "SUPPORT",
  "AWP",
  "LURKER",
  "ENTRY",
  "IGL",
  "COACH",
];

const RoleForm = styled.form`
  ${tw`grid grid-cols-2`}
`;

const RoleSelect = styled.select`
  ${tw`bg-gray-600 text-gray-900 p-1`}
`;

const SaveButton = styled.input`
  ${ButtonBase}
  ${tw`cursor-pointer`}
`;

export type TRoleEditFormData = {
  role: string;
  playerId: string;
};

type TRoleEditProps = TRoleEditFormData & {
  onSubmit: (formData: TRoleEditFormData) => void;
};

const RoleEdit: React.FC<TRoleEditProps> = ({ role, playerId, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  return (
    <RoleForm onSubmit={handleSubmit(onSubmit)}>
      <RoleSelect defaultValue={role} {...register(`role`)}>
        {playerRoles.map((roleOption) => (
          <option value={roleOption} key={roleOption}>
            {roleOption}
          </option>
        ))}
      </RoleSelect>
      <input type="hidden" defaultValue={playerId} {...register(`playerId`)} />
      <SaveButton type="submit" value="Save" />
    </RoleForm>
  );
};

export default RoleEdit;
