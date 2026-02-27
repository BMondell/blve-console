useEffect(() => {
  console.log('Login page loaded - checking session...')

  const redirectPath = searchParams.get('redirect') || '/admin/dashboard'
  console.log('Intended redirect:', redirectPath)

  // Clear hash if present
  if (window.location.hash) {
    console.log('Clearing hash fragment from callback')
    window.location.hash = ''
  }

  supabase.auth.getSession().then(({ data: { session }, error }) => {
    console.log('getSession result:', { session, error })
    if (session) {
      console.log('Session found - redirecting to:', redirectPath)
      router.replace(redirectPath)
    } else {
      console.log('No session - showing login button')
      setLoading(false)
    }
  }).catch(err => {
    console.error('getSession error:', err)
    setLoading(false)
  })

  const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session ? 'session exists' : 'no session')
    if (session) {
      console.log('Auth listener detected session - redirecting')
      router.replace(redirectPath)
    }
  })

  return () => {
    console.log('Cleaning up auth listener')
    listener.subscription.unsubscribe()
  }
}, [router, searchParams])