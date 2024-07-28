'use client'
import '../app/style.css'

import React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const ParentComponent = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const router = useRouter()
  const handleLogin = async () => {
    try {
      const resp = await fetch('/api/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
      if (resp.ok) {
        const result = await resp.json()

        console.log(result)
        localStorage.setItem('user', JSON.stringify(result.email))
        router.push('/')
      } else {
        alert('Invalid credentials')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleRegister = async () => {
    try {
      const resp = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
      const result = await resp.json()
      console.log('Response:', resp)
      console.log('Result:', result)
      if (resp.ok) {
        console.log(result)
        localStorage.setItem('user', JSON.stringify(result.email))
        router.push('/')
      } else {
        alert(`Registration failed: ${JSON.stringify(result)}`)
      }
    } catch (error) {
      console.error('Error during registration:', error)
    }
  }

  return (
    <div>
      <h2>Enter your email</h2>
      <EmailInput email={email} setEmail={setEmail} />
      <p>Your email: {email}</p>
      <PasswordInput
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
      />
      <p>Your password: {password}</p>
    </div>
  )
}

const EmailInput = ({ email, setEmail }) => {
  return (
    <div className="input-group">
      <input
        type="email"
        className="form-control"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>
  )
}

const PasswordInput = ({ password, setPassword, handleLogin, handleRegister }) => {
  return (
    <div className="input-group">
      <input
        type="password"
        className="form-control"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="btn btn-primary" onClick={handleLogin}>
        Login
      </button>
      <button className="btn btn-primary" onClick={handleRegister}>
        Register
      </button>
    </div>
  )
}

export default ParentComponent
