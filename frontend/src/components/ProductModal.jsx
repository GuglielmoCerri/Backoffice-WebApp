import React from 'react';
import { X, Plus, UserRound, NotebookText, CircleDollarSign, Shapes, Tally5 } from 'lucide-react';
import { Form, Button } from 'react-bootstrap';

function ProductModal({
  name, description, price, category, stock_quantity,
  setName, setDescription, setPrice, setCategory, setStockQuantity,
  handleSubmit, handleClose, title
}) {
  return (
    <div className="modal-container">
      <div className="modal-content">
        <div className="modal-header">
          <h1 className="modal-title">{title}</h1>
          <Button variant="primary" onClick={handleClose} className="close-button">
            <X size={20} color="black" />
          </Button>
        </div>
        <div className="modal-body">
          <Form>
            <Form.Group controlId="formName" className="custom-form-group">
              <Form.Label><UserRound size={20} /> Name</Form.Label>
              <Form.Control 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Enter name" 
                className="custom-form-control"
                required
              />
            </Form.Group>
            <Form.Group controlId="formDescription" className="custom-form-group">
              <Form.Label><NotebookText size={20} /> Description</Form.Label>
              <Form.Control 
                type="text" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Enter description" 
                className="custom-form-control"
                required
              />
            </Form.Group>
            <Form.Group controlId="formPrice" className="custom-form-group">
              <Form.Label><CircleDollarSign size={20} /> Price</Form.Label>
              <Form.Control 
                type="text" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                placeholder="Enter price" 
                className="custom-form-control"
              />
            </Form.Group>
            <Form.Group controlId="formCategory" className="custom-form-group">
              <Form.Label><Shapes size={20} /> Category</Form.Label>
              <Form.Control 
                type="text" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                placeholder="Enter category" 
                className="custom-form-control"
              />
            </Form.Group>
            <Form.Group controlId="formStockQuantity" className="custom-form-group">
              <Form.Label><Tally5 size={20} /> Stock quantity</Form.Label>
              <Form.Control 
                type="text" 
                value={stock_quantity} 
                onChange={(e) => setStockQuantity(e.target.value)} 
                placeholder="Enter stock quantity" 
                className="custom-form-control"
              />
            </Form.Group>
          </Form>
        </div>
        <div className="modal-footer-2">
          <Button variant="primary" onClick={handleSubmit}>
            <Plus />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
