import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductService from '../services/ProductService';
import './ProductDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

const ProductDetails = () => {
    const { product_id, price } = useParams();
    const [reviews, setReviews] = useState([]);
    const [product, setProduct] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('All');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        ProductService.searchProductId(product_id).then(response => {
            if (response.data.length > 0) {
                setReviews(response.data[0]['reviews']);
                setProduct(response.data[0]['product_title']);
            } else {
                setReviews([]);
                setProduct([]);
            }
        });
    }, [product_id]);

    // Function to render sentiment icon
    const renderSentimentIcon = (sentiment) => {
        return sentiment === 0 ? <FontAwesomeIcon icon={faThumbsDown} /> : <FontAwesomeIcon icon={faThumbsUp} />;
    };

    // Extract a unique list of countries for the filter dropdown
    const uniqueCountries = ['All', ...new Set(reviews.map(review => review.country))];

    // Filter reviews based on the selected country
    let filteredReviews = selectedCountry === 'All' ? reviews : reviews.filter(review => review.country === selectedCountry);

    // Further filter reviews based on the selected date range
    if (startDate && endDate) {
        filteredReviews = filteredReviews.filter(review => {
            const reviewDate = new Date(review.date);
            return reviewDate >= new Date(startDate) && reviewDate <= new Date(endDate);
        });
    }

    return (
        <div className='productDetails'>
            <h5>{product}</h5>
            <img className="img-fluid" alt="Product" src="https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/touch-black/notebook-xps-15-9530-t-black-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=654&qlt=100,1&resMode=sharp2&size=654,402&chrss=full"/>
            <p><strong>Price: </strong>${price}</p>
            
            <div className='reviewsSection'>
                {/* Header */}
                <div className="review-header row mb-2">
                    <div className="col-6"><strong>Reviews</strong></div>
                    <div className="col-2"><strong>Date</strong></div>
                    <div className="col-2"><strong>Country</strong></div>
                    <div className="col-1"><strong>Rating</strong></div>
                    <div className="col-1"><strong>Sentiment</strong></div>
                </div>
                <div className="review-header row mb-2">
                    <div className="col-6"></div>
                    <div className="col-2">
                        {/* Date Range Filters */}
                        <div className="date-filters">
                            <label>Start Date:</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            <br></br>
                            <label style={{marginTop: '10px'}}>End Date:</label>
                            <br></br>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                    </div>
                    <div className="col-2">
                        {/* Country Filter Dropdown */}
                        <select style={{marginTop: '24px'}} value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
                            {uniqueCountries.map(country => (
                                <option key={country} value={country}>{country}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-1"></div>
                    <div className="col-1"></div>
                </div>
                {filteredReviews.map(review => (
                    <div key={review.id} className="row mb-3">
                        <hr />
                        <div className="col-6"><p>{review.content}</p></div>
                        <div className="col-2"><p>{review.date}</p></div>
                        <div className="col-2"><p>{review.country}</p></div>
                        <div className="col-1"><p>{review.rating}</p></div>
                        <div className="col-1">{renderSentimentIcon(review.sentiment)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductDetails;
