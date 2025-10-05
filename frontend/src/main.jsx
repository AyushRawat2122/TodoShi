import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import {
  SignIn, Workspace, SignUp, Dashboard, Home, About, Contact, Guide, Verify,
  Projects, ProjectInfo, Chat, MyInvites, Collaborators, Todos, Logs, UnauthorizedPage, ProtectedPage, NotFound
} from './pages/index.js';

const route = createBrowserRouter([
  {
    element: <App />,
    path: "/",
    children: [
      { path: "/", element: <Home /> },
      { path: "sign-in", element: <SignIn /> },
      { path: "sign-up", element: <SignUp /> },

      // --- protected block start ---
      {
        element: <ProtectedPage />, // <-- THIS guards all nested routes
        children: [
          {
            path: "projects",
            children: [
              { index: true, element: <Navigate to={"/"} replace /> },
              { path: ":userId", element: <Projects /> }
            ]
          },
          {
            path: "workspace",
            children: [
              { index: true, element: <Navigate to={"/"} replace /> },
              {
                path: ":projectName/:projectId",
                element: <Workspace />,
                children: [
                  { index: true, element: <ProjectInfo /> },
                  { path: "chat", element: <Chat /> },
                  { path: "collaborators", element: <Collaborators /> },
                  { path: "todos", element: <Todos /> },
                  { path: "logs", element: <Logs /> }
                ]
              }
            ]
          },
          { path: "dashboard", element: <Dashboard /> },
          { path: "contact", element: <Contact /> },
          { path: "my-invites", element: <MyInvites /> }
        ]
      },
      // --- protected block end ---

      { path: "about", element: <About /> },
      { path: "guide", element: <Guide /> },

      {
        path: "verify",
        children: [
          { index: true, element: <Navigate to={"/sign-in"} replace /> },
          { path: ":UID/:emailID", element: <Verify /> }
        ]
      },

      { path: "unauthorized", element: <UnauthorizedPage /> },
      { path: "not-found", element: <NotFound /> }
    ]
  }
]);

export default route;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={route} />
    </Provider>
  </StrictMode>,
)
