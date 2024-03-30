import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import ProductService from '../services/ProductService';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom'; // Import Link

class ListProducts extends Component {

    constructor(props){
    super(props);
        this.state = {
            products:[], // create an array 
            searchInput:""
        }
    }

    handleSearch = () => {
        // Function to handle search
        const { searchInput } = this.state; // shorthand for const searchInput = this.state.searchInput
        console.log('Searching for:', searchInput);

        ProductService.searchProduct(searchInput).then(response => { 
            // console.log(response.data);
            // console.log(response.data.length)
            if (response.data.length === 0) {
                this.setState({ products: [], showNoResultsMessage: true }); // Update state to show no results message
            } else {
                this.setState({ products: response.data, showNoResultsMessage: false }); // Update state with products and hide no results message
            } // set the products array with the response
        })
    
    };

    render() {
        return (
            <div className="row" style={{ margin: "80px 50px 20px 50px"}}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "50px"}}>       
                    <input
                        style={{width: "25%"}}
                        onChange={(event) => this.setState({ searchInput: event.target.value })} // val is user's input
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                this.handleSearch();
                            }
                        }}
                    />
                    <IconButton aria-label="search" onClick={this.handleSearch}>
                        <SearchIcon />
                    </IconButton>  
                </div>
                {this.state.showNoResultsMessage && <p>There are no documents matching your search</p>}
                {   
                    this.state.products.map(product => (
                        <Link to={`/product/${product.name}`} style={{ textDecoration: 'none', color: 'inherit' }} key={product.name}>
                            <div key={product.id} className="row mb-3">
                                <div className="col-3">
                                    <img className="img-fluid" src="https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/touch-black/notebook-xps-15-9530-t-black-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=654&qlt=100,1&resMode=sharp2&size=654,402&chrss=full" alt={product.name} /> 
                                </div>
                                <div className="col-8">
                                    <h5 style={{textAlign : "left"}}>{product.name}</h5>
                                    <p style={{textAlign : "left"}}>Review: {product.content}</p> 
                                    <p style={{textAlign : "left"}}>Category: {product.category}</p>
                                </div>
                                <div className="col-1">
                                    <p style={{textAlign : "left"}}>${product.price}</p>
                                </div>
                            </div>
                        </Link>
                    ))
                }
            </div>
        );
    }
    
}

export default ListProducts