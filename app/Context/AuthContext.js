// import React, { createContext, useState, useEffect } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const restoreSession = async () => {
//       const token = await AsyncStorage.getItem("token");
//       if (token) setIsAuthenticated(true);
//       setLoading(false);
//     };
//     restoreSession();
//   }, []);

//   const login = async (tenantId) => {
//     setIsAuthenticated(true);
//   };

//   const logout = async () => {
//     await AsyncStorage.multiRemove([
//       "token",
//       "email",
//       "companies",
//       "tenantId",
//     ]);
//     setIsAuthenticated(false);
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
