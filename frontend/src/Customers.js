import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button, Modal } from 'react-bootstrap';
import './Customers.css'; // Aggiunta per importare il file CSS
import ModalCustomer from './components/CustomerModal';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [hobbies, setHobbies] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const addCustomer = async () => {
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
      fetchCustomers();
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

  const deleteCustomer = async id => {
    try {
      await axios.delete(`http://127.0.0.1:5000/customer/${id}`);
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const updateCustomer = async () => {
    try {
      await axios.put(`http://127.0.0.1:5000/customer/${selectedCustomer.id}`, { name, email, phone, location, hobbies });
      fetchCustomers();
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

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('phone', {
      header: 'Phone',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('location', {
      header: 'Location',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('hobbies', {
      header: 'Hobbies',
      cell: info => info.getValue(),
    }),
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: ({ row }) => (
        <div>
          <Button className="edit-button" variant="info" onClick={() => {
            setSelectedCustomer(row.original);
            setName(row.original.name);
            setEmail(row.original.email);
            setPhone(row.original.phone);
            setLocation(row.original.location);
            setHobbies(row.original.hobbies);
            setShowEditModal(true);
          }}>Edit</Button>{' '}
          <Button className="delete-button" variant="danger" onClick={() => deleteCustomer(row.original.id)}>Del</Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col items-center h-screen bg-gray-100">
      <div className="title-container">
        <h1 className="text-3xl font-bold my-4 text-center">Customers</h1>
      </div>
      <div className="table-container mx-auto">
        <div className="overflow-x-auto w-full max-w-4xl">
          <table className="min-w-full bg-white shadow-md rounded">
            <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="py-3 px-6 text-left">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-100">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="py-3 px-6 text-left whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="button-container">
        <Button className="mt-4 text-center add-customer-button" onClick={() => setShowAddModal(true)}>Add Customer</Button>
      </div>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <ModalCustomer
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
          handleSubmit={addCustomer}
          handleClose={() => {
            setShowAddModal(false);
            setName('');
            setEmail('');
            setPhone('');
            setLocation('');
            setHobbies('');
          }}
          title="Add Customer"
        />
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <ModalCustomer
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
          handleSubmit={updateCustomer}
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
  );
}

export default Customers;
