import Head from "next/head";
import styled from "styled-components";
import useSWR from "swr";
import tw from "twin.macro";
import { request, gql } from "graphql-request";
import Team from "../componets/Team";

const getTeams = gql`
  query {
    teams {
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

const Container = styled.div`
  ${tw`min-w-full min-h-full bg-gray-800 text-gray-100 m-0`}
`;

const Home: React.FC = () => {
  const { data: teamData } = useSWR<any>(
    getTeams,
    async (q) => await request(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT, q)
  );

  if (!teamData) {
    return <div>"Loading..."</div>;
  }
  console.log(teamData);

  return (
    <Container>
      <Head>
        <title>Esportliga mini site</title>
      </Head>
      {teamData.teams.map((t) => (
        <Team key={t.id} name={t.name} players={t.players} />
      ))}
    </Container>
  );
};

export default Home;
