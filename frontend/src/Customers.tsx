import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import TablePagination from './TablePagination.tsx'; 
import { ColumnDef} from '@tanstack/react-table';
import { makeData, Customer } from './makeDataCustomer.ts';
import { Button, Modal } from 'react-bootstrap';
import CustomerModal from './components/CustomerModal';
import { useNavigate } from "react-router-dom";
import './Table.css';

const Customers = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<Customer[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [hobbies, setHobbies] = useState('');

  useEffect(() => {
    fetchData();
  }, []);


  const handleGoHome = () => {
    navigate("/homepage");
  }; 

  const fetchData = async () => {
    const customers = await makeData();
    setData(customers);
  };

  const handleAddCustomer = async () => {
    try {
      if (!name) {
        alert('Name field is required!');
        return;
      }
      if (!email) {
        alert('Email field is required!');
        return;
      }
      await axios.post('http://127.0.0.1:5000/customer', { name, email, phone, location, hobbies });
      fetchData();
      setShowAddModal(false);
      setName('');
      setEmail('');
      setPhone('');
      setLocation('');
      setHobbies('');
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  const handleUpdateCustomer = async () => {
    try {
      await axios.put(`http://127.0.0.1:5000/customer/${selectedCustomer.id}`, { name, email, phone, location, hobbies });
      fetchData();
      setShowEditModal(false);
      setSelectedCustomer(null);
      setName('');
      setEmail('');
      setLocation('');
      setHobbies('');
      setPhone('');
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    console.log('Deleting customer with ID:', id);
    try {
      await axios.delete(`http://127.0.0.1:5000/customer/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const handleDownloadCSV = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Customers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setName('');
    setEmail('');
    setPhone('');
    setLocation('');
    setHobbies('');
  };

  const columns = React.useMemo<ColumnDef<Customer>[]>(
    () => [
      {
        accessorKey: 'name',
        cell: info => info.getValue(),
        header: () => <span>Name</span>,
        footer: props => props.column.id,
      },
      {
        accessorFn: row => row.email,
        id: 'email',
        cell: info => info.getValue(),
        header: () => <span>Email</span>,
        footer: props => props.column.id,
      },
      {
        accessorKey: 'phone',
        cell: info => info.getValue(),
        header: () => <span>Phone</span>,
        footer: props => props.column.id,
      },
      {
        accessorKey: 'location',
        cell: info => info.getValue(),
        header: () => <span>Location</span>,
        footer: props => props.column.id,
      },
      {
        accessorKey: 'hobbies',
        cell: info => info.getValue(),
        header: () => <span>Hobbies</span>,
        footer: props => props.column.id,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          return (
            <div>
              <Button className="edit-button" onClick={() => {
                setSelectedCustomer(row.original);
                setName(row.original.name);
                setEmail(row.original.email);
                setPhone(row.original.phone);
                setLocation(row.original.location);
                setHobbies(row.original.hobbies);
                setShowEditModal(true);
              }}>Edit</Button>{' '}
              <Button className="delete-button" onClick={() => handleDeleteCustomer(row.original.id)}>Delete</Button>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <div>
    <div className="home-button-container">
      <Button variant="primary" onClick={handleGoHome}>Home</Button>
    </div>
    <div className="table-container">
    <div className="table-wrapper">
    <TablePagination data={data} columns={columns} />
      <div className="button-container">
        <Button className="download-button" onClick={handleDownloadCSV}>Download CSV</Button>
        <Button className="add-button" onClick={() => setShowAddModal(true)}>Add Customer</Button>
      </div>
    </div>

      <Modal show={showAddModal} onHide={handleCloseModal}>
        <CustomerModal
          title="Add Customer"
          name={name}
          email={email}
          phone={phone}
          location={location}
          hobbies={hobbies}
          setName={setName}
          setEmail={setEmail}
          setPhone={setPhone}
          setLocation={setLocation}
          setHobbies={setHobbies}
          handleSubmit={handleAddCustomer}
          handleClose={handleCloseModal}
        />
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <CustomerModal
          name={name}
          email={email}
          phone={phone}
          location={location}
          hobbies={hobbies}
          setName={setName}
          setEmail={setEmail}
          setPhone={setPhone}
          setLocation={setLocation}
          setHobbies={setHobbies}
          handleSubmit={handleUpdateCustomer}
          handleClose={() => {
            setShowEditModal(false);
            setName('');
            setEmail('');
            setPhone('');
            setLocation('');
            setHobbies('');
          }}
          title="Edit Customer"
        />
      </Modal>
    </div>
    </div>
  );
};

export default Customers;
