import * as userConstants from "../constants/userConstants";
import axios from "../../api/axios";
import {GetToken} from "./userActions";
import * as articleConstants from "../constants/articleConstants";
import {request} from "axios";




export const createArticle = (formData) => async (dispatch) => {
    try{
        dispatch({ type: articleConstants.CREATE_ARTICLE_REQUEST});


        
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${GetToken()}`,
            },
        };

        for (const pair of formData.entries()) {
            const [key, value] = pair;
            console.log(`${key}: ${value}`);
        }


        const response = await axios.post(articleConstants.CREATE_ARTICLE_URL,
                  formData,
                  config
        );
        dispatch({ type: articleConstants.CREATE_ARTICLE_SUCCESS });

    }catch (error){
        console.log("Error status:", error.response.status);
        console.log("Error message:", error.response.data);
        console.log("Error details:", error.response.statusText);
        dispatch({
            type: articleConstants.CREATE_ARTICLE_FAIL,
            payload:
                error.response && error.response.data.message

                    ?  "An unexpected error occurred get request :" + error.response.data.message
                    : "Request get orders  error" + error.response.data.errors

        });

    }
}

export const updateArticle = (formData) => async (dispatch) => {
    try{
        dispatch({ type: articleConstants.UPDATE_ARTICLE_REQUEST});
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${GetToken()}`
            },
        };

        for (const pair of formData.entries()) {
            const [key, value] = pair;
            console.log(`${key}: ${value}`);
        }


        const response = await axios.put(articleConstants.UPDATE_ARTICLE_URL,formData,config);
        dispatch({ type: articleConstants.UPDATE_ARTICLE_SUCCESS });

    }catch (error){
        console.log("Error status:", error.response.status);
        console.log("Error message:", error.response.data);
        console.log("Error details:", error.response.statusText);
        dispatch({
            type: articleConstants.UPDATE_ARTICLE_FAIL,
            payload:
                error.response && error.response.data.message

                    ?  "An unexpected error occurred update request :" + error.response.data.message
                    : "Update article  error" + error.response.data.errors

        });

    }
}

export const getSalesmanArticles = (email) => async (dispatch) => {
    try{
        dispatch({ type: articleConstants.GET_SALESMAN_ARTICLE_REQUEST });
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GetToken()}`,
            },
        };


        const response = await axios.get(articleConstants.GET_SALESMAN_ARTICLE_URL +'?email='+ email, config);
        const articles = response.data;

        dispatch({ type: articleConstants.GET_SALESMAN_ARTICLE_SUCCESS, articles: articles});
        return articles
    }catch (error){
        dispatch({
            type: articleConstants.GET_SALESMAN_ARTICLE_FAIL,
            payload:
                error.response && error.response.data.message

                    ?  "An unexpected error occurred get request :" + error.response.data.message
                    : "Request get articles  error" + error.response.data.errors

        });
        console.log("Error status:", error.response.status);
        console.log("Error message:", error.response.data);
        console.log("Error details:", error.response.statusText);

    }
}

export const getArticles = () => async (dispatch) => {
    try{
        dispatch({ type: articleConstants.GET_ARTICLES_REQUEST });
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GetToken()}`,
            },
        };


        const response = await axios.get(articleConstants.GET_ARTICLES_URL, config);
        const articles = response.data;

        dispatch({ type: articleConstants.GET_ARTICLES_SUCCESS, articles: articles});
        return articles
    }catch (error){
        dispatch({
            type: articleConstants.GET_ARTICLES_FAIL,
            payload:
                error.response && error.response.data.message

                    ?  "An unexpected error occurred get request :" + error.response.data.message
                    : "Request get articles  error" + error.response.data.errors

        });
        console.log("Error status:", error.response.status);
        console.log("Error message:", error.response.data);
        console.log("Error details:", error.response.statusText);

    }
}