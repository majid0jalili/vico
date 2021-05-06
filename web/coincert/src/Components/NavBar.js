import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import ReactNavbar from "react-responsive-animate-navbar";

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { eventTokenID: "" };
    this.handleTokenIDChange = this.handleTokenIDChange.bind(this);
  }

  handleSubmit() {
    console.log("here");
  }

  handleTokenIDChange(event) {
    this.setState({ eventTokenID: event.target.value });
  }

  render() {
    return (
      <Navbar bg="light" expand="lg">
        <Nav.Link href="/">ViCo</Nav.Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/MyEvents">MyEvents</Nav.Link>

            <Nav.Link href="/Gallery">Gallery</Nav.Link>
            <Nav.Link href="/Market">Market</Nav.Link>
          </Nav>
          <Form inline>
            <Form.Control
              type="text"
              placeholder="Search Event Token ID"
              className="mr-sm-2"
              onChange={this.handleTokenIDChange}
            />
            <Link
              to={{
                pathname: "/EventAbout",
                state: { eventTokenID: this.state.eventTokenID },
              }}
            >
              Search
            </Link>
          </Form>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavBar;
