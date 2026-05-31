import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";


import Home from '../interfaces/before-login/Home/Home';
import About from '../interfaces/before-login/Home/About';
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

import UserPrivateRouter from './UserPrivateRouter';
import TeacherSignUp from "../interfaces/before-login/TeacherSignUp";
import ApplyList from "../interfaces/owner/Teachers/ApplyList";
import UserPublicRouter from "./userPublicRouter";
import Dashboard from "../interfaces/owner/dashboard/Dashboard";
import Salary from "../interfaces/owner/salary/Salary";
import History from "../interfaces/owner/history/History";
import ComplainList from "../interfaces/owner/complains/ComplainList";
import AddUserPackage from "../interfaces/owner/AddUserPackage/AddPackage";
import ManageSubjects from "../interfaces/owner/Subjects/ManageSubjects";
import ManageActivePackages from "../interfaces/owner/ActivePackages/ManageActivePackages";
import ManagePublicQuizzes from "../interfaces/owner/PublicQuizzes/ManagePublicQuizzes";
import CheckOwner from "./CheckOwner";
import PaymentDone from "../interfaces/general/PaymentDone";
import PoperlCurrency from "../interfaces/currency/PoperlCurrency";

const router = createBrowserRouter([
  
    {
      path: "/",
      element: <Home></Home>,
      errorElement: <Error></Error>
    },
    {
      path: "/perPointValue",
      element: <PoperlCurrency></PoperlCurrency>,
      errorElement: <Error></Error>
    },
    {
      path: "/payment-done",
      element: <PaymentDone></PaymentDone>
    },
    {
      path: "/about",
      element: <About></About>,
      errorElement: <Error></Error>
    },
    {
      path: '/teacherSignUp',
      element: <UserPublicRouter><TeacherSignUp></TeacherSignUp></UserPublicRouter>
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
        path: 'maintainance',
        element: <CheckOwner><Maintainance></Maintainance></CheckOwner>,
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
                path: 'pack/:id/:name/:price/:packageLimit/:credit/:type',
                element: <EditPack></EditPack>
              },
              {
                path: 'add-admin',
                element: <AddAdmin></AddAdmin>
              },
              {
                path: 'add-user-package',
                element: <AddUserPackage></AddUserPackage>
              },
              {
                path: 'subjects',
                element: <ManageSubjects></ManageSubjects>
              },
              {
                path: 'active-packages',
                element: <ManageActivePackages></ManageActivePackages>
              },
              {
                path: 'public-quizzes',
                element: <ManagePublicQuizzes></ManagePublicQuizzes>
              }


        ]
    }
])

export default router;
