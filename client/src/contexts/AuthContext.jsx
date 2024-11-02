import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../utils/constants";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [userDetails, setUserDetails] = useState(null);
    const [error, setError] = useState(null);    
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("user-token");
        if(token){
            fetchUserData(token);
        } else {
            setLoading(false);
        }
    },[]);

    const fetchUserData = async (token) => {
        try {

            const response = await axios.get(`${BACKEND_URL}/user/`, {
                headers: {
                    Authorization: token
                }
            });

            if(response.status === 200){ 
                setUserDetails({
                    id: response.data.data._id,
                    name: response.data.data.name,
                    email: response.data.data.email
                });  
            }
            
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError(error.message);
            logout();
        } finally {
            setLoading(false);
        }
    }

   const login = async (userData) => {
    setLoading(true);
    try {
        localStorage.setItem("user-token", userData.token);
        await fetchUserData(userData.token);
    } catch (error) {
        setError(error.message);
        logout();
    } finally {
        setLoading(false);
    }
   }

    const logout = () => {
        setUserDetails(null);
        localStorage.removeItem("user-token");
        setLoading(false);
    }    

    if(loading){
        return <div>Loading Auth...</div>
    }

    return (
        <AuthContext.Provider value={{userDetails, login, logout, error}} >
            {children}
        </AuthContext.Provider>
    )


}