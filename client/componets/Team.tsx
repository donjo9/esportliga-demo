import styled from "styled-components";
import tw from "twin.macro";

const TeamTitle = styled.div`
  ${tw`p-2 text-xl`}
`;

const PlayerHeader = styled.h1`
  ${tw`px-2 text-xl`}
`;
const PlayerGrid = styled.div`
  ${tw`grid grid-cols-1 w-max p-2`}
`;

const Team: React.FC<{ name: string }> = ({ name, children }) => {
  return (
    <>
      <TeamTitle>{name}</TeamTitle>
      <PlayerHeader>Players:</PlayerHeader>
      <PlayerGrid>{children}</PlayerGrid>
    </>
  );
};

export default Team;
