import {
    CREATE_ARTICLE_FAIL,
    CREATE_ARTICLE_REQUEST,
    CREATE_ARTICLE_SUCCESS, GET_ARTICLES_FAIL, GET_ARTICLES_REQUEST, GET_ARTICLES_SUCCESS,
    GET_SALESMAN_ARTICLE_FAIL,
    GET_SALESMAN_ARTICLE_REQUEST,
    GET_SALESMAN_ARTICLE_SUCCESS,
    UPDATE_ARTICLE_FAIL,
    UPDATE_ARTICLE_REQUEST,
    UPDATE_ARTICLE_SUCCESS
} from "../constants/articleConstants";

export const createArticleReducer = (state = {}, action) => {
    switch (action.type) {
        case CREATE_ARTICLE_REQUEST:
            return {  };
        case CREATE_ARTICLE_SUCCESS:
            return {success: true};
        case CREATE_ARTICLE_FAIL:
            return { success: false, error:action.payload};
        default:
            return state;
    }
};

export const updateArticleReducer = (state = {}, action) => {
    switch (action.type) {
        case UPDATE_ARTICLE_REQUEST:
            return {  };
        case UPDATE_ARTICLE_SUCCESS:
            return {success: true, article:action.payload};
        case UPDATE_ARTICLE_FAIL:
            return { success: false, error:action.payload};
        default:
            return state;
    }
};

export const getSalesmanArticleReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_SALESMAN_ARTICLE_REQUEST:
            return {  };
        case GET_SALESMAN_ARTICLE_SUCCESS:
            return {success: true, articles:action.payload};
        case GET_SALESMAN_ARTICLE_FAIL:
            return { success: false, error:action.payload};
        default:
            return state;
    }
};

export const getArticlesReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_ARTICLES_REQUEST:
            return {  };
        case GET_ARTICLES_SUCCESS:
            return {success: true, articles:action.payload};
        case GET_ARTICLES_FAIL:
            return { success: false, error:action.payload};
        default:
            return state;
    }
};