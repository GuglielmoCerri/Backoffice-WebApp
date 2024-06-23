import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Container, Typography } from '@mui/material';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import { FaTable, FaChartPie, FaSignOutAlt, FaUsers, FaBox, FaTags} from 'react-icons/fa';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import './style/Sidebar.css'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineElement,
  PointElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineElement,
  PointElement
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

interface LocationData {
  label: string;
  value: number;
  color: string;
}

interface TopProductData {
  product: string;
  quantity: number;
}

interface TrendData {
  date: string;
  category: string;
  takings: number;
}

const AnalyticsDashboard: React.FC = () => {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [priceRangeData, setPriceRangeData] = useState<PriceRangeData[]>([]);
  const [locationData, setLocationData] = useState<LocationData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProductData[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const categoryChartRef = useRef(null);
  const priceRangeChartRef = useRef(null);
  const locationChartRef = useRef(null);

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

  const fetchLocationData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token is missing');
        return;
      }
      const response = await axios.get('http://127.0.0.1:5000/analytics/customers_by_location', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLocationData(response.data);
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  };

  const fetchTopProductsData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token is missing');
        return;
      }
      const response = await axios.get('http://127.0.0.1:5000/analytics/top_selled_products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTopProducts(response.data);
    } catch (error) {
      console.error('Error fetching top products data:', error);
    }
  };

  const fetchTrendData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token is missing');
        return;
      }
      const response = await axios.get('http://127.0.0.1:5000/analytics/trend', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTrendData(response.data);
    } catch (error) {
      console.error('Error fetching trend data:', error);
    }
  };

  useEffect(() => {
    fetchCategoryData();
    fetchPriceRangeData();
    fetchLocationData();
    fetchTopProductsData();
    fetchTrendData();
  }, []);

  const categoryChartData = {
    labels: categoryData.map((data) => data.category),
    datasets: [
      {
        label: 'Average Price',
        data: categoryData.map((data) => data.average_price),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Total Stock',
        data: categoryData.map((data) => data.total_stock),
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const priceRangeChartData = {
    labels: priceRangeData.map((data) => data.price_range),
    datasets: [
      {
        label: 'Product Count',
        data: priceRangeData.map((data) => data.product_count),
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  const locationChartData = {
    labels: locationData.map((data) => data.label),
    datasets: [
      {
        data: locationData.map((data) => data.value),
        backgroundColor: locationData.map((data) => data.color),
        hoverBackgroundColor: locationData.map((data) => data.color),
      },
    ],
  };

  const totalQuantity = topProducts.reduce((sum, product) => sum + product.quantity, 0);
  const colors = ['#845EC2', '#D65DB1', '#FF6F91', '#FF9671', '#FFC75F'];

  const categories = [...new Set(trendData.map(data => data.category))];
  
  const categoryColors = {
    'Technology': '#B39CD0', 
    'Home': 'rgba(54, 162, 235, 0.6)', 
    'Clothing': 'rgba(75, 192, 192, 0.6)',  
  };

  const trendChartData = {
    labels: [...new Set(trendData.map(data => data.date))], 
    datasets: categories.map(category => ({
      label: category,
      data: trendData.filter(data => data.category === category).map(data => data.takings),
      borderColor: categoryColors[category],
      backgroundColor: categoryColors[category],
      fill: false,
    })),
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  const collapseIcon = collapsed ? <MdOutlineKeyboardArrowRight /> : <MdOutlineKeyboardArrowLeft />;

  return (
    <div style={{ display: 'flex', height: '100%' }}>
    <div>
    <Sidebar collapsed={collapsed}>
          <Menu closeOnClick>
            <SubMenu label="Tables" icon={<FaTable />}>
              <MenuItem component={<Link to="/customers" />} icon={<FaUsers />}>Customers</MenuItem>
              <MenuItem component={<Link to="/products" />} icon={<FaBox />}>Products</MenuItem>
              <MenuItem component={<Link to="/categories" />} icon={<FaTags />}>Categories</MenuItem>
            </SubMenu>
            <MenuItem component={<Link to="/analytics" />} icon={<FaChartPie />}>Dashboard</MenuItem>
            <MenuItem component={<Link to="/login" />} icon={<FaSignOutAlt />}>LogOut</MenuItem>
          </Menu>
          <div onClick={toggleSidebar} className="sidebar-toggle">
            {collapseIcon}
          </div>
        </Sidebar>
    </div>
    <Container className="mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <Typography variant="h5" component="h3" className="mb-4 text-center">
            Category Data
          </Typography>
          <Bar ref={categoryChartRef} 
               data={categoryChartData} 
               options={{
                scales: {
                  x: { grid: {display: true}},
                  y: { grid: {display: false},
                  },
                }
              }}/>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <Typography variant="h5" component="h3" className="mb-4 text-center">
            Price Range Data
          </Typography>
          <Bar ref={priceRangeChartRef} 
               data={priceRangeChartData} 
               options={{
                scales: {
                  x: { grid: {display: true}},
                  y: { grid: {display: false},
                  },
                }
              }}/>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow col-span-1 md:col-span-1">
          <Typography variant="h5" component="h3" className="mb-4 text-center">
            Customers by Location
          </Typography>
          <div className="w-1/2 mx-auto">
            <Doughnut ref={locationChartRef} 
                      data={locationChartData}
                      options={{
                        plugins: {
                          legend: {
                            position: 'bottom',
                            align: 'center',
                            fullSize: true,
                          },
                        },
                      }}  />
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow col-span-1 md:col-span-1">
          <Typography variant="h5" component="h3" className="mb-4 text-center">
            Top Products
          </Typography>
          {topProducts.map((product, index) => (
            <div key={product.product} className="mb-2">
              <Typography variant="h6">{product.product}</Typography>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full"
                  style={{ width: `${(product.quantity / totalQuantity) * 100}%`, backgroundColor: colors[index % colors.length] }}
                ></div>
              </div>
              <Typography variant="body2">Popularity: {(product.quantity / totalQuantity * 100).toFixed(2)}%</Typography>
            </div>
          ))}
        </div>
      </div>
        <div className="bg-white p-4 rounded shadow">
          <Typography variant="h5" component="h3" className="mb-4 text-center">
            Monthly Takings by Category Over The Last Year
          </Typography>
          <Line data={trendChartData} options={{
            scales: {
              x: { grid: { display: true } },
              y: { grid: { display: true } }
            },
            plugins: {
              legend: {
                position: 'bottom'
              }
            }
          }} />
        </div>
    </Container>
    </div>
  );
};

export default AnalyticsDashboard;
