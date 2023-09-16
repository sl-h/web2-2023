import {useEffect, useRef, useState} from "react";
import {createArticle, updateArticle} from "../../services/actions/articleActions"
import {useDispatch, useSelector} from "react-redux";
import "./ArticlePage.css"

import MainPage from "../../components/MainPage";
import {
    DEFAULT_IMG_SRC,
    MAX_FILE_SIZE,
} from "../../services/constants/articleConstants";
import {Button, Col, Form, FormGroup, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faInfoCircle, faTimes} from "@fortawesome/free-solid-svg-icons";
import {Link, redirect, useLocation, useParams, useHi} from "react-router-dom";
import UserArticlesPage from "./UserArticlesPage";





const UpdateArticlePage = () => {
    const location = useLocation();
    const articleTest = location.state && location.state.article;

    var userInfo = JSON.parse(localStorage.getItem('userInfo'))



    useEffect(() => {
        if (articleTest) {
            try {
                setArticle(articleTest);
            } catch (error) {
                console.error('Error parsing JSON:', error);
                // Handle the error or set 'article' to null in case of invalid JSON
                setArticle(null);
            }
        }
    }, [articleTest]);


    /*const articleTest = JSON.parse(articleDto)*/

    const articleRef = useRef();
    const errRef = useRef();

    const dispatch = useDispatch();

    const updateArticleReducer = useSelector((state) => state.updateArticleReducer);
    const { success, error } = updateArticleReducer;


    const [imgFocus, setImgFocus] = useState(false);
    const [validImg, setValidImg] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [article, setArticle] = useState({
        name: articleTest.name,
        description: articleTest.description,
        type: articleTest.type,
        price: articleTest.price,
        imageName: articleTest.imageName,
        imageSrc: articleTest.imageSrc,
        articleId: articleTest.id
    });


    const handleSubmit = async(e) => {
        e.preventDefault()
        const formData = new FormData();
        const articleDto = {
            Name:article.name,
            Description:article.description,
            Type:article.type,
            Price:article.price,
            ImageName:article.imageName,
            ImageSrc:article.imageSrc,
            ImageFile:article.imageFile,
            email:  userInfo.email,
            articleId: article.articleId
        }

        for (const [key, value] of Object.entries(articleDto)) {
            formData.append(key, value);
        }

        dispatch(updateArticle(formData)).then(() => window.location.replace('/salesman-articles'))
    }



    const handleChange = (name, value) => {
        setArticle((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageUpload =  (e) => {
        if(e.target.files && e.target.files[0])
        {
            const file = e.target.files[0]
            if(file.size < MAX_FILE_SIZE ){
                const reader = new FileReader();
                reader.onload = x => {
                    setArticle((prevState) => ({
                        ...prevState,
                        imageSrc: x.target.result,
                        imageName: file.name,
                        imageFile: file
                    }));
                    setValidImg(true)

                }
                reader.readAsDataURL(file)
            }
        }
        else
        {
            setArticle((prevState) => ({
                ...prevState,
                imageSrc: DEFAULT_IMG_SRC,
                imageName: "Default",
                imageFile: null
            }));
        }
    }

    return <MainPage tittle={"Update article"}>
        <>
                <Row className={"create-article-container"}>
                    <p ref={errRef}
                       className={errMsg ? "errmsg" : "offscreen"}
                       aria-live={"assertive"}>
                        {errMsg}
                    </p>
                    <Col>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label htmlFor={"article-type"}>Type: </Form.Label>
                                <Form.Control
                                    as={"select"}
                                    id="article-type"
                                    value={article.type}
                                    onChange={(e) => handleChange("type", e.target.value)}
                                >
                                    <option value={""} disabled>Selcet Type</option>
                                    <option value={"AllSeason"}>All Season</option>
                                    <option value={"Summer"}>Summer Tires</option>
                                    <option value={"Winter"}>Winter Tires</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label htmlFor={"article-name"}>Tittle: </Form.Label>
                                <Form.Control
                                    id="article-name"
                                    type={"text"}
                                    value={article.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label htmlFor={"article-desc"}>Description: </Form.Label>
                                <Form.Control
                                    id="article-desc"
                                    type={"text"}
                                    value={article.description}
                                    onChange={(e) =>handleChange("description", e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label htmlFor={"article-price"}>Price: </Form.Label>
                                <Form.Control
                                    id="article-price"
                                    type={"number"}
                                    value={article.price}
                                    onChange={(e) => handleChange("price", e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label htmlFor={"imageUpload"}>
                                    Image:
                                    <span className={validImg ? 'valid' : 'hide'}>
                                    <FontAwesomeIcon icon={faCheck} />
                               </span>
                                    <span className={validImg || !article.imageFile ? 'hide' : 'invalid'}>
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
                                <p id={"imgnote"} className={imgFocus && article.imageFile && !validImg ? 'instructions' : 'offscreen'}>
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    Please select an image file (JPEG, PNG, JPEG).
                                </p>
                            </Form.Group>
                            <Button type={"submit"}>Update</Button>
                        </Form>
                    </Col>
                    <Col style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <img  src={article.imageSrc} className={"ArticlePic"} />

                    </Col>
                </Row>
        </>
    </MainPage>

}
export default UpdateArticlePage