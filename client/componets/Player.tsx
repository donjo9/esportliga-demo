type TPlayer = {
  id: string;
  username: string;
  role: string;
};

const Player: React.FC<TPlayer> = ({ id, username, role }) => {
  return (
    <div>
      {" "}
      {username} {role}
    </div>
  );
};

export default Player;
