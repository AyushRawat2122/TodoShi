import React, { use, useEffect } from 'react';
import { ToastContainer, Zoom } from 'react-toastify';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './firebase/config';
import { VerticalNav } from './components';
import { getLastSignInMethod } from './utils/getLastSignInMethod';
import { signOutUser } from './firebase/auth';
import serverRequest from './utils/axios';
import useIsLargeScreen from './hooks/useIsLargeScreen';
import useUser from './hooks/useUser';
import useConnections from './hooks/useConnections';
import { useAuthStatus } from './hooks/useAuthStatus';
import { AiOutlineInfoCircle, AiOutlineCheckCircle, AiOutlineWarning, AiOutlineCloseCircle } from "react-icons/ai";
import useTheme from './hooks/useTheme';
import { showSuccessToast, showErrorToast, showInfoToast } from './utils/toastMethods';

function App() {
  const location = useLocation();
  const authPages = ['/sign-in', '/sign-up'];
  const isAuthPage = authPages.includes(location.pathname) || location.pathname.startsWith('/verify');
  const isSecuredRoutes = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/workspace') || location.pathname.startsWith('/contact') || location.pathname.startsWith('/projects');
  const navigate = useNavigate();
  const { updateUser, updateLoading, updateSignInStatus } = useUser();
  const isLarge = useIsLargeScreen();
  const { setGithubConnection, setGoogleConnection, resetConnectionDetails } = useConnections();
  const isglobalNavDisabled = location.pathname.startsWith('/workspace') || location.pathname.startsWith('/projects') || location.pathname.startsWith('/user');
  const contentXPadding = !isglobalNavDisabled && isLarge ? 'px-10' : '';
  const { isSignedIn } = useAuthStatus();
  const { isDark } = useTheme();
  const isErrorPage = location.pathname === '/unauthorized' || location.pathname === '/not-found';
  const handleSignIn = async (user, lastSignInMethod) => {
    // if lastSignInMethod is not set, it will be null which means the user has cleared its local storage and as firebase neither provides the last sign-in method nor security to unverified email addresses, it is important to handle this case appropriately. so we are signing out the user. 
    if (!lastSignInMethod) {
      showInfoToast('Session expired. Please sign in again.');
      await signOutUser();
      navigate('/sign-in', { replace: true });
    }
    // If the last sign-in method is "oauth" then a little check before access that the user has this provider linked to their account.
    else if (lastSignInMethod === 'oauth' && !user.providerData.some((provider) => ["google.com", "github.com"].includes(provider.providerId))) {
      showErrorToast('Authentication error. Please sign in again.');
      await signOutUser();
      localStorage.removeItem("lastSignInMethod");
      navigate('/sign-in', { replace: true });
    }
    // If the last sign-in method is "password" then a little check before access that the user has verified email to their account.
    else if (lastSignInMethod === 'password' && !user.emailVerified) {
      localStorage.removeItem("lastSignInMethod");
      navigate(`/verify/${user.uid}/${user.email}`, { replace: true });
    }
    else {
      // set available connections
      user.providerData.forEach((provider) => {
        if (provider.providerId === "google.com") {
          setGoogleConnection({ isLinked: true, email: provider.email });
        }
        if (provider.providerId === "github.com") {
          setGithubConnection({ isLinked: true, email: provider.email });
        }
      });

      // fetch server user
      updateSignInStatus(true);
      try {
        const serverUserInstance = await serverRequest.get(`/users/userDetails/${user.uid}`);
        updateUser(serverUserInstance?.data?.data);
        showSuccessToast(`Welcome back! , ${serverUserInstance?.data?.data?.username}`);
      } catch (error) {
        showErrorToast('Failed to load your profile. Please refresh.');
        updateUser(null);
      }
    }
  }

  const handleSignOut = async () => {
    updateUser(null);
    updateSignInStatus(false);
    resetConnectionDetails();
    if (isSecuredRoutes) {
      navigate('/sign-in', { replace: true });
    }
    showInfoToast('You have been signed out');
  }

  useEffect(() => {
    const auth = getAuth(app);
    updateLoading(true); // start loading when setting up the listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      updateLoading(true); // ensure loading is true for every auth state change cycle
      try {
        if (user) {
          const lastSignInMethod = getLastSignInMethod();
          console.log('✅ User is signed in:', user);
          await handleSignIn(user, lastSignInMethod);
        } else {
          await handleSignOut();
        }
      } catch (error) {
        showErrorToast('Authentication error occurred');
        console.error('Error during authentication state change:', error);
      } finally {
        updateLoading(false); // end loading for both branches
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthPage && isSignedIn) {
      navigate('/', { replace: true });
    }
  }, [isSignedIn]);
  return (
    <div className={`p-1 flex dark:bg-[#0c0a1a] h-screen w-screen bg-gray-50 overflow-hidden`}>
      {/* Single nav instance; it renders sidebar on large and bottom bar on small */}
      {(!isAuthPage && !isglobalNavDisabled && !isErrorPage) && <VerticalNav />}

      {/* Main content with dynamic bottom padding for mobile bottom bar */}
      <div className={`flex-1 h-full ${contentXPadding} ${isLarge ? '' : 'pb-20'} dark:bg-[#0c0a1a] overflow-y-scroll`} >
        <Outlet />
      </div>

      <ToastContainer
        theme={isDark ? "dark" : "light"}
        icon={({ type, theme }) => {
          const color = theme === "dark" ? "#c2a7fb" : "#4c1f8e";
          const size = 24; // icon size

          switch (type) {
            case "info":
              return <AiOutlineInfoCircle color={color} size={size} />;
            case "error":
              return <AiOutlineCloseCircle color={color} size={size} />;
            case "success":
              return <AiOutlineCheckCircle color={color} size={size} />;
            case "warning":
              return <AiOutlineWarning color={color} size={size} />;
            default:
              return null;
          }
        }}
        position="top-right"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Zoom}
      />
    </div>
  );
}

export default App;

