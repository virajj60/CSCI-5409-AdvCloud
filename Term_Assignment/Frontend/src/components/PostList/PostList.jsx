import axios from 'axios';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import PostCard from '../PostCard/PostCard';
import { IoIosCreate, IoIosLogOut } from "react-icons/io";
import { useNavigate } from 'react-router-dom';


function PostList() {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        try {
            axios.get("http://" + process.env.REACT_APP_BACKEND_URL + "/posts")
                .then(res => {
                    setPosts(res.data);
                    setFilteredPosts(res.data);
                })
        } catch (error) {
            console.log(error);
        }
    }, []);

    const handleInputChange = (e) => {
        const results = posts.filter(post => {
            if (e.target.value === '') {
                return post;
            } else {
                return post.item_desc.toLowerCase().includes(e.target.value.toLowerCase());
            }
        });
        setQuery(e.target.value);
        setFilteredPosts(results);
    }

    const handleOnClick = (e) => {
        e.preventDefault();
        navigate('/addPost');
    }

    const handleLogOut = (e) => {
        e.preventDefault();
        window.localStorage.removeItem('email');
        navigate('/');
    }

    return (
        <>
            <StyledForm className='form'>
                <div className='input-wrapper'>
                    <div className='create-post' onClick={(e) => handleOnClick(e)}>
                        <IoIosCreate />
                        Create Post
                    </div>
                    <div className='search-box'>
                        <label>Search</label>
                        <input type='search' onChange={(e) => handleInputChange(e)} value={query} />
                    </div>
                    <div className='logout' onClick={(e) => handleLogOut(e)}>
                        <IoIosLogOut />
                        Logout
                    </div>
                </div>
            </StyledForm>
            <StyledPostList>
                {
                    filteredPosts.map(post => {
                        return <PostCard post={post} key={post.owner_email} />
                    })
                }
            </StyledPostList>
        </>
    );

}

const StyledForm = styled.form`
    display: flex;
    margin: 2rem auto;
    justify-content: center;
    .input-wrapper{
        display: flex;
        gap: 1rem;
        font-size: 1rem;
        width: 70%;
        justify-content: space-between;
        align-items: center;
        input {
         width: 60%;
         padding: 1rem;
         outline: none;
         border: none;
         box-shadow: 1px 1px 1px 1px #ccc;
         border-radius: 5px;
        }
        .search-box{
            width: 70%;
            justify-items: center;
        }
        .create-post{
            cursor: pointer;
        }
        label{
            padding: 0.5rem;
        }
    }
`;

const StyledPostList = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 80%;
    margin: auto;
    box-shadow: 1px 1px 2px 2px #ccc;
    padding: 1rem;
    gap: 2rem; 
    justify-content: space-evenly;
`;

export default PostList;

