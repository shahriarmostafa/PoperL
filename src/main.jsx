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
import AuthProvider from './providers/AuthProvider';
import Subscription from './interfaces/general/Subscription';
import UserPrivateRouter from './routes/UserPrivateRouter';
import Complain from './interfaces/Private/Complain';

// owner pages
import Change from './interfaces/owner/admin-change/Change';
import AddAdmin from './interfaces/owner/admin-change/add-admin/AddAdmin';
import Packages from './interfaces/owner/packages/packages';
import AddPackage from './interfaces/owner/packages/AddPackage';
import EditPack from './interfaces/owner/packages/EditPack';

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
    },
    {
      path: '/subscription',
      element: <UserPrivateRouter><Subscription></Subscription></UserPrivateRouter>
    },
    {
      path: '/complain',
      element: <UserPrivateRouter><Complain></Complain></UserPrivateRouter>
    },
    {
      path: '/admins',
      element: <Change></Change>,
      loader: () => fetch("http://localhost:5000/user")
    },
    {
      path: '/add-admin',
      element: <AddAdmin></AddAdmin>
    },
    {
      path: '/packages',
      element: <Packages></Packages>,
      loader: () => fetch("http://localhost:5000/pack")
    },
    {
      path: '/add-package',
      element: <AddPackage></AddPackage>
    },
    {
      path: '/pack/:id',
      element: <EditPack></EditPack>,
      loader: ({params}) => fetch(`http://localhost:5000/pack/${params.id}`)
    }
  ]
}]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  </StrictMode>
)
