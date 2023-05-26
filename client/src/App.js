import { useState, useEffect, React } from 'react';
import Map, {Marker, Popup} from 'react-map-gl';
import { Circle, Star } from '@mui/icons-material';
import 'mapbox-gl/dist/mapbox-gl.css';
import "./app.css"
import axios from 'axios';
import moment from 'moment';
import Register from './components/Register';
import Login from './components/Login';

const TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

function App() {
  //User
  const [currentUser, setCurrentUser] = useState();
  const storeUser = localStorage;

  //Places
  const[pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);

  //Form
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);

  //Map
  const [viewState, setViewState] = useState({
    latitude: 39.742043,
    longitude: -104.991531,
    zoom: 11
  });

  //Register & Login Buttons
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  //Get Pins
  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await axios.get("/pins");
        setPins(allPins.data);
      } catch(err) {
        console.log(err)
      }
    };
    getPins();// eslint-disable-next-line
  }, []);

  //Set Pins
  const handleCircleClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    //Center Popup by defining viewstate
    setViewState({...viewState, latitude: lat, longitude: long})
  }

  //Add Pin
  const handleAddClick = (e) => {
    const { lng, lat } = e.lngLat;   
    setNewPlace({
      long:lng,
      lat:lat,
    });
  }

  //Store New Pin
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      long: newPlace.long,
      lat: newPlace.lat,
    }

    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  }

  //Logout
  const handleLogout = () => {
    storeUser.removeItem("user");
    setCurrentUser(null);
  };

  return (
  <div style={{ height: "100vh", width: "100%" }}>
    <Map
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      style={{width: 950, height: 750}}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={TOKEN}
      onDblClick={handleAddClick}
      transitionDuration="400"
    >
      {pins.map((p)=>(
      <>
        <Marker 
          longitude={p.long} 
          latitude={p.lat}
          offsetLeft={-viewState.zoom*3.5}
          offsetTop={-viewState.zoom*7} 
        >
          <Circle 
            style={{
              fontSize:viewState.zoom*1, 
              color:p.username === currentUser ?  "tomato" : "slateblue",
              cursor: "pointer"
            }} 
            onClick={() => handleCircleClick(p._id, p.lat, p.long)}  
          />
        </Marker>
        
        { p._id  === currentPlaceId && (
        <Popup 
          key = {p._id}
          longitude={p.long} 
          latitude={p.lat}
          closeButton={true}
          closeOnClick={false}
          onClose={() => setCurrentPlaceId(null)}
          anchor="left"
        >
          <div className="card">
            <label className="place">Place</label>
            <h3>{p.title}</h3>
            <label>Review</label>
            <p className="desc">{p.desc}</p>
            <label>Rating</label>
            <div>
              {Array(p.rating).fill(<Star className="star" />)}
            </div>
            <label>Info</label>
            <span className="username">Created By <b>{p.username}</b></span>
            <span className="date">{moment(p.createdAt).fromNow()}</span>
          </div>
        </Popup>
        )} 
      </>
      ))}
      {newPlace && ( 
        <Popup 
          longitude={newPlace.long} 
          latitude={newPlace.lat}
          closeButton={true}
          closeOnClick={false}
          onClose={() => setNewPlace(null)}
          anchor="left"
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input 
                  placeholder='Enter a title'
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Review</label>
                <textarea 
                  placeholder='Write a review' 
                  onChange={(e) => setDesc(e.target.value)}
                />
                <label>Rating</label>
                <select onChange={(e) => setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="submitButton" type="submit">Add Pin</button>
              </form>
            </div>
        </Popup>
      )}
      {currentUser ? (
        <button className="button logout" onClick={handleLogout}>Log out</button>
      ) : (      
        <div className="buttons">
          <button className="button login" onClick={() => setShowLogin(true)}>Login</button>
          <button className="button register" onClick={() => setShowRegister(true)}>Register</button>
        </div>
      )}
      {showRegister && <Register setShowRegister={setShowRegister} />}
      {showLogin && 
      <Login  
          setShowLogin={setShowLogin} 
          storeUser={storeUser} 
          setCurrentUser={setCurrentUser} 
        />
      }
      
    </Map>
  </div>
  );
}


export default App;