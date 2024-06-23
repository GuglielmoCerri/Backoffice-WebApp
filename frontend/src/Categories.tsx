import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import TablePagination from './TablePagination.tsx';
import { ColumnDef } from '@tanstack/react-table';
import { makeData, Category } from './makeDataCategory.ts';
import { Button, Modal } from 'react-bootstrap';
import CategoryModal from './components/CategoryModal';
import { Link } from 'react-router-dom';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { FaTable, FaChartPie, FaSignOutAlt, FaUsers, FaBox, FaTags} from 'react-icons/fa';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import './Table.css';

const Categories = () => {
  const [data, setData] = useState<Category[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(false);
  const [createdAt, setCreatedAt] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const categories = await makeData();
    setData(categories);
  };

  const handleAddCategory = async () => {
    try {
      if (!name) {
        alert('Name field is required!');
        return;
      }
      await axios.post('http://127.0.0.1:5000/category', { name, description, status });
      fetchData();
      setShowAddModal(false);
      setName('');
      setDescription('');
      setStatus(false);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleUpdateCategory = async () => {
    try {
      await axios.put(`http://127.0.0.1:5000/category/${selectedCategory?.id}`, { name, description, status });
      fetchData();
      setShowEditModal(false);
      setSelectedCategory(null);
      setName('');
      setDescription('');
      setStatus(false);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    console.log('Deleting category with ID:', id);
    try {
      await axios.delete(`http://127.0.0.1:5000/category/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleDownloadCSV = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Categories.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setName('');
    setDescription('');
    setStatus(false);
  };

  const columns = React.useMemo<ColumnDef<Category>[]>(
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
        accessorKey: 'status',
        cell: info => (info.getValue() ? 'Active' : 'Inactive'),
        header: () => <span>Status</span>,
        footer: props => props.column.id,
      },
      {
        accessorKey: 'created_at',
        cell: info => new Date(info.getValue()).toLocaleString(),
        header: () => <span>Created At</span>,
        footer: props => props.column.id,
      },
      {
        accessorKey: 'updated_at',
        cell: info => new Date(info.getValue()).toLocaleString(),
        header: () => <span>Updated At</span>,
        footer: props => props.column.id,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          return (
            <div>
              <Button className="edit-button" onClick={() => {
                setSelectedCategory(row.original);
                setName(row.original.name);
                setDescription(row.original.description);
                setStatus(row.original.status);
                setCreatedAt(row.original.created_at);
                setUpdatedAt(row.original.updated_at);
                setShowEditModal(true);
              }}>Edit</Button>{' '}
              <Button className="delete-button" onClick={() => handleDeleteCategory(row.original.id)}>Delete</Button>
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
            <Button className="add-button" onClick={() => setShowAddModal(true)}>Add Category</Button>
          </div>
        </div>

        <Modal show={showAddModal} onHide={handleCloseModal}>
          <CategoryModal
            title="Add Category"
            name={name}
            description={description}
            status={status}
            created_at={createdAt}
            updated_at={updatedAt}
            setName={setName}
            setDescription={setDescription}
            setStatus={setStatus}
            handleSubmit={handleAddCategory}
            handleClose={handleCloseModal}
          />
        </Modal>

        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <CategoryModal
            title="Edit Category"
            name={name}
            description={description}
            status={status}
            created_at={createdAt}
            updated_at={updatedAt}
            setName={setName}
            setDescription={setDescription}
            setStatus={setStatus}
            handleSubmit={handleUpdateCategory}
            handleClose={() => {
              setShowEditModal(false);
              setSelectedCategory(null);
              setName('');
              setDescription('');
              setStatus(false);
              setCreatedAt('');
              setUpdatedAt('');
            }}
          />
        </Modal>
      </div>
    </div>
  );
};

export default Categories;
