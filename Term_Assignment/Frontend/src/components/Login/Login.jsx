import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

function Login() {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");

  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setemail(value);
    }
    if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://" + process.env.REACT_APP_BACKEND_URL + "/users/validateUser", { 'email': email, 'password': password })
      .then(res => {
        window.localStorage.setItem('email', email);
        navigate('/posts');
      })
      .catch((error) => {
        setemail('');
        setPassword('');
        setAuthError("Invalid email and Password");
      });
    window.localStorage.setItem('email', email);
    navigate('/posts', { state: { email: email } });

  };

  return (
    <>
      <StyledLoginImgWrapper className="login-img-wrapper">
        <StyledLogin className="login-form" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <label htmlFor="email">Email</label>
            <input type="text" id="email" name="email" value={email} onChange={(e) => handleInputChange(e)} placeholder="E-mail"></input>
          </div>
          <div className="input-wrapper">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={password} onChange={(e) => handleInputChange(e)} placeholder="Password"></input>
          </div>
          <button className="login-btn">Login</button>
          <div className="err">
            {<span className='err'>{authError}</span>}
          </div>
        </StyledLogin>
      </StyledLoginImgWrapper>
    </>
  );
}

const StyledLoginImgWrapper = styled.div`
  display: flex;
  width: 60%;
  box-shadow: 1px 1px 2px 2px #ccc;
  border-radius: 5px;
  margin: 5rem auto;
  padding: 1rem;
`;

const StyledLogin = styled.form`
  display: flex;
  flex-basis: 50%;
  flex-direction: column;
  gap: 1rem;
  padding: 0 1rem;
  .input-wrapper {
    display: flex;
    font-size: 2rem;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    input {
      padding: 1rem;
      outline: none;
      border: none;
      box-shadow: 1px 1px 2px 2px #ccc;
      border-radius: 5px;
    }
  }
  a{
    text-decoration: none;
    font-size: 1.5rem;
    text-align: center;
    color:  rgb(0, 127, 255);
  }
  button {
    background-color: rgb(0, 127, 255);
    outline: none;
    border: none;
    border-radius: 5px;
    color: white;
    padding: 1rem;
    margin-top: auto;
    :hover {
      cursor: pointer;
    }
  }
  .err{
    padding: 0rem;
    color: red;
    font-size: small;
    text-align: center;
  }
`;

export default Login;
