import MainPage from "../../components/MainPage";
import {useEffect, useRef, useState} from "react";
import {Form, Button, Row, Col, Table} from "react-bootstrap";
import {Link, useLocation, useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {cancelPurchase, getAllOrders, getCustomerOrders, getFilteredOrders} from "../../services/actions/orderActions";
import {formatDate} from "../../services/actions/common"
import "./OrdersPage.css"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faTimes,faInfoCircle} from "@fortawesome/free-solid-svg-icons";
const OrdersPage = () => {

    const errRef = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [orderList,setOrderList] = useState([])
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const currentDate = new Date();

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const status = searchParams.get('status');

    const userUpdateReducer = useSelector((state) => state.userUpdateReducer);
    const { success, error } = userUpdateReducer;

    //let unverifiedUsers= JSON.parse(localStorage.getItem('unverifiedUsers'));

    const [errMsg, setErrMsg] = useState('');

  

    useEffect(() => {
        if(userInfo.role == 'Admin'){
        
                dispatch(getAllOrders())
                    .then((data) => {
                        setOrderList(data);
                         if (data.length <= 0) {
                        setErrMsg("There are no orders");
                     }})
                    .catch((error) => {
                        console.log("Error fetching  orders:", error);
                });}
        else if (userInfo.role == 'Customer'){
            
                dispatch(getCustomerOrders(userInfo.userId))
                    .then((data) => {
                        setOrderList(data);
                        if (data.length <= 0) {
                            setErrMsg("There are no orders");
                        }})
                    .catch((error) => {
                        console.log("Error fetching  orders:", error);
                });}
        else
        {
                dispatch(getFilteredOrders(userInfo.userId,status))
                .then((data) => {
                    setOrderList(data);
                    if (data.length <= 0) {
                        setErrMsg("There are no orders");
                    }})
                .catch((error) => {
                    console.log("Error fetching  orders:", error);
                });}

    },[])


    const CancelOrder = (id) => {
        dispatch(cancelPurchase(id));
        navigate('/articles')

    }


    return <MainPage tittle={"All orders"}>
        <>
            {errMsg ? (
                <section>
                    <p>{errMsg}</p>
                </section>
            ) :(

                <Table>
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Date</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Time left</th>
                        <th>Delivery time</th>
                       {/* <th>Delivery address</th>*/}
                    </tr>
                    </thead>
                    <tbody>
                    {orderList && orderList.length > 0 ? (
                        orderList.map((order) => (
                            <tr >
                                <td>{order.id}</td>
                                <td>{formatDate(order.orderDate)}</td>
                                <td>{order.totalAmount}</td>
                                <td>
                                    {(() => {
                                        switch (order.status) {
                                            case 'Pending':
                                                return 'Pending';
                                            case 'Deliverd':
                                                return 'Delivered';
                                            case 'Canceled':
                                                return 'Canceled';
                                            default:
                                                return 'Unknown Status';
                                        }
                                    })()}
                                </td>
                                <td>{order.timeToDelivery}</td>
                                <td>{order.orderCreationTime}</td>
                                <td><Button 
                                    className={userInfo.role != 'Customer'? "offscreen" : "show"}
                                    disabled= {  order.status != 'Pending'||
                                               (order.orderCreationTime - 60 > order.timeToDelivery ) 
                                    }
                                    onClick={(e)=> {e.preventDefault(); CancelOrder(order.id)}} 
                                     size={"sm"}>cancel</Button></td>
                                <td>
                                    <p className={
                                        userInfo.role == 'Customer' &&
                                        (order.status == 'Pending') &&
                                        (order.orderCreationTime - 60 > order.timeToDelivery ) ? "instructions" : "offscreen"}>
                                        <FontAwesomeIcon icon={faInfoCircle}></FontAwesomeIcon>
                                        Time is up.You can cancel your order only in first hour. <br/>
                                    </p>
                                </td>
                             
                               {/* <td>{order.address}</td>*/}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3}>No orders found.</td>
                        </tr>
                    )}

                    </tbody>
                </Table>
            )}
        </>
    </MainPage>
}

export default OrdersPage