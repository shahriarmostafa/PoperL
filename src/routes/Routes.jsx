import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";


import Home from '../interfaces/before-login/Home';
import SignIn from '../interfaces/before-login/SignIn';
import SignUp from '../interfaces/before-login/SignUp';
import Subscription from '../interfaces/general/Subscription';
import UserPrivateRouter from './UserPrivateRouter';
import Complain from '../interfaces/Private/Complain';

// owner pages
import Change from '../interfaces/owner/admin-change/Change';
import AddAdmin from '../interfaces/owner/admin-change/add-admin/AddAdmin';
import Packages from '../interfaces/owner/packages/Packages';
import AddPackage from '../interfaces/owner/packages/AddPackage';
import EditPack from '../interfaces/owner/packages/EditPack';
import Maintainance from "../Layout/Maintainance";



const router = createBrowserRouter([
    {
      path: '/',
      element: <Main></Main>,
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
        }
      ]
    },
    {
        path: 'maintainance',
        element: <Maintainance></Maintainance>,
        children: [
            {
                path: 'admins',
                element: <Change></Change>,
                loader: () => fetch("https://backend-eta-blue-92.vercel.app/user")
              },
              {
                path: 'add-admin',
                element: <AddAdmin></AddAdmin>
              },
              {
                path: 'packages',
                element: <Packages></Packages>,
                loader: () => fetch("https://backend-eta-blue-92.vercel.app/pack")
              },
              {
                path: 'add-package',
                element: <AddPackage></AddPackage>
              },
              {
                path: 'pack/:id',
                element: <EditPack></EditPack>,
                loader: ({params}) => fetch(`https://backend-eta-blue-92.vercel.app/pack/${params.id}`)
              }
        ]
    }
])

export default router;