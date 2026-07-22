
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

    return(
        <nav className="bg-blue-600 text-white px-4 py-3 flex flex-col md:flex-row md:justify-between md:items-center">
            {/* Logo */}
            <Link to='/'className="text-xl font-bold">
                Expense Tracker
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
                        {location.pathname !== '/login' && <Link to="/login" className="hover:underline">Login</Link>}
                        {location.pathname !== '/register' && <Link to="/register" className="hover:underline">Register</Link>}
                    </>
                )}
            </div>
        </nav>
    )
}
export default Navbar;