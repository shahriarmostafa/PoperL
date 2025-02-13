import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom';
import AuthProvider from './providers/AuthProvider';
import PageTransition from './providers/PageTransition';
import CallProvider from './providers/CallProvider';
// service worker for pwa
import * as serviceWorker from './serviceWorker';

import router from './routes/Routes';

//tan stack query
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
const queryClient = new QueryClient()


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PageTransition>
          <CallProvider>
            <RouterProvider router={router}></RouterProvider>
          </CallProvider>
        </PageTransition>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
)

serviceWorker.register();
