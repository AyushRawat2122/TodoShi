import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from "@clerk/clerk-react";
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import {SignIn , Workspace} from './pages/index.js';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

const route = createBrowserRouter([{
  element: <App />,
  path: '/',
  children: [{ path: 'sign-in', element: <SignIn /> }, { path: 'workspace', element: <Workspace /> }]
}]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={route}>
      <Provider store={store}>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          <App />
        </ClerkProvider>
      </Provider>
    </RouterProvider>
  </StrictMode>,
)
