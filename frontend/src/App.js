import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './App.css';
import { PieChart, Pie, Cell, Legend, Tooltip ,LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

function App() {
  const [student, setStudent] = useState({
    name: '',
    roll_number: '',
    department: '',
    semester: '',
    gpa: ''
  });
  const [username, setUsername] = useState('');

  const [ password, setPassword] = useState('');

  const [role, setRole] = useState(null);

  const departments=['CS','SE','AI','CGV','IT','DS']

  const [editIndex, setEditIndex] = useState(null);

  const [students, setStudents] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  const [originalList, setOriginalList] = useState([]);

  const [sortSelection, setSortSelection] = useState('');

  const [topDept, setTopDept] = useState('CS');

  const [topStudents, setTopStudents] = useState([]);

  const [failingStudents, setFailingStudents] = useState([]);

  const handleLogin = (e) =>{
      e.preventDefault();

        if(username === "alina@admin" && password === "admin123"){
        setRole("Admin")
      } else if (username === "ayesha@admin" && password === "admin123"){
        setRole("Admin")
      } else if (username === "lin@student" && password === "student123"){
        setRole("student")
      }else if(username ==="zaineb@student" && password === "student123"){
        setRole("student")
      }else{
        alert("Invalid Credentials!")
      }

      setUsername("")
      setPassword("")
  }


  useEffect(() => {
    axios.get('http://localhost:8000/api/students/')
      .then(res => {
        setStudents(res.data);
        setOriginalList(res.data);       
      })
      .catch(err => {
        console.error("Error fetching students:", err);
      });
  }, []);

  useEffect(() => {
      getTopStudentsByDept(topDept);
    }, [originalList, topDept]);

  useEffect(() =>{
    const failing = originalList.filter(s => s.gpa<2.0);
    setFailingStudents(failing);
  },[originalList]);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const gpa = parseFloat(student.gpa);

    const updatedStudent = { ...student, gpa };

    if (editIndex !== null) { //if edit index is set it puts, otheriwse posts
     const rollNumber = students[editIndex].roll_number;

        axios.put(`http://localhost:8000/api/students/${rollNumber}/`, updatedStudent)
        .then(res => {
          const updatedStudents = [...students];
          updatedStudents[editIndex] = res.data;
          setStudents(updatedStudents);
          setOriginalList(updatedStudents)
          setEditIndex(null); 
          setStudent({ name: '', roll_number: '', department: '', semester: '', gpa: '' });
          alert('Student updated successfully!');
        })
        .catch(err => {
          console.error("Error updating student:", err.response?.data || err.message);
          alert('Error updating student');
        });
    } else {
      axios.post('http://localhost:8000/api/students/', updatedStudent)
        .then(res => {
          alert('Student added successfully!');
          setStudents(prev => [...prev, res.data]);
          setOriginalList(prev => [...prev, res.data]);
          setStudent({ name: '', roll_number: '', department: '', semester: '', gpa: '' });
        })
        .catch(err => {
          console.error("Error adding student:", err.response?.data || err.message);
          alert('Error adding student');
        });
    }
};

  const handleEdit = (roll_number) => {
    const selectedStudent = students.find(s => s.roll_number === roll_number);

    const confirmed = window.confirm("Are you sure you want to edit this student?");
    if (!confirmed) return;

    setStudent({
      name: selectedStudent.name,
      roll_number: selectedStudent.roll_number,
      department: selectedStudent.department,
      semester: selectedStudent.semester,//lsadnlwfwlbflwbfl
      gpa: selectedStudent.gpa.toString()
    });

    const index = students.findIndex(s => s.roll_number === roll_number);
    setEditIndex(index);
};


  const handleDelete = (rollNumber) => {
    const confirmed = window.confirm("Are you sure you want to delete this student?");
    if (!confirmed) return;
    axios.delete(`http://localhost:8000/api/students/${rollNumber}/`)
      .then(() => {
        setStudents(students.filter(s => s.roll_number !== rollNumber));
        setOriginalList(originalList.filter(s => s.roll_number !== rollNumber))
      })
      .catch(err => console.error(err));
  };

  const handleSearch = () => {
    const term = searchTerm.toLowerCase().trim();
    if(!term){
      setStudents(originalList);
      return;
    }
    const filtered = originalList.filter(s =>
       s.name.toLowerCase() === term ||
       s.semester.toString() === term ||
       s.department.toLowerCase() === term
      );
    setStudents(filtered);
  }

  const handleReset = () => {
    setStudents(originalList);
    setSearchTerm('')
  }

  const handleSort =()=>{
    let sortedList = [...students];

    if(sortSelection === 'GPA'){
      sortedList.sort((a,b) => b.gpa - a.gpa); //high to low
    }
    else if(sortSelection === 'Semester'){
      sortedList.sort((a,b) => a.semester - b.semester) //low to high
    }
    setStudents(sortedList);
  }

  const handleSortReset =() => {
    setStudents (originalList);
    setSortSelection('')
  }

  const handleExportJSON = () => {
      const dataStr = JSON.stringify(students, null, 2); //JSON.stringify(value,filter,space)
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "students.json";
      a.click();
      URL.revokeObjectURL(url);
    };

  const handleImportJSON = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const importedStudents = JSON.parse(evt.target.result);
          if (Array.isArray(importedStudents)) {
            // Filter out duplicates based on roll_number
            const newStudents = importedStudents.filter(
              impStu => !originalList.some(origStu => origStu.roll_number === impStu.roll_number)
            );

            if(newStudents.length === 0) {
              alert("No new students to import.");
              return;
            }

            const postPromises = newStudents.map(student =>
              axios.post('http://localhost:8000/api/students/', student)
                .then(res => res.data)
            );

            const savedStudents = await Promise.all(postPromises);

            // Merge backend saved students with existing list
            const mergedStudents = [...originalList, ...savedStudents];

            setStudents(mergedStudents);
            setOriginalList(mergedStudents);

            alert("Students imported and saved to backend successfully!");
          } else {
            alert("Invalid JSON format: Expected an array of students.");
          }
        } catch (err) {
          alert("Error parsing JSON: " + err.message);
        }
      };
      reader.readAsText(file);
    };

  const getTopStudentsByDept = (dept) => {
      const filtered = originalList.filter(s => s.department === dept).sort((a,b) => b.gpa - a.gpa).slice(0,5);
      setTopStudents(filtered);
    };

  const getDepartmentCounts = () => {
    const counts = {};
    originalList.forEach(s => {
      counts[s.department] = (counts[s.department] || 0) + 1;
    });

    return Object.entries(counts).map(([department, count]) => ({
      name: department,
      value: count
    }));
  };

  const pieData = getDepartmentCounts();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a83279', '#8232a8'];

  const avgGPAData = useMemo(()=>{
    const semesterGroups = {};

    originalList.forEach(student=>{
      if(!semesterGroups[student.semester]){
        semesterGroups [student.semester] = {totalGPA : 0, count : 0};
      }
      semesterGroups[student.semester].totalGPA += student.gpa;
      semesterGroups[student.semester].count++;
    });

    return Object.keys(semesterGroups).map(sem=>({
      semester : sem,
      avgGPA : (semesterGroups[sem].totalGPA / semesterGroups[sem].count).toFixed(2)
    }))
  },[originalList]);

   const handleOnlyStar =()=>{
     let starred = originalList.filter(s=> s.gpa>3.0)
       setStudents(starred);
   };

  return (
    <>
      {role === null ? (
        <div className='login-container'>
          <div className='login-box'>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <input type = "text" placeholder='Username' value ={username} onChange={(e)=>setUsername(e.target.value)} required/>
              <input type= "password" placeholder = "Password" value = {password} onChange={(e)=>setPassword(e.target.value)} required/>
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
      ) : (
        <div className="container">
          <header className="header">
            <h1 className="title">EduTrack Dashboard</h1>
            {role === 'Admin' && (
              <div className="admin-controls">
                <h2 className="subtitle">Student Management</h2>
                <form className="student-form" onSubmit={handleSubmit}>
                  <input type="text" name="name" placeholder="Name" value={student.name} onChange={handleChange} required />
                  <input type="text" name="roll_number" placeholder="Roll Number" value={student.roll_number} onChange={handleChange} required />
                  <select 
                    name="department"
                    value={student.department} 
                    onChange={handleChange}
                    required
                    >
                    <option value="">Select Department</option>
                    {departments.map((dept, index) => (
                      <option key={index} value={dept}>{dept}</option>
                    ))}
                  </select>
                  <input type="number" step="1" name="semester" placeholder="Semester" value={student.semester} onChange={handleChange} min="1" max="8" required />
                  <input type="number" step="0.01" name="gpa" placeholder="GPA" value={student.gpa} onChange={handleChange} min="0" max="4.00" required />
                  <button type="submit">{editIndex !== null ? 'Update Student' : 'Add Student'}</button>
                </form>
              </div>
            )}
          </header>

          <section className="data-controls">
            <div className="search-sort-section">
              <div className="search-bar">
                <input type="text" name="name" placeholder='Search by name, semester, or department' 
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <button className="search-button" onClick={() => handleSearch()}>Search</button>
                <button className="reset-button" onClick={() => handleReset()}>Reset</button>
              </div>

              <div className="sort-section">
                <select value={sortSelection} onChange={(e) => setSortSelection(e.target.value)}>
                  <option value="" disabled>Sort by...</option>
                  <option value='GPA'>GPA</option>
                  <option value='Semester'>Semester</option>
                </select>
                <button className="apply-button" onClick={() => handleSort()}>Sort</button>
                <button className="reset-button" onClick={() => handleSortReset()}>Reset</button>
              </div>

              <div className="import-export-section">
                <button onClick={handleExportJSON}>Export JSON</button>
                {role === 'Admin' && (
                  <label className="import-button">
                    Import JSON
                    <input type="file" accept=".json,application/json" onChange={handleImportJSON} />
                  </label>
                )}
              </div>
               
             <button className="only-star-button" onClick={handleOnlyStar}>Only ⭐️</button>

            </div>
          </section>

          <section className="data-display">
            <div className="student-list-container">
              <h2 className="subtitle">Student List</h2>
              <div className="student-list">
                {students.length === 0 ? (
                  <p className="no-data">No students match your search.</p>
                ) : (
                  students.map((s) => (
                    <div className="student-card" key={s.roll_number}>
                      {s.gpa > 3 && <div className="star-badge">⭐️</div>}
                      <div className="student-info">
                        <p><strong>Name:</strong> {s.name}</p>
                        <p><strong>Roll No:</strong> {s.roll_number}</p>
                        <p><strong>Department:</strong> {s.department}</p>
                        <p><strong>Semester:</strong> {s.semester}</p>
                        <p><strong>GPA:</strong> {s.gpa}</p>
                      </div>
                      {role === 'Admin' && (
                        <div className="student-actions">
                          <button className="edit-button" onClick={() => handleEdit(s.roll_number)}>Edit</button>
                          <button className="delete-button" onClick={() => handleDelete(s.roll_number)}>Delete</button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="charts-container">
              <div className="chart-section">
                <h2 className="subtitle">Student Count per Department</h2>
                <div className="chart-wrapper">
                  <PieChart width={350} height={300}>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </div>
              </div>

              <div className="chart-section">
                <h2 className="subtitle">Average GPA by Semester</h2>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={avgGPAData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="semester" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="avgGPA"
                        stroke="#8884d8"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="top-students-section">
              <div className="top-students">
                <h2 className="subtitle">Top 5 Students - {topDept} Department</h2>
                <div className="top-dropdown">
                  <select value={topDept} onChange={(e) => setTopDept(e.target.value)}>
                    <option value="CS">CS</option>
                    <option value="SE">SE</option>
                    <option value="AI">AI</option>
                    <option value="DS">DS</option>
                    <option value="IT">IT</option>
                    <option value="CGV">CGV</option>
                  </select>
                </div>
                <div className="student-list">
                  {topStudents.length === 0 ? (
                    <p className="no-data">No students found for this department</p>
                  ) : (
                    topStudents.map((s) => (
                      <div className="student-card" key={s.roll_number}>
                        <div className="student-info">
                          <p><strong>Name:</strong> {s.name}</p>
                          <p><strong>Roll No:</strong> {s.roll_number}</p>
                          <p><strong>GPA:</strong> {s.gpa}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="failing-students">
                <h2 className="subtitle">Failing Students (GPA &lt; 2.0)</h2>
                <div className="student-list">
                  {failingStudents.length === 0 ? (
                    <p className="no-data">No students are failing</p>
                  ) : (
                    failingStudents.map((s) => (
                      <div className="student-card failing" key={s.roll_number}>
                        <div className="student-info">
                          <p><strong>Name:</strong> {s.name}</p>
                          <p><strong>Roll No:</strong> {s.roll_number}</p>
                          <p><strong>GPA:</strong> {s.gpa}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}


export default App;
