import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function VoterDashboard() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [electionStatus, setElectionStatus] = useState("");
  const [constituencyWinner, setConstituencyWinner] = useState(null);
  const [overallWinner] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [majorityParty, setMajorityParty] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setUser({
        ...storedUser,
        votedForCandidate: storedUser.voted_for_candidate,
      });
    }

    const fetchElectionStatus = async () => {
      try {
        const response = await fetch("http://localhost:3000/electionStatus");
        const data = await response.json();
        setElectionStatus(data.status);
      } catch (error) {
        console.error("Error fetching election status:", error);
      }
    };

    const fetchCandidates = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/candidates?constituency_id=${user.constituency_id}`
        );
        const data = await response.json();
        setCandidates(data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    const fetchOverallWinner = async () => {
      try {
        const response = await fetch("http://localhost:3000/overallWinner");
        const data = await response.json();
        if (data.partyName !== "Hung Parliament") {
          setMajorityParty(data.partyName);
        } else {
          setMajorityParty(null);
        }
      } catch (error) {
        console.error("Error fetching overall winner:", error);
      }
    };

    const fetchConstituencyWinner = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/constituencyWinner?constituency_id=${user.constituency_id}`
        );
        const data = await response.json();
        setConstituencyWinner(data);
      } catch (error) {
        console.error("Error fetching constituency winner:", error);
      }
    };

    const fetchData = async () => {
      if (electionStatus === "ended") {
        await fetchOverallWinner();
        await fetchConstituencyWinner();
      }
    };

    fetchElectionStatus();
    if (user.constituency_id) {
      fetchCandidates();
    }

    fetchData();
  }, [user.constituency_id, electionStatus, overallWinner]);

  const handleVote = async (event) => {
    event.preventDefault();

    const confirmVote = window.confirm(
      "You are about to cast your vote. Remember, voting is final and cannot be changed. Do you want to proceed?"
    );
    if (!confirmVote) return;

    try {
      const response = await fetch("http://localhost:3000/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voter_id: user.id,
          candidate_id: selectedCandidate,
        }),
      });

      if (response.ok) {
        alert("Vote successfully cast!");
        const updatedUser = { ...user, has_voted: true };

        const candidateResponse = await fetch(
          `http://localhost:3000/candidates/${selectedCandidate}`
        );
        if (candidateResponse.ok) {
          const candidateData = await candidateResponse.json();
          updatedUser.votedForCandidate = candidateData.candidate;
        }

        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        const errorMsg = await response.text();
        alert(errorMsg);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error casting vote: " + error.message);
    }
  };

  const toggleDetails = () => setShowDetails(!showDetails);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={toggleDetails}>
                {showDetails ? "Back to Dashboard" : "Voter Details"}
              </Nav.Link>
              <Nav.Link onClick={handleLogout}>Log Out</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {showDetails ? (
        <div className="container mt-5">
          <header className="text-center mb-4">
            <h1>Voter Details</h1>
          </header>
          <section
            style={{
              margin: "20px 0",
              backgroundColor: "#f8f8f8",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.05)",
            }}
          >
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.id}
            </p>
            <p>
              <strong>UVC:</strong> {user.uvc}
            </p>
            <p>
              <strong>Constituency:</strong> {user.constituency_name}
            </p>
            <p>
              <strong>Has Voted:</strong> {user.has_voted ? "Yes" : "No"}
            </p>
            {user.has_voted && (
              <p>
                <strong>Voted For:</strong>{" "}
                {user.votedForCandidate
                  ? user.votedForCandidate
                  : "Candidate ID: " + user.voted_for}
              </p>
            )}
          </section>
        </div>
      ) : (
        <div className="container mt-5">
          <header className="text-center mb-4">
            <h1>Voter Dashboard</h1>
            <br></br>
            <div>
              <h3>Welcome, {user.name}</h3>
            </div>
            <br></br>
            <div>
              <h5>Your Constituency: {user.constituency_name}</h5>
            </div>
          </header>
          <section id="votingSection">
            <h2>Cast Your Vote</h2>
            {electionStatus === "ongoing" ? (
              user.has_voted ? (
                <div className="alert alert-info" role="alert">
                  You have already cast your vote and cannot vote again.
                </div>
              ) : (
                <form onSubmit={handleVote}>
                  <div className="form-group">
                    <label htmlFor="candidate">Select Candidate:</label>
                    <select
                      name="candidate"
                      id="candidate"
                      value={selectedCandidate}
                      onChange={(e) => setSelectedCandidate(e.target.value)}
                      required
                    >
                      <option value="">Select a candidate</option>
                      {candidates.map((candidate) => (
                        <option key={candidate.canid} value={candidate.canid}>
                          {candidate.candidate} ({candidate.party_name})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <input
                      type="submit"
                      value="Cast Vote"
                      id="voteButton"
                      disabled={user.has_voted}
                    />
                  </div>
                </form>
              )
            ) : (
              <p>
                {electionStatus === "not started"
                  ? "Election has not started yet."
                  : "Election has ended."}
              </p>
            )}
          </section>
          {electionStatus === "ended" && (
            <section id="resultsSection">
              <h2>Election Results</h2>
              {constituencyWinner && (
                <p>
                  Your Constituency Winner: {constituencyWinner.candidate_name}{" "}
                  ({constituencyWinner.party_name})
                </p>
              )}
              {majorityParty ? (
                <p>{majorityParty} has secured an overall majority.</p>
              ) : (
                <p>
                  No single party has secured an overall majority (Hung
                  Parliament).
                </p>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default VoterDashboard;
