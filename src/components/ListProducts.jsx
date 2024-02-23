import React, {Component} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import ProductService from '../services/ProductService';

class ListProducts extends Component {

    constructor(props){
    super(props);
        this.state = {
            products:[] // create an array 
        }
    }

    componentDidMount(){ // gets called automatically after the component has been rendered to the DOM
        ProductService.getProducts().then(response => { 
            console.log(response.data);
            this.setState({products: response.data}) // set the products array with the response
        })

    }

    render() {
        return (
            <div className="row" style={{ margin: "80px 50px 20px 50px"}}>
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