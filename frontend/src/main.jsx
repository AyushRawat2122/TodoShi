import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SignIn, Workspace, SignUp } from './pages/index.js';

const route = createBrowserRouter([{
  element: <App />,
  path: '/',
  children: [
    { path: 'sign-in', element: <SignIn /> },
    { path: 'workspace', element: <Workspace /> },
    { path: 'sign-up', element: <SignUp /> } 
  ]
}]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={route} />
    </Provider>
  </StrictMode>,
)
