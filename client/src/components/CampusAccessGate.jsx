// // src/components/CampusAccessGate.jsx
//  // 🔥 true = bypass, false = normal
// import { useState, useEffect } from 'react';
// import { verifyCampusAccess } from '../utils/geoFenceUtils';


// const CampusAccessGate = ({ children }) => {
//   const [accessStatus, setAccessStatus] = useState({
//     loading: true,
//     granted: false,
//     error: null,
//     distance: null,
//     nearestLibrary: null,
//   });

//   useEffect(() => {
//     checkAccess();
//   }, []);

//   const checkAccess = async () => {
//     setAccessStatus({ ...accessStatus, loading: true });
    
//     const result = await verifyCampusAccess();
    
//     setAccessStatus({
//       loading: false,
//       granted: result.isWithinCampus,
//       error: result.error || null,
//       distance: result.distance,
//       nearestLibrary: result.nearestLibrary,
//     });
//   };

//   // LOADING STATE
//   if (accessStatus.loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
//         <div className="text-center">
//           <div className="relative w-24 h-24 mx-auto mb-6">
//             <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
//             <div className="relative flex items-center justify-center w-24 h-24 bg-blue-600 rounded-full">
//               <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//               </svg>
//             </div>
//           </div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">
//             Verifying Campus Access
//           </h2>
//           <p className="text-gray-600">
//             Checking your location...
//           </p>
//           <div className="w-64 h-2 bg-gray-200 rounded-full mt-6 mx-auto overflow-hidden">
//             <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: '70%' }}></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ACCESS DENIED
//   if (!accessStatus.granted) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-red-50 to-orange-50">
//         <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
//           <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
//             <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//             </svg>
//           </div>

//           <h2 className="text-2xl font-bold text-gray-800 mb-3">
//             Campus Access Required
//           </h2>

//           <p className="text-gray-600 mb-6">
//             {accessStatus.error || 'You must be on campus to access the library system.'}
//           </p>

//           {accessStatus.distance && accessStatus.nearestLibrary && (
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
//               <div className="flex items-start">
//                 <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 <div>
//                   <p className="text-sm font-semibold text-gray-800 mb-1">
//                     Nearest Library
//                   </p>
//                   <p className="text-sm text-gray-700">
//                     {accessStatus.nearestLibrary.name}
//                   </p>
//                   <p className="text-sm text-gray-600 mt-1">
//                     Distance: <span className="font-semibold">{accessStatus.distance}m away</span>
//                   </p>
//                   <p className="text-xs text-gray-500 mt-2">
//                     Required: Inside campus geofence boundary
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           <button
//             onClick={checkAccess}
//             className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
//           >
//             <div className="flex items-center justify-center">
//               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//               </svg>
//               Retry Location Check
//             </div>
//           </button>

//           <div className="mt-6 pt-6 border-t border-gray-200">
//             <p className="text-xs text-gray-500 mb-2 font-semibold">
//               Troubleshooting:
//             </p>
//             <ul className="text-xs text-gray-500 text-left space-y-1">
//               <li>• Enable location services in browser settings</li>
//               <li>• Connect to campus WiFi network</li>
//               <li>• Move closer to a library building</li>
//               <li>• Ensure GPS is enabled on your device</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ACCESS GRANTED
//   return <>{children}</>;
// };

// export default CampusAccessGate;
// src/components/CampusAccessGate.jsx

import { useState, useEffect } from 'react';
import { verifyCampusAccess } from '../utils/geoFenceUtils';

// 🔥 CONTROL SWITCH
// true  = bypass (ghar pe testing)
// false = normal campus check
const BYPASS_LOCATION = false;

const CampusAccessGate = ({ children }) => {
  const [accessStatus, setAccessStatus] = useState({
    loading: true,
    granted: false,
    error: null,
    distance: null,
    nearestLibrary: null,
  });

  useEffect(() => {
    // 🔥 BYPASS ACTIVE → skip everything
    if (BYPASS_LOCATION) {
      setAccessStatus({
        loading: false,
        granted: true,
        error: null,
        distance: null,
        nearestLibrary: null,
      });
    } else {
      checkAccess();
    }
  }, []);

  const checkAccess = async () => {
    setAccessStatus(prev => ({ ...prev, loading: true }));

    const result = await verifyCampusAccess();

    setAccessStatus({
      loading: false,
      granted: result.isWithinCampus,
      error: result.error || null,
      distance: result.distance,
      nearestLibrary: result.nearestLibrary,
    });
  };

  // 🔥 BYPASS DIRECT RETURN (extra safety)
  if (BYPASS_LOCATION) {
    return <>{children}</>;
  }

  // LOADING STATE
  if (accessStatus.loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
            <div className="relative flex items-center justify-center w-24 h-24 bg-blue-600 rounded-full">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Verifying Campus Access
          </h2>
          <p className="text-gray-600">
            Checking your location...
          </p>
        </div>
      </div>
    );
  }

  // ACCESS DENIED
  if (!accessStatus.granted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Campus Access Required
          </h2>

          <p className="text-gray-600 mb-6">
            {accessStatus.error || 'You must be on campus to access the library system.'}
          </p>

          <button
            onClick={checkAccess}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry Location Check
          </button>
        </div>
      </div>
    );
  }

  // ACCESS GRANTED
  return <>{children}</>;
};

export default CampusAccessGate;