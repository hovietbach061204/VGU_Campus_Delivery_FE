// src/app/Map/OrderTrackingPage/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { query, where, collection, onSnapshot } from 'firebase/firestore';
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet
if (typeof window !== 'undefined' && L && L.Icon && L.Icon.Default) {
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/marker-icon-2x.png',
    iconUrl: '/marker-icon.png',
    shadowUrl: '/marker-shadow.png',
  });
}

interface LatLng {
  lat: number;
  lng: number;
}

export default function OrderTrackingPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [purchaser, setPurchaser] = useState<LatLng | null>(null);
  const [deliveryman, setDeliveryman] = useState<LatLng | null>(null);
  const [route, setRoute] = useState<LatLng[]>([]);
  const [eta, setEta] = useState<string>('');
  const [showRoute, setShowRoute] = useState(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [distance, setDistance] = useState<string>('');

  // Fetch order data from Firestore in real-time
  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    setError('');
    const q = query(collection(db, 'orders'), where('order_id', '==', orderId));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        if (querySnapshot.empty) {
          setError('Order not found.');
          setPurchaser(null);
          setDeliveryman(null);
        } else {
          const docSnap = querySnapshot.docs[0];
          const data = docSnap.data();
          if (data.purchaser_lat && data.purchaser_lon) {
            setPurchaser({ lat: data.purchaser_lat, lng: data.purchaser_lon });
          } else {
            setError('Purchaser location missing.');
            setPurchaser(null);
          }
          if (data.delivery_man_lat && data.delivery_man_lon) {
            setDeliveryman({
              lat: data.delivery_man_lat,
              lng: data.delivery_man_lon,
            });
          } else {
            setError('Deliveryman location missing.');
            setDeliveryman(null);
          }
        }
        setLoading(false);
      },
      () => {
        setError('Failed to fetch order data.');
        setPurchaser(null);
        setDeliveryman(null);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [orderId]);

  // Fetch route and ETA when showRoute is true
  useEffect(() => {
    if (!showRoute || !purchaser || !deliveryman) return;
    // Don't fetch route if both are at the same location
    if (
      purchaser.lat === deliveryman.lat &&
      purchaser.lng === deliveryman.lng
    ) {
      setRoute([]);
      setDistance('');
      setEta('Arrived');
      return;
    }
    const fetchRouteAndEta = async () => {
      const apiKey = '943be670-e612-4cc5-bb26-b43dfbc4cb2d'; // <-- Replace this with your actual API key
      // Use 'foot' vehicle for walking route
      const url = `https://graphhopper.com/api/1/route?point=${purchaser.lat},${purchaser.lng}&point=${deliveryman.lat},${deliveryman.lng}&vehicle=foot&locale=en&points_encoded=false&key=${apiKey}`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.paths && data.paths[0]) {
          const points = data.paths[0].points.coordinates.map(
            (coord: number[]) => ({ lat: coord[1], lng: coord[0] })
          );
          setRoute(points);
          // Distance in meters
          const distanceMeters = data.paths[0].distance;
          const distanceKm = (distanceMeters / 1000).toFixed(2);
          setDistance(distanceKm);
          // Estimate time: use GraphHopper's time if available, else fallback to car speed
          let etaMinutes;
          if (data.paths[0].time) {
            etaMinutes = Math.round(data.paths[0].time / 60000);
          } else {
            // fallback: assume 40km/h
            const carSpeedKmh = 40;
            etaMinutes = Math.round((distanceMeters / 1000 / carSpeedKmh) * 60);
          }
          setEta(`${etaMinutes} min`);
        } else if (data.message) {
          setRoute([]);
          setDistance('');
          setEta('No route found: ' + data.message);
        } else {
          setRoute([]);
          setDistance('');
          setEta('No route found');
        }
      } catch {
        setRoute([]);
        setEta('Failed to fetch route');
        setDistance('');
      }
    };
    fetchRouteAndEta();
  }, [showRoute, purchaser, deliveryman]);

  useEffect(() => {
    if (deliveryman && purchaser) {
      const distance = Math.sqrt(
        Math.pow(deliveryman.lat - purchaser.lat, 2) +
          Math.pow(deliveryman.lng - purchaser.lng, 2)
      );
      if (distance < 0.0001) {
        setEta('Arrived');
      }
    }
  }, [deliveryman, purchaser]);

  const bothSame =
    purchaser &&
    deliveryman &&
    purchaser.lat === deliveryman.lat &&
    purchaser.lng === deliveryman.lng;

  // Calculate offset if both are at the same location
  const purchaserMarker = purchaser;
  let deliverymanMarker = deliveryman;
  if (bothSame && purchaser && deliveryman) {
    // Offset deliveryman marker slightly north
    deliverymanMarker = {
      lat: deliveryman.lat + 0.0001,
      lng: deliveryman.lng,
    };
  }

  const center = purchaser || deliveryman || { lat: 0, lng: 0 };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#ffe5dc] to-[#fff8f6] p-4">
      <h1 className="mb-4 text-2xl font-bold text-[#ff785b]">
        Order Tracking Map
      </h1>
      {loading && <div className="mb-2 text-[#ff785b]">Loading...</div>}
      {error && <div className="mb-2 text-red-500">{error}</div>}
      {bothSame && (
        <div className="mb-2 text-[#ff785b]">
          Deliveryman and purchaser are at the same location.
        </div>
      )}
      {purchaser || deliveryman ? (
        <div style={{ width: '100vw', maxWidth: '100vw', height: '80vh' }}>
          <MapContainer
            center={center}
            zoom={19}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {purchaserMarker && (
              <Marker position={purchaserMarker}>
                <Popup>
                  Purchaser Location
                  <br />
                  Lat: {purchaserMarker.lat.toFixed(6)}
                  <br />
                  Lon: {purchaserMarker.lng.toFixed(6)}
                  {bothSame && <div>(Original location)</div>}
                </Popup>
              </Marker>
            )}
            {deliverymanMarker && (
              <Marker position={deliverymanMarker}>
                <Popup>
                  Deliveryman Location
                  <br />
                  Lat: {deliverymanMarker.lat.toFixed(6)}
                  <br />
                  Lon: {deliverymanMarker.lng.toFixed(6)}
                  {bothSame && <div>(Offset for visibility)</div>}
                </Popup>
              </Marker>
            )}
            {showRoute && route.length > 0 && !bothSame && (
              <Polyline positions={route} color="green" />
            )}
          </MapContainer>
        </div>
      ) : null}
      <div className="mt-4 flex flex-col items-center gap-2">
        <button
          className="rounded bg-[#ff785b] px-4 py-2 font-semibold text-white hover:bg-[#ff5b3b]"
          onClick={() => setShowRoute(true)}
          disabled={!purchaser || !deliveryman}
        >
          Show Route & ETA
        </button>
        {distance && (
          <div className="text-lg font-semibold text-[#ff785b]">
            Distance: {distance} km
          </div>
        )}
        {eta && (
          <div className="text-lg font-semibold text-[#ff785b]">ETA: {eta}</div>
        )}
      </div>
    </main>
  );
}
