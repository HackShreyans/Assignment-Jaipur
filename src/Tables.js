import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser, updateUser } from './redux/userSlice'; // Import updateUser action

const tableStyles = {
  container: {
    margin: '20px',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  th: {
    padding: '10px',
    border: '1px solid #ddd',
    backgroundColor: '#f2f2f2',
    textAlign: 'left',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  td: {
    padding: '10px',
    border: '1px solid #ddd',
  },
  evenRow: {
    backgroundColor: '#f9f9f9',
  },
  actionBtn: {
    padding: '5px 10px',
    marginRight: '5px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '3px',
    backgroundColor: '#007bff',
    color: '#fff',
    transition: 'background 0.3s ease',
  },
};

const Tables = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const loading = useSelector((state) => state.users.loading);
  const error = useSelector((state) => state.users.error);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    zipcode: '',
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(userId));
    }
  };

  const handleUpdate = (user) => {
    setSelectedUser(user);
    setUpdateFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      city: user.address.city,
      zipcode: user.address.zipcode,
    });
    setShowUpdateForm(true);
  };

  const handleUpdateFormSubmit = () => {
    dispatch(
      updateUser({
        id: selectedUser.id,
        name: updateFormData.name,
        email: updateFormData.email,
        phone: updateFormData.phone,
        address: {
          city: updateFormData.city,
          zipcode: updateFormData.zipcode,
        },
      })
    );
    setShowUpdateForm(false);
    setSelectedUser(null);
    setUpdateFormData({
      name: '',
      email: '',
      phone: '',
      city: '',
      zipcode: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div style={tableStyles.container}>
      <h2 style={{textAlign:'center',color:'blue'}}>User Table</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <table style={tableStyles.table}>
        <thead>
          <tr>
            <th style={tableStyles.th}>ID</th>
            <th style={tableStyles.th}>Name</th>
            <th style={tableStyles.th}>Email</th>
            <th style={tableStyles.th}>Phone</th>
            <th style={tableStyles.th}>City with Zip Code</th>
            <th style={tableStyles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id} style={index % 2 === 0 ? tableStyles.evenRow : null}>
              <td style={tableStyles.td}>{user.id}</td>
              <td style={tableStyles.td}>{user.name}</td>
              <td style={tableStyles.td}>{user.email}</td>
              <td style={tableStyles.td}>{user.phone}</td>
              <td style={tableStyles.td}>{`${user.address.city} ${user.address.zipcode}`}</td>
              <td style={tableStyles.td}>
                <button style={tableStyles.actionBtn} onClick={() => handleUpdate(user)}>
                  Update
                </button>
                <button style={tableStyles.actionBtn} onClick={() => handleDelete(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showUpdateForm && selectedUser && (
        <UpdateForm
          formData={updateFormData}
          onChange={handleChange}
          onSubmit={handleUpdateFormSubmit}
          onCancel={() => setShowUpdateForm(false)}
        />
      )}
    </div>
  );
};

const UpdateForm = ({ formData, onChange, onSubmit, onCancel }) => {
  return (
    <div style={{ ...styles.formContainer, ...styles.centered }}>
      <h3 style={styles.formTitle}>Update User</h3>
      <form onSubmit={onSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="name" style={styles.label}>
            Name:
          </label>
          <input type="text" name="name" value={formData.name} onChange={onChange} style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>
            Email:
          </label>
          <input type="text" name="email" value={formData.email} onChange={onChange} style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="phone" style={styles.label}>
            Phone:
          </label>
          <input type="text" name="phone" value={formData.phone} onChange={onChange} style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="city" style={styles.label}>
            City:
          </label>
          <input type="text" name="city" value={formData.city} onChange={onChange} style={styles.input} />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="zipcode" style={styles.label}>
            Zip Code:
          </label>
          <input type="text" name="zipcode" value={formData.zipcode} onChange={onChange} style={styles.input} />
        </div>
        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.button}>
            Update
          </button>
          <button type="button" onClick={onCancel} style={{ ...styles.button, backgroundColor: '#dc3545' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  formContainer: {
    background: '#f9f9f9',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)',
    maxWidth: '400px',
    position: 'fixed',
  },
  centered: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  formTitle: {
    margin: '0 0 20px 0',
    textAlign: 'center',
    fontSize: '24px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    marginBottom: '5px',
    fontSize: '16px',
    color: '#666',
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '3px',
    fontSize: '16px',
  },
  buttonGroup: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '3px',
    fontSize: '16px',
    cursor: 'pointer',
    border: 'none',
    background: '#007bff',
    color: '#fff',
    transition: 'background 0.3s ease',
  },
};

export default Tables;
