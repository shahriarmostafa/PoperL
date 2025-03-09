import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";


import Home from '../interfaces/before-login/Home/Home';
import SignIn from '../interfaces/before-login/SignIn';
import SignUp from '../interfaces/before-login/SignUp';
import Error from "../interfaces/before-login/shared/Error";

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
import Dashboard from "../interfaces/owner/dashboard/Dashboard";
import Salary from "../interfaces/owner/salary/Salary";
import History from "../interfaces/owner/history/History";
import ComplainList from "../interfaces/owner/complains/ComplainList";


const router = createBrowserRouter([
  
    {
      path: "/",
      element: <UserPublicRouter><Home></Home></UserPublicRouter>,
      errorElement: <Error></Error>
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
      errorElement: <Error></Error>,

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
        errorElement: <Error></Error>,
        children: [
              {
                path: "dashboard",
                element: <Dashboard></Dashboard>
              },
              {
                path: 'admins',
                element: <Change></Change>
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
                path: "salary",
                element: <Salary></Salary>
              },
              {
                path: "history",
                element: <History></History>
              },
              {
                path: "complains",
                element: <ComplainList></ComplainList>
              },
              {
                path: 'packages',
                element: <Packages></Packages>
              },
              {
                path: 'add-package',
                element: <AddPackage></AddPackage>
              },
              {
                path: 'pack/:id/:name/:price/:packageLimit/:callDuration',
                element: <EditPack></EditPack>
              },
              {
                path: 'add-admin',
                element: <AddAdmin></AddAdmin>
              }

              
        ]
    }
])

export default router;