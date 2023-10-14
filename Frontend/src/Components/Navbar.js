import logo from '../assets/logo.PNG';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';        // use to add/pass/store data to the store or userReducer


const Navbar = () => {

    const dispatch = useDispatch();           // initial dispatch
    const navigate = useNavigate();       // used to, go to "/login" when logged out

    // checking if user's data is available in redux store / userReducer
    const user = useSelector(state => state.userReducer.user)   // getting/accessing (users) data (inside userReducer) from redux store (logged in)
    // console.log(user.email + "From Nabvar");
    
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: "LOGOUT" });              // for removing the token and the user from the redux store and userReducer.js
        // above object inside dispatch "type" is like case:"LOGIN_ERROR"
        // debugger;
        navigate('/login');
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg p-0 position-fixed start-0 top-0 w-100 z-3 bg-white">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        <img src={logo} alt="logo" style={{ height: "4rem" }} />
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link" aria-current="page" to="/login">Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/signup">SignUp</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/posts">Posts</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/contact">Contact</Link>
                            </li>
                            {/* <li className="nav-item">
                                <Link className="nav-link" to="/profile">Profile</Link>
                            </li> */}


                        </ul>
                        <form className="d-flex w-50" role="search">
                            <input className="form-control me-2 w-100" type="search" placeholder="Search" aria-label="Search" />
                            {/* <button className="btn btn-outline-success me-3" type="submit">Search</button> */}

                        </form>
                        <div className="p-1 my-2 me-5 d-flex align-items-center">
                            <Link to="/posts"><i className="fa-solid fa-house fs-4 text-dark me-3"></i></Link>
                            
                            
                            {user._id ? 
                            <div className="dropdown d-flex align-items-center">
                            <i className="fa-regular fa-heart fs-4 text-dark me-3"></i>
                                <div className="btn d-flex align-items-center justify-content-center" data-bs-toggle="dropdown" style={{ borderRadius: "50%", border: "none" }}>
                                    {/* <i className="fa-solid fa-circle fs-3 text-dark"></i> */}
                                    <img src="https://wellgroomedgentleman.com/media/images/Tony_Stark_Beard_with_Quiff_Hairstyle.width-800.jpg" alt="profile-pic" className="img-fluid" style={{ height: "40px", borderRadius: "50px" }} />
                                        <h6 className="ms-2">{user.fullName}</h6>
                                </div>
                                    
                                    


                                <ul className="dropdown-menu">
                                    <li>
                                        <Link className="dropdown-item mt-0" to="/profile">My Profile</Link>
                                    </li>
                                    <li>
                                        <a className="dropdown-item btn btn-danger" onClick={logout}>
                                            Logout
                                        </a>
                                    </li>
                                </ul>
                                    {/* <button className="btn btn-danger me-2" onClick={logout}>
                                        Logout
                                    </button> */}
                                
                            </div>
                            : ''}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;