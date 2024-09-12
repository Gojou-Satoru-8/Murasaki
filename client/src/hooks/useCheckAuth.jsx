import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../store";

const useCheckAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:3000/current-user", {
          credentials: "include",
        });
        const data = await response.json();
        console.log(data);

        // Set redux store based on whether a user was present in server-session or not.
        if (!data.user) dispatch(authActions.logout());
        else dispatch(authActions.login({ user: data.user }));
      } catch (err) {
        console.log("Auth Check failed", err.message);
        dispatch(authActions.logout());
      }
    };
    fetchUser();
  }, [dispatch]);
};

export default useCheckAuth;
