import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

const UpdateUser = () => {
    const { id } = useParams();
    const [user, setUser] = useState({});
    useEffect(() => {
        const url = `http://localhost:5000/users/${id}`
        fetch(url)
            .then(res => res.json())
            .then(data => setUser(data))
    }, [])
    const handleNameChange = e => {
        const updatedUser = { name: e.target.value, email: user.email };
        setUser(updatedUser);
    }
    const handleEmailChange = e => {
        const updatedUser = { ...user };
        updatedUser.email = e.target.value;
        setUser(updatedUser);
    }
    const handleUpdateUser = e => {
        const url = `http://localhost:5000/users/${id}`;
        fetch(url, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(res => res.json())
            .then(data => {
                if (data.modifiedCount > 0) {
                    alert('Updated successfully')
                    setUser({});
                }
            })

        e.preventDefault()
    }

    return (
        <div>
            <h2>Update {user.name}</h2>
            <h2>Update {user.email}</h2>
            <h6>{id}</h6>
            <form onSubmit={handleUpdateUser}>
                <input type="text" onChange={handleNameChange} value={user.name || ''} />
                <input type="email" onChange={handleEmailChange} value={user.email || ''} id="" />
                <input type="submit" value="submit" />
            </form>
        </div>
    );
};

export default UpdateUser;