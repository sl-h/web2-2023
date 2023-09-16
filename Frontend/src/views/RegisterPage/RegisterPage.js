import {useEffect, useRef, useState} from "react";
import MainPage from "../../components/MainPage";
import {Button, Col, Form, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import {faCheck, faTimes,faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import {register, splitAddress} from "../../services/actions/userActions";
import {
    USERNAME_REGEX,
    EMAIL_REGEX,
    PWD_REGEX,
    FULL_NAME_REGEX,
    ADDRESS_REGEX,
    BIRTHDAY_REGEX,
    MAX_FILE_SIZE,
    DEFAULT_IMG_SRC,
} from "../../services/constants/userConstants"
import {GoogleLogin} from "@react-oauth/google";



const RegisterPage = () => {
    const userRef = useRef();
    const errRef = useRef();

    const dispatch = useDispatch();

    const userRegisterReducer = useSelector((state) => state.userRegisterReducer);
    const { success, error, userInfo } = userRegisterReducer;

  /*  const { clientId } = useGoogleOAuth();*/


    //#region useState
    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [fullName, setFullName] = useState('');
    const [validFullName, setValidFullName] = useState(false);
    const [fullNameFocus, setFullNameFocus] = useState(false);

    const [address, setAddress] = useState('');
    const [validAddress, setValidAddress] = useState(false);
    const [addressFocus, setAddressFocus] = useState(false);

    const [birthday, setBirthday] = useState('');
    const [validBirthday, setValidBirthday] = useState(false);
    const [birthdayFocus, setBirthdayFocus] = useState(false);

    const [role, setRole] = useState('');
    const [validRole, setValidRole] = useState(false);
    const [roleFocus, setRoleFocus] = useState(false);

    const [img, setImg] = useState('');
    const [imgSrc, setImgSrc] = useState(DEFAULT_IMG_SRC);
    const [imgName, setImgName] = useState('');
    const [imgFocus, setImgFocus] = useState(false);
    const [validImg, setValidImg] = useState(false);

    const [errMsg, setErrMsg] = useState('');

    //endregion


    //#region useEffect
    useEffect(() => {
        if(error)
            setErrMsg(error)
    },[errMsg])

 /*   useEffect(() => {
        userRef.current.focus();
    },[])*/

    useEffect(() => {
        setValidName(USERNAME_REGEX.test(user));
    }, [user])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd])

    useEffect(() => {
        setValidFullName(FULL_NAME_REGEX.test(fullName));
    }, [fullName])

    useEffect(() => {
        setValidAddress(ADDRESS_REGEX.test(address));
    }, [address])

    useEffect(() => {
        setValidBirthday(BIRTHDAY_REGEX.test(birthday));
    }, [birthday])

    useEffect(() => {
        if(role != "")
            setValidRole(true)
    }, [role])



    //endregion


    const handleImageUpload =  (e) => {
        if(e.target.files && e.target.files[0])
        {
            const file = e.target.files[0]
            if(file.size < MAX_FILE_SIZE ){
                const reader = new FileReader();
                reader.onload = x => {
                    setImgSrc(x.target.result)
                    setImgName(file.name)
                    setValidImg(true)
                    setImg(file)
                }
                reader.readAsDataURL(file)
            }
        }
        else
        {
            setImgSrc(DEFAULT_IMG_SRC)
            setImgName("Default")
            setImg(null)
        }
    }


    const handleSubmit = async(e) => {
        e.preventDefault();

        //#region check is form valid
        //if button enabled with JS hack
        const v1 = USERNAME_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        const v3 = EMAIL_REGEX.test(email);
        const v4 =  BIRTHDAY_REGEX.test((birthday));
        const v5 =  ADDRESS_REGEX.test((address));


        if(!v1 || !v2 || !v3 || !v4 || !v5){
            setErrMsg("Invalid Entry");
            return;
        }//#endregion


        //#region fill form data
        const formData = new FormData();
        const [street,streetNumber,city,postalCode] = splitAddress(address)

        const userData = {
            Username: user,
            Password: pwd,
            Email: email,
            FullName: fullName,
            Address: {
                street: street,
                streetNumber: streetNumber,
                city: city,
                postCode: postalCode,
            },
            Birthday: birthday,
            Role: role,
            ImageName: imgName,
            ImageFile: img,
            ImageSrc: imgSrc,
            token: "empty",
        };

        for (const [key, value] of Object.entries(userData)) {
            if (key === "Address") {
                for (const [addressKey, addressValue] of Object.entries(value)) {
                    formData.append(`Address.${addressKey}`, addressValue);
                }
            } else {
                formData.append(key, value);
            }
        }
        //#endregion


        dispatch(register(formData, errRef))
    }


    return <MainPage tittle={"Sign up"}>
        <>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a>
                            <Link to="/login" style={{color:"blue"}}>Sign In</Link>
                        </a>
                    </p>
                </section>
            ) : (
            <section className={"login-container"}>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}
                   aria-live={"assertive"}>{errMsg}</p>
                <Form onSubmit={handleSubmit}>

                    <Form.Group>
                        <Form.Label htmlFor={"username"}>Username:
                            <span className={validName ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck}/>
                                </span>
                            <span className={validName || !user ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes}/>
                                </span>
                        </Form.Label>
                        <Form.Control
                            type={"text"}
                            id = "username"
                            ref = {userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={()=> setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />
                        <p id={"uidnote"} className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>
                            4 to 24 characters. <br/>
                            Must begin with a letter. <br/>
                            Letters, numbers, underscores, hyphens allowed.
                        </p>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label htmlFor={"email"}>Email:
                            <span className={validEmail ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck}/>
                                </span>
                            <span className={validEmail || !email ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes}/>
                                </span>
                        </Form.Label>
                        <Form.Control
                            type={"text"}
                            id = "email"
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            aria-invalid={validEmail ? "false" : "true"}
                            aria-describedby="emailnote"
                            onFocus={()=> setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                        />
                        <p id={"emailnote"} className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>
                            Email should be in the format of: 'example@example.com'. <br/>
                            Letters, numbers, underscores, hyphens allowed.
                        </p>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label htmlFor={"password"}>
                            Password:
                            <span className={validPwd ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck}/>
                                </span>
                            <span className={validPwd || !pwd ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes}/>
                                </span>
                        </Form.Label>
                        <Form.Control
                            type={"password"}
                            id={"password"}
                            onChange={(e)=> setPwd(e.target.value)}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby={"pwdnote"}
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus((false))}
                        />
                        <p id={"pwdnote"} className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle}/>
                            8 to 24 characters. <br/>
                            Must include uppercase and lowercase letters, a number with a special character. <br/>
                            Allowed special characters:
                            <span aria-label={"exclamation mark"}> ! </span>
                            <span aria-label={"at symbol"}> @ </span>
                            <span aria-label={"hashtag"}> # </span>
                            <span aria-label={"percent"}> % </span>
                        </p>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label htmlFor="confirm_pwd">
                            Confirm Password:
                            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                        </Form.Label>
                        <Form.Control
                            type="password"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the first password input field.
                        </p>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label htmlFor={"fullname"}>
                            Full name:
                            <span className={validFullName ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck}/>
                                </span>
                            <span className={validFullName || !fullName ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes}/>
                                </span>
                        </Form.Label>
                        <Form.Control
                            type={"text"}
                            id="fullName"
                            onChange={(e)=> setFullName(e.target.value)}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby={"namenote"}
                            onFocus={() => setFullNameFocus(true)}
                            onBlur={() => setFullNameFocus((false))}
                        />
                        <p id={"namenote"} className={fullNameFocus && fullName && !validFullName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle}/>
                            Name consists only of  uppercase and lowercase letters. <br/>
                        </p>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label htmlFor={"address"}>
                            Address:
                            <span className={validAddress ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck}/>
                                </span>
                            <span className={validAddress || !address ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes}/>
                                </span>
                        </Form.Label>
                        <Form.Control
                            type={"text"}
                            id="address"
                            onChange={(e)=> setAddress(e.target.value)}
                            required
                            aria-invalid={validAddress ? "false" : "true"}
                            aria-describedby={"addrnote"}
                            onFocus={() => setAddressFocus(true)}
                            onBlur={() => setAddressFocus((false))}
                        />
                        <p id={"addrnote"} className={addressFocus && address && !validAddress ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle}/>
                            Please enter the address in the following format: street, street number, city, postal code. <br/>
                            Example:Main Street, 123, Cityville, 78901.<br/>
                        </p>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label htmlFor={"birthday"}>
                            Birthday:
                            <span className={validBirthday ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck}/>
                                </span>
                            <span className={validBirthday || !birthday ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes}/>
                                </span>
                        </Form.Label>
                        <Form.Control
                            type={"text"}
                            id="birthday"
                            onChange={(e)=> setBirthday(e.target.value)}
                            required
                            aria-invalid={validBirthday ? "false" : "true"}
                            aria-describedby={"birthdaynote"}
                            onFocus={() => setBirthdayFocus(true)}
                            onBlur={() => setBirthdayFocus((false))}
                        />
                        <p id={"birthdaynote"} className={birthdayFocus && birthday && !validBirthday ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle}/>
                            Please enter your date of birth in the following format: YYYY-MM-DD. <br/>
                            Year should be a four-digit number;<br/>
                            Month should be a two-digit number from 01 to 12.<br/>
                            The day should be a two-digit number from 01 to 31;<br/>
                        </p>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label htmlFor={"userRole"}>Role:
                            <span className={validRole ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck}/>
                            </span>
                            <span className={validRole || !role ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes}/>
                            </span>
                        </Form.Label>
                        <Form.Control
                            as={"select"}
                            id={"userRole"}
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            aria-invalid={validRole ? 'false' : 'true'}
                            aria-describedby={"rolenote"}
                            onFocus={() => setRoleFocus(true)}
                            onBlur={() => setRoleFocus((false))}
                            required>
                                <option value={""} disabled>Selcet Role</option>
                                <option value={"Customer"}>Customer</option>
                                <option value={"Salesman"}>Salesman</option>

                        </Form.Control>
                        <p id={"rolenote"} className={roleFocus && role && !validRole ? 'instructions' : 'offscreen'}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Please select an role.
                        </p>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label htmlFor={"imageUpload"}>
                            Image:
                            {/*<img  src={imgSrc} style={{float:"right" }} />*/}
                            <span className={validImg ? 'valid' : 'hide'}>
                                    <FontAwesomeIcon icon={faCheck} />
                               </span>
                            <span className={validImg || !img ? 'hide' : 'invalid'}>
                                    <FontAwesomeIcon icon={faTimes} />
                               </span>
                        </Form.Label>
                        <Form.Control
                            type="file"
                            id="imageUpload"
                            accept=".jpg., .png, .jpeg"
                            onChange={handleImageUpload}
                            aria-invalid={validImg ? 'false' : 'true'}
                            aria-describedby={"imgnote"}
                            onFocus={() => setImgFocus(true)}
                            onBlur={() => setImgFocus((false))}
                        />
                        <p id={"imgnote"} className={imgFocus && img && !validImg ? 'instructions' : 'offscreen'}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Please select an image file (JPEG, PNG, JPEG).
                        </p>
                    </Form.Group>

                    <Button type={"submit"}
                            variant="bg-primary"
                            style={{backgroundColor:"#183D3D", color:"white"} }
                            disabled={!validName ||
                            !validPwd ||
                            !validMatch ||
                            !fullName ||
                            !address ||
                            !birthday ? true : false}>Sign Up</Button>

                </Form>
                <p>
                    Already registered?
                    <Link to="/login" style={{color:"blue"}} >Sign In</Link>
                </p>

        </section>
        )}
    </>
</MainPage>

}
export default RegisterPage