import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import ProductService from '../services/ProductService';
import { Pagination, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom'; // Import Link
import webLogo from '../web_logo.png';

class ListProducts extends Component {

    constructor(props){
    super(props);
        this.state = {
            products:[], // create an array 
            searchInput:"",
            categoryInput:"",
            resultType: -1,
            currentPage: 1,
            pageCount: 0,
            showNoResultsMessage: false,
            searchSuggestions: '',
            queyExecTime: 0
        }
    }

    reviewSummary(reviews) {
        let counts = { 'positive': 0, 'negative': 0, 'neutral': 0 };
        reviews.forEach(review => {
            counts[review.sentiment] += 1;
        });

        return (
            <span>
                <span style={{ color: 'red' }}>{counts.negative} negative</span> / 
                <span style={{ color: ' green'}}> {counts.positive} positive</span> / 
                <span style={{ color: 'rgb(255, 175, 0)'}}> {counts.neutral} neutral</span>
            </span>
        );    
    }

    handleSearch = () => {
        const { searchInput } = this.state;
        console.log('Searching for:', searchInput);
    
        if (searchInput !== "") {
            const startTime = performance.now() // query start time 
            ProductService.searchProduct(searchInput, 1).then(response => {
                const endTime = performance.now(); // Query end time
                const execTime = (endTime - startTime).toFixed(2);
                this.setState({ queryExecTime: execTime });

                console.log(response.data);
                const productsFound = response.data.products.length > 0;
                let suggestionString = searchInput; // Default to original input
                let showSuggestions = false;
    
                // Process suggestions if any
                const inputWords = searchInput.split(' ');
                suggestionString = inputWords.map((word, wordIndex) => {
                    // Attempt to find a suggestion for the current word
                    const currentSuggestion = response.data.suggestions.find(suggestion => suggestion.text.toLowerCase() === word.toLowerCase());
                    if (currentSuggestion && currentSuggestion.options.length > 0) {
                        // Find the best option based on score, assuming options are already sorted by score and frequency
                        const bestOption = currentSuggestion.options.find(option => option.score >= 0.5);
                        // Decide to show suggestions if any option has a score >= 0.75
                        if (bestOption) {
                            showSuggestions = true;
                            return bestOption.text; // Use the suggested word
                        }
                    }
                    return word; // No suitable suggestion found, use the original word
                }).join(' ');
    
                this.setState({ 
                    products: productsFound ? response.data.products : [], 
                    currentPage: 1, 
                    showNoResultsMessage: !productsFound, 
                    searchSuggestions: showSuggestions ? suggestionString : ''
                });
            });
    
            this.setState({categoryInput: ""})
            this.getPageCount();
        }
    };
    
    
    

    // handleSearch = () => {
    //     const { searchInput } = this.state;
    //     console.log('Searching for:', searchInput);

    //     if (searchInput !== "") {
    //         ProductService.searchProduct(searchInput, 1).then(response => {
    //             console.log(response.data);
    //             if (response.data.products.length === 0) {
    //                 this.setState({ 
    //                     products: [], 
    //                     currentPage: 1, 
    //                     showNoResultsMessage: true, 
    //                     searchSuggestions: suggestionWords.join(' ') // Update to handle suggestions
    //                 });
    //             } else {
    //                 this.setState({ 
    //                     products: response.data.products, 
    //                     currentPage: 1, 
    //                     showNoResultsMessage: false, 
    //                     searchSuggestions: [] // Clear suggestions if products are found
    //                 });
    //             }
    //         });

    //         this.setState({categoryInput: ""})
    //         this.getPageCount();
    //     }
    // };

    handleCategoryChange = (event) => {
        const category = event.target.value;
        this.setState({ categoryInput: category }, () => {
            if (category != ""){
                this.categorySearch(); // Perform search after state is updated
            }
        });
    };
    
    categorySearch = () => {
        const { categoryInput } = this.state; 
        console.log('Searching for:', categoryInput);

        const startTime = performance.now() // query start time 
        ProductService.searchProductCat(categoryInput, 1).then(response => { 
            const endTime = performance.now(); // Query end time
            const execTime = (endTime - startTime).toFixed(2);
            this.setState({ queryExecTime: execTime });

            if (response.data.length === 0) {
                this.setState({ products: [], currentPage: 1, showNoResultsMessage: true }); // Update state to show no results message
            } else {
                console.log(response.data)
                this.setState({ products: response.data, currentPage: 1, showNoResultsMessage: false }); // Update state with products and hide no results message
            } 
        })

        this.setState({searchInput: ""})
        this.getCatPageCount();
    
    };

    changePage = (event, page) => {
        const { resultType } = this.state;

        if (resultType == 0){
            const { searchInput } = this.state;
            ProductService.searchProduct(searchInput, page).then(response => { 
                if (response.data.products.length === 0) {
                    this.setState({ products: [], showNoResultsMessage: true }); // Update state to show no results message
                } else {
                    this.setState({ products: response.data.products, currentPage: page, showNoResultsMessage: false }); // Update state with products and hide no results message
                } // set the products array with the response
            })
        } else if (resultType == 1) {
            const { categoryInput } = this.state;
            ProductService.searchProductCat(categoryInput, page).then(response => { 
                if (response.data.length === 0) {
                    this.setState({ products: [], showNoResultsMessage: true }); // Update state to show no results message
                } else {
                    this.setState({ products: response.data, currentPage: page, showNoResultsMessage: false }); // Update state with products and hide no results message
                } // set the products array with the response
            })
        }

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

        this.setState({ resultType: 0});
    }

    getCatPageCount = () => {
        const { categoryInput } = this.state;
        ProductService.searchProductCat(categoryInput, 1, 25).then(response => { 
            if (response.data.length < 25) {
                this.setState({ pageCount: Math.ceil(response.data.length / 5)}); // Update state to show no results message
            } else {
                this.setState({ pageCount: 5 }); // Update state with products and hide no results message
            } // set the products array with the response
        })

        this.setState({ resultType: 1});
    }

    render() {
        const { searchInput } = this.state;
        const {queryExecTime } = this.state;
        
        return (
            <div className="row" style={{ margin: "80px 50px 20px 50px"}}>
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <img style={{width: '10%'}} src={webLogo} />
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "50px"}}>       
                    {/* Category Dropdown Search */}
                    <select
                        style={{ marginRight: "20px", padding: "7px" }}
                        value={this.state.categoryInput}
                        onChange={this.handleCategoryChange}
                    >
                        <option value="">Select a Category</option>
                        {/* Media & Entertainment */}
                        <optgroup label="Media & Entertainment">
                            <option value="Books">Books</option>
                            <option value="Movies & TV">Movies & TV</option>
                            <option value="Music">Music</option>
                            <option value="Video Games">Video Games</option>
                        </optgroup>

                        {/* Health & Beauty */}
                        <optgroup label="Health & Beauty">
                            <option value="Luxury Beauty">Luxury Beauty</option>
                            <option value="Beauty">Beauty</option>
                            <option value="Health, Household and Personal Care">Health, Household and Personal Care</option>
                        </optgroup>

                        {/* Home & Garden */}
                        <optgroup label="Home & Garden">
                            <option value="Garden">Garden</option>
                            <option value="Home">Home</option>
                            <option value="Kitchen">Kitchen</option>
                            <option value="Pet Supplies">Pet Supplies</option>
                        </optgroup>

                        {/* Electronics & Computers */}
                        <optgroup label="Electronics & Computers">
                            <option value="Computers">Computers</option>
                            <option value="Electronics">Electronics</option>
                        </optgroup>

                        {/* Hobbies & Toys */}
                        <optgroup label="Hobbies & Toys">
                            <option value="Toys">Toys</option>
                            <option value="Musical Instruments">Musical Instruments</option>
                            <option value="Sporting Goods">Sporting Goods</option>
                        </optgroup>

                        {/* Professional & Industrial */}
                        <optgroup label="Professional & Industrial">
                            <option value="Industrial & Scientific">Industrial & Scientific</option>
                            <option value="Office Products">Office Products</option>
                            <option value="Automotive">Automotive</option>
                            <option value="DIY & Tools">DIY & Tools</option>
                        </optgroup>

                        {/* Baby & Fashion */}
                        <optgroup label="Baby & Fashion">
                            <option value="Baby Products">Baby Products</option>
                            <option value="Fashion">Fashion</option>
                        </optgroup>

                        {/* Miscellaneous */}
                        <optgroup label="Miscellaneous">
                            <option value="Grocery">Grocery</option>
                            <option value="Gift Cards">Gift Cards</option>
                            <option value="Software">Software</option>
                        </optgroup>
                    </select>


                    {/* Product Search */}
                    <input
                        value={searchInput}
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
                
                {/* Search Results and Time Display */}
                {this.state.products.length > 0 &&
                    <div style={{marginLeft:'70px', marginBottom: '10px'}}>
                        <p>Query execution time: {queryExecTime}ms</p>
                    </div>
                }

                
                <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", height: '100%' }}>
                    {this.state.showNoResultsMessage && 
                        <p style={{ fontWeight: "bold" }}>There are no products matching your search.</p>
                    }
                    {this.state.searchSuggestions.length > 0 && (
                        <div style={{ textAlign: "center", marginBottom: "50px" }}>
                            <span>Did you mean: </span>
                            <button
                                style={{ margin: "0 5px", border: "none", background: "none", color: "blue", cursor: "pointer" }}
                                onClick={() => this.setState({ searchInput: this.state.searchSuggestions }, this.handleSearch)}
                            >
                                {this.state.searchSuggestions}
                            </button>
                        </div>
                    )}
                </div>

                {   
                    this.state.products.map(product => (
                        <Link to={`/product/${product.product_id}/${product.price}/${product.product_category}`} style={{ textDecoration: 'none', color: 'inherit' }} key={product.name}>
                            <div key={product.product_id} className="row mb-3">
                                <div className="col-3">
                                    <img className="img-fluid" src={product.image !== "" ? product.image : "https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg"} alt={product.product_title} />
                                </div>
                                <div className="col-8">
                                    <h5 style={{textAlign : "left"}}>{product.product_title}</h5>
                                    <p style={{textAlign : "left", fontSize: '17px'}}>Category: {product.product_category}</p>
                                    <p style={{fontSize: '17px'}}>Reviews: {this.reviewSummary(product.reviews)}</p>
                                </div>
                                <div className="col-1">
                                    <p style={{textAlign : "left", marginTop: '60px'}}>${product.price}</p>
                                </div>
                            </div>
                        </Link>
                    ))
                }

                {this.state.products.length > 0 && ( // Only render Pagination if there are products
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}> {/* Adjust margin as necessary */}
                    <Pagination count={this.state.pageCount} page={this.state.currentPage} onChange={this.changePage} />
                </div>
            )}
            </div>
        );
    }
    
}

export default ListProducts