import React, { createContext, useContext } from "react";

const AuthContext = createContext();

useAuth = () => useContext(AuthContext);

export { AuthContext, useAuth };