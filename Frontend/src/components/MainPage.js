import {Container, Row} from "react-bootstrap";
import Header from "./Header";
import Footer from "./Footer";
import '../styles/MainScreen.css';
import {useNavigate} from "react-router-dom";


const MainPage = ({tittle, children}) => {
    return (
        <>
        <Header/>
        <div className={"main-back"}>
            <Container>
                <Row>
                    <div className={"page"}>
                        {tittle && (
                        <>
                            <h1 className={"heading"}>{tittle}</h1>
                            <hr />
                        </>
                        )}
                        {children}
                    </div>
                </Row>
            </Container>
        </div>
            <Footer/>
        </>
    )
}

export  default MainPage