import * as userConstants from "../constants/userConstants";
import axios from "../../api/axios";
import {UserInfo} from "../../models/UserInfo";



export const GetToken =() => {
    return localStorage.getItem('token')
}

export const splitAddress = (address) => {
    let addressParts = address.split(",");
    let street = addressParts[0].trim();
    let streetNumber = parseInt(addressParts[1].trim());
    let city = addressParts[2].trim();
    let postalCode = parseInt(addressParts[3].trim());
    return [street,streetNumber,city,postalCode]
}

export const logout = () => async (dispatch) => {

    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");

    dispatch({ type: userConstants.USER_LOGOUT });
};

export const login = (email, password, errRef) => async (dispatch, getState) => {
    try {
        dispatch({ type: userConstants.USER_LOGIN_REQUEST });

        const config = {
            headers: {
                "Content-type": "application/json",
            },
        };

        let userDto = {
            Email: email,
            Password: password
        }

        const  response  = await axios.post(
            userConstants.LOGIN_URL,
            userDto,
            config
        );



        let user = response.data
        let userData = new UserInfo(
            user.username,
            user.fullName,
            user.email,
            user.password,
            user.imageSrc,
            user.birthday,
            user.address,
            user.role,
            user.token,
            user.verified,
            user.userId)

        console.log(userData)
        localStorage.setItem('userInfo',JSON.stringify(userData)) //TODO koristim
        localStorage.setItem('token',user.token)

        dispatch({
            type: userConstants.USER_LOGIN_SUCCESS,
            success: true,
            payload: userData });

    } catch (error) {
        dispatch({
            type: userConstants.USER_LOGIN_FAIL,
            payload:
                error.response && error.response.data.message
                   /* ? error.response.data.message
                    : error.message,*/
                    ? "Login failed"
                    : "Wrong username or password",
            success: false
        });
        errRef.current.focus()
    }
};

export const loginGoogle = (googleResponse, errRef) => async (dispatch) => {
    try {
        dispatch({ type: userConstants.USER_LOGIN_REQUEST });
        const config = {
            headers: {
                "Content-type": "application/json"
            },
        };


        const  response  = await axios.post(
            userConstants.GOOGLE_LOGIN_URL,
            JSON.stringify(googleResponse),
            config
        );

        let user = response.data
        let userData = new UserInfo(
            user.username,
            user.fullName,
            user.email,
            user.password,
            user.imageSrc,
            user.birthday,
            user.address,
            user.role,
            user.token,
            )
            userData.userId = user.userId
            console.log(userData)
            console.log(user)

        localStorage.setItem('userInfo',JSON.stringify(userData))
        localStorage.setItem('token',user.token)

        dispatch({
            type: userConstants.USER_LOGIN_SUCCESS,
            success: true,
            payload: userData });

    } catch (error) {
        errRef.current.focus()
        dispatch({
            type: userConstants.USER_LOGIN_FAIL,
            payload:
                error.response && error.response.data.message
                     ? error.response.data.message
                     : error.message,
        });
    }
};

export const register = (formData, errRef) => async (dispatch) => {
    try {
        dispatch({ type: userConstants.USER_REGISTER_REQUEST });

        const config = {
            headers: {
                "Content-type": "multipart/form-data"
            },
        };
        for (const pair of formData.entries()) {
            const [key, value] = pair;
            console.log(`${key}: ${value}`);
        }


        const response = await axios.post(
            userConstants.REGISTER_URL,
            formData,
            config
        );

        dispatch({ type: userConstants.USER_REGISTER_SUCCESS, payload: response });

    } catch (error) {
        dispatch({
            type: userConstants.USER_REGISTER_FAIL,
            payload:
                error.response && error.response.data.message
                   /* ? error.response.data.message
                    : error.message,*/
                    ?  "An unexpected error occurred during registration:" + error.response.data.message
                    : "Registration error" + error.response.data.errors
        });
        errRef.current.focus()
    }
};

