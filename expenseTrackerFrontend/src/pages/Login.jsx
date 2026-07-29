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
    const { loginWithPassword, loginWithGoogle } = useAuth(); // Destructure login functions from useAuth()
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
            loginWithPassword(res?.data.token, password); // calling loginWithPassword function and passing token & password as params

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
            loginWithGoogle(res?.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || "Google Login Failed");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="relative flex justify-center items-center min-h-screen px-4 w-full bg-gradient-to-br from-[#0F172A] to-[#1E293B] overflow-hidden select-none">
            {/* Ambient Drifting Glowing Orbs */}
            <div className="absolute top-[10%] left-[10%] w-[320px] h-[320px] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none animate-drift-orb-1"></div>
            <div className="absolute bottom-[10%] right-[10%] w-[380px] h-[380px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none animate-drift-orb-2"></div>
            <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-rose-500/5 blur-[140px] pointer-events-none animate-drift-orb-3"></div>

            {/* Glowing Financial Trendlines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <g className="opacity-25">
                    {/* Emerald Positive Trendline */}
                    <path
                        d="M -50 650 C 200 600, 350 400, 550 450 C 750 500, 950 250, 1150 300 C 1350 350, 1450 150, 1650 200"
                        fill="none"
                        stroke="url(#emerald-glow)"
                        strokeWidth="3.5"
                        className="animate-draw-line"
                    />
                    {/* Indigo/Coral Fluctuating Trendline */}
                    <path
                        d="M -50 400 C 150 350, 300 480, 500 280 C 700 80, 900 380, 1100 180 C 1300 100, 1400 250, 1600 100"
                        fill="none"
                        stroke="url(#indigo-glow)"
                        strokeWidth="2"
                        strokeDasharray="6,6"
                        className="animate-draw-line"
                        style={{ animationDelay: '1.5s' }}
                    />
                </g>
                <defs>
                    <linearGradient id="emerald-glow" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#059669" stopOpacity="0" />
                        <stop offset="30%" stopColor="#10B981" stopOpacity="0.8" />
                        <stop offset="75%" stopColor="#34D399" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#059669" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="indigo-glow" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4F46E5" stopOpacity="0" />
                        <stop offset="40%" stopColor="#6366F1" stopOpacity="0.6" />
                        <stop offset="75%" stopColor="#F43F5E" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Floating Analytics Glass Widgets (pointer-events disabled) */}
            {/* Top Left Floating Tag: Income */}
            <div className="hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-800/40 backdrop-blur-md border border-white/10 shadow-lg pointer-events-none animate-float-slow absolute left-[4%] lg:left-[10%] xl:left-[16%] top-[15%] lg:top-[20%] z-0">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </div>
                <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Income</div>
                    <div className="text-sm font-semibold text-emerald-400 font-mono animate-pulse-emerald">+$1,250.00</div>
                </div>
            </div>

            {/* Top Right Floating Tag: Savings Ratio */}
            <div className="hidden md:flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-800/40 backdrop-blur-md border border-white/10 shadow-lg pointer-events-none animate-float-slow absolute right-[6%] lg:right-[12%] xl:right-[18%] top-[12%] lg:top-[18%] z-0" style={{ animationDelay: '2s' }}>
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Savings</div>
                    <div className="text-sm font-semibold text-indigo-300 font-mono">68% Achieved</div>
                </div>
            </div>

            {/* Bottom Right Floating Tag: Category Snippet */}
            <div className="hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-800/40 backdrop-blur-md border border-white/10 shadow-lg pointer-events-none animate-float-reverse absolute right-[4%] lg:right-[10%] xl:right-[16%] bottom-[15%] lg:bottom-[20%] z-0">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Food & Dining</div>
                    <div className="text-sm font-semibold text-rose-300 font-mono">-$420.00</div>
                </div>
            </div>

            {/* Main Form Card Container */}
            <div className="z-10 w-full max-w-md flex flex-col gap-4 shadow-md p-6 rounded-lg login-card-glass">
                <form onSubmit={handleLogin} className="flex flex-col gap-3">
                    <input
                        type="email"
                        placeholder="Email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded-md p-2 input-glass"
                    />

                    <div className="relative w-full">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border rounded-md p-2 pr-10 input-glass input-glass-indigo"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-400 transition-colors focus:outline-none"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {error && <p className="text-rose-400 text-sm font-medium">{error}</p>}
                    {isLoading && <p className="text-emerald-400 text-sm font-medium animate-pulse-emerald">Loading...</p>}

                    <button
                        type="submit"
                        className="w-full text-white p-2 rounded-md transition-all hover:text-xl btn-emerald-gradient cursor-pointer"
                    >
                        Login
                    </button>
                </form>

                <div className="flex items-center">
                    <div className="flex-1 border-t border-slate-700"></div>
                    <span className="mx-3 text-sm text-slate-400">OR</span>
                    <div className="flex-1 border-t border-slate-700"></div>
                </div>

                <div className="w-full flex justify-center">
                    <GoogleLogin
                        theme="filled_black"
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError("Google Login Failed")}
                    />
                </div>
            </div>
        </div>
    )
}
export default Login;
