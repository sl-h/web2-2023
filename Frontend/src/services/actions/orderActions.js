import * as userConstants from "../constants/userConstants";
import axios from "../../api/axios";
import {GetToken} from "./userActions";
import * as orderConstants from "../constants/orderConstants";
import {Order} from "../../models/Order";
import {ADD_ITEM_TO_CART, DELETE_ORDER, MAKE_ORDER, REMOVE_ITEM_FROM_CART} from "../constants/orderConstants";
import {store} from "../../store";



export const getAllOrders = () => async (dispatch) => {
    try{
        dispatch({ type: orderConstants.GET_ALL_ORDERS_REQUEST });
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GetToken()}`,
            },
        };


        const response = await axios.get(orderConstants.GET_ALL_ORDERS_URL, config);
        const orders = response.data;

        dispatch({ type: orderConstants.GET_ALL_ORDERS_SUCCESS, orders:orders });
        return orders
    }catch (error){
        dispatch({
            type: orderConstants.GET_ALL_ORDERS_FAIL,
            payload:
                error.response && error.response.data.message

                    ?  "An unexpected error occurred get request :" + error.response.data.message
                    : "Request get orders  error" + error.response.data.errors

        });
        console.log("Error status:", error.response.status);
        console.log("Error message:", error.response.data);
        console.log("Error details:", error.response.statusText);

    }
}

export const getCustomerOrders = (id) => async (dispatch) => {
    try{
        dispatch({ type: orderConstants.GET_CUSTOMER_ORDERS_REQUEST });
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GetToken()}`,
            },
        };


        const response = await axios.get(orderConstants.GET_ALL_ORDERS_URL +'/' + id, config);
        const orders = response.data;

        dispatch({ type: orderConstants.GET_CUSTOMER_ORDERS_SUCCESS, orders:orders });
        return orders
    }catch (error){
        dispatch({
            type: orderConstants.GET_CUSTOMER_ORDERS_FAIL,
            payload:
                error.response && error.response.data.message

                    ?  "An unexpected error occurred get request :" + error.response.data.message
                    : "Request get orders  error" + error.response.data.errors

        });
        console.log("Error status:", error.response.status);
        console.log("Error message:", error.response.data);
        console.log("Error details:", error.response.statusText);

    }
}

export const getFilteredOrders = (id, filter) => async (dispatch) => {
    try{
        dispatch({ type: orderConstants.GET_FILTERED_ORDERS_REQUEST });
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GetToken()}`,
            },
        };

        const url = `${orderConstants.GET_FILTERED_ORDERS_URL}/${id}/${filter}`;


        const response = await axios.get(url, config);
        const orders = response.data;


        dispatch({ type: orderConstants.GET_FILTERED_ORDERS_SUCCESS, orders:orders });
        return orders
    }catch (error){
        dispatch({
            type: orderConstants.GET_FILTERED_ORDERS_FAIL,
            payload:
                error.response && error.response.data.message

                    ?  "An unexpected error occurred get request :" + error.response.data.message
                    : "Request get orders  error" + error.response.data.errors

        });
        console.log("Error status:", error.response.status);
        console.log("Error message:", error.response.data);
        console.log("Error details:", error.response.statusText);

    }
}

export const addItemToCart = (article) => (dispatch) =>{
    try {
        //order.addItem(article);

        dispatch({type:ADD_ITEM_TO_CART, payload:article});

        const orderState = store.getState().cartReducer;
        orderState.id= JSON.parse(localStorage.getItem("userInfo")).userId;
        localStorage.setItem('cart', JSON.stringify(orderState));

    }
    catch (error){
        if (error.response) {
            console.log("Error status:", error.response.status);
        } else {
            console.log("Error:", error.message);
        }
    }

}

export const removeFromCart = (article) => (dispatch) =>{
    try {
        //order.addItem(article);

        dispatch({type:REMOVE_ITEM_FROM_CART, payload:article});

        const orderState = store.getState().cartReducer;
        localStorage.setItem('cart', JSON.stringify(orderState));

    }
    catch (error){
        if (error.response) {
            console.log("Error status:", error.response.status);
        } else {
            console.log("Error:", error.message);
        }
    }
}

export const deleteOrder = (order) => (dispatch) => {
    try {
        dispatch({type: DELETE_ORDER, payload: order.id})

        const orderState = store.getState().cartReducer;
        localStorage.setItem('cart', JSON.stringify(orderState));
    }
    catch (error){
    if (error.response) {
        console.log("Error status:", error.response.status);
    } else {
        console.log("Error:", error.message);
    }
}
}


export const cancelPurchase = (id) => async (dispatch) => {
    try{
        dispatch({ type: orderConstants.CANCEL_PURCHASE_REQUEST });
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GetToken()}`,
            },
        };


        const response = await axios.delete(orderConstants.CANCEL_PURCHASE_URL +'/' + id, config);


        dispatch({ type: orderConstants.CANCEL_PURCHASE_SUCCESS });

    }catch (error){
        dispatch({
            type: orderConstants.CANCEL_PURCHASE_FAIL,
            payload:
                error.response && error.response.data.message

                    ?  "An unexpected error occurred get request :" + error.response.data.message
                    : "Request get orders  error" + error.response.data.errors

        });
        console.log("Error status:", error.response.status);
        console.log("Error message:", error.response.data);
        console.log("Error details:", error.response.statusText);

    }
}

export const BuyItems = (order) => async (dispatch) => {
    try {
        dispatch({type: orderConstants.BUY_ITEMS_REQUEST});

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GetToken()}`,
            },
        };

        const orderDto = {
            customerId: order.customerId,
            totalAmount: order.totalAmount,
            orderItems: order.orderItems,
            comment: order.comment,
            address: order.address

        }
        console.log(orderDto);

        const response = await axios.post(orderConstants.BUY_ITEMS_URL, orderDto,config);
        dispatch({type: orderConstants.BUY_ITEMS_SUCCESS});
        console.log(response)

        const orderState = store.getState().cartReducer;
        localStorage.setItem('cart', JSON.stringify(orderState));
    } catch (error) {
        dispatch({type: orderConstants.BUY_ITEMS_FAIL});
        if (error.response) {
            console.log("Error status:", error.response.status);
        } else {
            console.log("Error:", error.message);
        }
    }
}



