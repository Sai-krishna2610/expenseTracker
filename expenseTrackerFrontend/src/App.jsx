
import './App.css'
// import { useEffect } from 'react'
// import axios from 'axios';
import { Route,Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import AddExpense from './components/AddExpense.jsx';
import Transactions from './components/Transactions.jsx';
import Analytics from './components/Analytics.jsx';
import Profile from './pages/Profile.jsx';

function App() {
  // useEffect(() => {
  //   axios.get("http://localhost:8000")
  //     .then(res =>
  //       {
  //         console.log(res);
  //         console.log(res.data);
  //       })
  //     .catch(err => console.log(err))
  // }, [])


  return (
    <>
      <Navbar/>
      <div className='p-4'>
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/login' element={<Login/>}/>
            
            {/* PROTECTED ROUTE */}
            <Route path='/dashboard' element={ <PrivateRoute>
                                                <Dashboard/>
                                                {/* <AddExpense/>
                                                <Transactions/>
                                                <Analytics/>
                                                <Profile/> */}
                                            </PrivateRoute>
                                        }
            />
            <Route
              path="/add-expense"
              element={
                <PrivateRoute>
                  <AddExpense />
                </PrivateRoute>
              }
            />

            <Route
              path="/transactions"
              element={
                <PrivateRoute>
                  <Transactions />
                </PrivateRoute>
              }
            />

            <Route
              path="/analytics"
              element={
                <PrivateRoute>
                  <Analytics />
                </PrivateRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
    </>
  )
}

export default App
