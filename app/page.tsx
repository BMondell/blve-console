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
    // Get current session
    supabase.auth.getSession().then((result) => {
      console.log('Current session:', result.data.session)
      setSession(result.data.session)
      setLoading(false)
    })
    
    // Listen for auth changes
    const authListener = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed to:', session)
      setSession(session)
    })
    
    // Cleanup
    return () => {
      authListener.data.subscription.unsubscribe()
    }
  }, [])
  
  const handleSignIn = async () => {
    console.log('Starting sign in...')
    await supabase.auth.signInWithOAuth({ 
      provider: 'google', 
      options: { 
        redirectTo: `${location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      } 
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
          <button onClick={handleSignIn} style={{background:'#000',color:'#fff',padding:'1rem 2rem',borderRadius:'1rem',fontSize:'1.1rem',fontWeight:'medium',cursor:'pointer'}}>Sign in with Google</button>
        </div>
      </div>
    )
  }
  
  return (
    <div style={{padding:'2rem',minHeight:'100vh',background:'#f9fafb'}}>
      <h1 style={{fontSize:'2rem',marginBottom:'1rem'}}>✅ SUCCESS!</h1>
      <p style={{fontSize:'1.2rem',marginBottom:'2rem'}}>Signed in as: <strong>{session.user.email}</strong></p>
      <button onClick={() => supabase.auth.signOut()} style={{padding:'0.75rem 1.5rem',background:'#000',color:'#fff',border:'none',borderRadius:'0.5rem',fontSize:'1rem',cursor:'pointer'}}>Sign out</button>
    </div>
  )
}