import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './firebase/config';
import { signInWithGoogle, signInWithGitHub , signOutUser } from './firebase/auth.js';


function App() {
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('✅ User is signed in:', {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          providerId: user.providerData[0]?.providerId,
          emailVerified: user.emailVerified
        });
      } else {
        console.log('❌ No user is signed in.');
      }
    });
    return () => unsubscribe();
  }, [])
  return (
    <div>
      <Outlet />
    </div>
  )
}

export default App
