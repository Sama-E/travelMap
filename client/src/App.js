import { useState } from 'react';
import ReactMapGl from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

function App() {
  const [viewPort, setViewPort] = useState({
    width: "100vw",
    height: "100vh",
    longitude: 37.7577,
    latitude: -80,
    zoom: 5
  });
  return (
    <div className="App">
      <ReactMapGl
          {...viewPort}
          mapboxApiAccessToken = {process.env.REACT_APP_PUBLIC_MAPBOX}
          onViewPortChange={nextViewPort => setViewPort(nextViewPort)}
        />
    </div>
  );
}


export default App;