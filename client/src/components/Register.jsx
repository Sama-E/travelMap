import "../assets/css/register.css"
import { useRef, useState } from "react";
import { Room, Cancel } from '@mui/icons-material';
import axios from "axios";

const Register = ({setShowRegister}) => {
  const[success, setSuccess] = useState(false);
  const[error, setError] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      await axios.post("/users/register", newUser);
      setError(false);
      setSuccess(true);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="registerContainer">
      <div className="logo">
        <Room />
        mapTravels
      </div>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="username" ref={nameRef} />
          <input type="email" placeholder="email" ref={emailRef}/>
          <input type="password" placeholder="password" ref={passwordRef}/>
          <button className="register">Register</button>
          { success && 
            <span className="success">Success, you are registered! Please login.</span>
          } 
          { error &&
            <span className="error">Something is wrong.</span>
          }
        </form>
        <Cancel 
          className="registerClose" 
          onClick={() => setShowRegister(false)} 
        />
    </div>
  )
}

export default Register