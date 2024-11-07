import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Root from './root';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import Home from './interfaces/before-login/Home';
import SignIn from './interfaces/before-login/SignIn';
import SignUp from './interfaces/before-login/SignUp';
const router = createBrowserRouter([{
  path: '/',
  element: <Root></Root>,
  children: [
    {
      path: '/',
      element: <Home></Home>
    },
    {
      path: '/signup',
      element: <SignUp></SignUp>
    },
    {
      path: '/signin',
      element: <SignIn></SignIn>
    }
  ]
}]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>
)
