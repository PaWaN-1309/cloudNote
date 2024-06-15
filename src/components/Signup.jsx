import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" })
  let navigate = useNavigate();
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/auth/createuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: credentials.name, email: credentials.email, password: credentials.password
        })
      });

      const responseData = await response.json();
      if (responseData.success) {
        localStorage.setItem('token', responseData.authToken); 
        navigate("/"); 
        alert("Account creation successful.. !");
      } else {
        console.log(responseData.error);
        alert("Account creation failed: " + responseData.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error: " + error.message);
    }
  }

  return (
    <div className='container'>
      <h1 className='my-5'>Sign - Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 my-5">
          <label htmlFor="name" className="form-label">Name</label>
          <input onChange={onChange} value={credentials.name} type="name" className="form-control" id="name" aria-describedby="nameHelp" name="name" />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input onChange={onChange} value={credentials.email} type="email" className="form-control" id="email" aria-describedby="emailHelp" name="email" />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input minLength={5} onChange={onChange} value={credentials.password} type="password" className="form-control" id="password" name="password" />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">Confirm Password</label>
          <input minLength={5} onChange={onChange} value={credentials.cpassword} type="password" className="form-control" id="cpassword" name="cpassword" />
        </div>
        <button disabled={credentials.name.length == 0 || credentials.email.length == 0 || credentials.password.length == 0 || credentials.password !== credentials.cpassword} type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default Signup
