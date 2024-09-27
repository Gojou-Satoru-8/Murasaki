import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../store";

const useGetCurrentUser = () => {
  const authState = useSelector((state) => state.auth);
  console.log("Authentication status: ", authState);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:3000/current-user", {
          credentials: "include",
        });
        const data = await response.json();
        // console.log(data);

        // Set redux store based on whether a user was present in server-session or not.
        // if (!data.user) dispatch(authActions.unsetUser());
        if (data.user) dispatch(authActions.setUser({ user: data.user }));
      } catch (err) {
        console.log("Auth Check failed", err.message);
        // dispatch(authActions.unsetUser());
      } finally {
        // setLoading(false);
        dispatch(authActions.setLoading(false));
      }
    };
    fetchUser();
  }, [dispatch]);
  return authState;
};

export default useGetCurrentUser;
