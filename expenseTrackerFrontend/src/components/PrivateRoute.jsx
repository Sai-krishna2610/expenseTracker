import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
function PrivateRoute({children})
{
    const {token} =useAuth();//Destructuring the useAuth
    // const token=null;
    if(!token)
    {
        //not logged in -> go to login page
        console.log("Token not there");
        return <Navigate to='/login'/>
    }
    console.log('Token present');
    //logged in -> show page
    return children;
}
export default PrivateRoute;