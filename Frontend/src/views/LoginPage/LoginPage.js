import MainPage from "../../components/MainPage";
import {useEffect, useRef, useState} from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import './LoginPage.css';
import { useDispatch, useSelector } from "react-redux";
import {login, loginGoogle} from "../../services/actions/userActions";
import {GoogleLogin} from "@react-oauth/google";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faTimes,faInfoCircle} from "@fortawesome/free-solid-svg-icons";

import {
    EMAIL_REGEX,
} from "../../services/constants/userConstants"

const LoginPage = () => {

    const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const userLoginReducer = useSelector((state) => state.userLoginReducer);
    const { error, userInfo } = userLoginReducer;

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');


    useEffect(() => {
        if(userInfo){
        if( userInfo.role == 'Customer')
            navigate("/articles")
        else if( userInfo.role == 'Salesman')
            navigate("/salesman-articles")
        else
            navigate("/get-orders")
        }
    })

    useEffect(() => {
        if(error)
            setErrMsg(error)
    })

    //!*this will be called only when compnenet loads*!/
    useEffect(() => {
        userRef.current.focus();
    },[])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    /*useEffect(() => {
        errRef.current.focus();
    },[email, pwd])*/


    const handleSubmit = async (e) => {
        e.preventDefault();
         dispatch(login(email,pwd,errRef))
    }


    const handleGoogleLoginSuccess = async function (response){
        console.log('Google Sign-In Success:', response);

        const jwtToken = response.credential;

        // Decode the JWT to get user data
        const base64Url = jwtToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const userData = JSON.parse(atob(base64));


        dispatch(loginGoogle(response.credential,errRef))
    }


    return <MainPage tittle={"Login"}>
     
        <div className="wrapper">
            <section className={"login-container"}>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}
                   aria-live={"assertive"}>{errMsg}</p>

                <Form onSubmit={handleSubmit}>

                    <Form.Group>
                        <Form.Label htmlFor={"email"}>Email: </Form.Label>
                        <Form.Control
                               type={"text"}
                               id={"email"}
                               ref={userRef}
                               autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            aria-invalid={validEmail ? "false" : "true"}
                            aria-describedby="emailnote"
                        
                        />
                        <p id={"emailnote"} className={ email && !validEmail ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>
                            Email should be in the format of: 'example@example.com'. <br/>
                        </p>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor={"password"}>Password: </Form.Label>
                        <Form.Control
                            type={"password"}
                            id={"password"}
                            autoComplete={"off"}
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                        />
                    </Form.Group>

                    <Button className="signin-button" type={"submit"}>Sign In</Button>

                </Form>
                <GoogleLogin
                    buttonText={ "Continue with Google"}
                    theme="filled_black"
                    onSuccess={handleGoogleLoginSuccess}
                    onError={() => {
                        console.log("Google sign up failed")
                    }}
                />


                <Row>
                    <Col> Need an Account?
                            <Link to={"/register"}  style={{color:"blue"}} className={"refrence-text"}>  Sign Up</Link>
                    </Col>
                </Row>

            </section>
            </div>

    </MainPage>
}

export default LoginPage