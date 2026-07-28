
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
function Navbar()
{
    const location = useLocation();
    console.log(location.pathname, " Page");
    const navigate = useNavigate();
    const {token,logout} = useAuth();

    const handleLogout = () => {
        logout(); //call context logout;
        navigate('/login');
    };

    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    return(
        <nav className={isAuthPage ? "relative z-20 bg-[#0B0F19]/85 backdrop-blur-xl border-b border-slate-800/80 text-slate-100 px-4 py-3 flex flex-col md:flex-row md:justify-between md:items-center transition-all duration-300" : "bg-blue-600 text-white px-4 py-3 flex flex-col md:flex-row md:justify-between md:items-center"}>
            {/* Logo */}
            <Link to='/' className={isAuthPage ? "text-lg font-semibold tracking-wider text-white hover:text-emerald-400 transition-colors" : "text-xl font-bold"}>
                EXPENSE TRACKER
            </Link>

            {/* Links */}
            <div className="space-x-4">
                {token ? (
                    <>
                        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                        <Link to="/add-expense" className="hover:underline">Add Expense</Link>
                        <Link to="/transactions" className="hover:underline">Transactions</Link>
                        <Link to="/analytics" className="hover:underline">Analytics</Link>
                        <Link to="/profile" className="hover:underline">Profile</Link>
                        <span> Welcome User</span>
                        <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        {location.pathname !== '/login' && (
                            <Link to="/login" className={isAuthPage ? "text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-emerald-400 transition-colors" : "hover:underline"}>
                                Login
                            </Link>
                        )}
                        {location.pathname !== '/register' && (
                            <Link to="/register" className={isAuthPage ? "text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-emerald-400 transition-colors" : "hover:underline"}>
                                Register
                            </Link>
                        )}
                    </>
                )}
            </div>
        </nav>
    )
}
export default Navbar;