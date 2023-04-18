import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

function PostDetails() {
    const loc = useLocation();
    const [postDetails, setpostDetails] = useState('');

    useEffect(() => {
        const getpostDetails = async () => {
            const res = await axios.get("http://" + process.env.REACT_APP_BACKEND_URL + "/posts/postDetails/" + loc.state.post_id);
            setpostDetails(res.data);
        }
        getpostDetails();
    }, [loc.state.post_id]);

    if (!postDetails) {
        return <h2>Loading...</h2>
    }

    return (
        <StyledProfileDetails>
            <div className='details-wrapper'>
                <div className='detail'>
                    <p className='detail-label'>Name:</p>
                    <p className='detail-data'>{postDetails.name}</p>
                </div>
                <div className='detail'>
                    <p className='detail-label'>Email:</p>
                    <p className='detail-data'>{postDetails.owner_email}</p>
                </div>
                <div className='detail'>
                    <p className='detail-label'>Address:</p>
                    <p className='detail-data'>{postDetails.address}</p>
                </div>
                <div className='detail'>
                    <p className='detail-label'>Item:</p>
                    <p className='detail-data'>{postDetails.item_desc}</p>
                </div>
                <div className='detail'>
                    <p className='detail-label'>Units:</p>
                    <p className='detail-data'>{postDetails.qty}</p>
                </div>
                <div className='detail'>
                    <p className='detail-label'>Price:</p>
                    <p className='detail-data'>{postDetails.price}</p>
                </div>
            </div>
        </StyledProfileDetails>
    )
}

const StyledProfileDetails = styled.div`
    display:flex;
    width:40%;
    margin: 5rem auto;
    box-shadow: 1px 1px 2px 2px #ccc;
    padding: 1rem;
    .details-wrapper{
        display: flex;
        flex-direction: column;
        flex-basis: 70%;
        font-size: 15px;
        padding: 1rem;
        justify-content: space-between;
        margin: 0rem auto;
        gap: 1rem;
    }
    .detail{
        display: flex;
        flex-basis: 100%;
        justify-content: center;
        gap: 1rem;
        justify-content: space-between;
        border: 1px solid black;
        border-radius: 5px;
        box-shadow: 1px 1px 1px 1px #ccc;
        padding: 5px;
    }
`;

export default PostDetails;