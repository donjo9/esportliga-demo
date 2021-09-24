import request, { gql } from "graphql-request";
import { useRouter } from "next/router";
import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import styled from "styled-components";
import tw from "twin.macro";
import { SignupInputType } from "../types";
import { useAuth } from "../utils/useAuth";

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

const sigupRequest = gql`
  mutation newPlayers($username: String!, $password: String!, $email: String!) {
    signup(data: { username: $username, password: $password, email: $email }) {
      user {
        id
        username
      }
      token
    }
  }
`;

type SignupRespons = {
  signup: {
    token: string;
    user: {
      username: string;
      id: string;
    };
  };
};

const SignUpPage: React.FC = () => {
  const router = useRouter();
  const { setUserInfo } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInputType>();

  const onSubmit: SubmitHandler<SignupInputType> = async (data) => {
    console.log(data);

    const { username, password, email } = data;

    try {
      const { signup } = await request<SignupRespons>(
        process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
        sigupRequest,
        { username, password, email }
      );
      setUserInfo(signup.user);
      router.replace("/");
      toast.success("Signup success");
    } catch ({ response: { errors } }) {
      if (errors) {
        errors.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        toast.error("Signup failed, please try again");
      }
    }
  };

  return (
    <LoginContainer>
      <Toaster />
      <LoginForm onSubmit={handleSubmit(onSubmit)}>
        <LoginInput
          {...register("username")}
          placeholder="username"
          type="text"
        />
        <LoginInput {...register("email")} placeholder="email" type="email" />
        <LoginInput
          {...register("password")}
          placeholder="password"
          type="password"
        />
        <LoginButton type="submit" value="Signup" />
      </LoginForm>
    </LoginContainer>
  );
};

export default SignUpPage;
