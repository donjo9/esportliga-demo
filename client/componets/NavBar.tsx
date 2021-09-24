import * as React from "react";
import Link from "next/link";
import styled from "styled-components";
import tw from "twin.macro";
import { useAuth } from "../utils/useAuth";
import { useRouter } from "next/router";
import useTeam from "../utils/useTeam";
import toast, { Toaster } from "react-hot-toast";

const NavBarContainer = styled.nav`
  ${tw`min-w-full bg-gray-900 p-4 flex`}
`;

const NavStyle = tw`p-4 text-gray-300 cursor-pointer hover:text-blue-300 hover:underline`;

const NavItem = styled.a`
  ${NavStyle}
`;

const Logout = styled.button`
  ${NavStyle}
  ${tw`focus:outline-none`}
`;

const NavBar = () => {
  const { user, setUserInfo } = useAuth();
  const { data } = useTeam(user.id);
  const router = useRouter();
  const SignOutHandler = async () => {
    setUserInfo({ username: "", id: "" });
    toast.success("Successfully signed out");
    router.replace("/");
  };
  return (
    <NavBarContainer>
      <Link href="/">
        <NavItem>Home</NavItem>
      </Link>

      {!user.username ? (
        <>
          <Link href="/login">
            <NavItem>Login</NavItem>
          </Link>
          <Link href="/signup">
            <NavItem>Signup</NavItem>
          </Link>
        </>
      ) : (
        <>
          <Logout onClick={SignOutHandler}>Logout</Logout>
        </>
      )}

      <Link href={`/profile`}>
        <NavItem>{user.username}</NavItem>
      </Link>
      {data?.player?.team ? (
        <Link href={`/team/${data.player.team.id}`}>
          <NavItem>Team</NavItem>
        </Link>
      ) : null}
    </NavBarContainer>
  );
};

export default NavBar;
