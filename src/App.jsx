import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  Autocomplete,
  useJsApiLoader,
  Marker,
} from "@react-google-maps/api";
import { FaLocationArrow, FaTimes, FaChevronDown, FaChevronUp, FaMapMarkerAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { config, validateConfig } from "./config";

const libraries = ["places"];

function App() {
  // Validate configuration first
  let configError = null;
  try {
    validateConfig();
  } catch (error) {
    configError = error;
  }

  // All hooks must be called at the top level
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: config.googleMapsApiKey,
    libraries,
  });

  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [travelMode, setTravelMode] = useState("DRIVING");
  const [isExpanded, setIsExpanded] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const fixedLocation = { lat: 23.2463, lng: 77.5019 }; // Fixed coordinates
  const originRef = useRef();
  const destinationRef = useRef();

  const calculateRoute = useCallback(async () => {
    const origin = originRef.current?.value?.trim();
    const destination = destinationRef.current?.value?.trim();

    if (!origin || !destination) {
      toast.error("Please provide both origin and destination!");
      return;
    }

    setIsCalculating(true);
    const directionsService = new google.maps.DirectionsService();

    try {
      const results = await directionsService.route({
        origin,
        destination,
        travelMode: google.maps.TravelMode[travelMode],
      });

      if (results.routes.length === 0) {
        throw new Error("No route found");
      }

      const route = results.routes[0].legs[0];
      setDirectionsResponse(results);
      setDistance(route.distance.text);
      setDuration(route.duration.text);
      toast.success("Route calculated successfully!");
    } catch (error) {
      console.error("Route Calculation Error:", error.message);
      
      // Clear previous results on error
      setDirectionsResponse(null);
      setDistance("");
      setDuration("");
      
      // More specific error messages
      if (error.message.includes("ZERO_RESULTS")) {
        toast.error("No route found between these locations.");
      } else if (error.message.includes("OVER_QUERY_LIMIT")) {
        toast.error("API quota exceeded. Please try again later.");
      } else if (error.message.includes("REQUEST_DENIED")) {
        toast.error("API request denied. Please check your API key.");
      } else {
        toast.error("Unable to calculate route. Please try different locations.");
      }
    } finally {
      setIsCalculating(false);
    }
  }, [travelMode]);

  const clearRoute = useCallback(() => {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    if (originRef.current) originRef.current.value = "";
    if (destinationRef.current) destinationRef.current.value = "";
  }, []);

  // Get current location from device
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser!");
      return;
    }

    setIsGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { lat: latitude, lng: longitude };
        
        setCurrentLocation(newLocation);
        
        // Set origin field to current location
        if (originRef.current) {
          originRef.current.value = `${latitude}, ${longitude}`;
        }
        
        // Center map on current location
        if (map) {
          map.panTo(newLocation);
          map.setZoom(15);
        }
        
        setIsGettingLocation(false);
        toast.success("Current location detected!");
      },
      (error) => {
        setIsGettingLocation(false);
        console.error("Geolocation error:", error);
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error("Location access denied by user!");
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error("Location information is unavailable!");
            break;
          case error.TIMEOUT:
            toast.error("Location request timed out!");
            break;
          default:
            toast.error("An unknown error occurred while retrieving location!");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  }, [map]);

  // Handle configuration error after all hooks are called
  if (configError) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h2>
          <p className="text-gray-700">{configError.message}</p>
          <p className="text-sm text-gray-500 mt-2">Please check your environment variables.</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Map Loading Error</h2>
          <p className="text-gray-700">Failed to load Google Maps.</p>
          <p className="text-sm text-gray-500 mt-2">Please check your internet connection and API key.</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full">
      <ToastContainer position="top-center" autoClose={3000} />
      <GoogleMap
        center={currentLocation || fixedLocation}
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

        {/* Current Location Marker */}
        {currentLocation && (
          <Marker
            position={currentLocation}
            icon={{
              url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="8" fill="#4285F4" stroke="white" stroke-width="3"/>
                  <circle cx="20" cy="20" r="3" fill="white"/>
                </svg>
              `),
              scaledSize: new google.maps.Size(40, 40),
              anchor: new google.maps.Point(20, 20),
            }}
            title="Your Current Location"
          />
        )}
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
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className={`px-4 py-2 text-white rounded-lg focus:outline-none flex items-center ${
                  isGettingLocation 
                    ? 'bg-green-300 cursor-not-allowed' 
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isGettingLocation && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                )}
                {isGettingLocation ? 'Getting Location...' : 'Use Current Location'}
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
                disabled={isCalculating}
                className={`px-4 py-2 text-white rounded-lg focus:outline-none focus:ring focus:ring-blue-300 flex items-center ${
                  isCalculating 
                    ? 'bg-blue-300 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isCalculating && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                )}
                {isCalculating ? 'Calculating...' : 'Calculate Route'}
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
                  if (map) {
                    const centerLocation = currentLocation || fixedLocation;
                    map.panTo(centerLocation);
                    map.setZoom(15);
                  }
                }}
                className="text-blue-500 hover:text-blue-600 focus:outline-none"
                title="Center map on your location"
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
