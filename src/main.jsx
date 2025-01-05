import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import AuthProvider from './providers/AuthProvider';



import * as serviceWorker from './serviceWorker';

import router from './routes/Routes';;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  </StrictMode>
)
console.log(serviceWorker);

serviceWorker.register();
