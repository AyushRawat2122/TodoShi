import { useSelector } from "react-redux";
export const useAuthStatus = () => {
  const { isSignedIn, isServerReady, isLoading } = useSelector((state) => state.user);
  return { isSignedIn, isServerReady, isLoading };
};
