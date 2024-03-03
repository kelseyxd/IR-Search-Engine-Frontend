import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import ProductService from '../services/ProductService';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';

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
                {   // js code
                    this.state.products.map(product => (
                        <div className="col-sm-4" key={product.id}>
                            <div className="card mb-3">
                                <img className="card-img-top" src="..." alt="image" />
                                <div className="card-body">
                                    <h5 className="card-title">{product.name}</h5>
                                    <p className="card-text">Review: {product.description}</p>
                                    <p className="card-text">Price: ${product.price}</p>
                                    <a href="#" className="btn btn-primary">More Info</a>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        );
    }
    
}

export default ListProducts