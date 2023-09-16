import React, { useEffect ,useState} from "react";
import {Container, Form, FormControl, Image, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {logout} from "../services/actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShoppingCart} from "@fortawesome/free-solid-svg-icons";
import {Order} from "../models/Order";
import '../styles/Header.css'

function Header({ setSearch }) {

    let isRefreshing = false;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')));



    const  cartReducer = useSelector((state) => state.cartReducer)
    const cartItemsCount = cartReducer.orderItems.reduce(
        (total, item) => total + item.quantity,
        0
    );
/* const   cartItemsCount = 0;*/



    const logoutHandler = () => {
        navigate('/login')
        dispatch(logout())
    };


    //event for tracking page reload
    window.addEventListener("unload", function() {
        isRefreshing = true;
    });

    //event for tracking changes in storage
    const storageChangeEvent = new Event('storageChange');
    window.dispatchEvent(storageChangeEvent);


    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.storageArea === localStorage && event.key === 'userInfo') {
                setUserInfo(JSON.parse(event.newValue));
            }

          /*  else if(event.storageArea === localStorage && event.key === 'cart') {
                setCartInfo(JSON.parse(event.newValue));
                setCartItemsCount(cartInfo.orderItems.length)
            }*/
        };



    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);

    },[]);



    return (
        <Navbar className="my-nav-bar" collapseOnSelect expand="lg ">
            <Container>
                <Navbar.Brand className="app-name">TireHaven </Navbar.Brand>

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="m-auto">
                        {/* {userInfo && (
                           <Form inline>
                                <FormControl
                                    type="text"
                                    placeholder="Search"
                                    className="mr-sm-2"
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </Form>
                         )}*/}
                    </Nav>
                    <Nav>
                       {userInfo ? (
                        <>
                            {userInfo.role == 'Admin' && (
                                <>
                                    <Nav.Link href="/get-orders">Orders</Nav.Link>
                                    <Nav.Link href="/verification">Users</Nav.Link>
                                </>
                            )}
                            {userInfo.role == 'Salesman' && (
                                <>
                                    <Nav.Link href="/salesman-articles">Home</Nav.Link>
                                    <Nav.Link href="/create-articles">Add Articles</Nav.Link>
                                    <Nav.Link as={Link}
                                              to={{pathname: '/get-orders', search: '?status=Pending'}}>
                                        New orders
                                    </Nav.Link>
                                    <Nav.Link as={Link}
                                              to={{pathname: "/get-orders"}}>
                                        My orders(sve ostalo)
                                    </Nav.Link>

                                </>
                            )}
                            {userInfo.role == 'Customer' && (
                                <>

                                    <Nav.Link href="/articles">Home</Nav.Link>
                                    <Nav.Link href="/get-orders">My orders</Nav.Link>
                                </>
                            )}

                            <NavDropdown
                                title={`${userInfo.username}`}
                                id="collasible-nav-dropdown"
                            >

                                <NavDropdown.Item href="/profile"style={{color:"black"}}>
                                     <Image
                                      alt=""
                                      src={userInfo.imageSrc}
                                      width="25"
                                      height="25"
                                      style={{ marginRight: 0 }}

                                    />
                                    profile
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item style={{color:"black"}} onClick={logoutHandler}>
                                    Logout
                                </NavDropdown.Item>

                            </NavDropdown>

                            {userInfo.role == 'Customer' && (
                                <>
                                    <Nav.Link href={"/cart"}>
                                        <div className="cart">
                                            <h4>
                                                <FontAwesomeIcon icon={faShoppingCart} />
                                            </h4>
                                            <i className="bi bi-cart2"></i>
                                            <div id="cartAmount" className="cartAmount">{cartItemsCount}</div>
                                        </div>
                                    </Nav.Link>
                                </>
                            )}

                        </>
                        ) : (
                            <Nav.Link href="/">Home</Nav.Link>
                      )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;