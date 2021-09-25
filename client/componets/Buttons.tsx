import styled from "styled-components";
import tw from "twin.macro";

export const ButtonBase = tw`mx-2 px-2 border-2 rounded-xl border-gray-700 bg-green-800 hover:bg-green-600`;

export const ActionButton = styled.button`
  ${ButtonBase}
  ${tw`w-max`}
`;
