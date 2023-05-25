import * as React from 'react';
import Map, {Marker} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { Circle, Star, StarBorder } from '@mui/icons-material';

const TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

function App() {
  const [viewState, setViewState] = React.useState({
    latitude: 39.742043,
    longitude: -104.991531,
    zoom: 8
  });
  return (
    <Map
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      style={{width: 800, height: 600}}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={TOKEN}
    >
      <Marker 
        longitude={-104.96234} 
        latitude={39.68356}
        offsetLeft={-20}
        offsetRight={-10} 
      >
        <Circle 
          style={{fontSize:viewState.zoom*1, color:"red"}} />
      </Marker>
    </Map>
  );
}


export default App;