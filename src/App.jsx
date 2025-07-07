import React, { useRef, useState } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  Autocomplete,
  useJsApiLoader,
  Marker,
} from "@react-google-maps/api";
import { FaLocationArrow, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const libraries = ["places"];

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey:
      process.env.REACT_APP_GOOGLE_MAPS_API_KEY ||
      "AIzaSyBJZxWZlH0pbLeFMxeq9XPd8ktwfbD6xvs", // Replace with your API key
    libraries,
  });

  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [travelMode, setTravelMode] = useState("DRIVING");
  const [isExpanded, setIsExpanded] = useState(true);

  const fixedLocation = { lat: 23.2463, lng: 77.5019 }; // Fixed coordinates
  const originRef = useRef();
  const destinationRef = useRef();

  if (!isLoaded) {
    return <p className="text-center text-lg font-semibold">Loading map...</p>;
  }

  async function calculateRoute() {
    const origin = originRef.current.value;
    const destination = destinationRef.current.value;

    if (!origin || !destination) {
      toast.error("Please provide both origin and destination!");
      return;
    }

    const directionsService = new google.maps.DirectionsService();

    try {
      const results = await directionsService.route({
        origin,
        destination,
        travelMode: google.maps.TravelMode[travelMode],
      });

      if (results.routes.length === 0) throw new Error("No route found");

      const route = results.routes[0].legs[0];
      setDirectionsResponse(results);
      setDistance(route.distance.text);
      setDuration(route.duration.text);
    } catch (error) {
      console.error("Route Calculation Error:", error.message);
      toast.error("No direct route found for the selected travel mode.");
    }
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destinationRef.current.value = "";
  }

  function setOriginToFixedLocation() {
    originRef.current.value = `${fixedLocation.lat}, ${fixedLocation.lng}`;
    toast.success("Origin set to current location!");
  }

  return (
    <div className="relative h-screen w-full">
      <ToastContainer position="top-center" autoClose={3000} />
      <GoogleMap
        center={fixedLocation} // Center map on fixed location
        zoom={15}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        options={{
          zoomControl: true,
          streetViewControl: true,
          mapTypeControl: true,
          fullscreenControl: false,
        }}
        onLoad={(map) => setMap(map)}
      >
        {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}

        <Marker
          position={fixedLocation}
          icon={{
            url: "/vite.svg",
            scaledSize: new google.maps.Size(50, 60),
          }}
          label="Fixed Location"
        />
      </GoogleMap>
      <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-6 max-w-lg w-full z-10">
        <div className="flex flex-row items-center justify-between mb-4">
          <h2 className="text-center text-xl font-bold">Google Maps Directions</h2>
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="px-4 py-2 bg-blue-700"
          >
            {isExpanded ? (
              <FaChevronUp className="text-white" />
            ) : (
              <FaChevronDown className="text-white" />
            )}
          </button>
        </div>
        {isExpanded && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Autocomplete>
                <input
                  type="text"
                  ref={originRef}
                  placeholder="Origin"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                />
              </Autocomplete>
              <button
                onClick={setOriginToFixedLocation}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none"
              >
                Use Current Location
              </button>
            </div>
            <Autocomplete>
              <input
                type="text"
                ref={destinationRef}
                placeholder="Destination"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            </Autocomplete>
            <select
              value={travelMode}
              onChange={(e) => setTravelMode(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="DRIVING">Driving</option>
              <option value="WALKING">Walking</option>
              <option value="BICYCLING">Bicycling</option>
              <option value="TRANSIT">Transit</option>
              <option value="TWO_WHEELER">Two-Wheeler</option>
            </select>
            <div className="flex justify-between">
              <button
                onClick={calculateRoute}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
              >
                Calculate Route
              </button>
              <button
                onClick={clearRoute}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center focus:outline-none focus:ring focus:ring-red-300"
              >
                <FaTimes className="mr-2" /> Clear Route
              </button>
            </div>
            <div className="flex justify-between items-center mt-3">
              <p className="text-gray-700">Distance: {distance || "N/A"}</p>
              <p className="text-gray-700">Duration: {duration || "N/A"}</p>
              <button
                onClick={() => {
                  map.panTo(fixedLocation);
                  map.setZoom(15);
                }}
                className="text-blue-500 hover:text-blue-600 focus:outline-none"
              >
                <FaLocationArrow />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
