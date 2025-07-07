// Environment configuration and validation
export const config = {
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
};

// Validate required environment variables
export const validateConfig = () => {
  const missing = [];
  
  if (!config.googleMapsApiKey) {
    missing.push('VITE_GOOGLE_MAPS_API_KEY');
  }
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  return true;
};

export default config;
