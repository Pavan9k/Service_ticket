import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../admin.module.css';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [newUser, setNewUser] = useState({ name: '', role: '' });
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const studentResponse = await axios.get('http://localhost:8000/Student');
                const facultyResponse = await axios.get('http://localhost:8000/Faculty');
                const combinedUsers = [
                    ...studentResponse.data.map(user => ({
                        id: user.id || 'No ID',
                        name: user.name || 'No Name',
                        password: user.pass || 'No Password', // Updated this line
                        role: 'Student'
                    })),
                    ...facultyResponse.data.map(user => ({
                        id: user.id || 'No ID',
                        name: user.name || 'No Name',
                        password: user.pass || 'No Password', // Updated this line
                        role: 'Faculty'
                    }))
                ];

                console.log('Fetched Users:', combinedUsers);
                setUsers(combinedUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const addUser = async () => {
        try {
            const response = await axios.post(`http://localhost:8000/${newUser.role}`, newUser);
            setUsers([...users, response.data]);
        } catch (error) {
            console.error('Error adding user:', error);
        }
        setNewUser({ name: '', role: '' });
    };

    const editUser = (index) => {
        setEditingUser(index);
        setNewUser(users[index]);
    };

    const saveUser = async (index) => {
        try {
            const updatedUser = newUser;
            await axios.put(`http://localhost:8000/${updatedUser.role}/${updatedUser.id}`, updatedUser);
            const updatedUsers = [...users];
            updatedUsers[index] = updatedUser;
            setUsers(updatedUsers);
        } catch (error) {
            console.error('Error updating user:', error);
        }
        setEditingUser(null);
        setNewUser({ name: '', role: '' });
    };

    const deleteUser = async (index) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const userToDelete = users[index];
                await axios.delete(`http://localhost:8000/${userToDelete.role}/${userToDelete.id}`);
                const updatedUsers = [...users];
                updatedUsers.splice(index, 1);
                setUsers(updatedUsers);
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const filteredUsers = users.filter(user => {
        const name = user.name ? String(user.name).toLowerCase() : '';
        const role = user.role ? String(user.role).toLowerCase() : '';
        const id = user.id ? String(user.id).toLowerCase() : '';
        const password = user.password ? String(user.password).toLowerCase() : '';
        return name.includes(searchTerm.toLowerCase()) || role.includes(searchTerm.toLowerCase()) || id.includes(searchTerm.toLowerCase()) || password.includes(searchTerm.toLowerCase());
    });

    return (
        <div className={styles.section}>
            <h3>User Management</h3>
            <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
            />

            <div className={styles.addUserForm}>
                <input
                    type="text"
                    placeholder="Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className={styles.inputField}
                />
                <input
                    type="text"
                    placeholder="Role"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className={styles.inputField}
                />
                {editingUser === null ? (
                    <button className={styles.addButton} onClick={addUser}>Add User</button>
                ) : (
                    <button className={styles.saveButton} onClick={() => saveUser(editingUser)}>Save User</button>
                )}
            </div>

            {loading ? (
                <p>Loading users...</p>
            ) : (
                <table className={styles.userTable}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Password</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, index) => (
                            <tr key={index}>
                                <td>{user.id || 'No ID'}</td>
                                <td>{user.name || 'No Name'}</td>
                                <td>{user.role || 'No Role'}</td>
                                <td>{user.password || 'No Password'}</td>
                                <td>
                                    <button className={styles.editButton} onClick={() => editUser(index)}>Edit</button>
                                    <button className={styles.deleteButton} onClick={() => deleteUser(index)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default UserManagement;
