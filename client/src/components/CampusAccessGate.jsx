// import React, { useState, useEffect } from 'react';
// import { verifyCampusAccess } from '../utils/geoFenceUtils';

// /**
//  * CampusAccessGate Component
//  * Wraps the entire library portal and enforces campus location check
//  * Matches your existing design system
//  */
// const CampusAccessGate = ({ children }) => {
//   const [accessStatus, setAccessStatus] = useState({
//     loading: true,
//     granted: false,
//     error: null,
//     details: null,
//   });

//   useEffect(() => {
//     checkAccess();
//   }, []);

//   const checkAccess = async () => {
//     setAccessStatus({ loading: true, granted: false, error: null, details: null });

//     try {
//       const result = await verifyCampusAccess();

//       if (result.success && result.isWithinCampus) {
//         // Access Granted
//         setAccessStatus({
//           loading: false,
//           granted: true,
//           error: null,
//           details: result,
//         });
//       } else if (result.success && !result.isWithinCampus) {
//         // Outside Campus
//         setAccessStatus({
//           loading: false,
//           granted: false,
//           error: 'outside_campus',
//           details: result,
//         });
//       } else {
//         // Location Error
//         setAccessStatus({
//           loading: false,
//           granted: false,
//           error: result.error || 'Unknown error',
//           details: null,
//         });
//       }
//     } catch (error) {
//       setAccessStatus({
//         loading: false,
//         granted: false,
//         error: error.message,
//         details: null,
//       });
//     }
//   };

//   // ========================================
//   // STATE 1: LOADING - Verifying Location
//   // ========================================
//   if (accessStatus.loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
//         <div className="text-center max-w-md w-full">
//           {/* Loading Spinner */}
//           <div className="relative mb-8">
//             <div className="w-20 h-20 mx-auto">
//               <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
//               <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
//             </div>
//           </div>

//           {/* Loading Text */}
//           <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
//             Verifying Location
//           </h2>
//           <p className="text-gray-600 text-sm lg:text-base mb-6">
//             Please allow location access to continue to the library portal
//           </p>

//           {/* Info Box */}
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
//             <div className="flex items-start gap-3">
//               <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//               </svg>
//               <div>
//                 <p className="text-sm font-semibold text-blue-900 mb-1">Why we need location access</p>
//                 <p className="text-xs text-blue-800">
//                   This portal is only accessible from within campus premises for data privacy and security.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ========================================
//   // STATE 2: GRANTED - Show App
//   // ========================================
//   if (accessStatus.granted) {
//     return (
//       <>
//         {/* Optional: Success Banner */}
//         <div className="bg-green-50 border-b border-green-200 px-4 py-2">
//           <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
//             <div className="flex items-center gap-2 text-sm text-green-800">
//               <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//               </svg>
//               <span className="font-medium">Campus Access Verified</span>
//               {accessStatus.details?.nearestLibrary && (
//                 <span className="hidden sm:inline text-green-700">
//                   • {accessStatus.details.nearestLibrary.name}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
        
//         {/* Show Main App */}
//         {children}
//       </>
//     );
//   }

//   // ========================================
//   // STATE 3: DENIED - Outside Campus
//   // ========================================
//   if (accessStatus.error === 'outside_campus') {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
//         <div className="max-w-2xl w-full">
//           <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10">
            
//             {/* Icon */}
//             <div className="flex justify-center mb-6">
//               <div className="relative">
//                 <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
//                   <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                   </svg>
//                 </div>
//                 <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
//                   <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </div>
//               </div>
//             </div>

//             {/* Title */}
//             <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-3">
//               Campus Access Required
//             </h1>
//             <p className="text-gray-600 text-center text-sm lg:text-base mb-8">
//               This library portal can only be accessed from within the campus premises
//             </p>

//             {/* Location Info Card */}
//             <div className="bg-gray-50 rounded-xl p-4 mb-6">
//               <div className="flex items-start gap-3">
//                 <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                   <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-sm font-semibold text-gray-900 mb-1">Your Current Location</p>
//                   <p className="text-sm text-gray-600">
//                     You are currently <strong className="text-gray-900">{accessStatus.details?.distance} meters</strong> away from the nearest library
//                   </p>
//                   {accessStatus.details?.nearestLibrary && (
//                     <p className="text-xs text-gray-500 mt-1">
//                       Nearest: {accessStatus.details.nearestLibrary.name}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Instructions */}
//             <div className="space-y-3 mb-8">
//               <p className="text-sm font-semibold text-gray-900">To access the library portal:</p>
              
