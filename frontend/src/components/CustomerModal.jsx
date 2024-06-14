import React from 'react';
import { X, Plus, UserRound, Mail, Phone, Map, Gamepad2 } from 'lucide-react';
import { Form, Button } from 'react-bootstrap';

function CustomerModal({
  name, email, phone, location, hobbies,
  setName, setEmail, setPhone, setLocation, setHobbies,
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
            <Form.Group controlId="formEmail" className="custom-form-group">
              <Form.Label><Mail size={20} /> Email</Form.Label>
              <Form.Control 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter email" 
                className="custom-form-control"
                required
              />
            </Form.Group>
            <Form.Group controlId="formPhone" className="custom-form-group">
              <Form.Label><Phone size={20} /> Phone</Form.Label>
              <Form.Control 
                type="text" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="Enter phone" 
                className="custom-form-control"
              />
            </Form.Group>
            <Form.Group controlId="formLocation" className="custom-form-group">
              <Form.Label><Map size={20} /> Location</Form.Label>
              <Form.Control 
                type="text" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                placeholder="Enter location" 
                className="custom-form-control"
              />
            </Form.Group>
            <Form.Group controlId="formHobbies" className="custom-form-group">
              <Form.Label><Gamepad2 size={20} /> Hobbies</Form.Label>
              <Form.Control 
                type="text" 
                value={hobbies} 
                onChange={(e) => setHobbies(e.target.value)} 
                placeholder="Enter hobbies" 
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

export default CustomerModal;
