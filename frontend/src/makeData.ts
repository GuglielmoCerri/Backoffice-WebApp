import axios from 'axios';

const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/customers');
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      return [];
    }
  };

export type Customer = {
  name: string
  email: string
  phone: number
  location: string
  hobbies: string
  subRows?: Customer[]
}

const newCustomer = (data: Customer): Customer => {
    return {
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
  


