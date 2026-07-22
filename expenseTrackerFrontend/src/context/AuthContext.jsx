import { useContext, createContext,useState } from "react";

//1. Create the context
const AuthContext=createContext();

//2. Create the provider component
const AuthProvider=({children})=>{
    const [token,setToken]=useState(localStorage.getItem('token') || null);

    //you can also add user state here later if you fetch user details
    // const [user,setUser]=useState(null);
    
    //Function to handle login
    const login=(newToken)=>{
        localStorage.setItem('token',newToken);
        setToken(newToken); //Updating token variable with real token got from backend


    };

    //function to handle logout
    const logout=()=>
    {
        localStorage.removeItem('token');
        setToken(null);
    };

    //Provide the state and functions to the rest of the app
    return (
        <AuthContext.Provider value={{token,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
};

//Create Custom hook for easy access
const useAuth=()=>{
    return useContext(AuthContext);
};

export {useAuth,AuthProvider}