export const updateProfile = (formData) => async (dispatch, getState) => {
    try {
        dispatch({ type: userConstants.USER_UPDATE_REQUEST });


        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                 Authorization: `Bearer ${GetToken()}`,
            },
        };


        for (const pair of formData.entries()) {
            const [key, value] = pair;

        }

        const response = await axios.put(userConstants.UPDATE_URL, formData, config);

        dispatch({ type: userConstants.USER_UPDATE_SUCCESS, userInfo:response.data});

        let user = response.data
        let userData = new UserInfo(
            user.username,
            user.fullName,
            user.email,
            user.password,
            user.imageSrc,
            user.birthday,
            user.address,
            user.role,
            user.token,
            user.verified)

        localStorage.setItem('userInfo',JSON.stringify(userData)) //TODO koristim
    } catch (error) {
        dispatch({
            type: userConstants.USER_UPDATE_FAIL,
            payload:
                error.response && error.response.data.message

                    ?  "An unexpected error occurred during profile edit:" + error.response.data.message
                    : "Profile edit error" + error.response.data.errors

        });
        console.log("Error status:", error.response.status);
        console.log("Error message:", error.response.data);
        console.log("Error details:", error.response.statusText);

    }
};

export const getUnverifiedUsers = () => async (dispatch) => {
    try{
        dispatch({ type: userConstants.GET_UNVERIFIED_USERS_REQUEST });
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GetToken()}`,
            },
        };


        const response = await axios.get(userConstants.GET_UNVERIFIED_USERS_URL, config);
        const unverifiedUsers = response.data;

        localStorage.setItem('unverifiedUsers', JSON.stringify(unverifiedUsers));
        dispatch({ type: userConstants.GET_UNVERIFIED_USERS_SUCCESS, users: unverifiedUsers});
        return unverifiedUsers
    }catch (error){
        dispatch({
            type: userConstants.GET_UNVERIFIED_USERS_FAIL,
            payload:
                error.response && error.response.data.message

                    ?  "An unexpected error occurred get request :" + error.response.data.message
                    : "Request get users  error" + error.response.data.errors

        });
        console.log("Error status:", error.response.status);
        console.log("Error message:", error.response.data);
        console.log("Error details:", error.response.statusText);

    }
}

export const getVerifiedUsers = () => async (dispatch) => {
    try{
        dispatch({ type: userConstants.GET_VERIFIED_USERS_REQUEST });
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GetToken()}`,
            },
        };


        const response = await axios.get(userConstants.GET_VERIFIED_USERS_URL, config);
        const verifiedUsers = response.data;

        localStorage.setItem('verifiedUsers', JSON.stringify(verifiedUsers));
        dispatch({ type: userConstants.GET_VERIFIED_USERS_SUCCESS, users: verifiedUsers});
        return verifiedUsers
    }catch (error){
        dispatch({
            type: userConstants.GET_VERIFIED_USERS_FAIL,
            payload:
                error.response && error.response.data.message

                    ?  "An unexpected error occurred get request :" + error.response.data.message
                    : "Request get users  error" + error.response.data.errors

        });
        console.log("Error status:", error.response.status);
        console.log("Error message:", error.response.data);
        console.log("Error details:", error.response.statusText);

    }
}

export const verifyProfile = (email,errRef) => async (dispatch) => {
    try {
        dispatch({ type: userConstants.USER_VERIFY_REQUEST });


        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GetToken()}`,
            },
        };


        const response = await axios.put(userConstants.VERIFY_USER_URL +email, email , config);
        dispatch({ type: userConstants.USER_VERIFY_SUCCESS});

        return true;
    }
    catch (error) {
        dispatch({
            type: userConstants.USER_VERIFY_FAIL,
            payload:
                error.response && error.response.data.message

                    ?  "An unexpected error occurred during profile edit:" + error.response.data.message
                    : "Profile edit error" + error.response.data.errors

        });
        console.log("Error status:", error.response.status);
        console.log("Error message:", error.response.data);
        console.log("Error details:", error.response.statusText);
        return false;
    }
}

