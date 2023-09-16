import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {addItemToCart, BuyItems, deleteOrder, removeFromCart} from "../services/actions/orderActions";
import MainPage from "./MainPage";
import {Button, Col, Form, Row, Table} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faInfoCircle, faShoppingCart, faTimes} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import '../styles/cart.css'
import {ADDRESS_REGEX} from "../services/constants/userConstants";
import {cenaDostave} from "../services/constants/orderConstants";


function Cart(){


    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')))
    const [order, setOrder] = useState({
        address:'',
        comment: '',
        orderItems: cart.orderItems,
        totalAmount: cart.totalAmount + cenaDostave,
        customerId: userInfo.userId
    })

    const [validAddress, setValidAddress] = useState(false);
    const [addressFocus, setAddressFocus] = useState(false);


    useEffect(() => {
        setValidAddress(ADDRESS_REGEX.test(order.address));
    }, [order])

    const cancelButtonHandler = () => {
        console.log(order)
        dispatch(deleteOrder(order))
        navigate('/articles')
    }

    const buyButtonHandler = () => {
        updateInfo()
        console.log(cart)
        console.log(order)
        dispatch(BuyItems(order))
        navigate('/get-orders')
    }

    const handleChange = (name, value) => {
        setOrder((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const updateInfo = () => {
        setCart(JSON.parse(localStorage.getItem('cart')))
    }

    const addItem = (article) => {
        dispatch(addItemToCart(article));
        updateInfo()
    }

    const removeItem = (article) => {
        dispatch(removeFromCart(article));
        updateInfo()
    }



    return (
        <MainPage  tittle={
            <>
                <h2> Your basket &nbsp;
                    <FontAwesomeIcon icon={faShoppingCart} />
                </h2>
            </>}
        >

            <div className={'order-container'}>
                <Form>
                    <Form.Group>
                        <Table>
                            <thead>
                            <th>Name:</th>
                            <th>Price:</th>
                            <th>Qunatitiy:</th>
                            </thead>
                            <tbody>
                            {cart.orderItems && cart.orderItems.length > 0 ?
                                (
                                    cart.orderItems.map((article) => (
                                            <tr className={'cart-item'}>
                                                <td>{article.name}</td>
                                                <td>{article.price}</td>
                                                <td>
                                                    <button className={'quantity-button'} onClick={(e) => {e.preventDefault(); removeItem(article)}}>-</button>
                                                    {article.quantity}
                                                    <button className={'quantity-button'} onClick={(e) => {e.preventDefault(); addItem(article)}}>+</button>
                                                </td>
                                            </tr>
                                        )
                                    )) :
                                (
                                    <tr>
                                        <td colSpan={3}>No items found.</td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </Table>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>
                            Address:
                            <span className={validAddress ? "valid" : "hide"}>
                                    <FontAwesomeIcon icon={faCheck}/>
                                </span>
                            <span className={validAddress  ? "hide" : "invalid"}>
                                    <FontAwesomeIcon icon={faTimes}/>
                            </span>
                        </Form.Label>
                        <Form.Control
                            required
                            type={"text"}
                            id="address"
                            value = {order.address}
                            onChange={(e) => handleChange("address", e.target.value)}
                            aria-invalid={validAddress ? "false" : "true"}
                            aria-describedby={"addrnote"}
                            onFocus={() => setAddressFocus(true)}
                            onBlur={() => setAddressFocus((false))}
                            className={'address-input'}
                            size={"sm"}
                        />
                        <p id={"addrnote"} className={addressFocus && order.address && !validAddress ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle}/>
                            Please enter the address in the following format: street, street number, city, postal code. <br/>
                            Example:Main Street, 123, Cityville, 78901.<br/>
                        </p>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>
                            Comment:
                        </Form.Label>
                        <Form.Control
                            type={"text"}
                            id="comment"
                            value = {order.comment}
                            onChange={(e) => handleChange("comment", e.target.value)}
                            required
                            className={'comment-input'}
                            size={"sm"}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>
                            Cena dostave: &nbsp; $ {cenaDostave}
                        </Form.Label>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>
                            <h5>Total amount: &nbsp; ${cart.totalAmount + cenaDostave}</h5>
                        </Form.Label>
                    </Form.Group>

                    <div className={'action-buttons'}>
                        <Button disabled = {cart.orderItems.length == 0 || !validAddress} 
                            type={"submit"} 
                            className={'action-button'} 
                            onClick={(e) => {e.preventDefault(); buyButtonHandler()}}>Buy</Button>
                        <Button type={"submit"} className={'action-button'} onClick={(e) => {e.preventDefault(); cancelButtonHandler()}}>Cancel</Button>
                    </div>
                 </Form>






            </div>
        </MainPage>
    );
};

export default Cart;