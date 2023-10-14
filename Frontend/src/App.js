import './App.css';
import Login from './pages/Login';
import Contact from './pages/Contact';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Signup from './pages/Signup';
import Posts from './pages/Posts';
import Profile from './pages/Profile';

import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

function App() {


  // this is for when user not logged in don't show another routes content
  function DynamicComponent() {
    const dispatch = useDispatch();           // initial dispatch
    const navigate = useNavigate();       // used to, go to "/login" when logged out

    // checking if user's data is available in redux store / userReducer
    const user = useSelector(state => state.userReducer.user)

    useEffect(() => {

      const userData = JSON.parse(localStorage.getItem('user'));
      if (userData) {   // when user has a logged in active session
        dispatch({ type: "LOGIN_SUCCESS", payload: userData });
        navigate('/posts');
      }
      else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: "LOGOUT" });              // for removing the token and the user from the redux store and userReducer.js
        // above object inside dispatch "type" is like case:"LOGIN_ERROR"
        navigate('/login');
      }


    }, []);

    return (
      <Routes>
        <Route exact path='/' element={<Posts />} />      {/* exact - path should be exactly what is it. */}
        <Route exact path='/login' element={<Login />} />
        <Route path='/contact' element={<Contact />} />
        <Route exact path='/signup' element={<Signup />} />
        <Route exact path='/posts' element={<Posts />} />
        <Route exact path='/profile' element={<Profile />} />
      </Routes>
    )
  }



  return (
    <div className='App'>

      {/* <Contact /> */}

      <BrowserRouter>
        <Navbar />
        {/* <Login /> */}
        <DynamicComponent/>
      </BrowserRouter>
    </div>
  );
}

export default App; 
