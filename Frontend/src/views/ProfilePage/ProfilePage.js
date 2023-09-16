import {useEffect, useRef, useState} from "react";
import axios from "../../api/axios";
import MainPage from "../../components/MainPage";
import {Button, Col, Form, FormCheck, FormGroup, Row} from "react-bootstrap";
import {Link,useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faInfoCircle, faTimes} from "@fortawesome/free-solid-svg-icons";
import "./ProfilePage.css"
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
import {register, splitAddress, updateProfile} from "../../services/actions/userActions";
import {useDispatch, useSelector} from "react-redux";

const ProfilePage = () => {
    const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();

    const dispatch = useDispatch();

   // const userLogin = useSelector((state) => state.userLogin);
   // const { userInfo } = userLogin; //this is stored only for one session :(
    var userInfo = JSON.parse(localStorage.getItem('userInfo'))


    const userUpdateReducer = useSelector((state) => state.userUpdateReducer);
    const { error, success } = userUpdateReducer;

    //#region useState
    const [user, setUser] = useState(userInfo.username);
    const [validName, setValidName] = useState(true);
    const [userFocus, setUserFocus] = useState(false);

    const [email, setEmail] = useState(userInfo.email);
    const [validEmail, setValidEmail] = useState(true);
    const [emailFocus, setEmailFocus] = useState(false);

    const [pwd, setPwd] = useState("");
    const [validPwd, setValidPwd] = useState(true);
    const [pwdFocus, setPwdFocus] = useState(false);


    const [fullName, setFullName] = useState(userInfo.fullName);
    const [validFullName, setValidFullName] = useState(true);
    const [fullNameFocus, setFullNameFocus] = useState(false);

    const addressString = `${userInfo.address.street}, ${userInfo.address.streetNumber}, ${userInfo.address.city}, ${userInfo.address.postCode}`;

    const [address, setAddress] = useState(addressString);
    const [validAddress, setValidAddress] = useState(true);
    const [addressFocus, setAddressFocus] = useState(false);

    const [birthday, setBirthday] = useState(userInfo.birthday);
    const [validBirthday, setValidBirthday] = useState(true);
    const [birthdayFocus, setBirthdayFocus] = useState(false);

    const [img, setImg] = useState('');
    const [imgSrc, setImgSrc] = useState(userInfo.imageSrc);
    const [imgName, setImgName] = useState(userInfo.ImageName);
    const [imgFocus, setImgFocus] = useState(false);
    const [validImg, setValidImg] = useState(true);

    const [errMsg, setErrMsg] = useState('');
    //endregion


    //#region useEffect
    useEffect(()=>{
        if(success)
        {
            if(userInfo.role=='Admin')
                navigate('/get-orders');
            else if(userInfo.role=='Customer')
                navigate('/articles');
            else if(userInfo.role=='Salesman')
                navigate('/salesman-articles');
        }
    })


    useEffect(() => {
        if(error)
            setErrMsg(error)
    },[error])

    useEffect(() => {
        userRef.current.focus();
    },[])

    useEffect(() => {
        setValidName(USERNAME_REGEX.test(user));
    }, [user])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        if(pwd.length >0 ){
        setValidPwd(PWD_REGEX.test(pwd));}
    }, [pwd])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    useEffect(() => {
        setValidFullName(FULL_NAME_REGEX.test(fullName));
    }, [fullName])


    useEffect(() => {
        setValidAddress(ADDRESS_REGEX.test(address));
    }, [address])

    useEffect(() => {
        setValidBirthday(BIRTHDAY_REGEX.test(birthday));
    }, [birthday])

    //endregion


    //TODO izmesti je
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
            console.log("Handle img upload esle statement")
        }
    }


    const handleSubmit = async(e) => {
        e.preventDefault();

        //#region fill form data
        const formData = new FormData();
        const [street,streetNumber,city,postalCode] = splitAddress(address)

        const userData = {
            Username: user,
            Email: email,
            Password: pwd,
            FullName: fullName,
            Address: {
                street: street,
                streetNumber: streetNumber,
                city: city,
                postCode: postalCode,
            },
            Birthday: birthday,
            ImageSrc: imgSrc,
            ImageName: imgName,
            ImageFile: img,
            token: userInfo.token,
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

        dispatch(updateProfile(formData))
    }


    return <MainPage tittle={"Edit Profile"}>
            <div className={"edit-container"}>
               {/* <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}
                   aria-live={"assertive"}>{errMsg}</p>*/}
                <Row className="profileContainer">
                    <Col md={6}>
                        <Form onSubmit={handleSubmit}>
                            {userInfo.role == 'Salesman' && (
                                <FormGroup style={{fontSize:20}}>
                                    <Form.Label>Status:

                                        {userInfo.verified ?
                                            (

                                                <span style={{fontWeight:"bold"}}>
                                                    &nbsp;
                                                    VERIFIED
                                                    &nbsp;
                                                    <FontAwesomeIcon  className={'valid'} icon={faCheck}/>
                                                </span>):
                                            (
                                                <span >
                                                    &nbsp;
                                                    UNVERIFIED
                                                    &nbsp;
                                                    <FontAwesomeIcon className={'invalid'} icon={faTimes}/></span>)
                                        }
                                    </Form.Label>
                                </FormGroup>) }


                            <Form.Group>
                                <Form.Label htmlFor={"username"}>Username:
                                   {/* <span className={validName ? "valid" : "hide"}>
                                            <FontAwesomeIcon icon={faCheck}/>
                                        </span>
                                    <span className={validName || !user ? "hide" : "invalid"}>
                                            <FontAwesomeIcon icon={faTimes}/>
                                        </span>*/}
                                </Form.Label>
                                <Form.Control
                                    type={"text"}
                                    id = "username"
                                    value={user}
                                    ref = {userRef}
                                    autoComplete="off"
                                    /*onChange={(e) => setUser(e.target.value)}*/
                                    readOnly
                                 /*   aria-invalid={validName ? "false" : "true"}
                                    aria-describedby="uidnote"
                                    onFocus={()=> setUserFocus(true)}
                                    onBlur={() => setUserFocus(false)}*/

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
                                    value={email}
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
                                    value={pwd}
                                    onChange={(e)=> setPwd(e.target.value)}
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
                                    value = {fullName}
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
                                    value = {address}
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
                                    value={birthday}
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
                                <Form.Label htmlFor={"imageUpload"}>
                                    Change profile picture:
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

                            <Button type="submit"
                                    variant="primary"
                                    disabled={!validName ||
                                    !validPwd ||
                                    !fullName ||
                                    !address ||
                                    !birthday ? true : false}>Save</Button>

                        </Form>
                    </Col>

                    <Col
                        style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                        }}>
                        <img  src={imgSrc} className={"profilePic"} />
                    </Col>
        </Row>
    </div>
</MainPage>
}

export default ProfilePage