import React from 'react';
import ReactDOM from 'react-dom/client';
import './global.css'
// import { Provider } from 'react-redux';
// import { store } from './store/store';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import App from './App';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import HomePage from './pages/HomePage';

const allRoutes = (
  <Route path='/' element={<App />}>
    <Route index={true} element={<LoginPage/>}></Route>
    <Route path='/register' element={<RegistrationPage/>}/>
    <Route path='/home' element={<HomePage/>}/>
  </Route>)
  const router = createBrowserRouter(createRoutesFromElements(allRoutes))

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <Provider store={store}> */}
    
      <RouterProvider router={router} />

    {/* </Provider> */}
  </React.StrictMode>
);