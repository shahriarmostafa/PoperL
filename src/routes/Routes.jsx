import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";


import Home from '../interfaces/before-login/Home';
import SignIn from '../interfaces/before-login/SignIn';
import SignUp from '../interfaces/before-login/SignUp';


// owner pages
import Change from '../interfaces/owner/admin-change/Change';
import AddAdmin from '../interfaces/owner/admin-change/add-admin/AddAdmin';
import Packages from '../interfaces/owner/packages/Packages';
import AddPackage from '../interfaces/owner/packages/AddPackage';
import EditPack from '../interfaces/owner/packages/EditPack';
import Maintainance from "../Layout/Maintainance";
import Teachers from "../interfaces/owner/Teachers/Teachers";

//Student after login
import Chat from "../interfaces/Private/Chat/Chat";
import ChatBox from "../interfaces/Private/Chat/ChatBox";
import TeacherList from "../interfaces/general/TeacherList/TeacherList";
import Subscription from '../interfaces/general/Subscription';
import UserPrivateRouter from './UserPrivateRouter';
import Complain from '../interfaces/Private/Complain';
import TeacherSignUp from "../interfaces/before-login/TeacherSignUp";


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
        //teacher page
        ,
        {
          path: '/teacherSignUp',
          element: <TeacherSignUp></TeacherSignUp>
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
          path: '/TeacherList',
          element: <UserPrivateRouter><TeacherList></TeacherList></UserPrivateRouter>
        },
        {
          path: '/chat',
          element: <UserPrivateRouter><Chat></Chat></UserPrivateRouter>
        },
        {
          path: '/chat/:chatId',
          element: <ChatBox></ChatBox>
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
                path: "teachers",
                element: <Teachers></Teachers>
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