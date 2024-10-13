import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mt-5">
      <header className="text-center mb-4">
        <h1>Welcome to Shangri-La's Official Online Voting Platform</h1>
      </header>
      <section className="text-center" >
        <p>
          Participate in shaping the future of Shangri-La. The GEVS platform enables all eligible citizens to register and vote online in the upcoming general election. Your voice matters, and every vote counts in determining the valley's future.
        </p>
        <p>
          Register today or log in to cast your vote.
        </p>
        <div className="mt-4">
          <Link to="/signup" className="btn btn-primary mr-2">Sign Up</Link>
          <Link to="/login"  className="btn btn-secondary">Log In</Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
