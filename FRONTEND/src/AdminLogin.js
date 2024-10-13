import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/officerLogin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                alert("Officer Login Successful! Redirecting to dashboard...");
                navigate('/election-commission-dashboard'); 
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
                <h1>Election Commission Officer Login</h1>
            </header>
            <section id="loginForm">
                <form  className="col-12 col-md-6 mx-auto" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Login" />
                    </div>
                </form>
            </section>
        </div>
    );
}

export default AdminLogin;
