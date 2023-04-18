import React, { } from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';


function PostCard(props) {
    const { post } = props;
    const navigate = useNavigate();

    const handleOnClick = () => {
        navigate('/postDetails', { state: { post_id: post.post_id } });
    }

    let imgSrc = 'https://' + process.env.REACT_APP_CLOUDFRONT_DOMAIN_NAME + '/' + post.img_url;

    return (
        <StyledPostCard>
            <div className='profile'>
                <div className='profile-img'>
                    <img src={imgSrc} alt='user'></img>
                </div>
                <div className='profile-details'>
                    <div className='name'>
                        {post.name}
                    </div>
                    <div className='obj-type'>
                        {post.item_desc}
                    </div>
                    <div className='qty'>
                        {post.qty}
                    </div>
                    <div onClick={handleOnClick} className='more-details'>
                        <p> More Details </p>
                    </div>
                </div>
            </div>
        </StyledPostCard >
    )
}

const StyledPostCard = styled.div`
    padding: 1rem;
    width: 25%;
    .profile{
        padding: 1rem;
        font-family: sans-serif;
        font-size: 15px;
        box-shadow: 1px 1px 2px 2px #ccc;
    }
    .profile-details{
        padding: 1rem;
        text-align: center;
    }
    .profile-img{
        width: 40%;
        display: block;
        margin-left: auto;
        margin-right: auto;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    .more-details{
        font-size: small;
        color: blue;
        cursor: pointer;
    }
`;

export default PostCard;