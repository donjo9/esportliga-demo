import * as React from "react";
const LOCALSTORAGE_KEY = "ESPORTLIGA_USER";
type AuthContext = {
  user: UserInfo;
  setUserInfo: (user: UserInfo) => void;
};

type UserInfo = {
  username: string | null;
  id: string | null;
};

const authContext = React.createContext<AuthContext>({
  user: {
    username: null,
    id: null,
  },
  setUserInfo: () => {},
});
const useAuth = () => React.useContext(authContext);

const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = React.useState({ username: null, id: null });
  const [firstTimeDone, setFirstTimeDone] = React.useState(false);

  React.useEffect(() => {
    try {
      const user = JSON.parse(
        localStorage.getItem(LOCALSTORAGE_KEY) || '{"username":null,"id":null}'
      );
      setUser(user);
      setFirstTimeDone(true);
    } catch (error) {
      console.error(error);
    }
  }, []);

  React.useEffect(() => {
    if (firstTimeDone) {
      localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(user));
    }
  }, [user]);

  const setUserInfo = (user: UserInfo) => {
    setUser(user);
  };

  return (
    <authContext.Provider value={{ user, setUserInfo }}>
      {children}
    </authContext.Provider>
  );
};

export { AuthProvider, useAuth };
