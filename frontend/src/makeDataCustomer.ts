import axios from './axiosConfig';

const fetchCustomers = async () => {
    try {
      const response = await axios.get('/customers');
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
  };

export type Customer = {
  id: number
  name: string
  email: string
  phone: string
  location: string
  hobbies: string
  subRows?: Customer[]
}

const newCustomer = (data: Customer): Customer => {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      location: data.location,
      hobbies: data.hobbies,
    };
  };

  export async function makeData() {
    const customers = await fetchCustomers();
  
    const tableRows = customers.map((customerData): Customer => {
      return newCustomer(customerData);
    });
  
    return tableRows;
  }
  


