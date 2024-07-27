import './style.css'

import React from 'react'
import {useState} from 'react';
import Sidebar from 'components/sidebar'
import AuthButton from 'components/auth-button'
import { handleClientScriptLoad } from 'next/script';

const ParentComponent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAuth, setIsAuth] = useState(false);

    const handleLogin = async() =>{
        try{
            const resp = await fetch('/api/authenticate',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({email, password})
                    });
            if (resp.ok){
                const result = await resp.json();
                setIsAuth(true);
                } else {
                    alert('Invalid credentials');
                    }
            } catch (error) {
                console.error(error);
                }

            }
            

    return (
      <div>
        <h2>Enter your email</h2>
        <EmailInput email={email} setEmail={setEmail} />
        <p>Your email: {email}</p>
        <PasswordInput password={password} setPassword={setPassword} handleLogin={handleLogin} />
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

const PasswordInput = ({ password, setPassword,handleLogin })=>{
    return(
        <div className="input-group">
        <input type="password" className="form-control" placeholder="Password" value = {password}
        onChange={(e) => setPassword(e.target.value)}/>
        <button className="btn btn-primary" onClick={handleLogin}>Submit</button>
        </div>
    )
}

export default PasswordInput;