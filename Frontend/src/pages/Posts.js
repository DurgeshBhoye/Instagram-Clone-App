import React, { useEffect, useState } from 'react';
import Card from '../Components/Card';
import axios from 'axios';
import { API_BASE_URL } from '../../src/config';
import Swal from 'sweetalert2';

function Posts() {

    const [allPosts, setAllPosts] = useState([]);

    const CONFIG_OBJECT = {        // this will be passed to the post api ( like ) and will go inside header tab and add this info to the header key and value fields
        headers: {
            "Content-Type": "application/json",       // key : value  --- inside header
            "Authorization": "Bearer " + localStorage.getItem("token")   // key : value inside authorization key // the token inside localStorage.getItem("token") inside browser send with the request
            // go to application tab in browser and select localstorage inside storage section then select http://localhost:3000   --- this will show 'token' value in key:value pair
        }
    }

    const getAllPosts = async () => {
        // console.log("All Posts");
        const response = await axios.get(`${API_BASE_URL}/allposts`);
        // debugger;
        if (response.status === 200) {
            setAllPosts(response.data.posts)
        }
        else {
            Swal.fire({
                icon: "error",
                title: `Some error occured while getting posts`
                // title: `${error.response.data.error}`
            })
        }
    }

    const deletePost = async (postId) => {
        const response = await axios.delete(`${API_BASE_URL}/deletepost/${postId}`, CONFIG_OBJECT);
        if (response.status === 200) {
            getAllPosts();
        }
    }

    useEffect(() => {
        getAllPosts();
    }, []);



    return (
        <div className='m-3 p-4'>
            <div className='pt-5 row h-100 row'>
                {allPosts.map((post) => {
                    return (
                        <div key={post._id} className='col-4 mt-3 col-12 col-md-6 col-lg-4'>
                            <Card postData={post} deletePost={deletePost} getAllPosts={getAllPosts} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Posts