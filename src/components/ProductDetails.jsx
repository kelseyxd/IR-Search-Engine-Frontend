import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
  const { productName } = useParams(); // This hook allows you to grab the productName from the URL // equivalent to const productName = useParams().productName;

  return (
    <div>
      <h2>Product Details</h2>
      <p>Name: {productName}</p>
    </div>
  );
}

export default ProductDetails;
