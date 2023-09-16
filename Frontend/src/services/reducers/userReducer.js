import {
    USER_LOGIN_FAIL,
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_REGISTER_FAIL,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_UPDATE_FAIL,
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
    USER_VERIFY_SUCCESS,
    USER_VERIFY_FAIL,
    USER_VERIFY_REQUEST,
    GET_UNVERIFIED_USERS_REQUEST,
    GET_UNVERIFIED_USERS_SUCCESS,
    GET_UNVERIFIED_USERS_FAIL,
    GET_VERIFIED_USERS_REQUEST,
    GET_VERIFIED_USERS_SUCCESS,
    GET_VERIFIED_USERS_FAIL
} from "../constants/userConstants";


export const userRegisterReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_REGISTER_REQUEST:
            return { };
        case USER_REGISTER_SUCCESS:
            return {success:true, userInfo:action.payload};
        case USER_REGISTER_FAIL:
            return { success: false,error: action.payload};
        default:
            return state;
    }
};

export const userLoginReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return {}
        case USER_LOGIN_SUCCESS:
            return { userInfo: action.payload};
        case USER_LOGIN_FAIL:
            return { error: action.payload};
        case USER_LOGOUT:
            return {};
        default:
            return state;
    }
};

export const userUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_UPDATE_REQUEST:
            return {  };
        case USER_UPDATE_SUCCESS:
            return {success: true, userInfo:action.payload};
        case USER_UPDATE_FAIL:
            return { success: false, error:action.payload};
        default:
            return state;
    }
};


export const userVerifyReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_VERIFY_REQUEST:
            return {  };
        case USER_VERIFY_SUCCESS:
            return {success: true};
        case USER_VERIFY_FAIL:
            return { success: false, error:action.payload};
        default:
            return state;
    }
};

export const getUnverifiedReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_UNVERIFIED_USERS_REQUEST:
            return {  };
        case GET_UNVERIFIED_USERS_SUCCESS:
            return {success: true, users:action.payload};
        case GET_UNVERIFIED_USERS_FAIL:
            return { success: false, error:action.payload};
        default:
            return state;
    }
};

export const getVerifiedReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_VERIFIED_USERS_REQUEST:
            return {  };
        case GET_VERIFIED_USERS_SUCCESS:
            return {success: true, users:action.payload};
        case GET_VERIFIED_USERS_FAIL:
            return { success: false, error:action.payload};
        default:
            return state;
    }
};
