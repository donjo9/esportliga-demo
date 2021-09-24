export type LoginData = {
  id: string;
  secret: string;
  data: UserInfo;
};

export type UserInfo = {
  email: string;
  role: string;
};

export type LoginInputType = {
  username: string;
  password: string;
};

export type SignupInputType = {
  username: string;
  email: string;
  password: string;
};
