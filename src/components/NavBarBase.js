import React, { Component } from "react";

import "./NavbarBase.css";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

export class NavbarBase extends Component {
  render() {
    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/">Trader Platform</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#features">Features</Nav.Link>
          <Nav.Link href="#pricing">Pricing</Nav.Link>
        </Nav>
      </Navbar>
    );
  }
}

export default NavbarBase;
