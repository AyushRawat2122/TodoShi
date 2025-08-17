import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './firebase/config';
import { VerticalNav } from './components';
import { getLastSignInMethod } from './utils/getLastSignInMethod';
import { signOutUser } from './firebase/auth';
import serverRequest from './utils/axios';
import { useDispatch } from "react-redux";
import useIsLargeScreen from './hooks/useIsLargeScreen';
import { set } from 'react-hook-form';

function App() {
  const location = useLocation();
  const authPages = ['/sign-in', '/sign-up'];
  const isAuthPage = authPages.includes(location.pathname) || location.pathname.startsWith('/verify');
  const isSecuredRoutes = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/workspace') || location.pathname.startsWith('/contact');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLarge = useIsLargeScreen();

  useEffect(() => {
    const auth = getAuth(app);
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
          const { setUser, setLoading, setServerReady, setSignInStatus } = await import('./store/userSlice.js');
          dispatch(setLoading(true));
          const serverUserInstance = await serverRequest.get(`/users/userDetails/${user.uid}`);
          dispatch(setUser(serverUserInstance?.data?.data));
          dispatch(setServerReady(true));
          dispatch(setSignInStatus(true));
          console.log('✅ User data fetched from server and state updated.');
          dispatch(setLoading(false));

          // now everything is fine just update our global state with the user data
        } else {
          // if user is not Signed In that means he cant access any of this page this is an event based but i ll make sure this check to the respective pages too :3
          const { setUser, setServerReady, setSignInStatus, setLoading } = await import('./store/userSlice.js');
          dispatch(setUser(null));
          dispatch(setServerReady(false));
          dispatch(setSignInStatus(false));
          dispatch(setLoading(false));
          if (isSecuredRoutes) {
            navigate('/sign-in', { replace: true });
          }
          console.log('❌ User is signed out');
        }
      } catch (error) {
        console.error('Error during authentication state change:', error);
        const { setLoading } = await import('./store/userSlice.js');
        dispatch(setLoading(false));
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
