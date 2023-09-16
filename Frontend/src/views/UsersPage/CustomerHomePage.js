import {useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {getUnverifiedUsers, getVerifiedUsers, verifyProfile} from "../../services/actions/userActions";
import MainPage from "../../components/MainPage";
import {Button, Table} from "react-bootstrap";
import {getArticles, getSalesmanArticles} from "../../services/actions/articleActions";
import './CustomerHomePage.css'
import ArticleCard from "../../components/ArticleCard";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShoppingCart} from "@fortawesome/free-solid-svg-icons";
import {Order} from "../../models/Order";
import {Article} from "../../models/Article";

const CustomerHomePage = () => {

    const errRef = useRef();
    const dispatch = useDispatch();
    const [errMsg, setErrMsg] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [articles, setArticles] = useState([])

    const getCartFromLocalStorage = () => {
        const cartData = localStorage.getItem('cart');
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))

        if(cartData)
            return JSON.parse(cartData)

        const newCartData = new Order()
        newCartData.customerId = userInfo.userId
        localStorage.setItem('cart', JSON.stringify(newCartData))

        return newCartData
    };

    const createOrder= () => {
        const order = new Order()
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        order.customerId = userInfo.userId
        return order

    }


    let order = createOrder()
    const[cartItemsCount, setCartItemCount] = useState(order.orderItems.length)



    useEffect(() => {
        dispatch(getArticles())
            .then((data) => {
                setArticles(data);
                if (data.length <= 0) {
                    setErrMsg("There are no articles");
                }})
            .catch((error) => {
                console.log("Error fetching  articles:", error);
            });
    },[])

/*   const toggleExpand = (e) => {
        e.preventDefault()
        setIsExpanded(!isExpanded)
   }*/



    return <MainPage tittle={"Articles"}>
        <>
                <div className="article-grid">
                    {articles.map((article) => (
                        <ArticleCard key={article.id} article={JSON.stringify(article)} order={order}/>
                    ))}
                    {errMsg && <p>{errMsg}</p>}
                </div>


        </>
    </MainPage>
}

export default CustomerHomePage