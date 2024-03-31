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
          <Route path="/product/:name/:category/:price" element={<ProductDetails />} /> {/* ':productName:' This part is dynamic. Whatever value is in this segment of the URL after ':' will be passed to the ProductDetails component as a prop named productName.  */}
          

        </Routes>
      </div>
    </Router>
  );
}

export default App;
