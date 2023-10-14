import socialDesktop from '../assets/social-desktop.PNG';
import socialMobile from '../assets/social-mobile.PNG';
import './Login.css';
import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../src/config';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch} from 'react-redux';        // use to add/pass/store data to the store or userReducer



const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();           // initial dispatch

    const navigate = useNavigate();

    const login = (event) => {
        event.preventDefault();
        // debugger;
        // setLoading((prev) => !prev);
        setLoading(true);

        const requestData = { email, password }  // we can ignore name:name if both are same

        axios.post(`${API_BASE_URL}/auth/login`, requestData)      // requestData = data to be sent to the server
            .then((response) => {
                // console.log(response.data.result.message);
                // console.log(response.data.result.token);
                // console.log(response.data.result.user);
                // debugger;
                if (response.status === 200) {
                    setLoading(false);
                    localStorage.setItem('token', response.data.result.token);   // storing token to localStorage
                    localStorage.setItem('user', JSON.stringify(response.data.result.user));  // to localStorage
                    dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.result.user, })  // passing/adding data to userReducer inside case: "LOGIN_SUCCESS"
                    console.log(response.data.result.user);

                    // after completion of above conditions go to below page
                    navigate('/profile');   // navigate to the "/profile" (the profile page created/added in App.js)
                    
                    // Swal.fire({
                    //     icon: "success",
                    //     title: `${response.data.result.message}`
                    // })
                    // setEmail('');
                    // setPassword('');
                }
            })
            .catch((error) => {
                // console.log(error.response.data.error);
                setLoading(false);
                Swal.fire({
                    icon: "error",
                    title: `${error.response.data.error}`
                })
            })
    }

    return (
        <div className="container p-5 mt-5">
            <div className="row">
                <div className="col-md-7 social-desktop p-3 d-flex d-lg-block align-items-center justify-content-center">
                    <img src={socialDesktop} alt="Social Desktop" className='d-none d-md-block' />
                    <img src={socialMobile} alt="Social Mobile" className='d-md-none' />
                </div>
                <div className="col-md-5 p-2">
                    <div className="card shadow-sm rounded-1 bg-light">
                        <div className="card-body">

                            {loading ?
                                <div className="row text-center">
                                    <div className="col-md-12">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                </div>
                                :
                                ''
                            }

                            <h4 className="card-title text-center mt-3 fw-bold logIn">Log In</h4>

                            <div className='w-100 d-flex justify-content-center'>
                                <form className='w-75' onSubmit={login}>
                                    <div className="my-3">
                                        <input type="email"
                                            className="form-control inputBG rounded-1"
                                            placeholder='Phone number, username or email' 
                                            // value={email}
                                            defaultValue={'jane@gmail.com'}
                                            onChange={(e) => setEmail(e.target.value)}
                                            />
                                    </div>
                                    <div className="mb-3">
                                        <input type="password"
                                            className="form-control inputBG rounded-1"
                                            placeholder='Password' 
                                            // value={password}
                                            defaultValue={'foster'}
                                            onChange={(e) => setPassword(e.target.value)}
                                            />
                                    </div>
                                    {/* <div className="mb-3"> */}
                                    <button type="submit" className="btn btn-primary w-100 inputBTN rounded-1 border border-0">Log In</button>
                                    {/* </div> */}

                                    <div className='mt-3 mx-0 text-center d-flex justify-content-center align-items-center '>
                                        <hr className='col-4' />
                                        <h6 className='col-2 text-muted'>OR</h6>
                                        <hr className='col-4' />
                                    </div>

                                    <div className='my-3'>
                                        <Link to="/signup">
                                            <button className="w-100 rounded-1 border border-1 signup-link btn btn-light">
                                                <span>Don't have an account? </span>
                                                <span className='text-primary fw-bold'>SignUp</span>
                                            </button>
                                        </Link>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;



// {/* <button className="btn btn-primary">Login</button> */}