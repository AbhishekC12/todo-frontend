import axios from "axios";
import { useEffect, useState } from "react";
import { useFormik } from "formik";

export function ToDoApp() {
    const [appointments, setAppointments] = useState([]);
    const [toggleAdd, setToggleAdd] = useState({ display: 'block' });
    const [toggleEdit, setToggleEdit] = useState({ display: 'none' });
    const [editAppoint, setEditAppointment] = useState({ Id: 0, Title: '', Date: '', Description: '' });

    const formik = useFormik({
        initialValues: {
            Id: 0,
            Title: '',
            Description: '',
            Date: new Date().toISOString().substr(0, 10) // Initial date in YYYY-MM-DD format
        },
        onSubmit: (appointment) => {
            axios.post(`https://todo-backend-swkz.onrender.com/addtask`, appointment)
                .then(() => {
                    alert('Appointment Added Successfully..');
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Error adding appointment:', error);
                });
        }
    });

    const editFormik = useFormik({
        initialValues: {
            Id: editAppoint.Id || 0, // Ensure Id is initialized properly
            Title: editAppoint.Title || '',
            Date: editAppoint.Date ? new Date(editAppoint.Date).toISOString().substr(0, 10) : new Date().toISOString().substr(0, 10), // Convert to YYYY-MM-DD format
            Description: editAppoint.Description || ''
        },
        enableReinitialize: true,
        onSubmit: (appointment) => {
            axios.put(`https://todo-backend-swkz.onrender.com/${editAppoint.Id}`, appointment)
                .then(() => {
                    alert('Appointment Modified Successfully..');
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Error modifying appointment:', error);
                });
        }
    });

    useEffect(() => {
        loadAppointments();
    }, []);

    function loadAppointments() {
        axios.get(`https://todo-backend-swkz.onrender.com/appointments`)
            .then(response => {
                setAppointments(response.data);
            })
            .catch(error => {
                console.error('Error fetching appointments:', error);
            });
    }

    function handleDeleteClick(e) {
        var id = parseInt(e.target.value);
        var flag = window.confirm(`Are you sure\n Want to Delete?`);
        if (flag === true) {
            axios.delete(`https://todo-backend-swkz.onrender.com/deletetask/${id}`)
                .then(() => {
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Error deleting appointment:', error);
                });
        }
    }

    function handleEditClick(id) {
        setToggleAdd({ display: 'none' });
        setToggleEdit({ display: 'block' });
        axios.get(`https://todo-backend-swkz.onrender.com/appointments/${id}`)
            .then(response => {
                setEditAppointment(response.data || { Id: 0, Title: '', Date: '', Description: '' });
            })
            .catch(error => {
                console.error('Error fetching appointment for edit:', error);
                setEditAppointment({ Id: 0, Title: '', Date: '', Description: '' }); // Set default values or handle error case
            });
    }

    function handleCancelClick() {
        setToggleAdd({ display: 'block' });
        setToggleEdit({ display: 'none' });
    }

    return (
        <div className="container-fluid">
            <h1 className="text-center">To Do App</h1>
            <header>
                <div aria-label="AddAppointment" style={toggleAdd} >
                    <label className="form-label fw-bold">Add New Appointment</label>
                    <div>
                        <form onSubmit={formik.handleSubmit} className="w-50">
                            <div className="d-flex">
                                <input type="number" name="Id" value={formik.values.Id} className="form-control" onChange={formik.handleChange} />
                                <input type="text" name="Title" onChange={formik.handleChange} className="form-control" placeholder="Title" />
                                <input type="date" name="Date" onChange={formik.handleChange} className="form-control" value={formik.values.Date} />
                            </div>
                            <div className="mt-2">
                                <label className="form-label fw-bold">Description</label>
                                <textarea name="Description" onChange={formik.handleChange} className="form-control" value={formik.values.Description}></textarea>
                                <div className="mt-3">
                                    <button className="btn btn-primary">Add</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div aria-label="EditAppointment" style={toggleEdit} >
                    <label className="form-label fw-bold">Edit Appointment</label>
                    <div>
                        <form onSubmit={editFormik.handleSubmit} className="w-50">
                            <div className="d-flex">
                                <input type="number" name="Id" value={editFormik.values.Id} className="form-control" onChange={editFormik.handleChange} />
                                <input type="text" name="Title" value={editFormik.values.Title} onChange={editFormik.handleChange} className="form-control" placeholder="Title" />
                                <input type="date" name="Date" value={editFormik.values.Date} onChange={editFormik.handleChange} className="form-control" />
                            </div>
                            <div className="mt-2">
                                <label className="form-label fw-bold">Description</label>
                                <textarea name="Description" value={editFormik.values.Description} onChange={editFormik.handleChange} className="form-control"></textarea>
                                <div className="mt-3">
                                    <button className="btn btn-success">Save</button>
                                    <button type="button" onClick={handleCancelClick} className="ms-2 btn btn-danger">Cancel</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </header>

            <main className="mt-4">
                <div>
                    <label className="form-label fw-bold">Your Appointments</label>
                    <div className="d-flex flex-wrap">
                        {
                            appointments.map(appointment =>
                                <div className="alert alert-dismissible alert-success m-2 w-25" key={appointment.Id}>
                                    <button className="btn btn-close" value={appointment.Id} onClick={handleDeleteClick}></button>
                                    <div className="h5 alert-title">{appointment.Title}</div>
                                    <p>{appointment.Description}</p>
                                    <span className="bi bi-calendar"></span> {appointment.Date ? new Date(appointment.Date).toLocaleDateString() : ''}
                                    <div className="mt-3">
                                        <button onClick={() => { handleEditClick(appointment.Id) }} className="bi bi-pen-fill btn btn-warning"> Edit </button>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </main>
        </div>
    );
}
