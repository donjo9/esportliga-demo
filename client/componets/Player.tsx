import styled from "styled-components";
import tw from "twin.macro";

type TPlayer = {
  id: string;
  username: string;
  role: string;
};

const PlayerContainer = styled.div`
  ${tw`flex flex-row my-1`}
`;

const UserHeader = styled.h2`
  ${tw`mr-auto px-2`}
`;
const Player: React.FC<TPlayer> = ({ username, children }) => {
  return (
    <PlayerContainer>
      <UserHeader>{username}</UserHeader>

      {children}
    </PlayerContainer>
  );
};

export default Player;
