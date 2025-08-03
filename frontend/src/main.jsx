import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SignIn, Workspace, SignUp, Dashboard, Home, About, Contact, Guide } from './pages/index.js';

const route = createBrowserRouter([{
  element: <App />,
  path: '/',
  children: [
    { path: '/', element: <Home /> },
    { path: 'sign-in', element: <SignIn /> },
    { path: 'sign-up', element: <SignUp /> },
    { path: 'workspace', element: <Workspace /> },
    { path: 'dashboard', element: <Dashboard /> },
    { path: 'about', element: <About /> },
    { path: 'contact', element: <Contact /> },
    { path: 'guide', element: <Guide /> }
  ]
}]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={route} />
    </Provider>
  </StrictMode>,
)