//               <div className="flex items-start gap-3">
//                 <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
//                   1
//                 </div>
//                 <p className="text-sm text-gray-700 pt-1">Visit any campus library location</p>
//               </div>

//               <div className="flex items-start gap-3">
//                 <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
//                   2
//                 </div>
//                 <p className="text-sm text-gray-700 pt-1">Enable location services on your device</p>
//               </div>

//               <div className="flex items-start gap-3">
//                 <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
//                   3
//                 </div>
//                 <p className="text-sm text-gray-700 pt-1">Retry the location check when you're on campus</p>
//               </div>
//             </div>

//             {/* Retry Button */}
//             <button
//               onClick={checkAccess}
//               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
//             >
//               Retry Location Check
//             </button>

//             {/* Footer Note */}
//             <p className="text-xs text-gray-500 text-center mt-6 px-4">
//               This security measure ensures library resources are accessed only within campus for data privacy and compliance.
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ========================================
//   // STATE 4: DENIED - Location Permission Error
//   // ========================================
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex items-center justify-center p-4">
//       <div className="max-w-2xl w-full">
//         <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10">
          
//           {/* Icon */}
//           <div className="flex justify-center mb-6">
//             <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
//               <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//               </svg>
//             </div>
//           </div>

//           {/* Title */}
//           <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-3">
//             Location Access Required
//           </h1>
//           <p className="text-gray-600 text-center text-sm lg:text-base mb-8">
//             {accessStatus.error || 'Unable to verify your location'}
//           </p>

//           {/* Instructions Card */}
//           <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
//             <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
//               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
//               </svg>
//               How to enable location access
//             </h3>
//             <ul className="space-y-2 text-sm text-blue-900">
//               <li className="flex items-start gap-2">
//                 <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                 </svg>
//                 <span>Click the location icon in your browser's address bar</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                 </svg>
//                 <span>Select "Allow" or "Always allow" for this site</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                 </svg>
//                 <span>Refresh the page or click retry below</span>
//               </li>
//             </ul>
//           </div>

//           {/* Action Buttons */}
//           <div className="space-y-3">
//             <button
//               onClick={checkAccess}
//               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
//             >
//               Retry Location Check
//             </button>
//             <button
//               onClick={() => window.location.reload()}
//               className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
//             >
//               Refresh Page
//             </button>
//           </div>

//           {/* Footer Note */}
//           <p className="text-xs text-gray-500 text-center mt-6 px-4">
//             Location access is required for campus security and data privacy compliance.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CampusAccessGate;
import React from "react";

/*
  ================================
  TEMPORARY CAMPUS ACCESS BYPASS
  ================================
  👉 Location check ABHI OFF hai
  👉 Development / UI work ke liye
  👉 Wapas ON karne ke liye niche
     DEV_BYPASS = false kar dena
*/

const CampusAccessGate = ({ children }) => {
  const DEV_BYPASS = true; // 🔥 TEMP: location access disabled

  // 🚀 Directly allow access in dev
  if (DEV_BYPASS) {
    return <>{children}</>;
  }

  /*
    =====================================
    ORIGINAL LOCATION LOGIC (COMMENTED)
    =====================================

    yaha pe pehle tera:
    - navigator.geolocation
    - campus distance check
    - allowed / denied UI
    tha

    jab wapas enable karna ho:
    1️⃣ DEV_BYPASS = false
    2️⃣ niche ka logic uncomment
  */

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
        <h2 className="text-2xl font-bold text-red-600 mb-3">
          Campus Access Restricted
        </h2>
        <p className="text-gray-600 mb-4">
          This website is accessible only within the campus location.
        </p>
        <p className="text-sm text-gray-500">
          Please enable location access or visit from the campus network.
        </p>
      </div>
    </div>
  );
};

export default CampusAccessGate;
