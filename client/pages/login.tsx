import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import styled from "styled-components";
import tw from "twin.macro";
import { LoginInputType } from "../types";
import { useAuth } from "../utils/useAuth";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import request, { gql } from "graphql-request";

const LoginContainer = styled.div`
  ${tw`flex justify-center w-full h-full items-center p-4`}
`;
const LoginForm = styled.form`
  ${tw`flex flex-col border rounded-xl min-h-full border-gray-700 w-1/5 bg-gray-600 p-6`}
`;

const LoginInput = styled.input`
  ${tw`bg-gray-800 rounded p-2 m-2`}
`;

const LoginButton = styled.input`
  ${tw`bg-green-500 rounded p-4 m-2 cursor-pointer`}
`;

const loginRequest = gql`
  mutation doSignIn($username: String!, $password: String!) {
    signin(data: { username: $username, password: $password }) {
      user {
        id
        username
      }
      token
    }
  }
`;

type LogInRespons = {
  signin: {
    token: string;
    user: {
      username: string;
      id: string;
    };
  };
};

const LoginPage: React.FC = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputType>();
  const { setUserInfo } = useAuth();

  const onSubmit: SubmitHandler<LoginInputType> = async (data) => {
    const { username, password } = data;

    try {
      const { signin } = await request<LogInRespons>(
        process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
        loginRequest,
        { username, password }
      );
      setUserInfo(signin.user);
      router.replace("/");
      toast.success("Login success");
    } catch ({ response: { errors } }) {
      if (errors) {
        errors.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        toast.error("Login failed, please try again");
      }
      return;
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit(onSubmit)}>
        <LoginInput
          {...register("username")}
          placeholder="username"
          type="text"
        />
        <LoginInput
          {...register("password")}
          placeholder="password"
          type="password"
        />
        <LoginButton type="submit" value="Login" />
      </LoginForm>
    </LoginContainer>
  );
};

export default LoginPage;
