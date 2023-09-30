import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { useUser } from "./UserContext";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:8001/auth/register", {
        username,
        password,
      });
      navigate("/login");
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Form
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      label="REGISTER"
      onSubmit={onSubmit}
    />
  );
};

const Login = () => {
  const { currentUser, setCurrentUser } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [, setCookies] = useCookies(["access_token"]);
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:8001/auth/login", {
        username,
        password,
      });

      if (response.data.status) {
        setCookies("access_token", response.data.token);
        setCurrentUser(response.data.user);
        console.log(response.data.user);
        navigate("/setAvatar");
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Form
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      label="LOGIN"
      onSubmit={onSubmit}
    />
  );
};

const Form = ({
  username,
  setUsername,
  password,
  setPassword,
  label,
  onSubmit,
}) => {
  return (
    <div className="auth-body">
      <div className="auth-container">
        <form onSubmit={onSubmit}>
          <h1 className="h1">{label}</h1>
          <div className="form">
            <div className="form-group">
              <label htmlFor="username" className="reg-text">
                Username
              </label>
              <input
                className="reg-inp"
                type="text"
                id="username"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="reg-text">
                Password
              </label>
              <input
                className="reg-inp"
                type="password"
                id="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
                required
              />
            </div>
            <button type="submit" className="reg-btn">
              {label}
            </button>

            <span>
              already have an account ? <Link to="/login">Login</Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export { Register, Login };
