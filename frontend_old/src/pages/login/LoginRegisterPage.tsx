import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { domain } from '../../config';
import { MainPageHighlight } from '../../components/MainPageHighlight';

export function LoginRegisterPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login'|'register'>('login');
  const [form, setForm] = useState({
    firstName: '', lastName: '',
    email: '', password: '', confirm: '', remember: false
  });
  const [error, setError] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      let response;
      if (mode === 'login') {
        response = await fetch(`${domain}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password })
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Server error');
        }
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('userId', data.id);
        navigate('/calendar');
      } else {
        if (form.password !== form.confirm) {
          throw new Error('Passwords do not match');
        }
        response = await fetch(`${domain}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password, firstName: form.firstName, lastName: form.lastName })
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Server error');
        }
        alert(data.message);
        setMode('login')
      }
    }catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      {/* Brand */}
      <div className="brand-panel">
        <h1 className="h1">Task Tracer</h1>
        <p className="text-xl text-slate-300 mb-6">
          Streamline your workflow, track progress, and achieve your goals with our intuitive task management system.
        </p>
        <MainPageHighlight />
      </div>

      {/* Form */}
      <div className="form-section">
        <div className="card">
          {/* Tabs */}
          <div className="tabs mb-6">
            <div
              className={`tab ${mode==='login'?'tab--active':''}`}
              onClick={()=>{
                setError(null)
                setMode('login')
              }}
            >Sign In</div>
            <div
              className={`tab ${mode==='register'?'tab--active':''}`}
              onClick={()=>{
                setError(null)
                setMode('register')
              }}
            >Register</div>
          </div>

          {/* Forms */}
          <form onSubmit={onSubmit} className="form-toggle">
            {mode === 'register' && (
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {['firstName','lastName'].map(key => (
                  <div key={key}>
                    <label className="block mb-1">{
                      key==='firstName'?'First Name':'Last Name'
                    }</label>
                    <div className="input-group">
                      <i className="fas fa-user"></i>
                      <input
                        name={key} type="text" placeholder={ key==='firstName'?'John':'Doe' }
                        value={(form as any)[key]}
                        onChange={onChange}
                        className="input"
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Email */}
            <label className="block mb-1">Email Address</label>
            <div className="input-group">
              <i className="fas fa-envelope"></i>
              
              <input
                name="email" type="email" placeholder="Email Address"
                value={form.email} onChange={onChange}
                className="input" required
              />
            </div>

            {/* Password */}
            <label className="block mb-1">Password</label>
            
            {mode==='login' ? (
              <div className="input-group">
                <i className="fas fa-lock"></i>
                <input
                  name="password" type="password" placeholder="Password"
                  value={form.password} onChange={onChange}
                  className="input" required
                />
              </div>
            ) : ['password','confirm'].map(key => (
              <div key={key} className="input-group">
                <i className="fas fa-lock"></i>
                <input
                  name={key} type="password"
                  placeholder={ key==='password'?'Password':'Confirm Password' }
                  value={(form as any)[key]}
                  onChange={onChange}
                  className="input" required
                />
              </div>
            ))}

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="btn btn--primary mb-4"
            >
              {mode==='login'?'Sign In':'Create Account'}
            </button>

          </form>

          <p className="footer">© 2025 Task Tracer. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
