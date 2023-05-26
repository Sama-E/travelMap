import { useState, useEffect, React } from 'react';
import Map, {Marker, Popup} from 'react-map-gl';
import { Circle, Star, StarBorder } from '@mui/icons-material';
import 'mapbox-gl/dist/mapbox-gl.css';
import "./app.css"
import axios from 'axios';
import moment from 'moment';

const TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

function App() {
  const currentUser = "David";
  const[pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);

  const [newPlace, setNewPlace] = useState(null);

  const [viewState, setViewState] = useState({
    latitude: 39.742043,
    longitude: -104.991531,
    zoom: 11
  });

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

  const handleCircleClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    //Center Popup by defining viewstate
    setViewState({...viewState, latitude: lat, longitude: long})
  }

  const handleAddClick = (e) => {
    const { lng, lat } = e.lngLat;   
    setNewPlace({
      long:lng,
      lat:lat,
    });
  }

  return (
    <Map
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      style={{width: 800, height: 600}}
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
          offsetLeft={-20}
          offsetRight={-10} 
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
              <Star className="star" />
              <Star className="star" />
              <Star className="star" />
              <Star className="star" />
              <Star className="star" />
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
              <form>
                <label>Title</label>
                <input placeholder='Enter a title'/>
                <label>Review</label>
                <textarea placeholder='Write a review' />
                <label>Rating</label>
                <select>
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
    </Map>
  );
}


export default App;