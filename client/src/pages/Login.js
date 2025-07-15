import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

function Login({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });

      const userInfo = {
        _id: res.data._id,
        name: res.data.username, // assuming username is returned as name
        email: res.data.email,
      };

      localStorage.setItem('user', JSON.stringify(userInfo));
      localStorage.setItem('token', res.data.token);
      window.dispatchEvent(new Event('storage'));

      if (onClose) onClose(); // close modal
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="email" className="mb-3">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="password" className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="w-100">
        Sign In
      </Button>
    </Form>
  );
}

export default Login;
