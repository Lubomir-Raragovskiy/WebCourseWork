import React from 'react';
import { Form } from 'react-bootstrap';

const PortraitUploader = ({ onFileSelect, disabled }) => {
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

        if (file && validImageTypes.includes(file.type)) {
            onFileSelect(file);
        } else {
            alert('Please upload a valid image file (jpg, png, or gif).');
            onFileSelect(null);
            e.target.value = null;
        }
    };

    return (
        <Form.Group className="mb-3" controlId="portrait">
            <Form.Label>Upload Portrait</Form.Label>
            <Form.Control
                type="file"
                onChange={handleFileChange}
                disabled={disabled}
            />
        </Form.Group>
    );
};

export default PortraitUploader;
