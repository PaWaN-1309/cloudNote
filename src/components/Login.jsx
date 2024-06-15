import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" })
    let navigate = useNavigate();
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: credentials.email, password: credentials.password
            })
        });
        const responseJson = await response.json();
        console.log(responseJson);
        if (responseJson.success) {
            // Save the auth-token and redirect
            localStorage.setItem('token', responseJson.authToken);
            alert("Login successfull.. !")
            navigate("/")
        } else {
            alert("Invalid credentials.. !")
        }
    }
    return (
        <div className='container'>
            <h1 className='my-5'>Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3 my-5">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input onChange={onChange} value={credentials.email} type="email" className="form-control" id="email" aria-describedby="emailHelp" name="email" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input onChange={onChange} value={credentials.password} type="password" className="form-control" id="password" name="password" />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Login
