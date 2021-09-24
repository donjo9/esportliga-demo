import type { AppProps /*, AppContext */ } from "next/app";
import { Toaster } from "react-hot-toast";
import styled from "styled-components";
import tw from "twin.macro";
import NavBar from "../componets/NavBar";
import "../styles/globals.css";
import { AuthProvider } from "../utils/useAuth";

const Container = styled.div`
  ${tw`min-w-full min-h-full bg-gray-800 text-gray-100 m-0`}
`;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Container>
      <Toaster />
      <AuthProvider>
        <NavBar />
        <Component {...pageProps} />
      </AuthProvider>
    </Container>
  );
}

export default MyApp;
