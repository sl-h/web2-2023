import '../styles/articleCard.css'
import {Button} from "react-bootstrap";
import {useEffect, useState} from "react";
import {Link, Route, useNavigate} from "react-router-dom";
import ArticleDetail from "./ArticleDeteail";
import {useDispatch} from "react-redux";
import {addItemToCart} from "../services/actions/orderActions";



function ArticleCard({ article, order}) {

    const navigate = useNavigate();
    const dispatch = useDispatch();


    const openDetail = (e) => {
        e.preventDefault();
        const state = { article: article, order: order, addItem: addItem};
       navigate('/article-detail', {state: JSON.stringify(state)})

    };

    article = JSON.parse(article)



    const addItem= (e) => {
        dispatch(addItemToCart(article));
        navigate('/articles')
    };

    const truncatedDescription = article.description.slice(0, 50) + '...';

    return (
        <>
             <div className={"article-card"} onClick={(e) => openDetail(e)}>
                <img src={article.imageSrc} alt={article.name} />
                <h3>{article.name}</h3>
                <p>{truncatedDescription}</p>
                <h6>${article.price}</h6>
                <Button  onClick={(e) => {e.stopPropagation(); addItem(e)}} className={'order-button'}>Add to Order</Button>
            </div>
        </>
    );
}

export default ArticleCard;