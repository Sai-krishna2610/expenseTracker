import { useState } from "react";
import API from "../services/api.js";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext.jsx";

function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // Normal Registration
    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        setError(null);

        try {
            const res = await API.post("/auth/register", form);

            // If your backend returns a JWT on register
            if (res.data.token) {
                login(res.data.token);
                navigate("/dashboard");
            } else {
                alert("Registered Successfully");
                navigate("/login");
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Registration failed. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Google Registration/Login
    const handleGoogleSuccess = async (credentialResponse) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await API.post("/auth/google", {
                idToken: credentialResponse.credential,
            });

            login(res.data.token);
            navigate("/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Google Registration Failed"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white p-6 rounded shadow-md w-96">

                <h2 className="text-2xl font-bold text-center mb-6">
                    Register
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">

                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={form.name}
                        onChange={handleChange}
                        className="border p-2"
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="border p-2"
                        required
                    />

                    <div className="relative">

                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full border p-2 pr-10"
                            required
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword((prev) => !prev)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                            {showPassword ? (
                                <FaEyeSlash />
                            ) : (
                                <FaEye />
                            )}
                        </button>

                    </div>

                    {error && (
                        <p className="text-red-500 text-sm">
                            {error}
                        </p>
                    )}

                    {isLoading && (
                        <p className="text-blue-500 text-sm">
                            Loading...
                        </p>
                    )}

                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        Register
                    </button>

                </form>

                <div className="flex items-center my-5">
                    <div className="flex-grow border-t"></div>

                    <span className="mx-3 text-gray-500 text-sm">
                        OR
                    </span>

                    <div className="flex-grow border-t"></div>
                </div>

                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() =>
                            setError("Google Registration Failed")
                        }
                        text="signup_with"
                    />
                </div>

            </div>
        </div>
    );
}

export default Register;