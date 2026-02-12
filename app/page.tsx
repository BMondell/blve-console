'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/auth-helpers-nextjs'
import type { Session } from '@supabase/supabase-js'

export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null)
  const [orgData, setOrgData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    supabase.auth.getSession().then((result) => {
      setSession(result.data.session)
    })
    
    const {  { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    
    return () => {
      subscription.unsubscribe()
    }
  }, [])
  
  useEffect(() => {
    if (session) {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      supabase.from('org_dashboard_view').select('*').eq('slug', 'fiu').single().then(({ data, error }) => {
        if (!error) setOrgData(data)
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [session])
  
  const handleSignIn = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signInWithOAuth({ 
      provider: 'google', 
      options: { redirectTo: `${location.origin}/auth/callback` } 
    })
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
  
  if (loading) {
    return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',color:'#666'}}>Loading routing data...</div>
  }
  
  return (
    <div style={{minHeight:'100vh',background:'#f9fafb',padding:'2rem'}}>
      <header style={{background:'#fff',boxShadow:'0 1px 3px rgba(0,0,0,0.1)',padding:'1rem 2rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
          <div style={{fontSize:'1.75rem',fontWeight:'bold'}}>BLVΞ</div>
          <div style={{color:'#999'}}>| FIU Athletics Console</div>
        </div>
        <button onClick={() => {
          const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
          )
          supabase.auth.signOut()
        }} style={{color:'#666',background:'none',border:'none',fontSize:'1rem',cursor:'pointer'}}>Sign out</button>
      </header>
      <main style={{maxWidth:'1200px',margin:'2rem auto'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:'1.5rem',marginBottom:'2rem'}}>
          <div style={{background:'#fff',borderRadius:'1rem',padding:'1.5rem',boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
            <div style={{color:'#999',fontSize:'0.9rem',marginBottom:'0.5rem'}}>TOTAL ROUTING POOL</div>
            <div style={{fontSize:'2rem',fontWeight:'bold'}}>${orgData?.routing_pool?.toFixed(2) || '0.00'}</div>
            <div style={{color:'#10b981',fontSize:'0.95rem',marginTop:'0.25rem'}}>+${orgData?.monthly_routing?.toFixed(2) || '0.00'} this month</div>
          </div>
          <div style={{background:'#fff',borderRadius:'1rem',padding:'1.5rem',boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
            <div style={{color:'#999',fontSize:'0.9rem',marginBottom:'0.5rem'}}>MONTHLY TRANSACTIONS</div>
            <div style={{fontSize:'2rem',fontWeight:'bold'}}>{orgData?.monthly_tx?.toLocaleString() || '0'}</div>
            <div style={{color:'#666',fontSize:'0.95rem',marginTop:'0.25rem'}}>from {orgData?.active_members?.toLocaleString() || '0'} community members</div>
          </div>
          <div style={{background:'#fff',borderRadius:'1rem',padding:'1.5rem',boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
            <div style={{color:'#999',fontSize:'0.9rem',marginBottom:'0.5rem'}}>AVG ROUTING PER TX</div>
            <div style={{fontSize:'2rem',fontWeight:'bold'}}>${
              orgData?.monthly_routing && orgData?.monthly_tx 
                ? (orgData.monthly_routing / orgData.monthly_tx).toFixed(2) 
                : '0.00'
            }</div>
            <div style={{color:'#666',fontSize:'0.95rem',marginTop:'0.25rem'}}>covenant-preserving (88% to FIU)</div>
          </div>
        </div>
      </main>
    </div>
  )
}