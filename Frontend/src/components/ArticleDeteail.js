import {Button, Col, Row} from "react-bootstrap";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import MainPage from "./MainPage";
import {useDispatch} from "react-redux";
import {compileString} from "sass";
import ArticleCard from "./ArticleCard";
import {addItemToCart} from "../services/actions/orderActions";

function ArticleDetail(){

    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {article, order} = JSON.parse(location.state)


    const addItem = () => {
        try{
             dispatch(addItemToCart( article))
             navigate('/articles')
        }
        catch (error){
            console.log("Error: ", error)
        }

        // Update the cart or trigger any other actions
    };


    return (
        <MainPage  tittle={article.name}>
        <div tittle={article.name} className={'article-detail'}>
            <Row className={'article-container'}>
                <Col>
                    <img src={article.imageSrc} alt={article.name} />
                </Col>
                <Col>
                    <h2>{article.name}</h2>
                    <h5 className={'type'}>Tyre type: &nbsp; {article.type}</h5>
                    <h5>Descrition: &nbsp; {article.description} </h5>
                    <h4>Price: &nbsp; ${article.price}</h4>
                   {/* <Button onClick={(e) => {e.preventDefault(); addItem()}}>Add to Order</Button>
              */} <Button onClick={(e) => {e.preventDefault(); addItem()}}>Add to Order</Button>
                </Col>


            </Row>

        </div>
        </MainPage>
    );
};

export default ArticleDetail;