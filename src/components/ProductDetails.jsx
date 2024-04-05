import React, { useState, useEffect  } from 'react';
import { useParams } from 'react-router-dom';
import ProductService from '../services/ProductService';
import './ProductDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

const ProductDetails = () => {
    const { product_id, price } = useParams(); // This hook allows you to grab the product_id from the URL // equivalent to const product_id = useParams().product_id;
    const [reviews, setReviews] = useState([])
    const [product, setProduct] = useState([])

    useEffect(() => {
        ProductService.searchProductId(product_id).then(response => {
            if (response.data.length > 0) {
                setReviews(response.data[0]['reviews']); 
                setProduct(response.data[0]['product_title']);
            } else {
                setReviews([]); // No product found
                setProduct([]);
            }
        });
    }, [product_id]);

    // Function to render sentiment icon
    const renderSentimentIcon = (sentiment) => {
        return sentiment === 0 ? <FontAwesomeIcon icon={faThumbsDown} />: <FontAwesomeIcon icon={faThumbsUp} />;
    };

    return (
        <div className='productDetails'>
            <h5>{product}</h5>
            {/* TODO: add in product description here */}
            <img className="img-fluid" src="https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/touch-black/notebook-xps-15-9530-t-black-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=654&qlt=100,1&resMode=sharp2&size=654,402&chrss=full"/> 
            {/* <p><strong>Category: </strong>{category}</p> */}
            <p><strong>Price: </strong>${price}</p>
            <div className='reviewsSection'>
                {/* Header */}
                <div className="review-header row mb-2">
                    <div className="col-8"><strong>Reviews</strong></div>
                    <div className="col-1"><strong>Date</strong></div>
                    <div className="col-1"><strong>Country</strong></div>
                    <div className="col-1"><strong>Rating</strong></div>
                    <div className="col-1"><strong>Sentiment</strong></div>
                </div>
        
                {
                    reviews.map(review => (
                        <div key={review.id} className="row mb-3">
                            <hr/>
                            <div className="col-8">
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
                            <div className="col-1">
                                {renderSentimentIcon(review.sentiment)}
                            </div>                         
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default ProductDetails;
