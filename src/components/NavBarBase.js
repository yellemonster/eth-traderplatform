import React, { Component } from "react";
import { EthContext } from "../_contexts/EthContext";

import "./NavbarBase.css";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

export class NavbarBase extends Component {
  static contextType = EthContext;

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <a className="navbar-brand" href="#/">
          DApp Token Exchange
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a
              className="nav-link small"
              href={`https://etherscan.io/address/${this.props.account}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {this.context.userAddress}
            </a>
          </li>
        </ul>
      </nav>
    );
  }
}

export default NavbarBase;
