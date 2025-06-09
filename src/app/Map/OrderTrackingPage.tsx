// src/app/Map/OrderTrackingPage.tsx
// This file is deprecated. The actual page is now in src/app/Map/OrderTrackingPage/page.tsx. You can safely delete this file.

// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';
// import { db } from '@/lib/firebase';
// import { doc, getDoc } from 'firebase/firestore';
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Polyline,
//   Popup,
// } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // Fix for default marker icon in Leaflet
// import markerIcon2x from '/public/marker-icon-2x.png';
// import markerIcon from '/public/marker-icon.png';
// import markerShadow from '/public/marker-shadow.png';

// if (typeof window !== 'undefined' && L && L.Icon && L.Icon.Default) {
//   L.Icon.Default.mergeOptions({
//     iconRetinaUrl: markerIcon2x,
//     iconUrl: markerIcon,
//     shadowUrl: markerShadow,
//   });
// }

// interface LatLng {
//   lat: number;
//   lng: number;
// }

// export default function OrderTrackingPage() {
//   const searchParams = useSearchParams();
//   const orderId = searchParams.get('orderId');
//   const [purchaser, setPurchaser] = useState<LatLng | null>(null);
//   const [deliveryman, setDeliveryman] = useState<LatLng | null>(null);
//   const [route, setRoute] = useState<LatLng[]>([]);
//   const [eta, setEta] = useState<string>('');
//   const [showRoute, setShowRoute] = useState(false);

//   // Fetch order data from Firestore
//   useEffect(() => {
//     if (!orderId) return;
//     const fetchOrder = async () => {
//       const docRef = doc(db, 'orders', orderId);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         const data = docSnap.data();
//         // Startpoint: purchaser_lon, purchaser_lat
//         if (data.purchaser_lat && data.purchaser_lon) {
//           setPurchaser({ lat: data.purchaser_lat, lng: data.purchaser_lon });
//         }
//         // Endpoint: delivery_man_lon, delivery_man_lat
//         if (data.delivery_man_lat && data.delivery_man_lon) {
//           setDeliveryman({
//             lat: data.delivery_man_lat,
//             lng: data.delivery_man_lon,
//           });
//         }
//       }
//     };
//     fetchOrder();
//   }, [orderId]);

//   // Fetch route and ETA when showRoute is true
//   useEffect(() => {
//     if (!showRoute || !purchaser || !deliveryman) return;
//     const fetchRouteAndEta = async () => {
//       // Use GraphHopper API
//       const apiKey = 'YOUR_GRAPHHOPPER_API_KEY';
//       const url = `https://graphhopper.com/api/1/route?point=${purchaser.lat},${purchaser.lng}&point=${deliveryman.lat},${deliveryman.lng}&vehicle=car&locale=en&points_encoded=false&key=${apiKey}`;
//       try {
//         const res = await fetch(url);
//         const data = await res.json();
//         if (data.paths && data.paths[0]) {
//           const points = data.paths[0].points.coordinates.map(
//             (coord: number[]) => ({ lat: coord[1], lng: coord[0] })
//           );
//           setRoute(points);
//           // Convert time from ms to minutes
//           const minutes = Math.round(data.paths[0].time / 60000);
//           setEta(`${minutes} min`);
//         }
//       } catch (err) {
//         setRoute([]);
//         setEta('');
//       }
//     };
//     fetchRouteAndEta();
//   }, [showRoute, purchaser, deliveryman]);

//   // Polyline decoder (Google polyline algorithm)
//   function decodePolyline(encoded: string): LatLng[] {
//     let points: LatLng[] = [];
//     let index = 0,
//       lat = 0,
//       lng = 0;
//     while (index < encoded.length) {
//       let b,
//         shift = 0,
//         result = 0;
//       do {
//         b = encoded.charCodeAt(index++) - 63;
//         result |= (b & 0x1f) << shift;
//         shift += 5;
//       } while (b >= 0x20);
//       let dlat = result & 1 ? ~(result >> 1) : result >> 1;
//       lat += dlat;
//       shift = 0;
//       result = 0;
//       do {
//         b = encoded.charCodeAt(index++) - 63;
//         result |= (b & 0x1f) << shift;
//         shift += 5;
//       } while (b >= 0x20);
//       let dlng = result & 1 ? ~(result >> 1) : result >> 1;
//       lng += dlng;
//       points.push({ lat: lat / 1e5, lng: lng / 1e5 });
//     }
//     return points;
//   }

//   // Calculate ETA if deliveryman is at purchaser's location
//   useEffect(() => {
//     if (deliveryman && purchaser) {
//       const distance = Math.sqrt(
//         Math.pow(deliveryman.lat - purchaser.lat, 2) +
//           Math.pow(deliveryman.lng - purchaser.lng, 2)
//       );
//       if (distance < 0.0001) {
//         setEta('Arrived');
//       }
//     }
//   }, [deliveryman, purchaser]);

//   const center = purchaser || deliveryman || { lat: 0, lng: 0 };

//   return (
//     <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#ffe5dc] to-[#fff8f6] p-4">
//       <h1 className="mb-4 text-2xl font-bold text-[#ff785b]">
//         Order Tracking Map
//       </h1>
//       <div style={{ width: '100%', maxWidth: 600, height: 400 }}>
//         <MapContainer
//           center={center}
//           zoom={15}
//           style={{ height: '100%', width: '100%' }}
//         >
//           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//           {purchaser && (
//             <Marker position={purchaser}>
//               <Popup>
//                 Purchaser Location
//                 <br />
//                 Lat: {purchaser.lat.toFixed(6)}
//                 <br />
//                 Lon: {purchaser.lng.toFixed(6)}
//               </Popup>
//             </Marker>
//           )}
//           {deliveryman && (
//             <Marker position={deliveryman}>
//               <Popup>
//                 Deliveryman Location
//                 <br />
//                 Lat: {deliveryman.lat.toFixed(6)}
//                 <br />
//                 Lon: {deliveryman.lng.toFixed(6)}
//               </Popup>
//             </Marker>
//           )}
//           {showRoute && route.length > 0 && (
//             <Polyline positions={route} color="blue" />
//           )}
//         </MapContainer>
//       </div>
//       <div className="mt-4 flex flex-col items-center gap-2">
//         <button
//           className="rounded bg-[#ff785b] px-4 py-2 font-semibold text-white hover:bg-[#ff5b3b]"
//           onClick={() => setShowRoute(true)}
//           disabled={!purchaser || !deliveryman}
//         >
//           Show Route & ETA
//         </button>
//         {eta && (
//           <div className="text-lg font-semibold text-[#ff785b]">ETA: {eta}</div>
//         )}
//       </div>
//     </main>
//   );
// }
