import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const Footer = () => {
    return (
        <footer
            style={{
                width: "100%",
                position: "fixed",
                bottom: 0,
                marginBottom: 0,
                display: "flex",
                justifyContent: "center",
                backgroundColor:"gainsboro"
                
            }}
        >
            <Container
            style={{borderTop: 111}}>
                <Row>
                    <Col className="text-center py-3">Copyright &copy; TireHaven </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;