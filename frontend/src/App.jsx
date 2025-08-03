import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './firebase/config';
import { VerticalNav } from './components';

function App() {
  const location = useLocation();
  const authPages = ['/sign-in', '/sign-up'];
  const isAuthPage = authPages.includes(location.pathname);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('✅ User is signed in:', {
          user
        });
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
