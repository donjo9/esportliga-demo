import * as React from "react";
import Link from "next/link";
import styled from "styled-components";
import tw from "twin.macro";
import { useAuth } from "../utils/useAuth";
import { useRouter } from "next/router";
import useUser from "../utils/useUser";
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
  const { user: authUser, setUserInfo } = useAuth();
  const { team } = useUser(authUser.id);
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

      {!authUser.username ? (
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
        <NavItem>{authUser.username}</NavItem>
      </Link>
      {team ? (
        <Link href={`/team/${team.id}`}>
          <NavItem>Team</NavItem>
        </Link>
      ) : null}
    </NavBarContainer>
  );
};

export default NavBar;
