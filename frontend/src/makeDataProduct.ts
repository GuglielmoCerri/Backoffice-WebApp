import axios from 'axios';

const fetchProducts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching Products:', error);
      return [];
    }
  };

export type Product = {
  id: number
  name: string
  description: string
  price: number
  category: string
  stock_quantity: number
  subRows?: Product[]
}

const newProduct = (data: Product): Product => {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      stock_quantity: data.stock_quantity,
    };
  };

  export async function makeData() {
    const Products = await fetchProducts();
  
    const tableRows = Products.map((productData): Product => {
      return newProduct(productData);
    });
  
    return tableRows;
  }
  


