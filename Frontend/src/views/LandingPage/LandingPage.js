import {Button, Container, Row} from "react-bootstrap";
import './LandingPage.css';
import {useEffect} from "react";


const LandingPage = () => {
/*    function clearLocalStorage() {
        localStorage.clear();
    }

    

    useEffect(() =>
    {
        clearLocalStorage()
    },[])*/
    return (
        <div className={"main"}>
            <Container>
                <div className={'intro-txt'}>
                    <div>
                        <h1 className={"tittle"}>"Welcome to TireHaven - Your Destination for Quality Tires!<br/><br/> </h1>
                        <p className={"subtitle"}>
                        At TireHaven, we are dedicated to keeping you safe on the road <br/>
                         while providing you with the best selection of tires for your vehicles. 
                         Whether you're a daily commuter, an off-road enthusiast, 
                         or a weekend road tripper, we have the perfect tires to meet your needs.
.<br/>
                        </p>
                    </div>
                    <div className={"button-container"}>
                        <a href={"/login"}>
                            <Button size='lg' className={'landing-button1'}> LogIn</Button>
                        </a>

                        <a href={"/register"}>
                            <Button size='lg'  className={'landing-button2'} variant={'outline-primary'}>Sign Up</Button>
                        </a>
                    </div>
                </div>
            </Container>
        </div>
    )
};

export default LandingPage