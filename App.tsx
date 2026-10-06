import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

interface Student {
  _id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
}

interface StudentForm {
  name: string;
  email: string;
  phone: string;
  course: string;
}

const API_URL = "http://localhost:5000/api/students";

function App() {
  const [students, setStudents] = useState<Student[]>([]);

  const [formData, setFormData] = useState<StudentForm>({
    name: "",
    email: "",
    phone: "",
    course: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  // =========================
  // GET ALL STUDENTS
  // =========================

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL);

      setStudents(response.data);
    } catch (error) {
      console.error(error);

      setError("Unable to fetch students");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD STUDENTS
  // =========================

  useEffect(() => {
    fetchStudents();
  }, []);

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // =========================
  // CREATE / UPDATE
  // =========================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.course
    ) {
      setError("Please fill all fields");
      return;
    }

    try {
      if (editingId) {
        await axios.put(
          `${API_URL}/${editingId}`,
          formData
        );

        setMessage("Student updated successfully");
      } else {
        await axios.post(API_URL, formData);

        setMessage("Student added successfully");
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        course: "",
      });

      setEditingId(null);

      fetchStudents();
    } catch (error: any) {
      console.error(error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  // =========================
  // EDIT STUDENT
  // =========================

  const handleEdit = (student: Student) => {
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone,
      course: student.course,
    });

    setEditingId(student._id);

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE STUDENT
  // =========================

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setMessage("");
      setError("");

      await axios.delete(`${API_URL}/${id}`);

      setMessage("Student deleted successfully");

      fetchStudents();
    } catch (error) {
      console.error(error);

      setError("Unable to delete student");
    }
  };

  // =========================
  // CANCEL EDIT
  // =========================

  const handleCancel = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      course: "",
    });

    setEditingId(null);

    setMessage("");
    setError("");
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="app">

      {/* HEADER */}

      <header className="header">
        <h1>Student Management System</h1>

        <p>
          React + Node.js + Express + MongoDB CRUD Application
        </p>
      </header>


      {/* MAIN */}

      <main className="container">

        {/* FORM CARD */}

        <section className="card">

          <div className="card-header">
            <h2>
              {editingId
                ? "Update Student"
                : "Add New Student"}
            </h2>
          </div>


          {/* SUCCESS MESSAGE */}

          {message && (
            <div className="success-message">
              {message}
            </div>
          )}


          {/* ERROR MESSAGE */}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}


          {/* FORM */}

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              {/* NAME */}

              <div className="input-group">
                <label htmlFor="name">
                  Student Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter student name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>


              {/* EMAIL */}

              <div className="input-group">
                <label htmlFor="email">
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>


              {/* PHONE */}

              <div className="input-group">
                <label htmlFor="phone">
                  Phone
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="text"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>


              {/* COURSE */}

              <div className="input-group">
                <label htmlFor="course">
                  Course
                </label>

                <select
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                >
                  <option value="">
                    Select Course
                  </option>

                  <option value="B.Tech ECE">
                    B.Tech ECE
                  </option>

                  <option value="B.Tech CSE">
                    B.Tech CSE
                  </option>

                  <option value="B.Tech AI & ML">
                    B.Tech AI & ML
                  </option>

                  <option value="B.Tech EEE">
                    B.Tech EEE
                  </option>

                  <option value="B.Tech Mechanical">
                    B.Tech Mechanical
                  </option>
                </select>
              </div>

            </div>


            {/* BUTTONS */}

            <div className="form-buttons">

              <button
                type="submit"
                className="btn btn-primary"
              >
                {editingId
                  ? "Update Student"
                  : "Add Student"}
              </button>


              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </section>


        {/* STUDENT LIST */}

        <section className="card">

          <div className="table-header">

            <div>
              <h2>Student List</h2>

              <p>
                Total Students: {students.length}
              </p>
            </div>

          </div>


          {/* TABLE */}

          <div className="table-container">

            {loading ? (

              <div className="no-data">
                Loading students...
              </div>

            ) : students.length === 0 ? (

              <div className="no-data">
                No students found
              </div>

            ) : (

              <table>

                <thead>
                  <tr>

                    <th>#</th>

                    <th>Name</th>

                    <th>Email</th>

                    <th>Phone</th>

                    <th>Course</th>

                    <th>Actions</th>

                  </tr>
                </thead>


                <tbody>

                  {students.map(
                    (student, index) => (

                      <tr key={student._id}>

                        <td>
                          <span className="serial">
                            {index + 1}
                          </span>
                        </td>


                        <td>
                          <span className="student-name">
                            {student.name}
                          </span>
                        </td>


                        <td>
                          {student.email}
                        </td>


                        <td>
                          {student.phone}
                        </td>


                        <td>
                          <span className="course">
                            {student.course}
                          </span>
                        </td>


                        <td>

                          <div className="actions">

                            <button
                              className="edit-btn"
                              onClick={() =>
                                handleEdit(student)
                              }
                            >
                              Edit
                            </button>


                            <button
                              className="delete-btn"
                              onClick={() =>
                                handleDelete(
                                  student._id
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default App;