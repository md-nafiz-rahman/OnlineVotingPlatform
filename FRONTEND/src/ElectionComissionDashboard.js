import React, { useEffect, useState } from 'react';

function ElectionComissionDashboard() {
  const [results, setResults] = useState([]);
  const [outcome, setOutcome] = useState('No results to be displayed');

    const startElection = async () => {
        try {
            await fetch('http://localhost:3000/startElection', { method: 'POST' });
            await updateElectionStatus('ongoing');
            alert('Election started successfully!');
        } catch (error) {
            console.error('Error starting the election:', error);
        }
    };

const endElection = async () => {
    try {
        const response = await fetch('http://localhost:3000/endElection', { method: 'POST' });
        const data = await response.json();
        alert(data.message);  
        setOutcome(data.message);  
        fetchResults(); 
    } catch (error) {
        console.error('Error ending the election:', error);
        alert("Failed to end the election.");
    }
};

    const updateElectionStatus = async (status) => {
        try {
            await fetch('http://localhost:3000/updateElectionStatus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
        } catch (error) {
            console.error('Error updating election status:', error);
        }
    };

  const fetchResults = async () => {
    try {
      const response = await fetch('http://localhost:3000/results');
      const fetchedResults = await response.json();
      const groupedResults = fetchedResults.reduce((acc, result) => {
        if (!acc[result.constituency_id]) {
          acc[result.constituency_id] = {
            constituency_id: result.constituency_id,
            constituency_name: result.constituency_name,
            candidates: []
          };
        }
        acc[result.constituency_id].candidates.push({
          candidate_id: result.candidate_id,
          candidate_name: result.candidate_name,
          party_name: result.party_name,
          vote_count: result.vote_count
        });
        return acc;
      }, {});

      setResults(Object.values(groupedResults));
    } catch (error) {
      console.error('Error fetching results:', error);
      alert("Failed to fetch results.");
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div className="container mt-5">
      <header className="text-center mb-4">
        <h1>Election Commission Dashboard</h1>
      </header>
      <section id="electionControl">
        <button onClick={startElection}>Start Election</button>
        <button onClick={endElection}>End Election</button>
      </section>
      <section id="resultsSection">
        <h2>Election Results</h2>
        <div id="results" className="results-list">
          {results.map(result => (
            <div key={result.constituency_id} className="constituency">
              <h3>{result.constituency_name}</h3>
              {result.candidates.map(candidate => (
                <div key={candidate.candidate_id} className="candidate">
                  {candidate.candidate_name} ({candidate.party_name}) - Votes: {candidate.vote_count}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
      <section id="announcement">
        <h2>Election Outcome</h2>
        <div id="outcome" className="outcome-message">{outcome}</div>
      </section>
    </div>
  );
}

export default ElectionComissionDashboard;