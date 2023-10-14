import { Link } from 'react-router-dom';
import socialDesktop from '../assets/social-desktop.PNG';
import socialMobile from '../assets/social-mobile.PNG';
import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../src/config';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


function Signup() {

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();       // for navigating to the login page when successful signup

    const signup = (event) => {
        event.preventDefault();
        // debugger;
        // setLoading((prev) => !prev);
        setLoading(true);

        const requestData = { fullName: fullName, email, password }  // we can ignore name:name if both are same

        axios.post(`${API_BASE_URL}/signup`, requestData)
            .then((result) => {
                // debugger;
                if (result.status === 201) {
                    setLoading(false);
                    Swal.fire({
                        icon: "success",
                        title: "User registered successfully!"
                    })
                    setFullName('');
                    setEmail('');
                    setPassword('');
                    navigate('/login'); 
                }
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
                Swal.fire({
                    icon: "error",
                    title: "User not registered!"
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
                                        <div className="spinner-border text-danger" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                </div>
                                :
                                ""
                            }

                            <h4 className="card-title text-center mt-3 fw-bold logIn">Sign Up</h4>

                            <div className='w-100 d-flex justify-content-center'>
                                <form className='w-75' onSubmit={signup}>
                                    <div className="my-2">
                                        <input type="text"
                                            className="form-control inputBG rounded-1"
                                            defaultValue={'9876543210'}
                                            // required
                                            placeholder='Phone' />
                                    </div>
                                    <div className="mb-2">
                                        <input type="email"
                                            className="form-control inputBG rounded-1"
                                            placeholder='Email'
                                            value={email}
                                            required
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <input type="text"
                                            className="form-control inputBG rounded-1"
                                            placeholder='Full Name'
                                            value={fullName}
                                            required
                                            onChange={(e) => setFullName(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <input type="password"
                                            className="form-control inputBG rounded-1"
                                            placeholder='Password'
                                            value={password}
                                            required
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>

                                    <div className='text-muted mt-2 mb-3'>
                                        <input className="form-check-input" type="checkbox" /> <span className='text-muted'>Remember password</span>
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100 inputBTN rounded-1 border border-0">Sign Up</button>

                                    <div className='mt-2 mx-0 text-center d-flex justify-content-center align-items-center '>
                                        <hr className='col-4' />
                                        <h6 className='col-2 text-muted'>OR</h6>
                                        <hr className='col-4' />
                                    </div>

                                    <div className='my-2'>
                                        <Link to="/login">
                                            <button className="w-100 rounded-1 border border-1 signup-link btn btn-light">
                                                <span>Already have an account? </span>
                                                <span className='text-primary fw-bold'>Log In</span>
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
    )
}

export default Signup;