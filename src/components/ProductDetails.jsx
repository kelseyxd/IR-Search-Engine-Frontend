import React, { useState, useEffect  } from 'react';
import { useParams } from 'react-router-dom';
import ProductService from '../services/ProductService';
import './ProductDetails.css';

const ProductDetails = () => {
    const { name, category, price } = useParams(); // This hook allows you to grab the name from the URL // equivalent to const productName = useParams().productName;
    const [reviews, setReviews] = useState([])

    useEffect(() => {
        ProductService.searchProduct(name).then(response => {
            if (response.data.length > 0) {
                setReviews(response.data); 
            } else {
                setReviews([]); // No product found
            }
        });
    }, [name]);

    return (
        <div className='productDetails'>
            <h5>{name}</h5>
            {/* TODO: add in product description here */}
            <img className="img-fluid" src="https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/touch-black/notebook-xps-15-9530-t-black-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=654&qlt=100,1&resMode=sharp2&size=654,402&chrss=full"/> 
            <p><strong>Category: </strong>{category}</p>
            <p><strong>Price: </strong>${price}</p>
            <div className='reviewsSection'>
                {/* Header */}
                <div className="review-header row mb-2">
                    <div className="col-9"><strong>Reviews</strong></div>
                    <div className="col-1"><strong>Date</strong></div>
                    <div className="col-1"><strong>Country</strong></div>
                    <div className="col-1"><strong>Rating</strong></div>
                </div>
        
                {
                    reviews.map(review => (
                        <div key={review.id} className="row mb-3">
                            <hr/>
                            <div className="col-9">
                                <p>{review.content}</p>
                            </div>
                            <div className="col-1">
                                <p>{review.date}</p>
                            </div>
                            <div className="col-1">
                                <p>{review.country}</p>
                            </div>
                            <div className="col-1">
                                <p>{review.rating}</p>
                            </div>                           
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default ProductDetails;
