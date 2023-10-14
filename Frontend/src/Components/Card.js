import React, { useState } from 'react'
import './Card.css'
import moreAction from '../assets/more-action.PNG'
// now checking for users data in store 👇
import { useSelector } from 'react-redux';   // use to add/pass/store data to the store or userReducer
import axios from 'axios';
import { API_BASE_URL } from '../../src/config';
import { useNavigate } from 'react-router-dom';    // if user not logged in and trying to like or unlike post navigate to "/login"

const Card = (props) => {

    const [commentBox, setCommentBox] = useState(false);
    const [comment, setComment] = useState('');

    const [style, setStyle] = useState({
        color: "blue",
    });

    const navigate = useNavigate();       // used to, go to "/login" when logged out



    const CONFIG_OBJECT = {        // this will be passed to the post api ( like ) and will go inside header tab and add this info to the header key and value fields
        headers: {
            "Content-Type": "application/json",       // key : value  --- inside header
            "Authorization": "Bearer " + localStorage.getItem("token")   // key : value inside authorization key // the token inside localStorage.getItem("token") inside browser send with the request
            // go to application tab in browser and select localstorage inside storage section then select http://localhost:3000   --- this will show 'token' value in key:value pair
        }
    }

    // checking if user's data is available in redux store / userReducer
    const user = useSelector(state => state.userReducer.user)   // getting/accessing (users) data (inside userReducer) from redux store (logged in)
    // console.log(user + "     --  data of logged in user inside redux store");
    // console.log(user._id + "     --  ID of logged in user inside redux store");
    // console.log(props.postData.author._id + "     --   Author ID of post creator!");
    // const localuser = JSON.parse(localStorage.getItem('user'));
    // const data = localuser.email;
    // console.log(data + "      -- data of user inside localStorage");

    const likeUnlikePost = async (postId, type) => {   // same request to like and unlike post
        // type and postId will be passed from function call (below)
        // console.log(props.postData.likes[0]);
        console.log(postId);
        console.log(typeof(postId));
        // const isInArray = props.postData.likes.includes(`${postId}`);
        const names = props.postData.likes;
        const id = names.find(item => item == postId);

        console.log(names);
        console.log(id);

        // if (isInArray) {
        //     console.log("yes it include this ID");
        // }
        // else {
        //     console.log("not include this ID");
        // }

        const request = { "postId": postId };
        const response = await axios.put(`${API_BASE_URL}/${type}`, request, CONFIG_OBJECT);
        if (response.status === 200) {
            props.getAllPosts();
            // setStyle({
            //     color: style.color === "blue" ? "red" : "blue",
            //     visibility: "hidden",
            // });
        }
        else {
            
        }
    }

    const submitComment = async (postId) => {
        const request = { "postId": postId, "commentText": comment };
        const response = await axios.put(`${API_BASE_URL}/comment`, request, CONFIG_OBJECT);
        if (response.status === 200) {
            props.getAllPosts();
            setCommentBox(false);
        }
        // console.log(comment);
    }

    return (
        <div >
            <div className="card shadow-sm">
                <div className="card-body px-2">
                    <div className='row d-flex justify-content-between align-items-center'>
                        <div className='col-10 d-flex'>
                            <img className='p-2 post-profile-pic' alt="profile pic" src={props.postData.author.profileImg} />
                            <div className='mt-2'>
                                <p className='fs-6 fw-bold'>{props.postData.author.fullName}</p>
                                <p className='location'>{props.postData.description}</p>
                            </div>
                        </div>
                        {props.postData.author._id === user._id ?
                            <div className='col-2'>
                                <i onClick={() => props.deletePost(props.postData._id)} style={{ cursor: "pointer" }}  className="ps-2 fs-3 fa-solid fa-trash-arrow-up text-danger"></i>
                            </div>
                            : ""
                        }

                    </div>
                    <div className='row'>
                        <div className='col-12'>
                            <img style={{ borderRadius: '15px' }} className='p-2 img-fluid' alt={props.postData.description} src={props.postData.image} />
                        </div>
                    </div>
                    <div className='row my-3'>
                        <div className='col-6 d-flex'>
                            <i onClick={() => likeUnlikePost(props.postData._id, 'like')} style={style} className="ps-2 fs-4 fa-regular fa-thumbs-up"></i>
                            <sup className='fw-bold' style={{ color: 'darkorange' }}>{props.postData.likes.length}</sup>

                            <i onClick={() => likeUnlikePost(props.postData._id, 'unlike')} className="ps-3 fs-4  fa-regular fa-thumbs-down"></i>

                            <i onClick={() => setCommentBox(true)} style={{ color: 'darkorange' }} className="ps-3 fs-4 fa-regular fa-comment"></i>
                            <sup className='fw-bold' style={{ color: 'darkorange' }}>{props.postData.comments.length}</sup>

                        </div>
                        <div className='col-6'>
                            <span className='pe-2 fs-6 fw-bold float-end'>{props.postData.likes.length} 💖</span>
                        </div>
                    </div>

                    {commentBox && user._id ?
                        <div className='row mb-2'>
                            <div className='col-12 d-flex justify-content-around align-items-center gap'>
                                <textarea onChange={(e) => setComment(e.target.value)} className='form-control'></textarea>
                                <b onClick={() => submitComment(props.postData._id)} style={{ color: 'darkorange', cursor: 'pointer' }}><i class="ps-2 fs-4 fa-regular fa-paper-plane"></i></b>
                            </div>
                        </div>
                        : ''}
                    
                    <div className={props.postData.comments.length === 0 ? '' : 'card p-2'}>
                        <h6 className={props.postData.comments.length === 0 ? 'd-none' : 'text-center my-2'}>Comments</h6>
                        {props.postData.comments.map((comment) => {
                            return (
                                <div className='row m-1'>
                                    <div className='col-12 d-flex justify-content-between'>
                                        <p><img style={{ height: '1.5rem', width: '1.5rem', borderRadius: '30px', border:'2px solid lightblue' }} src={comment.commentedBy.profileImg} alt="commented by.." /> <b style={{ fontSize: '11px', fontFamily:'Poppins' }}>{comment.commentedBy.fullName}</b></p>
                                        <code style={{ fontSize: '11px', maxWidth:"50%", fontFamily:'Poppins'}}>{comment.commentText}</code>
                                    </div>
                                </div>
                            )
                        })}
                    </div>



                    <div className='row'>
                        <div className='col-12 d-flex justify-content-between'>
                            <span className='p-2 text-muted'>2 Hours Ago</span>
                            <span className='p-2 text-muted float-right'>{props.postData.location}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Card