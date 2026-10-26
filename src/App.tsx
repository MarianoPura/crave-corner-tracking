import {useEffect, useRef, useState} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './index.css';
import type {Map as LeafletMap, CircleMarker} from 'leaflet';

type Coordinates = {
  lat: number;
  lng: number;
}

function App() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  const pointAMarkerRef = useRef<CircleMarker | null>(null);
  const pointBMarkerRef = useRef<CircleMarker | null>(null);

  const pointARef = useRef<Coordinates | null>(null);
  const pointBRef = useRef<Coordinates | null>(null);

  const [pointA, setPointA] = useState<Coordinates | null>(null);
  const [pointB, setPointB] = useState<Coordinates | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current){
      return;
    }

    const map = L.map(mapContainerRef.current).setView(
      [14.5995, 120.9842],
      42
    );

    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    map.on('click', (event) => {
      const coordinates: Coordinates = {
        lat: Number(event.latlng.lat.toFixed(6)),
        lng: Number(event.latlng.lat.toFixed(6))
      };

      if (pointARef.current === null) {
        pointARef.current = coordinates;
        setPointA(coordinates);

        pointAMarkerRef.current = L.circleMarker(
          [coordinates.lat, coordinates.lng],
          {
            radius: 8,
            color: 'blue',
            fillColor: 'blue',
            fillOpacity: 0.8,
          }
        )
        .addTo(map)
        .bindPopup('Point A: Pickup')
        .openPopup();
      } else {
        pointBRef.current = coordinates;
        setPointB(coordinates);

        if(pointBMarkerRef.current) {
          pointBMarkerRef.current.remove();
        }

        pointBMarkerRef.current= L.circleMarker(
          [coordinates.lat, coordinates.lng],
          {
            radius: 8,
            color: 'red',
            fillColor: 'red',
            fillOpacity: 0.8
          }
        )
        .addTo(map)
        .bindPopup('Point B: Destination')
        .openPopup();
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
      pointAMarkerRef.current = null;
      pointBMarkerRef.current = null;
    }
  }, []);


  function resetPoints() {
    pointAMarkerRef.current?.remove();
    pointBMarkerRef.current?.remove();

    pointAMarkerRef.current = null;
    pointBMarkerRef.current = null;

    setPointA(null);
    setPointB(null);

    mapRef.current?.setView([14.5995, 120.9842], 12);
  }

  return (
    <div>
      <h1>Delivery Tracking</h1>

      <p>Click the map to select pickup destination</p>
      
      <div>
        <h2>Point A: Pickup Location</h2>
        {pointA ?
         (<p>Latitud: {pointA.lat}, Longnitude: {pointA.lng}</p>): 
         (<p>Not Selected</p>)
        }
      </div>

      <div>
          <h2>Point B: Pickup Location</h2>
          {pointB ? 
          (<p>Latitude: {pointB.lat}, Longnitude: {pointB.lng}</p>):
          (<p>Not Selected</p>)
          }
      </div>

      <button onClick={resetPoints}>Reset Locations</button>
    <div ref={mapContainerRef} style = {{height: '450px', width: '100%', marginTop: '16px'}}/>
    </div>
  );
}

export default App;