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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    
    return () => subscription.unsubscribe()
  }, [])
  
  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({ 
      provider: 'google', 
      options: { redirectTo: `${location.origin}/auth/callback` } 
    })
  }
  
  if (loading) {
    return <div>Loading...</div>
  }
  
  if (!session) {
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(to bottom right, #e0e7ff, #f3e8ff)',padding:'2rem'}}>
        <div style={{textAlign:'center',maxWidth:'500px'}}>
          <div style={{fontSize:'4rem',fontWeight:'bold',marginBottom:'1rem'}}>BLVΞ</div>
          <button onClick={handleSignIn} style={{background:'#000',color:'#fff',padding:'1rem 2rem',borderRadius:'1rem',fontSize:'1.1rem',fontWeight:'medium',cursor:'pointer'}}>Sign in with Google</button>
        </div>
      </div>
    )
  }
  
  return (
    <div style={{padding:'2rem'}}>
      <h1>✅ SUCCESS! Signed in as: {session.user.email}</h1>
      <button onClick={() => supabase.auth.signOut()} style={{marginTop:'1rem',padding:'0.5rem 1rem',background:'#000',color:'#fff',border:'none',borderRadius:'0.5rem',cursor:'pointer'}}>Sign out</button>
    </div>
  )
}