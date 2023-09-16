import { combineReducers, applyMiddleware} from "redux";
import { configureStore } from '@reduxjs/toolkit'
import {
    userLoginReducer,
    userRegisterReducer,
    userUpdateReducer,
    userVerifyReducer,
    getUnverifiedReducer,
    getVerifiedReducer
} from "../src/services/reducers/userReducer";

import thunk from "redux-thunk"
import {cartReducer, deleteOrderReducer, getOrdersReducer} from "./services/reducers/orderReducer";
import {
    createArticleReducer, getArticlesReducer,
    getSalesmanArticleReducer,
    updateArticleReducer
} from "./services/reducers/articleReducer";
import {cenaDostave} from "./services/constants/orderConstants";



const reducer = combineReducers({
    userLoginReducer: userLoginReducer,
    userRegisterReducer: userRegisterReducer,
    userUpdateReducer: userUpdateReducer,
    userVerifyReducer: userVerifyReducer,
    getUnverifiedReducer: getUnverifiedReducer,
    getVerifiedReducer: getVerifiedReducer,
    getOrdersReducer: getOrdersReducer,
    createArticleReducer: createArticleReducer,
    updateArticleReducer: updateArticleReducer,
    getSalesmanArticleReducer: getSalesmanArticleReducer,
    getArticlesReducer: getArticlesReducer,
    cartReducer: cartReducer,
    deleteOrderReducer: deleteOrderReducer
});

const initialState ={
    cartReducer: {
        totalAmount: 0,
        orderItems: [],
    }
}

const persistedState = {
    cartReducer: JSON.parse(localStorage.getItem('cart')) || initialState.cartReducer,
};

const middleware = [thunk]

export const store = configureStore({
    reducer,
   /* initialState,*/
    persistedState,
    middleware,
    devTools:process.env.NODE_ENV !== 'production',

});// - The Redux DevTools Extension is disabled for production