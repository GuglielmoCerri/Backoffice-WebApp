import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import TablePagination from './TablePagination.tsx'; 
import { ColumnDef} from '@tanstack/react-table';
import { makeData, Product } from './makeDataProduct.ts';
import { Button, Modal } from 'react-bootstrap';
import ProductModal from './components/ProductModal';
import { Link } from 'react-router-dom';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { FaTable, FaChartPie, FaSignOutAlt, FaUsers, FaBox, FaTags} from 'react-icons/fa';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import './style/Table.css';
import './style/Sidebar.css';

const Products = () => {
  const [data, setData] = useState<Product[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock_quantity, setStockQuantity] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const products = await makeData();
    setData(products);
  };

  const handleAddProduct = async () => {
    try {
      if (!name) {
        alert('Name field is required!');
        return;
      }
      if (!price) {
        alert('Price field is required!');
        return;
      }
      await axios.post('http://127.0.0.1:5000/product', { name, description, price, category, stock_quantity });
      fetchData();
      setShowAddModal(false);
      setName('');
      setDescription('');
      setPrice('');
      setCategory('');
      setStockQuantity('');
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      await axios.put(`http://127.0.0.1:5000/product/${selectedProduct.id}`, { name, description, price, category, stock_quantity });
      fetchData();
      setShowEditModal(false);
      setSelectedProduct(null);
      setName('');
      setDescription('');
      setPrice('');
      setCategory('');
      setStockQuantity('');
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    console.log('Deleting product with ID:', id);
    try {
      await axios.delete(`http://127.0.0.1:5000/product/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleDownloadCSV = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Products.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setName('');
    setDescription('');
    setPrice('');
    setCategory('');
    setStockQuantity('');
  };

  const columns = React.useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: 'name',
        cell: info => info.getValue(),
        header: () => <span>Name</span>,
        footer: props => props.column.id,
      },
      {
        accessorFn: row => row.description,
        id: 'description',
        cell: info => info.getValue(),
        header: () => <span>Description</span>,
        footer: props => props.column.id,
      },
      {
        accessorKey: 'price',
        cell: info => info.getValue(),
        header: () => <span>Price</span>,
        footer: props => props.column.id,
      },
      {
        accessorKey: 'category',
        cell: info => info.getValue(),
        header: () => <span>Category</span>,
        footer: props => props.column.id,
      },
      {
        accessorKey: 'stock_quantity',
        cell: info => info.getValue(),
        header: () => <span>Stock quantity</span>,
        footer: props => props.column.id,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          return (
            <div className="actions-column">
              <Button className="edit-button" onClick={() => {
                setSelectedProduct(row.original);
                setName(row.original.name);
                setDescription(row.original.description);
                setPrice(row.original.price);
                setCategory(row.original.category);
                setStockQuantity(row.original.stock_quantity);
                setShowEditModal(true);
              }}>Edit</Button>{' '}
              <Button className="delete-button" onClick={() => handleDeleteProduct(row.original.id)}>Delete</Button>
            </div>
          );
        },
      },
    ],
    []
  );

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
    <div className="table-container">
    <div className="table-wrapper">
    <TablePagination data={data} columns={columns} />
      <div className="button-container">
        <Button className="download-button" onClick={handleDownloadCSV}>Download CSV</Button>
        <Button className="add-button" onClick={() => setShowAddModal(true)}>Add Product</Button>
      </div>
    </div>

      <Modal show={showAddModal} onHide={handleCloseModal}>
        <ProductModal
          title="Add Product"
          name={name}
          description={description}
          price={price}
          category={category}
          stock_quantity={stock_quantity}
          setName={setName}
          setDescription={setDescription}
          setPrice={setPrice}
          setCategory={setCategory}
          setStockQuantity={setStockQuantity}
          handleSubmit={handleAddProduct}
          handleClose={handleCloseModal}
        />
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <ProductModal
          name={name}
          description={description}
          price={price}
          category={category}
          stock_quantity={stock_quantity}
          setName={setName}
          setDescription={setDescription}
          setPrice={setPrice}
          setCategory={setCategory}
          setStockQuantity={setStockQuantity}
          handleSubmit={handleUpdateProduct}
          handleClose={() => {
            setShowEditModal(false);
            setName('');
            setDescription('');
            setPrice('');
            setCategory('');
            setStockQuantity('');
          }}
          title="Edit Product"
        />
      </Modal>
    </div>
    </div>
  );
};

export default Products;
