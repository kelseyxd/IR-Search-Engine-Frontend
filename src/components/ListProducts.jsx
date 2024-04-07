import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import ProductService from '../services/ProductService';
import { Pagination, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom'; // Import Link

class ListProducts extends Component {

    constructor(props){
    super(props);
        this.state = {
            products:[], // create an array 
            searchInput:"",
            currentPage: 1,
            pageCount: 0
        }
    }

    handleSearch = () => {
        // Function to handle search
        const { searchInput } = this.state; // shorthand for const searchInput = this.state.searchInput
        console.log('Searching for:', searchInput);

        if (searchInput != ""){
            ProductService.searchProduct(searchInput, 1).then(response => { 
                console.log(response.data);
                // console.log(response.data.products.length)
                if (response.data.products.length === 0) {
                    this.setState({ products: [], currentPage: 1, showNoResultsMessage: true }); // Update state to show no results message
                } else {
                    this.setState({ products: response.data.products, currentPage: 1, showNoResultsMessage: false }); // Update state with products and hide no results message
                } // set the products array with the response
            })
    
            this.getPageCount();
        }   
    };

    handleCategoryChange = (event) => {
        const category = event.target.value;
        this.setState({ searchInput: category }, () => {
            if (category != ""){
                this.categorySearch(); // Perform search after state is updated
            }
        });
    };
    
    categorySearch = () => {
        const { searchInput } = this.state; 
        console.log('Searching for:', searchInput);

        ProductService.searchProductCat(searchInput, 1).then(response => { 
            if (response.data.products.length === 0) {
                this.setState({ products: [], currentPage: 1, showNoResultsMessage: true }); // Update state to show no results message
            } else {
                this.setState({ products: response.data.products, currentPage: 1, showNoResultsMessage: false }); // Update state with products and hide no results message
            } 
        })

        this.getPageCount();
    
    };

    changePage = (event, page) => {
        const { searchInput } = this.state;
        ProductService.searchProduct(searchInput, page).then(response => { 
            if (response.data.products.length === 0) {
                this.setState({ products: [], showNoResultsMessage: true }); // Update state to show no results message
            } else {
                this.setState({ products: response.data.products, currentPage: page, showNoResultsMessage: false }); // Update state with products and hide no results message
            } // set the products array with the response
        })
    }

    getPageCount = () => {
        const { searchInput } = this.state;
        ProductService.searchProduct(searchInput, 1, 25).then(response => { 
            if (response.data.products.length < 25) {
                this.setState({ pageCount: Math.ceil(response.data.products.length / 5)}); // Update state to show no results message
            } else {
                this.setState({ pageCount: 5 }); // Update state with products and hide no results message
            } // set the products array with the response
        })
    }

    render() {
        return (
            <div className="row" style={{ margin: "80px 50px 20px 50px"}}>

                <div style={{ display: "flex", justifyContent: "center", marginBottom: "50px"}}>       
                    
                    {/* Category Dropdown Search */}
                    <select
                        style={{ marginRight:"20px", padding:"7px"}}
                        value={this.state.searchInput}
                        onChange={this.handleCategoryChange}
                    >
                        <option value="">Select a Category</option>
                        <option value="kit">Kit</option>
                        <option value="tools">Tools</option>
                    </select>

                    {/* Product Search */}
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

                {this.state.showNoResultsMessage && <p style={{textAlign: "center"}}>There are no documents matching your search</p>}
                {   
                    this.state.products.map(product => (
                        <Link to={`/product/${product.product_id}/${product.price}`} style={{ textDecoration: 'none', color: 'inherit' }} key={product.name}>
                            <div key={product.product_id} className="row mb-3">
                                <div className="col-3">
                                    <img className="img-fluid" src="https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/touch-black/notebook-xps-15-9530-t-black-gallery-1.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=654&qlt=100,1&resMode=sharp2&size=654,402&chrss=full" alt={product.name} /> 
                                </div>
                                <div className="col-8">
                                    <h5 style={{textAlign : "left"}}>{product.product_title}</h5>
                                    <p style={{textAlign : "left"}}>Category: {product.category}</p>
                                </div>
                                <div className="col-1">
                                    <p style={{textAlign : "left", marginTop: '60px'}}>${product.price}</p>
                                </div>
                            </div>
                        </Link>
                    ))
                }
                <Pagination count={this.state.pageCount} page={this.state.currentPage} onChange={this.changePage}/>
            </div>
        );
    }
    
}

export default ListProducts