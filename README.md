# General Election Voting System (GEVS)

## Overview

This project is a **basic online voting system** developed as part of a coursework assignment. The system allows users to register as voters, cast votes, and provides election officials with tools to manage the election process and monitor results. It also includes a simple **REST API** for accessing election data.

## Features

- **Voter Registration**: Users register with their email, name, date of birth, and a unique voter code (UVC).
- **Voting**: Registered voters can log in and select a candidate to vote for in their constituency.
- **Election Management**: Election officials can start/stop the election and view live voting results.
- **REST API**: Provides real-time access to election data, including vote counts per constituency and overall election results.
- **Error Handling**: Handles common errors like duplicate registrations, invalid voter codes, and incorrect login credentials.

## Technology Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express.js and MySQL for data storage
- **API**: RESTful endpoints for accessing election data

## Installation and Setup

### 1. Set Up the Database

Ensure that MySQL is installed. To create the election database:

1. Open your MySQL terminal and create the database:

   ```sql
   CREATE DATABASE election;
   Set up the necessary tables based on the schema you have designed.


### 2. Configure the Backend

In the `BACKEND` folder, open the `server.js` file and update the database connection settings:

```javascript
const connection = mysql.createConnection({
   host: "localhost",
   user: "your-username",
   password: "your-password",
   database: "election"
});
```

In the terminal, navigate to the BACKEND directory:

```
cd BACKEND
```

Install dependencies:
```
npm install
```
Start the backend server:
```
node server.js
```
The backend server will run on localhost:3001.

### 3. Configure the Frontend

Open a new terminal and navigate to the `FRONTEND` directory:
```
cd FRONTEND
```
Install the frontend dependencies:
```
npm install
```

Start the React development server:
```
npm start
```

The frontend will launch on localhost:3005. Access it via your browser at http://localhost:3005.


### 4. Dependencies

Ensure the following dependencies are installed as listed in the `package.json`:

```json
"dependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "bootstrap": "^5.3.2",
    "qr-scanner": "^1.4.2",
    "react": "^18.2.0",
    "react-bootstrap": "^2.9.2",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.1",
    "react-scripts": "^3.0.1",
    "web-vitals": "^2.1.4"
}
```

### Valid UVC Codes

Here is the list of valid Unique Voter Codes (UVC) required for voter registration:

| UVC Codes  | UVC Codes  | UVC Codes  | UVC Codes  |
|------------|------------|------------|------------|
| HH64FWPE   | JA9WCMAS   | ZSRBTK9S   | 2GYDT5D3   |
| BBMNS9ZJ   | Z93G7PN9   | B7DMPWCQ   | LVTFN8G5   |
| KYMK9PUH   | WPC5GEHA   | YADA47RL   | UNP4A5T7   |
| WL3K3YPT   | RXLNLTA6   | 9GTZQNKB   | UMT3RLVS   |
| JA9WCMAS   | 7XUFD78Y   | KSM9NB5L   | TZZZCJV8   |
| Z93G7PN9   | DBP4GQBQ   | BQCRWTSG   | UVE5M7FR   |
| WPC5GEHA   | ZSRBTK9S   | ML5NSKKG   | W44QP7XJ   |
| RXLNLTA6   | B7DMPWCQ   | D5BG6FDH   | 9FCV9RMT   |
| 7XUFD78Y   | YADA47RL   | 2LJFM6PM   | DHKVCU8T   |
| DBP4GQBQ   | 9GTZQNKB   | 38NWLPY3   | TH9A6HUB   |
| ZSRBTK9S   | KSM9NB5L   | 2TEHRTHJ   | 2E5BHT5R   |
| B7DMPWCQ   | BQCRWTSG   | G994LD9T   | 556JTA32   |
| YADA47RL   | ML5NSKKG   | Q452KVQE   | LUFKZAHW   |
| 9GTZQNKB   | D5BG6FDH   | 75NKUXAH   | DBAD57ZR   |
| KSM9NB5L   | 2LJFM6PM   | DHKVCU8T   | K96JNSXY   |
| BQCRWTSG   | 38NWLPY3   | TH9A6HUB   | PFXB8QXM   |
| ML5NSKKG   | 2TEHRTHJ   | 2E5BHT5R   | 8TEXF2HD   |
| D5BG6FDH   | G994LD9T   | 556JTA32   | N6HBFD2X   |
| 2LJFM6PM   | Q452KVQE   | LUFKZAHW   | K3EVS3NM   |
| 38NWLPY3   | 75NKUXAH   | DBAD57ZR   | 5492AC6V   |
| 2TEHRTHJ   | DHKVCU8T   | K96JNSXY   | U5LGC65X   |
| G994LD9T   | TH9A6HUB   | PFXB8QXM   | BKMKJN5S   |
| Q452KVQE   | 2E5BHT5R   | 8TEXF2HD   | JF2QD3UF   |
| 75NKUXAH   | 556JTA32   | N6HBFD2X   | NW9ETHS7   |
| DHKVCU8T   | LUFKZAHW   | K3EVS3NM   | VFBH8W6W   |
| TH9A6HUB   | DBAD57ZR   | 5492AC6V   | 7983XU4M   |
| 2E5BHT5R   | K96JNSXY   | U5LGC65X   | 2GYDT5D3   |
| 556JTA32   | PFXB8QXM   | BKMKJN5S   | LVTFN8G5   |
| LUFKZAHW   | 8TEXF2HD   | JF2QD3UF   | UNP4A5T7   |
| DBAD57ZR   | N6HBFD2X   | NW9ETHS7   | UMT3RLVS   |
| K96JNSXY   | K3EVS3NM   | VFBH8W6W   | TZZZCJV8   |
| PFXB8QXM   | 5492AC6V   | 7983XU4M   | UVE5M7FR   |
| 8TEXF2HD   | U5LGC65X   | 2GYDT5D3   | W44QP7XJ   |
| N6HBFD2X   | BKMKJN5S   | LVTFN8G5   | 9FCV9RMT   |
| K3EVS3NM   | JF2QD3UF   | UNP4A5T7   |5492AC6V    |
| NW9ETHS7   | UMT3RLVS   |

### QR Codes for Voter Registration

A folder containing QR codes for each UVC is included with the project files. Voters can scan the QR code from their Poll Card to automatically fill in the UVC field during registration.


### API Endpoints

#### Get Constituency Vote Count

```http
GET /gevs/constituency/{constituency-name}
```
Returns the vote count for each candidate in the specified constituency.
#### Get Overall Election Results

```http
GET /gevs/results
```
Returns the number of seats won by each party and the election status.

### How to Use

#### Register as a Voter:

- Register with your email, full name, date of birth, and unique voter code.
- QR code scanning is available for registration if provided.

#### Vote:

- Once registered, log in to cast your vote for a candidate in your constituency.
- **Note**: Votes cannot be changed once submitted.

#### Election Management:

- The election official can log in using the following credentials:
  - **Email**: election@shangrila.gov.sr
  - **Password**: shangrila2024$
  
- The election official can:
  - Start or stop the election.
  - View live results of voting.
