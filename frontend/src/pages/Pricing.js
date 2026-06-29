import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadPlans() {
      const { data } = await supabase.from('plans').select('*');
      if (data) setPlans(data);
    }
    loadPlans();
  }, []);

  const features = [
    'AI Writing Detection',
    'Plagiarism Check',
    '2 PDF Reports per scan',
    'Secure file processing',
    'Auto file deletion after 1 hour'
  ];

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc'}}>
      <Navbar />
      <div style={{padding:'60px 20px',textAlign:'center'}}>
        <h1 style={{fontSize:'42px',fontWeight:'800',color:'#1e3a8a',marginBottom:'12px'}}>
          Choose Your Plan
        </h1>
        <p style={{fontSize:'18px',color:'#6b7280',marginBottom:'50px'}}>
          Pay once, use your slots anytime. No subscriptions.
        </p>
        <div style={{display:'flex',justifyContent:'center',gap:'24px',flexWrap:'wrap',maxWidth:'1100px',margin:'0 auto'}}>
          {plans.length === 0 ? (
            <div style={{padding:'40px',color:'#6b7280'}}>Loading plans...</div>
          ) : (
            plans.map((plan, index) => (
              <div key={plan.id} style={{
                background: index === 2 ? '#1e40af' : '#ffffff',
                color: index === 2 ? '#ffffff' : '#1f2937',
                borderRadius:'20px',
                padding:'36px 28px',
                width:'240px',
                boxShadow: index === 2 ? '0 20px 60px rgba(30,64,175,0.4)' : '0 4px 20px rgba(0,0,0,0.08)',
                transform: index === 2 ? 'scale(1.05)' : 'scale(1)',
                position:'relative',
                border: index === 2 ? 'none' : '1px solid #e5e7eb',
                transition:'all 0.3s'
              }}>
                {index === 2 && (
                  <div style={{
                    position:'absolute',top:'-14px',left:'50%',
                    transform:'translateX(-50%)',
                    background:'#fbbf24',color:'#1f2937',
                    padding:'4px 16px',borderRadius:'20px',
                    fontSize:'12px',fontWeight:'700'
                  }}>
                    MOST POPULAR
                  </div>
                )}
                <h3 style={{fontSize:'20px',fontWeight:'700',marginBottom:'8px'}}>
                  {plan.name}
                </h3>
                <div style={{fontSize:'48px',fontWeight:'800',margin:'16px 0 4px'}}>
                  ₨{plan.price_pkr?.toLocaleString()}
                </div>
                <div style={{
                  fontSize:'14px',
                  color: index === 2 ? '#bfdbfe' : '#6b7280',
                  marginBottom:'24px'
                }}>
                  {plan.slots} document slots
                </div>
                <div style={{marginBottom:'28px',textAlign:'left'}}>
                  {features.map(f => (
                    <div key={f} style={{
                      display:'flex',alignItems:'center',gap:'8px',
                      marginBottom:'10px',fontSize:'14px'
                    }}>
                      <span style={{color: index === 2 ? '#86efac' : '#22c55e',fontWeight:'700'}}>✓</span>
                      {f}
                    </div>
                  ))}
                  <div style={{
                    display:'flex',alignItems:'center',gap:'8px',
                    marginBottom:'10px',fontSize:'14px'
                  }}>
                    <span style={{color: index === 2 ? '#86efac' : '#22c55e',fontWeight:'700'}}>✓</span>
                    {plan.slots} document slots
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/payment/${plan.id}`)}
                  style={{
                    width:'100%',padding:'14px',borderRadius:'12px',
                    border:'none',cursor:'pointer',fontWeight:'700',
                    fontSize:'16px',
                    background: index === 2 ? '#ffffff' : '#1e40af',
                    color: index === 2 ? '#1e40af' : '#ffffff',
                    transition:'all 0.2s',
                    boxShadow:'0 4px 12px rgba(0,0,0,0.15)'
                  }}
                >
                  Get Started
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}