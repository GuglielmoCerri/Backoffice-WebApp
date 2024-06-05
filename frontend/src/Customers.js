import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable } from 'react-table';
import { Button, Modal, Form } from 'react-bootstrap';
import './Customers.css'; // Aggiunta per importare il file CSS

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

  const data = React.useMemo(() => customers, [customers]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Phone',
        accessor: 'phone',
      },
      {
        Header: 'Location',
        accessor: 'location',
      },
      {
        Header: 'Hobbies',
        accessor: 'hobbies',
      },
      {
        Header: 'Actions',
        accessor: 'id',
        Cell: ({ row }) => (
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
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <div className="table-container">
      <h1>Customers</h1>
      <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps()}
                  style={{
                    borderBottom: 'solid 3px red',
                    background: 'aliceblue',
                    color: 'black',
                    fontWeight: 'bold',
                  }}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      style={{
                        padding: '10px',
                        border: 'solid 1px gray',
                        background: 'papayawhip',
                      }}
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <Button className="add-button" variant="success" onClick={() => setShowAddModal(true)}>Add Item</Button>
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header>
          <Modal.Title>Add Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter name" value={name} onChange={e => setName(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control type="text" placeholder="Enter phone" value={phone} onChange={e => setPhone(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formLocation">
            <Form.Label>Location</Form.Label>
            <Form.Control type="text" placeholder="Enter location" value={location} onChange={e => setLocation(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formHobbies">
            <Form.Label>Hobbies</Form.Label>
            <Form.Control type="text" placeholder="Enter hobbies" value={hobbies} onChange={e => setHobbies(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={addCustomer}>Add</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter name" value={name} onChange={e => setName(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Form.Group controlId="formPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control type="text" placeholder="Enter phone" value={phone} onChange={e => setPhone(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formLocation">
            <Form.Label>Location</Form.Label>
            <Form.Control type="text" placeholder="Enter location" value={location} onChange={e => setLocation(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formHobbies">
            <Form.Label>Hobbies</Form.Label>
            <Form.Control type="text" placeholder="Enter hobbies" value={hobbies} onChange={e => setHobbies(e.target.value)} />
          </Form.Group>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={updateCustomer}>Update</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Customers;
