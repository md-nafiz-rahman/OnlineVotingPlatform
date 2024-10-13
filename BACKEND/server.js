const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "nafiz",
  password: "Rahman71*",
  database: "election",
});

connection.connect((err) => {
  if (err) {
    console.error("Failed to connect to MySQL:", err);
    throw err;
  }
  console.log("Connected to the MySQL server.");
});

app.post("/register", async (req, res) => {
  const { email, fullName, dob, password, uvc, constituency } = req.body;

  try {
    let query = "SELECT * FROM voter WHERE voter_id = ?";
    connection.query(query, [email], async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Database query error during email check");
      }

      if (result.length > 0) {
        return res.status(400).send("Email already registered");
      } else {
        query = "SELECT * FROM uvc_code WHERE UVC = ? AND used = 0";
        connection.query(query, [uvc], async (err, result) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .send("Database query error during UVC check");
          }

          if (result.length === 0) {
            return res.status(400).send("Invalid or already used UVC");
          } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            query =
              "INSERT INTO voter (voter_id, full_name, DOB, password, UVC, constituency_id) VALUES (?, ?, ?, ?, ?, ?)";
            connection.query(
              query,
              [email, fullName, dob, hashedPassword, uvc, constituency],
              (err, result) => {
                if (err) {
                  console.error("Insert voter error:", err);
                  return res
                    .status(500)
                    .send("Error registering new user: " + err.message);
                } else {
                  connection.query(
                    "UPDATE uvc_code SET used = 1 WHERE UVC = ?",
                    [uvc],
                    (err, result) => {
                      if (err) {
                        console.error("Update UVC error:", err);
                        return res
                          .status(500)
                          .send("Error updating UVC: " + err.message);
                      }
                      res.status(201).send("User registered");
                    }
                  );
                }
              }
            );
          }
        });
      }
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Server error");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const query = `
    SELECT 
        voter.*, 
        constituency.constituency_name,
        voted_for,
        candidate.candidate as voted_for_candidate
    FROM 
        voter 
    INNER JOIN 
        constituency ON voter.constituency_id = constituency.constituency_id 
    LEFT JOIN
        candidate ON voter.voted_for = candidate.canid
    WHERE 
        voter.voter_id = ?`;

  connection.query(query, [email], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error during database query");
    }

    if (result.length === 0) {
      return res.status(401).send("User not found");
    }

    const user = result[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      res.json({
        id: user.voter_id,
        name: user.full_name,
        uvc: user.UVC,
        has_voted: user.has_voted,
        constituency_id: user.constituency_id,
        constituency_name: user.constituency_name,
        voted_for_candidate: user.voted_for_candidate,
      });
    } else {
      res.status(401).send("Invalid credentials");
    }
  });
});

app.get("/candidates", (req, res) => {
  const constituency_id = req.query.constituency_id;

  const query =
    "SELECT candidate.*, party.party as party_name FROM candidate INNER JOIN party ON candidate.party_id = party.party_id WHERE constituency_id = ?";
  connection.query(query, [constituency_id], (err, results) => {
    if (err) {
      return res.status(500).send("Error fetching candidates");
    }
    res.json(results);
  });
});

app.post("/vote", (req, res) => {
  const { voter_id, candidate_id } = req.body;

  connection.query(
    "SELECT has_voted FROM voter WHERE voter_id = ?",
    [voter_id],
    (err, results) => {
      if (err) {
        return res.status(500).send("Error checking user's vote status");
      }
      if (results.length === 0) {
        return res.status(404).send("User not found");
      }

      const user = results[0];
      if (user.has_voted) {
        return res.status(403).send("User has already cast a vote");
      } else {
        connection.beginTransaction((err) => {
          if (err) {
            throw err;
          }

          connection.query(
            "UPDATE candidate SET vote_count = vote_count + 1 WHERE canid = ?",
            [candidate_id],
            (err, result) => {
              if (err) {
                return connection.rollback(() => {
                  throw err;
                });
              }

              connection.query(
                "UPDATE voter SET has_voted = 1, voted_for = ? WHERE voter_id = ?",
                [candidate_id, voter_id],
                (err, result) => {
                  if (err) {
                    return connection.rollback(() => {
                      throw err;
                    });
                  }
                  connection.commit((err) => {
                    if (err) {
                      return connection.rollback(() => {
                        throw err;
                      });
                    }
                    res.send("Vote successfully recorded");
                  });
                }
              );
            }
          );
        });
      }
    }
  );
});

app.post("/officerLogin", async (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM election_officer WHERE email = ?";
  connection.query(query, [email], async (err, result) => {
    if (err) return res.status(500).send("Error during database query");
    if (result.length === 0) return res.status(401).send("Officer not found");

    const officer = result[0];
    const validPassword = await bcrypt.compare(password, officer.password);
    if (validPassword) {
      res.status(200).send("Officer logged in");
    } else {
      res.status(401).send("Invalid credentials");
    }
  });
});

app.post("/startElection", (req, res) => {
  const startElectionQuery =
    "UPDATE election_officer SET election_status = 'ongoing' WHERE officer_id = 1";
  connection.query(startElectionQuery, (err, result) => {
    if (err) {
      console.error("Error starting the election:", err);
      return res.status(500).send("Error starting the election");
    }
    res.send("Election started successfully!");
  });
});

app.post("/endElection", (req, res) => {
  const endElectionQuery =
    "UPDATE election_officer SET election_status = 'ended' WHERE officer_id = 1";
  connection.query(endElectionQuery, (err, result) => {
    if (err) {
      console.error("Error ending the election:", err);
      return res.status(500).send("Error ending the election");
    }

    const resultsQuery = `
            SELECT 
                constituency.constituency_id, 
                constituency.constituency_name, 
                candidate.candidate, 
                party.party as party_name, 
                candidate.vote_count 
            FROM 
                candidate 
            JOIN 
                constituency ON candidate.constituency_id = constituency.constituency_id 
            JOIN 
                party ON candidate.party_id = party.party_id 
            ORDER BY 
                constituency.constituency_id, candidate.vote_count DESC`;
    connection.query(resultsQuery, (err, results) => {
      if (err) {
        console.error("Error fetching election results:", err);
        return res.status(500).send("Error fetching election results");
      }

      let constituencyWinners = {};
      results.forEach((result) => {
        if (!constituencyWinners[result.constituency_name]) {
          constituencyWinners[result.constituency_name] = result;
        }
      });

      let partyCounts = {};
      Object.values(constituencyWinners).forEach((winner) => {
        partyCounts[winner.party_name] =
          (partyCounts[winner.party_name] || 0) + 1;
      });

      const majorityCount = Object.keys(constituencyWinners).length / 2;
      let majorityParty = null;
      for (const [party, count] of Object.entries(partyCounts)) {
        if (count > majorityCount) {
          majorityParty = party;
          break;
        }
      }

      res.json({
        message: majorityParty
          ? `Majority party: ${majorityParty}`
          : "Hung Parliament: No single party has secured an overall majority.",
        results: results,
        majorityParty: majorityParty,
      });
    });
  });
});

app.get("/results", (req, res) => {
  const query = `
    SELECT 
        constituency.constituency_id, 
        constituency.constituency_name, 
        candidate.canid as candidate_id,
        candidate.candidate as candidate_name,
        party.party as party_name, 
        candidate.vote_count 
    FROM 
        candidate 
    JOIN 
        constituency ON candidate.constituency_id = constituency.constituency_id 
    JOIN 
        party ON candidate.party_id = party.party_id 
    ORDER BY 
        constituency.constituency_id, candidate.vote_count DESC`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching election results:", err);
      return res
        .status(500)
        .send(`Error fetching election results: ${err.message}`);
    }
    res.json(results);
  });
});

app.get("/electionStatus", (req, res) => {
  const query =
    "SELECT election_status FROM election_officer WHERE officer_id = 1";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching election status:", err);
      return res.status(500).send("Error fetching election status");
    }
    if (results.length > 0) {
      res.json({ status: results[0].election_status });
    } else {
      res.status(404).send("Election status not found");
    }
  });
});

app.post("/updateElectionStatus", (req, res) => {
  const { status } = req.body;
  const query =
    "UPDATE election_officer SET election_status = ? WHERE officer_id = 1";
  connection.query(query, [status], (err, result) => {
    if (err) {
      console.error("Error updating election status:", err);
      return res.status(500).send("Error updating election status");
    }
    res.send("Election status updated successfully!");
  });
});

app.get("/overallWinner", (req, res) => {
  const query = `
        SELECT 
            party.party_id, 
            party.party, 
            COUNT(candidate.constituency_id) AS constituency_wins 
        FROM 
            candidate 
        JOIN 
            party ON candidate.party_id = party.party_id 
        JOIN 
            (SELECT 
                constituency_id, 
                MAX(vote_count) AS max_votes 
             FROM 
                candidate 
             GROUP BY 
                constituency_id
            ) AS winners ON candidate.constituency_id = winners.constituency_id AND candidate.vote_count = winners.max_votes 
        GROUP BY 
            party.party_id 
        ORDER BY 
            constituency_wins DESC`;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching overall winner:", err);
      return res.status(500).send("Error fetching overall winner");
    }

    const totalConstituencies = results.reduce(
      (sum, party) => sum + party.constituency_wins,
      0
    );
    const majoritySeats = Math.ceil(totalConstituencies / 2);
    const winningParties = results.filter(
      (result) => result.constituency_wins >= majoritySeats
    );

    if (
      winningParties.length === 0 ||
      winningParties[0].constituency_wins < majoritySeats
    ) {
      res.json({
        message:
          "Hung Parliament: No single party has secured an overall majority.",
      });
    } else if (winningParties.length === 1) {
      const overallWinner = winningParties[0];
      res.json({
        message: `Overall Winner: ${overallWinner.party}`,
        partyName: overallWinner.party,
        constituencyWins: overallWinner.constituency_wins,
      });
    } else {
      res.json({
        message:
          "Hung Parliament: Multiple parties have secured the same number of constituency wins.",
      });
    }
  });
});

app.get("/constituencyWinner", (req, res) => {
  const { constituency_id } = req.query;
  const query = `
        SELECT 
            candidate.candidate as candidate_name, 
            party.party as party_name, 
            candidate.vote_count 
        FROM 
            candidate 
        JOIN 
            party ON candidate.party_id = party.party_id 
        WHERE 
            candidate.constituency_id = ?
		ORDER BY 
            candidate.vote_count DESC 
        LIMIT 1`;

  connection.query(query, [constituency_id], (err, results) => {
    if (err) {
      console.error("Error fetching constituency winner:", err);
      return res.status(500).send("Error fetching constituency winner");
    }
    if (results.length === 0) {
      res
        .status(404)
        .send("No winner could be determined for this constituency.");
    } else {
      res.json(results[0]);
    }
  });
});

app.get("/candidates/:id", (req, res) => {
  const candidateId = req.params.id;

  const query = "SELECT candidate FROM candidate WHERE canid = ?";
  connection.query(query, [candidateId], (err, results) => {
    if (err) {
      console.error("Error fetching candidate:", err);
      return res.status(500).send("Error fetching candidate");
    }
    if (results.length === 0) {
      return res.status(404).send("Candidate not found");
    } else {
      res.json(results[0]);
    }
  });
});

//TASK 2

app.get("/gevs/constituency/:constituencyName", (req, res) => {
  const constituencyName = req.params.constituencyName;

  const query = `
        SELECT 
            candidate.candidate as name, 
            party.party as party, 
            candidate.vote_count as vote 
        FROM candidate 
        JOIN party ON candidate.party_id = party.party_id 
        JOIN constituency ON candidate.constituency_id = constituency.constituency_id 
        WHERE constituency.constituency_name = ? 
        ORDER BY candidate.vote_count DESC`;

  connection.query(query, [constituencyName], (err, results) => {
    if (err) {
      console.error("Error fetching vote count:", err);
      return res.status(500).send("Error fetching vote count");
    }
    res.json({
      constituency: constituencyName,
      result: results,
    });
  });
});

app.get("/gevs/results", (req, res) => {
  const statusQuery =
    "SELECT election_status FROM election_officer WHERE officer_id = 1";
  connection.query(statusQuery, (statusErr, statusResults) => {
    if (statusErr) {
      console.error("Error fetching election status:", statusErr);
      return res.status(500).send("Error fetching election status");
    }
    const electionStatus = statusResults[0]?.election_status || "Pending";

    const resultsQuery = `
            SELECT 
                party.party, 
                COUNT(*) as seat 
            FROM candidate 
            JOIN party ON candidate.party_id = party.party_id 
            JOIN (
                SELECT 
                    constituency_id, 
                    MAX(vote_count) as max_vote 
                FROM candidate 
                GROUP BY constituency_id
            ) as winners ON candidate.constituency_id = winners.constituency_id AND candidate.vote_count = winners.max_vote 
            GROUP BY party.party_id`;

    connection.query(resultsQuery, (resultsErr, results) => {
      if (resultsErr) {
        console.error("Error fetching election results:", resultsErr);
        return res.status(500).send("Error fetching election results");
      }

      let winner = "Hung Parliament";
      if (electionStatus === "ended") {
        const maxSeats = Math.max(...results.map((r) => r.seat));
        const winningParties = results.filter((r) => r.seat === maxSeats);
        if (winningParties.length === 1) {
          winner = winningParties[0].party;
        }
      }

      res.json({
        status: electionStatus === "ongoing" ? "Pending" : electionStatus,
        winner: winner,
        seats: results,
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
