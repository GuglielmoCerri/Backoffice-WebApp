import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Customers from "./Customers.tsx"; 
import Products from "./Products.tsx"; 
import Categories from "./Categories.tsx"; 
import HomePage from "./HomePage"; 
import AnalyticsDashboard from "./AnalyticsDashboard.tsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path="login" element={<Login />} />
        <Route path="homepage" element={<HomePage />} />
        <Route path="customers" element={<Customers />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
