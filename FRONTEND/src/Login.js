import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem('user', JSON.stringify(user));
        alert("Login Successful! Redirecting to voter dashboard...");
        navigate('/voter-dashboard');
      } else {
        const data = await response.text();
        alert("Login Failed: " + data);
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Login Failed: " + error.message);
    }
  };

  return (
    <div className="container mt-5">
      <header className="text-center mb-4">
        <h1>Login to GEVS</h1>
      </header>
      <section id="loginForm">
        <form id="userLogin" className="col-12 col-md-6 mx-auto" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" className="form-control" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <input type="submit" className="btn btn-primary w-100" value="Login" />
          </div>
        </form>
        <div className="text-center mt-3">
          <p>Not registered? <Link to="/signup">Click here to register.</Link></p>
        </div>
      </section>
    </div>
  );
}

export default Login;
