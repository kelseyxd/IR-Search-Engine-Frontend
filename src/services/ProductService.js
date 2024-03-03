import axios from "axios";

const BASE_API = "http://localhost:8080/apis" ;

class ProductService{

    getProducts(){
        return axios.get(BASE_API + "/matchAllProducts") // create the function to fetch the data from backend
        ;

    }


    searchProduct(product){
        return axios.get(BASE_API + "/matchAllProducts/" + product)
    ;
  
    }

    // ins ertProduct(product){
    //     return axios.post(BASE_API + "/insert" , product)
    // ;
    // }

    // getProductsById(id){

    // return axios.get(BASE_API + "/find/" + id)
    // }

    // updateProduct(id, product){
    // return axios.put(BASE_API + "/update/" + id,product)
    // }

    // deleteProductById(id){

    // return axios.delete(BASE_API + "/delete/" + id)
    // }

}

export default new ProductService(); // just exporting one instance of the ProductService
