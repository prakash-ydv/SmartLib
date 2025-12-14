/**
 * GeoFence Utility for Campus Library Access Control
 * Supports 11 campus libraries with 50-acre radius coverage
 */

// ⚠️ IMPORTANT: Replace with your actual campus library coordinates
export const CAMPUS_LIBRARIES = [
  {
    id: 'central_library',
    name: 'Central Library',
    latitude: 23.2599,  // Replace with actual coordinates
    longitude: 77.4126, // Replace with actual coordinates
    radius: 450, // 50 acres ≈ 450 meters
  },
  {
    id: 'library_2',
    name: 'Engineering Block Library',
    latitude: 23.2605,
    longitude: 77.4130,
    radius: 450,
  },
  {
    id: 'library_3',
    name: 'Science Block Library',
    latitude: 23.2595,
    longitude: 77.4120,
    radius: 450,
  },
  // TODO: Add remaining 8 libraries here
  // Copy this format and add your actual coordinates
  /*
  {
    id: 'library_4',
    name: 'Library Name',
    latitude: 0.0,
    longitude: 0.0,
    radius: 450,
  },
  */
];

/**
 * Calculate distance between two GPS coordinates using Haversine formula
 * @param {number} lat1 - User latitude
 * @param {number} lon1 - User longitude
 * @param {number} lat2 - Library latitude
 * @param {number} lon2 - Library longitude
 * @returns {number} Distance in meters
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

/**
 * Check if user is within any campus library boundary
 * @param {number} userLat - User's current latitude
 * @param {number} userLon - User's current longitude
 * @returns {Object} { isWithinCampus: boolean, nearestLibrary: object|null, distance: number }
 */
export const checkCampusAccess = (userLat, userLon) => {
  let nearestLibrary = null;
  let minDistance = Infinity;
  let isWithinCampus = false;

  CAMPUS_LIBRARIES.forEach((library) => {
    const distance = calculateDistance(
      userLat,
      userLon,
      library.latitude,
      library.longitude
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestLibrary = library;
    }

    if (distance <= library.radius) {
      isWithinCampus = true;
    }
  });

  return {
    isWithinCampus,
    nearestLibrary,
    distance: Math.round(minDistance),
  };
};

/**
 * Get user's current location using browser Geolocation API
 * @returns {Promise<{latitude: number, longitude: number, accuracy: number}>}
 */
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        let errorMessage = 'Location access denied';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
          default:
            errorMessage = 'An unknown error occurred.';
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true, // Use GPS for better accuracy
        timeout: 10000, // 10 second timeout
        maximumAge: 0, // Don't use cached location
      }
    );
  });
};

/**
 * Main function to verify campus access
 * @returns {Promise<Object>} Access verification result
 */
export const verifyCampusAccess = async () => {
  try {
    // Get user's current location
    const userLocation = await getUserLocation();
    
    // Check if within campus boundary
    const accessCheck = checkCampusAccess(
      userLocation.latitude,
      userLocation.longitude
    );

    return {
      success: true,
      ...accessCheck,
      userLocation,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      isWithinCampus: false,
    };
  }
};