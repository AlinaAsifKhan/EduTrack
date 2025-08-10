import {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css';

const App =  () => {

  const [students, setStudents]= useState([])



  useEffect(()=>{
     axios.get('http://localhost:8000/api/students/')
    .then(res =>{
        setStudents(res.data)
    })
    .catch(err =>{
        console.error(err)
    })
  
}, []);
  



return (
    <div className ="container" >
      <h2>Add a Student:</h2>
        <form onSubmit={handleSubmit}>
          <form className="student-form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" value={student.name} onChange={handleChange} required />
          <input type="text" name="roll_number" placeholder="Roll Number" value={student.roll_number} onChange={handleChange} required />
          <input type="text" name="department" placeholder="Department" value={student.department} onChange={handleChange} required />
          <input type="text" name="semester" placeholder="Semester" value={student.semester} onChange={handleChange} required />
          <input type="number" step="0.01" name="gpa" placeholder="GPA" value={student.gpa} onChange={handleChange} required />
          <button type="submit">Add Student</button>
        </form>
        </form>
      <h2 className="subtitle">Student List</h2>
      <div className="student-list">
        {students.map((s, index) => (
          <div className="student-card" key={index}>
              <p><strong>Name:</strong> {s.name}</p>
              <p><strong>Roll No:</strong> {s.roll_number}</p>
              <p><strong>Department:</strong> {s.department}</p>
              <p><strong>Semester:</strong> {s.semester}</p>
              <p><strong>GPA:</strong> {s.gpa}</p>
            </div>
        ))}
      </div>
    </div>
  );
};

export default App;