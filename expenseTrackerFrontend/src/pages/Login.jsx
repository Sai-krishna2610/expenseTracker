import { useState } from "react";
import API from '../services/api.js';
import {useNavigate} from 'react-router-dom';
import { useAuth } from "../context/AuthContext.jsx";
import {FaEye,FaEyeSlash} from 'react-icons/fa';
import { GoogleLogin } from "@react-oauth/google";

function Login()
{
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate=useNavigate();
    const {login}=useAuth();//Destructure login from useAuth();
    const [isLoading,setIsLoading]=useState(false);
    const [error,setError]=useState(null);

    const handleLogin=async(e)=>{
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try{
            const res=await API.post("/auth/login",{
                email,password
            });
            console.log("Login Success ")
            login(res?.data.token);//calling login function and passing token as params

            //redirect after login
            navigate('/dashboard');
        }
        catch (err) {
            // console.dir(err,{depth:null});
            console.log("Error: ",err.response?.data);
            setError(err.response?.data?.message || "Login Failed. Please check credentials")
        }
        finally{
            setIsLoading(false);
        }
    };

    // Google Login Success Handler
    const handleGoogleSuccess = async (credentialResponse) => {
        setIsLoading(true);
        setError(null);
        try {
            // credentialResponse.credential is the Google ID Token
            const res = await API.post("/auth/google", {
                idToken: credentialResponse.credential
            });
            login(res?.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || "Google Login Failed");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="flex flex-col items-center gap-4">
            <form onSubmit={handleLogin} className="flex flex-col gap-3 w-full">
                <input type="email" placeholder="Email" id="email" onChange={(e) => setEmail(e.target.value)} className="border p-2"/>
                <div className="relative w-full">
                    <input type={showPassword ? 'text' : 'password'} placeholder="password" onChange={(e) => setPassword(e.target.value)} className="w-full border p-2 pr-10"/>
                    <button type="button" onClick={() => setShowPassword(prev => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {showPassword ? <FaEyeSlash/> : <FaEye/>}
                    </button>
                </div>
                {error && <p className="text-red-500">{error}</p>}
                {isLoading && <p className="text-blue-500">Loading...</p>}
                <button className="bg-blue-500 text-white p-2 cursor-pointer">Login</button>
            </form>

            <div className="flex items-center my-2 w-full">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="px-3 text-gray-500 text-sm">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Google Sign-In Button */}
            <div className="w-full flex justify-center">
                <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError("Google Login Failed")}
                />
            </div>
        </div>
    )
}
export default Login;