import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './firebase/config';
import { VerticalNav } from './components';
import { getLastSignInMethod } from './utils/getLastSignInMethod';
import { signOutUser } from './firebase/auth'; 

function App() {
  const location = useLocation();
  const authPages = ['/sign-in', '/sign-up'];
  const isAuthPage = authPages.includes(location.pathname) || location.pathname.startsWith('/verify');
  const navigate = useNavigate();
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
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
        // now everything is fine just update our global state with the user data
      } else {
        console.log('❌ No user is signed in.');
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex h-screen w-screen bg-gray-50 overflow-hidden">
      {!isAuthPage && (<div className='p-2 h-screen'><VerticalNav /></div>)}
      <div className="flex-1 transition-all h-screen p-2 overflow-y-scroll duration-300">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
