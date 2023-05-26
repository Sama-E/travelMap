import "../assets/css/login.css"
import { useRef, useState } from "react";
import { Room, Cancel } from '@mui/icons-material';
import axios from "axios";

const Login = ({setShowLogin, storeUser, setCurrentUser}) => {
  const[error, setError] = useState(false);
  const nameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
    };
    
    try {
      const res = await axios.post("/users/login", user);
      console.log(res);
      storeUser.setItem('user', res.data.username);
      setCurrentUser(res.data.username)
      setShowLogin(false);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="loginContainer">
      <div className="logo">
        <Room />
        mapTravels
      </div>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="username" ref={nameRef} />
          <input type="password" placeholder="password" ref={passwordRef}/>
          <button className="login">Login</button>
          { error &&
            <span className="error">Something is wrong.</span>
          }
        </form>
        <Cancel 
          className="loginClose" 
          onClick={() => setShowLogin(false)} 
        />
    </div>
  )
}

export default Login;