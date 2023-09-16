export const USER_LOGIN_REQUEST = "USER_LOGIN_REQUEST";
export const USER_LOGIN_SUCCESS = "USER_LOGIN_SUCCESS";
export const USER_LOGIN_FAIL = "USER_LOGIN_FAIL";
export const USER_LOGOUT = "USER_LOGOUT";

export const USER_REGISTER_REQUEST = "USER_REGISTER_REQUEST";
export const USER_REGISTER_SUCCESS = "USER_REGISTER_SUCCESS";
export const USER_REGISTER_FAIL = "USER_REGISTER_FAIL";

export const USER_UPDATE_REQUEST = "USER_UPDATE_REQUEST";
export const USER_UPDATE_SUCCESS = "USER_UPDATE_SUCCESS";
export const USER_UPDATE_FAIL = "USER_UPDATE_FAIL";

export const USER_VERIFY_REQUEST = "USER_UPDATE_REQUEST";
export const USER_VERIFY_SUCCESS = "USER_UPDATE_SUCCESS";
export const USER_VERIFY_FAIL = "USER_UPDATE_FAIL";

export const GET_UNVERIFIED_USERS_REQUEST = "UNVERIFIED_USERS_REQUEST";
export const GET_UNVERIFIED_USERS_SUCCESS  = "UNVERIFIED_USERS_SUCCESS";
export const GET_UNVERIFIED_USERS_FAIL  = "UNVERIFIED_USERS_FAIL";

export const GET_VERIFIED_USERS_REQUEST = "VERIFIED_USERS_REQUEST";
export const GET_VERIFIED_USERS_SUCCESS  = "VERIFIED_USERS_SUCCESS";
export const GET_VERIFIED_USERS_FAIL  = "VERIFIED_USERS_FAIL";

export const LOGIN_URL = 'api/User/logIn'
export const GOOGLE_LOGIN_URL = 'api/User/logIn-google'
export const REGISTER_URL = 'api/User/register'
export const UPDATE_URL = 'api/User/update-user'
export const VERIFY_USER_URL = 'api/User/verify-user'
export const GET_UNVERIFIED_USERS_URL = 'api/User/get-unverified-users'
export const GET_VERIFIED_USERS_URL = 'api/User/get-verified-users'


export const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9]{3,23}$/
export const EMAIL_REGEX =  /^\S+@\S+\.\S+$/;
export const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,23}$/
export const FULL_NAME_REGEX = /^[A-Z][a-zA-Z]{1,29}\s[A-Z][a-zA-Z]{1,29}$/;
export const ADDRESS_REGEX = /^[a-zA-Z\s]+, \d+, [a-zA-Z\s]+, [a-zA-Z\d\s]+$/;
export const BIRTHDAY_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
export const MAX_FILE_SIZE = 20 * 1024 * 1024;
export const DEFAULT_IMG_SRC = '/images/default-img_old.png'
