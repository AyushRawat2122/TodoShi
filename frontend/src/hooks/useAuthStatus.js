import { useSelector } from "react-redux";
export const useAuthStatus = () => {
  const { isSignedIn, isLoading, isServerReady } = useSelector((state) => state.user);
  return { isSignedIn, isLoading, isServerReady };
};
