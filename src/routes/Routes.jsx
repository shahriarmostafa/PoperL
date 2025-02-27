import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";


import Home from '../interfaces/before-login/Home/Home';
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
import ApplyList from "../interfaces/owner/Teachers/ApplyList";
import UserPublicRouter from "./userPublicRouter";
import Profile from "../interfaces/Private/Profile/Profile";


const router = createBrowserRouter([
  
    {
      path: "/",
      element: <UserPublicRouter><Home></Home></UserPublicRouter>
    },
    {
      path: '/teacherSignUp',
      element: <TeacherSignUp></TeacherSignUp>
    },
    {
      path: '/signup',
      element: <UserPublicRouter><SignUp></SignUp></UserPublicRouter>
    },
    {
      path: '/signin',
      element: <UserPublicRouter><SignIn></SignIn></UserPublicRouter> 
    },
    {
      path: 'user',
      element: <UserPrivateRouter><Main></Main></UserPrivateRouter>,
      children: [
        //teacher page
        
        {
          path: 'subscription',
          element: <Subscription></Subscription>
        },
        {
          path: 'complain',
          element: <Complain></Complain>
        },
        {
          path: 'teachers',
          element: <TeacherList></TeacherList>
        },
        {
          path: 'chat',
          element: <Chat></Chat>
        },
        {
          path: 'chat/:chatId',
          element: <ChatBox></ChatBox>
        },
        {
          path: 'profile',
          element: <Profile></Profile>
        },
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
                path: "applicants",
                element: <ApplyList></ApplyList>
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