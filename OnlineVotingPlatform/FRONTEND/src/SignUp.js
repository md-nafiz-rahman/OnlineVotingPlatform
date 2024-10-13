import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import QrScanner from "qr-scanner";

function SignUp() {
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [constituency, setConstituency] = useState("1");
  const [uvc, setUvc] = useState("");
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    number: false,
    uppercase: false,
    lowercase: false,
    specialChar: false,
  });

  useEffect(() => {
    if (isScannerActive) {
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => setUvc(result.data),
        { highlightScanRegion: true, highlightCodeOutline: true }
      );

      qrScannerRef.current.start();
    }

    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
        qrScannerRef.current = null;
      }
    };
  }, [isScannerActive]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!dob) {
      alert("Please enter your date of birth.");
      return;
    }

    const birthDate = new Date(dob);
    const age = new Date(new Date() - birthDate).getFullYear() - 1970;

    if (age < 18) {
      alert("Must be over 18 years old to register to vote.");
      return;
    }

    const payload = {
      email,
      fullName: fullname,
      dob,
      password,
      uvc,
      constituency,
    };

    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Registration Successful! Redirecting to login page...");
        navigate("/login");
      } else {
        const data = await response.text();
        alert("Registration Failed: " + data);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Registration Failed: " + error.message);
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    setPasswordCriteria({
      minLength: newPassword.length >= 8,
      number: /[0-9]/.test(newPassword),
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      specialChar: /[^A-Za-z0-9]/.test(newPassword),
    });
  };

  return (
    <div className="container">
      <header>
        <h1>General Election Voting System (GEVS)</h1>
      </header>
      <section id="registrationForm">
        <h2>Register as a Voter</h2>
        <form id="voterRegistration" onSubmit={handleSubmit}>
          <div>
            Email:{" "}
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            Full Name:{" "}
            <input
              type="text"
              name="fullname"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>
          <div>
            Date of Birth:{" "}
            <input
              type="date"
              name="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <div>
            {" "}
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              className="form-control"
              name="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
            />
            <ul className="mt-2">
              <li className={passwordCriteria.minLength ? "text-success" : ""}>
                At least 8 characters
              </li>
              <li className={passwordCriteria.number ? "text-success" : ""}>
                Contains a number
              </li>
              <li className={passwordCriteria.uppercase ? "text-success" : ""}>
                Contains an uppercase letter
              </li>
              <li className={passwordCriteria.lowercase ? "text-success" : ""}>
                Contains a lowercase letter
              </li>
              <li
                className={passwordCriteria.specialChar ? "text-success" : ""}
              >
                Contains a special character
              </li>
            </ul>
          </div>
          <div>
            Constituency:
            <select
              name="constituency"
              value={constituency}
              onChange={(e) => setConstituency(e.target.value)}
            >
              <option value="1">Shangri-la-Town</option>
              <option value="2">Northern-Kunlun-Mountain</option>
              <option value="3">Western-Shangri-la</option>
              <option value="4">Naboo-Vallery</option>
              <option value="5">New-Felucia</option>
            </select>
          </div>
          <div className="actions">
            <button
              type="button"
              onClick={() => setIsScannerActive(!isScannerActive)}
            >
              {isScannerActive ? "Close Scanner" : "Open Scanner"}
            </button>
          </div>
          {isScannerActive && (
            <div className="qr-scanner-container">
              <video ref={videoRef} className="qr-scanner" playsInline></video>
            </div>
          )}
          <div>
            UVC:
            <input
              type="text"
              name="uvc"
              value={uvc}
              onChange={(e) => setUvc(e.target.value)}
              placeholder="Scan or enter UVC"
            />
          </div>
          <div>
            <input type="submit" value="Register" />
          </div>
        </form>
        <div className="text-center mt-3">
          <p>
            Already registered? <Link to="/login">Click here to login.</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

export default SignUp;
