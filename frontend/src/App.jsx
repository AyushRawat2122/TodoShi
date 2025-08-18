import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './firebase/config';
import { VerticalNav } from './components';
import { getLastSignInMethod } from './utils/getLastSignInMethod';
import { signOutUser } from './firebase/auth';
import serverRequest from './utils/axios';
import useIsLargeScreen from './hooks/useIsLargeScreen';
import useUser from './hooks/useUser';

function App() {
  const location = useLocation();
  const authPages = ['/sign-in', '/sign-up'];
  const isAuthPage = authPages.includes(location.pathname) || location.pathname.startsWith('/verify');
  const isSecuredRoutes = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/workspace') || location.pathname.startsWith('/contact');
  const navigate = useNavigate();
  const { updateUser, updateLoading, updateServerReady, updateSignInStatus } = useUser();
  const isLarge = useIsLargeScreen();

  useEffect(() => {
    const auth = getAuth(app);
    updateLoading(true); // start loading immediately on mount
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const lastSignInMethod = getLastSignInMethod();
          console.log('✅ User is signed in:', user);
          // if lastSignInMethod is not set, it will be null which means the user has cleared its local storage and as firebase neither provides the last sign-in method nor security to unverified email addresses, it is important to handle this case appropriately. so we are signing out the user. 
          console.log('Last Sign-In Method:', lastSignInMethod);
          if (!lastSignInMethod) {
            console.log('No last sign-in method found, signing out user.');
            await signOutUser();
            navigate('/sign-in', { replace: true });
          }
          // If the last sign-in method is "oauth" then a little check before access that the user has this provider linked to their account.
          if (lastSignInMethod === 'oauth' && !user.providerData.some((provider) => ["google.com", "github.com"].includes(provider.providerId))) {
            console.log('User does not have OAuth provider linked, signing out.');
            await signOutUser();
            localStorage.removeItem("lastSignInMethod");
            navigate('/sign-in', { replace: true });
          }
          // If the last sign-in method is "password" then a little check before access that the user has verified email to their account.
          if (lastSignInMethod === 'password' && !user.emailVerified) {
            localStorage.removeItem("lastSignInMethod");
            navigate(`/verify/${user.uid}/${user.email}`, { replace: true });
          }

          console.log('User is signed in and has a valid last sign-in method.');
          navigate('/dashboard', { replace: true });

          // fetch server user
          const serverUserInstance = await serverRequest.get(`/users/userDetails/${user.uid}`);
          updateUser(serverUserInstance?.data?.data);
          updateServerReady(true);
          updateSignInStatus(true);
          console.log('✅ User data fetched from server and state updated.');
        } else {
          updateUser(null);
          updateServerReady(false);
          updateSignInStatus(false);
          if (isSecuredRoutes) {
            navigate('/sign-in', { replace: true });
          }
          console.log('❌ User is signed out');
        }
      } catch (error) {
        console.error('Error during authentication state change:', error);
      } finally {
        updateLoading(false); // end loading for both branches
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex h-screen w-screen bg-gray-50 overflow-hidden">
      {/* Single nav instance; it renders sidebar on large and bottom bar on small */}
      {!isAuthPage && <VerticalNav />}

      {/* Main content with dynamic bottom padding for mobile bottom bar */}
      <div className={`flex-1 transition-all h-screen p-2 ${isLarge ? 'pb-2' : 'pb-20'} overflow-y-scroll duration-300`}>
        <Outlet />
      </div>
    </div>
  );
}

export default App;

