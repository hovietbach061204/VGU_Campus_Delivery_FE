// hello

'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import type { LatLngExpression } from 'leaflet';
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png', // optional, if you add it later
});

const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
);

interface EstimationResponse {
  distanceKm: number;
  timeMinutes: number;
  routeGeometry: string; // GeoJSON string
}

export default function RouteEstimatePage() {
  const [startPos, setStartPos] = useState<LatLngExpression | null>(null);
  const [endPos] = useState<LatLngExpression>([10.773813, 106.704726]); // Fixed endpoint
  const [routeCoords, setRouteCoords] = useState<LatLngExpression[]>([
    [10.773813, 106.704726],
  ]);
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setStartPos([pos.coords.latitude, pos.coords.longitude]);
      });
    }
  }, []);

  const estimateRoute = async () => {
    if (!startPos) {
      alert('Waiting for current location...');
      return;
    }

    const [startLat, startLon] = startPos as [number, number];
    const [endLat, endLon] = endPos as [number, number];

    const res = await fetch(
      `http://localhost:8080/api/routing/estimate?startLat=${startLat}&startLon=${startLon}&endLat=${endLat}&endLon=${endLon}`
    );
    const data: EstimationResponse = await res.json();

    setDistance(data.distanceKm.toFixed(2));
    setDuration(data.timeMinutes.toFixed(2));

    if (data.routeGeometry) {
      const geo = JSON.parse(data.routeGeometry);
      const coords: LatLngExpression[] = geo.coordinates.map(
        ([lon, lat]: number[]) => [lat, lon]
      );
      setRouteCoords(coords);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Route Estimation</h2>
      <button onClick={estimateRoute} style={{ marginBottom: '1rem' }}>
        Calculate Route
      </button>

      {distance && duration && (
        <div>
          <p>
            <strong>Distance:</strong> {distance} km
          </p>
          <p>
            <strong>Estimated Time:</strong> {duration} minutes
          </p>
        </div>
      )}

      {startPos && (
        <MapContainer
          center={startPos}
          zoom={13}
          style={{ height: '500px', width: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={startPos} />
          <Marker position={endPos} />
          {routeCoords.length > 0 && (
            <Polyline positions={routeCoords} color="green" />
          )}
        </MapContainer>
      )}
    </div>
  );
}
