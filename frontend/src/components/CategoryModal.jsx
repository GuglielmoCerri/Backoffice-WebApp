import React from 'react';
import { X, Plus, UserRound, NotebookText, CheckSquare, Calendar } from 'lucide-react';
import { Form, Button } from 'react-bootstrap';

function CategoryModal({
  name, description, status, created_at, updated_at,
  setName, setDescription, setStatus,
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
              />
            </Form.Group>
            <Form.Group controlId="formStatus" className="custom-form-group">
              <Form.Label><CheckSquare size={20} /> Status</Form.Label>
              <Form.Check 
                type="checkbox" 
                checked={status} 
                onChange={(e) => setStatus(e.target.checked)} 
                label={status ? "Active" : "Inactive"} 
                className="custom-form-check"
              />
            </Form.Group>
            <Form.Group controlId="formCreatedAt" className="custom-form-group">
              <Form.Label><Calendar size={20} /> Created At</Form.Label>
              <Form.Control 
                type="text" 
                value={created_at} 
                placeholder="Auto-generated" 
                className="custom-form-control"
                readOnly
              />
            </Form.Group>
            <Form.Group controlId="formUpdatedAt" className="custom-form-group">
              <Form.Label><Calendar size={20} /> Updated At</Form.Label>
              <Form.Control 
                type="text" 
                value={updated_at} 
                placeholder="Auto-generated" 
                className="custom-form-control"
                readOnly
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

export default CategoryModal;
