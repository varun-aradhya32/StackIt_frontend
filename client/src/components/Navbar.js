import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Modal, Button, Container, Nav, Navbar as BsNavbar } from 'react-bootstrap';
import Login from '../pages/Login';       // Using SignIn logic
import Register from '../pages/Register'; // Using SignUp logic

const Navbar = () => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  return (
    <>
      <BsNavbar bg="dark" variant="dark" expand="lg" className="py-3 shadow-sm">
        <Container>
          <BsNavbar.Brand as={Link} to="/">StackIt</BsNavbar.Brand>
          <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
          <BsNavbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link as={Link} to="/" className="me-2">Home</Nav.Link>
              {isLoggedIn && (
                <Nav.Link as={Link} to="/ask" className="me-2">Ask Question</Nav.Link>
              )}
              {!isLoggedIn ? (
                <>
                  <Button
                    variant="outline-light"
                    size="sm"
                    className="me-2"
                    onClick={() => setShowSignIn(true)}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowSignUp(true)}
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  <span className="text-light me-3">Welcome, {user?.name}</span>
                  <Button variant="danger" size="sm" onClick={handleLogout}>Logout</Button>
                </>
              )}
            </Nav>
          </BsNavbar.Collapse>
        </Container>
      </BsNavbar>

      {/* Sign In Modal */}
      <Modal show={showSignIn} onHide={() => setShowSignIn(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Sign In</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Login onClose={() => setShowSignIn(false)} />
        </Modal.Body>
      </Modal>

      {/* Sign Up Modal */}
      <Modal show={showSignUp} onHide={() => setShowSignUp(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Register onClose={() => setShowSignUp(false)} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Navbar;
