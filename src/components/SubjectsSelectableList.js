import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListGroup } from 'react-bootstrap';

const SubjectsList = ({ selectedSubjects, setSelectedSubjects }) => {
  const [subjects, setSubjects] = useState([]);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      alert('An error occurred while fetching subjects. Please try again later.');
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleSubjectClick = (e, selectedSubject) => {
    e.preventDefault();
    e.stopPropagation();

    let updatedSelectedSubjects = [...selectedSubjects];
    if (updatedSelectedSubjects.includes(selectedSubject)) {
      updatedSelectedSubjects = updatedSelectedSubjects.filter(
        (subject) => subject !== selectedSubject
      );
    } else {
      updatedSelectedSubjects.push(selectedSubject);
    }
    setSelectedSubjects(updatedSelectedSubjects);
  };

  return (
    <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ced4da', borderRadius: '5px', padding: '10px' }}>
      <ListGroup>
        {subjects.map((subject) => (
          <ListGroup.Item
            key={subject.id}
            action
            as="button"
            onClick={(e) => handleSubjectClick(e, subject.name)}
            active={selectedSubjects.includes(subject.name)}
          >
            {subject.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default SubjectsList;
