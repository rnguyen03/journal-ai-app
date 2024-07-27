import './style.css'

import React from 'react'
import {useState} from 'react';
import Sidebar from 'components/sidebar'
import AuthButton from 'components/auth-button'

const ParentComponent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    return (
      <div>
        <h2>Enter your email</h2>
        <EmailInput email={email} setEmail={setEmail} />
        <p>Your email: {email}</p>
        <PasswordInput password={password} setPassword={setPassword} />
        <p>Your passwords: {password}</p>
      </div>
    );
  };

const EmailInput = ({ email, setEmail}) =>{
    return (
        <div className="input-group">
            <input type="email" className="form-control" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} />
            
        </div>
    )
}

const PasswordInput = ({ password, setPassword })=>{
    return(
        <div className="input-group">
        <input type="password" className="form-control" placeholder="Password" value = {password}
        onChange={(e) => setPassword(e.target.value)}/>
        <button className="btn btn-primary">Submit</button>
        </div>
    )
}

export default PasswordInput;