import React, { useEffect, useState } from 'react'
import './Profile.css'
import Modal from 'react-bootstrap/Modal';
import horizontalMoreAction from '../assets/horizontalMoreAction.PNG'
import '../Components/Card.css'
import axios from 'axios';
import { API_BASE_URL } from '../../src/config';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Profile = () => {

  const navigate = useNavigate();       // used to, go to "/posts" when added a post

  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState({ preview: '', data: '' });    // for profile images

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const [showPost, setShowPost] = useState(false);

  const handlePostClose = () => setShowPost(false);
  const handlePostShow = () => setShowPost(true);

  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");

  const [allMyPosts, setAllMyPosts] = useState([]);

  const user = useSelector(state => state.userReducer.user)   // getting/accessing (users) data (inside userReducer) from redux store (logged in)

  const [postDetail, setPostDetail] = useState({});

  const CONFIG_OBJECT = {        // this will be passed to the post api ( like ) and will go inside header tab and add this info to the header key and value fields
    headers: {
      "Content-Type": "application/json",       // key : value  --- inside header
      "Authorization": "Bearer " + localStorage.getItem("token")   // key : value inside authorization key // the token inside localStorage.getItem("token") inside browser send with the request
      // go to application tab in browser and select localstorage inside storage section then select http://localhost:3000   --- this will show 'token' value in key:value pair
    }
  }

  const handleFileSelect = (e) => {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0]
    }
    setImage(img);
  }

  const handleImgUpload = async (e) => {
    const formData = new FormData();
    formData.append('file', image.data);

    const response = axios.post(`${API_BASE_URL}/uploadFile`, formData) // ,CONFIG_OBJECT can be added next
    return response;
  }

  const addPost = async () => {
    // creating a validation if image is present or not
    if (image.preview === '') {
      Swal.fire({
        icon: "error",
        title: `Post image is mandatory!`
      })
    }
    else if (caption === '') {
      Swal.fire({
        icon: "error",
        title: `Post caption is mandatory!`
      })
    }
    else if (location === '') {
      Swal.fire({
        icon: "error",
        title: `Post location is mandatory!`
      })
    }
    else {
      setLoading(true);
      const imgRes = await handleImgUpload();
      // add validation rule for caption and location
      const request = {
        description: caption,
        location: location,
        image: `${API_BASE_URL}/files/${imgRes.data.fileName}`
      }
      // write api call to create post
      const postResponse = await axios.post(`${API_BASE_URL}/createpost`, request, CONFIG_OBJECT)   // here request means above object of content/attributes to be passed in the post method

      if (postResponse.status === 201) {
        setLoading(false);
        Swal.fire({
          icon: "success",
          title: `Post added successfully!`
        })
        navigate("/posts");              // if post added successfully navigate to "/posts"
      }
      else {
        Swal.fire({
          icon: "error",
          title: `Some error occured while adding post!`
        })
      }
    }
  }

  const getMyPosts = async () => {
    // console.log("All Posts");
    const response = await axios.get(`${API_BASE_URL}/myallposts`, CONFIG_OBJECT);
    // debugger;
    if (response.status === 200) {
      setAllMyPosts(response.data.posts)
    }
    else {
      Swal.fire({
        icon: "error",
        title: `Some error occured while getting "your" posts`
        // title: `${error.response.data.error}`
      })
    }
  }

  useEffect(() => {
    getMyPosts();
  }, []);

  const showDetail = (post) => { 
    setPostDetail(post);
  }

  const deletePost = async (postId) => {
        const response = await axios.delete(`${API_BASE_URL}/deletepost/${postId}`, CONFIG_OBJECT);
        if (response.status === 200) {
          getMyPosts();
          setShow(false);
        }
    }

  return (
    <div className='container shadow p-4 margin-profile'>
      <div className='row'>
        <div className='col-md-6 d-flex flex-column'>
          <img className='p-2 profile-pic img-fluid' alt="profile pic" src="https://wellgroomedgentleman.com/media/images/Tony_Stark_Beard_with_Quiff_Hairstyle.width-800.jpg" />
          <p className='ms-3 fs-5 fw-bold'>{user.email}</p>
          <p className='ms-3 fs-5'>{user.fullName}</p>
          {/* <p className='ms-3 fs-5'>Follow { user.email }</p> */}
          <p className='ms-3 fs-5'>Follow <a href="www.google.com"> {user.email}</a></p>
        </div>
        <div className='col-md-6 d-flex flex-column justify-content-between mt-3'>
          <div className='d-flex justify-content-equal mx-auto'>
            <div className="count-section pe-4 pe-md-5 text-center fw-bold">
              <h4>{allMyPosts.length}</h4>
              <p>Posts</p>
            </div>
            <div className='count-section px-4 px-md-5 text-center fw-bold'>
              <h4>20</h4>
              <p>Followers</p>
            </div>
            <div className='ps-md-5 ps-4 text-center fw-bold'>
              <h4>20</h4>
              <p>Following</p>
            </div>
          </div>
          <div className='mx-auto mt-md-0 mt-4'>
            <button className="custom-btn custom-btn-white me-md-3">
              <span className='fs-6'>Edit Profile</span>
            </button>
            <button className="custom-btn custom-btn-white" onClick={handlePostShow}>
              <span className='fs-6'>Upload Post</span>
            </button>
          </div>
        </div>
      </div>
      <div className='row my-3'>
        <div className='col-12'>
          <hr />
        </div>
      </div>

      <div className='row mb-4'>

        {allMyPosts.map((post) => {
          return (
            <div className='col-md-4 col-sm-12'key={post._id}>
              <div className="card" onClick={handleShow}>
                <img onClick={()=>showDetail(post)} src={post.image} className="card-img-top" alt={post.description} />
              </div>
            </div>
          )
        })}

      </div>


      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <div className='row'>
            <div className='col-md-6'>
              <div >
                <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="true">
                  <div className="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                  </div>
                  <div className="carousel-inner">
                    <div className="carousel-item active">
                      <img src={postDetail.image} className="d-block w-100" alt="..." />
                    </div>
                    <div className="carousel-item">
                      <img src="https://images.unsplash.com/photo-1664574653790-cee0e10a4242?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" className="d-block w-100" alt="..." />
                    </div>
                    <div className="carousel-item">
                      <img src="https://images.unsplash.com/photo-1670396118274-4f14fdd6323d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyMHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60" className="d-block w-100" alt="..." />
                    </div>
                  </div>
                  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              </div>
            </div>
            <div className='col-md-6'>
              <div className='row'>
                <div className='col-6 d-flex'>
                
                  <img className='p-2 post-profile-pic' alt="profile pic" src="https://images.unsplash.com/photo-1445543949571-ffc3e0e2f55e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8d2ludGVyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60" />
                  <div className='mt-2 ms-2'>
                    <p className='fs-6 fw-bold'>{postDetail.location}</p>
                    <p className='location'>{postDetail.description}</p>
                  </div>

                  <div className="dropdown ms-5">
                    <a className="btn" href="www.google.com" role="button" data-bs-toggle="dropdown">
                      <img alt="more action" src={horizontalMoreAction} />
                    </a>

                    <ul className="dropdown-menu">
                      <li><a className="dropdown-item" href="www.google.com">
                        <i className="fa-regular fa-pen-to-square px-2"></i>
                        Edit Post
                      </a></li>
                      <li>
                        <a className="dropdown-item" onClick={()=> deletePost(postDetail._id)}>
                          <i className="fa-sharp fa-solid fa-trash px-2"></i>Delete Post
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-12'>
                  <span className='p-2 text-muted'>2 Hours Ago</span>
                </div>
              </div>
              <div className='row mt-2'>
                <div className='col-12 ms-2'>
                  <p>{postDetail.description}</p>
                </div>
              </div>
              <div className='row my-3'>
                <div className='col-6 d-flex'>
                  <i className="ps-2 fs-4 fa-regular fa-heart"></i>
                  <i className="ps-3 fs-4 fa-regular fa-comment"></i>
                  <i className="ps-3 fs-4 fa-solid fa-location-arrow"></i>
                </div>
                <div className='col-12 mt-3 ms-2'>
                  <span className='fs-6 fw-bold'>200 likes</span>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showPost} onHide={handlePostClose} size="lg" centered>
        <Modal.Header closeButton>
          <span className='fw-bold fs-5'>Upload Post</span>
        </Modal.Header>
        <Modal.Body>
          {loading ?
            <div className="row d-flex justify-content-center align-items-center text-center">
              <div className="col-md-12">
                <div className="spinner-grow spinner-grow1 text-primary align-middle" style={{ width: "1.5rem", height: "1.5rem" }} role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <div className="spinner-grow spinner-grow2 text-primary  align-middle" style={{ width: "1.3rem", height: "1.3rem" }} role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <div className="spinner-grow spinner-grow3 text-primary align-middle" style={{ width: "1.1rem", height: "1.1rem" }} role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <div className="spinner-grow spinner-grow4 text-primary align-middle" style={{ width: "0.9rem", height: "0.9rem" }} role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <div className="spinner-grow spinner-grow5 text-primary align-middle" style={{ width: "0.7rem", height: "0.7rem" }} role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
            :


            <div className='row'>
              <div className='col-md-6 col-sm-12 mb-3'>
                <div className='upload-box'>
                  <div className="dropZoneContainer">
                    <input name='file' type="file" id="drop_zone" className="FileUpload bg-warning" accept=".jpg,.png,.gif, text/*" onChange={handleFileSelect} />
                    {/* <div className="dropZoneOverlay">
                    {image.preview && <img src={image.preview} width='100%' height='100%' className='img-fluid' />}
                    <i className="fa-solid fa-cloud-arrow-up fs-1"></i><br />
                    Upload Photo From Computer
                  </div> */}
                    <div className="dropZoneOverlay">
                      {image.preview && (
                        <img src={image.preview} width='100%' height='100%' className='img-fluid' />
                      )}
                      {!image.preview && (
                        <div>
                          <i className="fa-solid fa-cloud-arrow-up fs-1"></i>
                          <p>Upload Photo From Computer</p>
                        </div>
                      )}
                      {/* <br /> */}
                      {/* Upload Photo From Computer */}
                    </div>

                  </div>
                </div>
              </div>
              <div className='col-md-6 col-sm-12 d-flex flex-column justify-content-between'>
                <div className='row'>
                  <div className='col-sm-12 mb-3'>
                    <div className="form-floating">
                      <textarea onChange={(e) => setCaption(e.target.value)} className="form-control" placeholder="Add Caption" id="floatingTextarea"></textarea>
                      <label htmlFor="floatingTextarea">Add Caption</label>
                    </div>
                  </div>
                  <div className='col-sm-12'>
                    <div className="form-floating mb-3">
                      <input type="text" onChange={(e) => setLocation(e.target.value)} className="form-control" id="floatingInput" placeholder="Add Location" />
                      <label htmlFor="floatingInput"><i className="fa-solid fa-location-pin pe-2"></i>Add Location</label>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-sm-12'>
                    <button className="custom-btn custom-btn-pink float-end" onClick={addPost}>
                      <span className='fs-6 fw-600'>Post</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          }

        </Modal.Body>
      </Modal>
    </div>
  )
}

export default Profile