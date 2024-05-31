import React from 'react';
import { Navbar, Nav, Container } from "react-bootstrap";

const Menu = () => {
    return (
        <Navbar>
            <Container>
                <Navbar.Brand href="/"></Navbar.Brand>
                <Nav className="me-auto">

                    <Nav.Link href="#" onClick={() => window.history.back()}>Back</Nav.Link>
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/students">Students</Nav.Link>
                    <Nav.Link href="/grades">Grades</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
};



export default Menu;