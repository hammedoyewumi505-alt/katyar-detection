import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    async function checkAdmin() {
      const { data } = await supabase.auth.getUser();
      const email = data?.user?.email;
      setUserEmail(email || 'not logged in');
      // Admin emails (comma-separated)
      const ADMIN_EMAILS = ['developerhallins@gmail.com']
      if (ADMIN_EMAILS.includes(email)) {
        setIsAdmin(true)
      }
      setLoading(false);
    }
    checkAdmin();
  }, []);

  if (loading) return <div style={{padding:'40px',textAlign:'center'}}>Loading...</div>;

  if (!isAdmin) return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',flexDirection:'column',gap:'16px'}}>
      <div style={{fontSize:'60px'}}>🚫</div>
      <h1 style={{color:'#1e3a8a'}}>Access Denied</h1>
      <p style={{color:'#6b7280'}}>Current email: {userEmail}</p>
      <p style={{color:'#6b7280'}}>Required: developerhallins@gmail.com</p>
      <a href="/signin" style={{background:'#1e40af',color:'#fff',padding:'12px 24px',borderRadius:'10px',textDecoration:'none',fontWeight:'700'}}>Sign In as Admin</a>
    </div>
  );

  return (
    <div style={{padding:'40px',textAlign:'center'}}>
      <h1 style={{color:'#1e3a8a'}}>✅ Admin Panel Working!</h1>
      <p>You are logged in as: {userEmail}</p>
    </div>
  );
}
