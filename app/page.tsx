'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/auth-helpers-nextjs'

export default function Dashboard() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  useEffect(() => {
    supabase.auth.getSession().then(({  }) => {
      setSession(data.session)
      setLoading(false)
    })
    
    const {  } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    
    return () => {
      subscription.unsubscribe()
    }
  }, [])
  
  const handleSignIn = () => {
    supabase.auth.signInWithOAuth({ 
      provider: 'google', 
      options: { redirectTo: `${location.origin}/auth/callback` } 
    })
  }
  
  if (loading) {
    return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem'}}>Loading...</div>
  }
  
  if (!session) {
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(to bottom right, #e0e7ff, #f3e8ff)',padding:'2rem'}}>
        <div style={{textAlign:'center',maxWidth:'500px'}}>
          <div style={{fontSize:'4rem',fontWeight:'bold',marginBottom:'1rem'}}>BLVΞ</div>
          <h1 style={{fontSize:'2rem',fontWeight:'bold',marginBottom:'1.5rem'}}>Routing belief without extraction</h1>
          <p style={{fontSize:'1.1rem',color:'#666',marginBottom:'2rem'}}>FIU Athletics admin console — see real-time routing impact</p>
          <button onClick={handleSignIn} style={{background:'#000',color:'#fff',padding:'1rem 2rem',borderRadius:'1rem',fontSize:'1.1rem',fontWeight:'medium',cursor:'pointer',boxShadow:'0 4px 6px rgba(0,0,0,0.1)'}}>Sign in with Google</button>
          <p style={{marginTop:'1.5rem',fontSize:'0.9rem',color:'#999'}}>Only authorized FIU Athletics staff can access this console</p>
        </div>
      </div>
    )
  }
  
  return (
    <div style={{minHeight:'100vh',background:'#f9fafb',padding:'2rem'}}>
      <header style={{background:'#fff',boxShadow:'0 1px 3px rgba(0,0,0,0.1)',padding:'1rem 2rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
          <div style={{fontSize:'1.75rem',fontWeight:'bold'}}>BLVΞ</div>
          <div style={{color:'#999'}}>| FIU Athletics Console</div>
        </div>
        <button onClick={() => supabase.auth.signOut()} style={{color:'#666',background:'none',border:'none',fontSize:'1rem',cursor:'pointer'}}>Sign out</button>
      </header>
      <main style={{maxWidth:'1200px',margin:'2rem auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:'1.5rem',marginBottom:'2rem'}}>
          <div style={{background:'#fff',borderRadius:'1rem',padding:'1.5rem',boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
            <div style={{color:'#999',fontSize:'0.9rem',marginBottom:'0.5rem'}}>TOTAL ROUTING POOL</div>
            <div style={{fontSize:'2rem',fontWeight:'bold'}}>$0.50</div>
            <div style={{color:'#10b981',fontSize:'0.95rem',marginTop:'0.25rem'}}>+$0.50 this month</div>
          </div>
          <div style={{background:'#fff',borderRadius:'1rem',padding:'1.5rem',boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
            <div style={{color:'#999',fontSize:'0.9rem',marginBottom:'0.5rem'}}>MONTHLY TRANSACTIONS</div>
            <div style={{fontSize:'2rem',fontWeight:'bold'}}>0</div>
            <div style={{color:'#666',fontSize:'0.95rem',marginTop:'0.25rem'}}>from 0 community members</div>
          </div>
          <div style={{background:'#fff',borderRadius:'1rem',padding:'1.5rem',boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
            <div style={{color:'#999',fontSize:'0.9rem',marginBottom:'0.5rem'}}>AVG ROUTING PER TX</div>
            <div style={{fontSize:'2rem',fontWeight:'bold'}}>$0.00</div>
            <div style={{color:'#666',fontSize:'0.95rem',marginTop:'0.25rem'}}>covenant-preserving (88% to FIU)</div>
          </div>
        </div>
      </main>
    </div>
  )
}