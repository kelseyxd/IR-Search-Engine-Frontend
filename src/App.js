import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import ListProducts from './components/ListProducts';
import ProductDetails from './components/ProductDetails'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Routes> 
          <Route path="/" element={<ListProducts />} />
          <Route path="/product/:product_id/:price/:category" element={<ProductDetails />} /> {/* ':product_id:' This part is dynamic. Whatever value is in this segment of the URL after ':' will be passed to the ProductDetails component as a prop named product_id.  */}
          

        </Routes>
      </div>
    </Router>
  );
}

export default App;
