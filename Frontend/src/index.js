import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/bootstrap.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider, Outlet, Link, Navigate} from "react-router-dom";
import LoginPage from "./views/LoginPage/LoginPage";
import RegisterPage from "./views/RegisterPage/RegisterPage";
import ProfilePage from "./views/ProfilePage/ProfilePage";
import {store} from "./store";
import {Provider} from "react-redux";
import UnverifiedUsersPage from "./views/UsersPage/AdminUsersPage";
import OrdersPage from "./views/OrdersPage/OrdersPage";
import {GoogleOAuthProvider} from "@react-oauth/google";
import AddArticlePage from "./views/ArticlePage/CreateArticlePage";
import CreateArticlePage from "./views/ArticlePage/CreateArticlePage";
import UpdateArticlePage from "./views/ArticlePage/UpdateArticlePage";
import UserArticlesPage from "./views/ArticlePage/UserArticlesPage";
import CustomerHomePage from "./views/UsersPage/CustomerHomePage";
import ArticleDeteail from "./components/ArticleDeteail";
import Cart from "./components/Cart";

const ProtecetRoute = ({role, redirectPath='/', children}) => {
    const user = JSON.parse(localStorage.getItem('userInfo'))
    if(!user)
        return <Navigate to={redirectPath} replace/>
    else if(user.role != role)
        return <p>There's nothing here: 404!</p>
    else
        return children ? children :<Outlet/>
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>
    },
    {
        path: "login",
        element: <LoginPage/>
    }
    ,
    {
        path: "register",
        element: <RegisterPage/>
    },
    {
        path: "profile",
        element: <ProfilePage/>
    },
    {
        path: "verification",
        element:<ProtecetRoute role={"Admin"}>
                    <UnverifiedUsersPage/>
                </ProtecetRoute>
    },
    {
        path: "get-orders",
        element: <OrdersPage/>
    },
    {
        path: "create-articles",
        element:  <ProtecetRoute role={"Salesman"}>
                    <CreateArticlePage/>
                 </ProtecetRoute>
    }
    ,
    {
        path: "update-articles",
        element: 
             <ProtecetRoute role={"Salesman"}>
                  <UpdateArticlePage/>   
             </ProtecetRoute> 
    }
    ,
    {
        path: "salesman-articles",
        element:<ProtecetRoute role={"Salesman"}>
                  <UserArticlesPage/>    
             </ProtecetRoute> 
        
    }

    ,
    {
        path: "articles",
        element: 
        <ProtecetRoute role={"Customer"}>
            <CustomerHomePage/>     
         </ProtecetRoute>
    },
    {
        path: "article-detail",
        element: <ProtecetRoute role={"Customer"}>
                 <ArticleDeteail/>        
            </ProtecetRoute>
    }
    ,
    {
        path: "cart",
        element: <ProtecetRoute role={"Customer"}>
                    <Cart/>        
                </ProtecetRoute>
    }
])



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider  store={store} >
        {/*<GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>*/}
        <GoogleOAuthProvider clientId={"488844158734-8s80aflb4kfdrvkust9rp0gajm4fufkp.apps.googleusercontent.com"}>
                <React.StrictMode>
                    <RouterProvider router={router}/>
                </React.StrictMode>
         </GoogleOAuthProvider>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
