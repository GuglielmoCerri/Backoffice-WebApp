import axios from './axiosConfig';

const fetchCategories = async () => {
  try {
    const response = await axios.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export type Category = {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  status: boolean;
  subRows?: Category[];
};

const newCategory = (data: Category): Category => {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    created_at: data.created_at,
    updated_at: data.updated_at,
    status: data.status,
  };
};

export async function makeData() {
  const categories = await fetchCategories();

  const tableRows = categories.map((categoryData): Category => {
    return newCategory(categoryData);
  });

  return tableRows;
}
