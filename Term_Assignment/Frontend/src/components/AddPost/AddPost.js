import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
// import login_img from "../../assets/login.jpg";
import AddPostModal from '../AddPostModal/AddPostModal';

function AddPost() {

    const [item_desc, setObjectType] = useState('');
    const [qty, setQuantity] = useState();
    const [price, setPrice] = useState();
    const [address, setAddress] = useState('');
    const [image, setImage] = useState(null);

    const [item_desc_error, setObjectTypeError] = useState('');
    const [qty_error, setQuantityError] = useState('');
    const [priceError, setPriceError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [blankFromError, setBlankFormError] = useState('');

    const [disabled, setDisabled] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if ('item_desc' === name) {
            setObjectType(value);
        } else if ('qty' === name) {
            setQuantity(value);
        } else if ('address' === name) {
            setAddress(value);
        } else if ('price' === name) {
            setPrice(value);
        } else if ('image' === name) {
            setImage(e.target.files[0]);
        }
    }

    const handleInputValidation = async e => {
        const { name, value } = e.target;
        if ('item_desc' === name) {
            if (!value) {
                setObjectTypeError("Enter item description");
                setDisabled(true);
            } else {
                setObjectTypeError('');
                setDisabled(false);
            }
        } else if ('qty' === name) {
            if (!NaN(parseInt(value, 10))) {
                setQuantityError('Enter quantity');
                setDisabled(true);
            } else {
                setQuantityError('');
                setDisabled(false);
            }
        } else if ('address' === name) {
            if (!value) {
                setAddressError('Enter an address');
                setDisabled(true);
            } else {
                setAddressError('');
                setDisabled(false);
            }
        } else if ('price' === name) {
            if (!NaN(parseFloat(value))) {
                setPriceError('Enter the price');
                setDisabled(true);
            } else {
                setPriceError('');
                setDisabled(false);
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        handleInputValidation(e);
        if (qty_error || item_desc_error) {
            setBlankFormError('Enter mandatory fields');
        } else {
            const formData = new FormData();
            formData.append('owner_email', window.localStorage.getItem('email'));
            formData.append('item_desc', item_desc);
            formData.append('qty', qty);
            formData.append('price', price);
            formData.append('address', address);
            formData.append('image', image);

            const response = await fetch("http://" + process.env.REACT_APP_BACKEND_URL + "/posts/addPost", {
                method: "POST",
                body: formData,
            });

            try {
                if (response.status === 200) {
                    setBlankFormError('');
                    setObjectTypeError('');
                    setQuantityError('');
                    setShowModal(true);
                }
            } catch (error) {
                console.error(error);
                setBlankFormError('Unable to create post')
            }
        }
    }

    const handleModalClose = e => {
        setShowModal(false);
        navigate('/posts');
    }

    return (
        <StyledSignupImgWrapper className="login-img-wrapper">
            <StyledForm className='form'>
                <div className='formContent'>
                    <div className='formTitle'>
                        <h3>Create Post</h3>
                    </div>

                    <div className='inputWrapper'>
                        <label className='formLabel'>Item Description*</label>
                        <input className='formInput' type='text' name='item_desc' value={item_desc} onChange={(e) => handleInputChange(e)} onBlur={handleInputValidation} placeholder='Item type' />
                    </div>
                    <div className='err'>
                        {<span className='err'>{item_desc_error}</span>}
                    </div>

                    <div className='inputWrapper'>
                        <label className='formLabel'>Quantity*</label>
                        <input className='formInput' type='number' min='0' name='qty' value={qty} onChange={(e) => handleInputChange(e)} onBlur={handleInputValidation} placeholder='Quantity' />
                    </div>
                    <div className='err'>
                        {<span className='err'>{qty_error}</span>}
                    </div>

                    <div className='inputWrapper'>
                        <label className='formLabel'>Price*</label>
                        <input className='formInput' type='number' min='0' step='any' name='price' value={price} onChange={(e) => handleInputChange(e)} onBlur={handleInputValidation} placeholder='Price($CAD)' />
                    </div>
                    <div className='err'>
                        {<span className='err'>{priceError}</span>}
                    </div>


                    <div className='inputWrapper'>
                        <label className='formLabel'>Address*</label>
                        <input className='formInput' type='text' name='address' value={address} onChange={(e) => handleInputChange(e)} onBlur={handleInputValidation} placeholder='Address'></input>
                    </div>
                    <div className='err'>
                        {<span className='err'>{addressError}</span>}
                    </div>

                    <div className='inputWrapper'>
                        <label className='formLabel'>Image</label>
                        <input className='formInput' type='file' name='image' onChange={(e) => handleInputChange(e)} placeholder='Item Image' ></input>
                    </div>

                    <div className='footNote'>
                        <p>* Mandatory fields</p>
                    </div>

                    <div className='err'>
                        {<span className='blank-err'>{blankFromError}</span>}
                    </div>

                    <button disabled={disabled} className='createBtn' type='submit' onClick={(e) => handleSubmit(e)}>Create</button>
                    <div className='submit-modal'>
                        <AddPostModal onClose={handleModalClose} showModal={showModal} />
                    </div>
                </div>
            </StyledForm>
            <StyledSignupImg className="login-img">
                {/* <img src={login_img} alt="login_img" /> */}
            </StyledSignupImg>
        </StyledSignupImgWrapper>
    )
}

const StyledSignupImgWrapper = styled.div`
    display: flex;
    width: 60%;
    box-shadow: 1px 1px 2px 2px #ccc;
    border-radius: 5px;
    margin: 1rem auto;
    padding: 3rem;
`


const StyledSignupImg = styled.div`
    flex-basis: 50%;
    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`
const StyledForm = styled.form`
    margin:1rem auto;
    width: 50%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 0 1rem;
    a{
        margin: 1rem;
        text-decoration: none;
        font-size: 1rem;
        text-align: center;
        color:  rgb(0, 127, 255);
    }
    .formContent {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .inputWrapper{
        display: flex;
        font-size: 1;
        flex-direction: column;
        gap: 1rem;
    }
    .inputWrapper > input {
        padding: 1rem;
        outline: none;
        border: none;
        box-shadow: 1px 1px 2px 2px #ccc;
        border-radius: 5px;
    }
    .err{
    padding: 0rem;
    color: red;
    font-size: small;
    text-align: right;
    }
    .createBtn {
    width: fit-content;
    margin: 0 auto;
    padding: 0.5rem;
    background-color: rgb(16, 109, 240);
    border-radius: 5px;
    border:none;
    box-shadow: 1px 1px 1px 1px #ccc;
    color: white;
    letter-spacing: 1px;
    }
    .createBtn:hover{
    cursor: pointer;
    }
    .createBtn:disabled,
    .createBtn[disabled]{
    cursor: not-allowed;
    color: #666666;
    background-color: #ccc;
    }
    .formTitle{
    text-align: center;
    font-size: 1.5rem;
    }
    .footNote{
    color: red;
    justify-content: left;
    font-size: small;
    padding: 0rem;
    }
`
export default AddPost;