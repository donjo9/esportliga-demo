import Player from "./Player";

const Team: React.FC<{ name: string; players: Array<any> }> = ({
  name,
  players,
}) => {
  return (
    <div>
      {name}
      {players.map((p) => (
        <Player key={p.id} {...p} />
      ))}
    </div>
  );
};

export default Team;
