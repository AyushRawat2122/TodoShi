import { useDispatch , useSelector } from "react-redux";
import { setGithubProvider, setGoogleProvider } from "../store/userSlice";
function useConnections() {
  const dispatch = useDispatch();
  const setGoogleConnection = (status) => {
    dispatch(setGoogleProvider(status));
  };
  const setGithubConnection = (status) => {
    dispatch(setGithubProvider(status));
  };
  const getConnectionDetails = () => {
    return useSelector((state) => state.user.providers);
  };

  return {
    setGoogleConnection,
    setGithubConnection,
    getConnectionDetails,
  };
}

export default useConnections;
