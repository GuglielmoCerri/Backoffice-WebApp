import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Container, Grid, Paper, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler 
);

interface CategoryData {
  category: string;
  average_price: number;
  total_revenue: number;
  product_count: number;
  total_stock: number;
}

interface PriceRangeData {
  price_range: string;
  product_count: number;
}

const AnalyticsDashboard: React.FC = () => {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [priceRangeData, setPriceRangeData] = useState<PriceRangeData[]>([]);
  const categoryChartRef = useRef(null);
  const priceRangeChartRef = useRef(null);

  const fetchCategoryData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token is missing');
        return;
      }
      const response = await axios.get('http://127.0.0.1:5000/analytics/products_by_category', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategoryData(response.data);
    } catch (error) {
      console.error('Error fetching category data:', error);
    }
  };

  const fetchPriceRangeData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token is missing');
        return;
      }
      const response = await axios.get('http://127.0.0.1:5000/analytics/products_by_price_range', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPriceRangeData(response.data);
    } catch (error) {
      console.error('Error fetching price range data:', error);
    }
  };

  useEffect(() => {
    fetchCategoryData();
    fetchPriceRangeData();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Analytics Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper>
            <Typography variant="h6" gutterBottom>
              Products by Category
            </Typography>
            <Bar
              ref={categoryChartRef}
              data={{
                labels: categoryData.map((data) => data.category),
                datasets: [
                  {
                    label: 'Average Price',
                    data: categoryData.map((data) => data.average_price),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                  },
                  {
                    label: 'Total Revenue',
                    data: categoryData.map((data) => data.total_revenue),
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                  },
                  {
                    label: 'Product Count',
                    data: categoryData.map((data) => data.product_count),
                    backgroundColor: 'rgba(255, 159, 64, 0.6)',
                  },
                  {
                    label: 'Total Stock',
                    data: categoryData.map((data) => data.total_stock),
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                  },
                ],
              }}
              options={{
                scales: {
                  x: {
                    grid: {
                      display: false, 
                    },
                  },
                  y: {
                    grid: {
                      display: false, 
                    },
                  },
                },
                plugins: {
                  legend: {
                    display: true,
                  },
                },
                maintainAspectRatio: true,
                responsive: true,
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper>
            <Typography variant="h6" gutterBottom>
              Products by Price Range
            </Typography>
            <Bar
              ref={priceRangeChartRef}
              data={{
                labels: priceRangeData.map((data) => data.price_range),
                datasets: [
                  {
                    label: 'Product Count',
                    data: priceRangeData.map((data) => data.product_count),
                    backgroundColor: 'rgba(255, 206, 86, 0.6)',
                  },
                ],
              }}
              options={{
                scales: {
                  x: {
                    grid: {
                      display: false, 
                    },
                  },
                  y: {
                    grid: {
                      display: false, 
                    },
                  },
                },
                plugins: {
                  legend: {
                    display: true,
                  },
                },
                maintainAspectRatio: true,
                responsive: true,
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AnalyticsDashboard;
