import {useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {getAllOrders} from "../../services/actions/orderActions";
import MainPage from "../../components/MainPage";
import {Button, Table} from "react-bootstrap";
import {formatDate} from "../../services/actions/common";
import {getSalesmanArticles, updateArticle} from "../../services/actions/articleActions";
import updateArticlePage from "./UpdateArticlePage";
import {Link} from "react-router-dom";

const UserArticlesPage = () => {

    const errRef = useRef();
    const dispatch = useDispatch();
    const [articles,setArticles] = useState([])
    const [errMsg, setErrMsg] = useState('');
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))


    useEffect(() => {
        dispatch(getSalesmanArticles(userInfo.email))
            .then((data) => {
                setArticles(data);
                if (data.length <= 0) {
                    setErrMsg("There are no articles");
                }})
            .catch((error) => {
                console.log("Error fetching  articles:", error);
            });
    },[])

  /*  const editArticle = (article) => {
        window.location.href='/update-articles/${article}'
    }*/



    return <MainPage tittle={"My articles"}>
        <>
            {errMsg ? (
                <section>
                    <p>{errMsg}</p>
                </section>
            ) :(

                <Table>
                    <thead>
                    <tr>
                        <th>Type</th>
                        <th>Name</th>
                        <th>price</th>
                        <th>Description</th>
                        <th>Action</th>
                        {/*<th>Image</th>*/}
                        {/* <th>Qunatity</th>*/}
                    </tr>
                    </thead>
                    <tbody>
                    {articles && articles.length > 0 ? (
                        articles.map((article) => (
                            <tr>
                                <td>{article.type}</td>
                                <td>{article.name}</td>
                                <td>{article.price}</td>
                                <td>{article.description}</td>
                                <td>
                                    <Button /*onClick={(e) => {
                                        e.preventDefault()
                                        (editArticle(article))

                                    }}*/ >
                                        {console.log(article)}
                                       {/* <Link to={`/update-articles/${encodeURIComponent(JSON.stringify(article))}`}> Edit </Link>*/}
                                       <Link to={'/update-articles'} state={{article:article}} >Edit</Link>

                                    </Button>
                                </td>
                                {/*<td>{article.image}</td>*/}
                                {/* <td>{order.address}</td>*/}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3}>No articles found.</td>
                        </tr>
                    )}

                    </tbody>
                </Table>
            )}
        </>
    </MainPage>
}

export default UserArticlesPage