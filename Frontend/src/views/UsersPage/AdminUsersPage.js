import MainPage from "../../components/MainPage";
import {useEffect, useRef, useState} from "react";
import {Form, Button, Row, Col, Table} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {getUnverifiedUsers, getVerifiedUsers, login, verifyProfile} from "../../services/actions/userActions";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "./AdminUsersPage.css"


const AdminUsersPage = () => {

    const errRef = useRef();
    const dispatch = useDispatch();
    const [unverifiedUsers,setUnverifiedUsers] = useState([])
    const [verifiedUsers,setVerifiedUsers] = useState([])
    const [toggleState, setToggleState] = useState(1);
    //let unverifiedUsers= JSON.parse(localStorage.getItem('unverifiedUsers'));

    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        dispatch(getUnverifiedUsers())
            .then((data) => {
                setUnverifiedUsers(data);
                /*if (data.length <= 0) {
                    setErrMsg("All users are verified")}*/
                })
            .catch((error) => {
                    console.log("Error fetching unverified users:", error);
                });

        dispatch(getVerifiedUsers())
            .then((data) => {
                setVerifiedUsers(data);
               /* if (data.length <= 0) {
                    setErrMsg("There is no verified users");
                }*/})
            .catch((error) => {
                console.log("Error fetching verified users:", error);
            });
    },[])



/*    const refreshUnverifiedUsers = (event) => {
        event.preventDefault()
        dispatch(getUnverifiedUsers());
        setUnverifiedUsers(JSON.parse(localStorage.getItem('unverifiedUsers')));
    }*/


    const handleUserVerification = async(email, event) => {
        event.preventDefault()
        const response = await dispatch(verifyProfile(email,errRef))
        if(response){
            dispatch(getUnverifiedUsers())
                .then((data) => {
                    setUnverifiedUsers(data);
                })
                .catch((error) => {
                    console.log("Error fetching unverified users:", error);
                });
    }

    }


    const toggleTab= (index) => {
        setToggleState(index)
    }


    return <MainPage tittle={"Users"}>
        <>
            {errMsg ? (
                <section>
                    <p>{errMsg}</p>
                </section>
                ) :(
                    <div class={"tabs container"}>
                        <div className={"bloc-tabs"}>
                            <Button  className={toggleState == 1 ? "tabs active-tabs" : "tabs"}
                                 onClick={() => toggleTab(1)}
                            >Unverified users</Button>
                            <Button className={toggleState == 2 ? "tabs active-tabs" : "tabs"}
                                 onClick={() => toggleTab(2)}
                            >Verified users</Button>
                        </div>


                        <div clasName={"content-tabs"}>
                            <div className={toggleState == 1 ? "content active-content" : "content"}>
                                <Table>
                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {unverifiedUsers && unverifiedUsers.length > 0 ? (
                                        unverifiedUsers.map((user) => (
                                            <tr key={user.id}>
                                                <td>{user.fullName}</td>
                                                <td>{user.email}</td>
                                                <td>
                                                    <Button
                                                        variant="primary"
                                                        onClick={ (event)=> handleUserVerification(user.email,event)}>
                                                        Verify
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3}>No unverified users found.</td>
                                        </tr>
                                    )}

                                    </tbody>
                                </Table>
                            </div>
                            <div className={toggleState == 2 ? "content active-content" : "content"}>
                                <Table>
                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {verifiedUsers && verifiedUsers.length > 0 ? (
                                        verifiedUsers.map((user) => (
                                            <tr key={user.id}>
                                                <td>{user.fullName}</td>
                                                <td>{user.email}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3}>No verified users found.</td>
                                        </tr>
                                    )}

                                    </tbody>
                                </Table>
                            </div>
                        </div>
                </div>
            )}
        </>
    </MainPage>
}

export default AdminUsersPage