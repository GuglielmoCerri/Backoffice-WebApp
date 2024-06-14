import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';

import './Customers.css';

import {
  Column,
  ColumnDef,
  PaginationState,
  Table,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { makeData, Customer } from './makeData.ts';
import { Button, Modal } from 'react-bootstrap';
import CustomerModal from './components/CustomerModal';

const Customers = () => {
  const [data, setData] = useState<Customer[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [hobbies, setHobbies] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

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
        header: () => 'Phone',
        footer: props => props.column.id,
      },
      {
        accessorKey: 'location',
        header: () => <span>Location</span>,
        footer: props => props.column.id,
      },
      {
        accessorKey: 'hobbies',
        header: 'Hobbies',
        footer: props => props.column.id,
      },
    ],
    []
  );

  return (
    <>
      <MyTable
        data={data}
        columns={columns}
      />
      <hr />
      <Button className="add-button" variant="success" onClick={() => setShowAddModal(true)}>Add Customer</Button>
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
    </>
  );
};

function MyTable({
  data,
  columns,
}: {
  data: Customer[];
  columns: ColumnDef<Customer>[];
}) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  return (
    <div className="p-2">
      <div className="h-2" />
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} colSpan={header.colSpan}>
                  <div
                    className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: ' 🔼',
                      desc: ' 🔽',
                    }[header.column.getIsSorted() as string] ?? null}
                    {header.column.getCanFilter() && (
                      <div>
                        <Filter column={header.column} table={table} />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="h-2" />
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function Filter({
  column,
  table,
}: {
  column: Column<any, any>;
  table: Table<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === 'number' ? (
    <div className="flex space-x-2" onClick={e => e.stopPropagation()}>
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ''}
        onChange={e =>
          column.setFilterValue((old: [number, number]) => [
            e.target.value,
            old?.[1],
          ])
        }
        placeholder={`Min`}
        className="w-24 border shadow rounded"
      />
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ''}
        onChange={e =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            e.target.value,
          ])
        }
        placeholder={`Max`}
        className="w-24 border shadow rounded"
      />
    </div>
  ) : (
    <input
      className="w-36 border shadow rounded"
      onChange={e => column.setFilterValue(e.target.value)}
      onClick={e => e.stopPropagation()}
      placeholder={`Search...`}
      type="text"
      value={(columnFilterValue ?? '') as string}
    />
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Customers />
  </React.StrictMode>
);

export default Customers;
