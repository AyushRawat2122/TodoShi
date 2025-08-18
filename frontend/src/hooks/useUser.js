import { useSelector, useDispatch } from "react-redux";
import { setUser, setLoading, setServerReady, setSignInStatus } from "../store/userSlice";

function useUser() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const updateUser = (newUserData) => {
    dispatch(setUser(newUserData));
  };
  const updateLoading = (value) => {
    dispatch(setLoading(value));
  };
  const updateServerReady = (value) => {
    dispatch(setServerReady(value));
  };
  const updateSignInStatus = (value) => {
    dispatch(setSignInStatus(value));
  };

  return { user, updateUser, updateLoading, updateServerReady, updateSignInStatus };
}

export default useUser;
