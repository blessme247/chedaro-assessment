'use client'
import { User } from "@/lib/db/data.types"
import { getUser } from "@/lib/db/query"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

type UserWithoutPassword = Omit<User, "password">

type UserContextType = {
  user: UserWithoutPassword | null
  setUser: (user: UserWithoutPassword | null) => void
  loading: boolean
  logout: () => void
}

// Explicitly type the context with the defined type
const UserContext = createContext<UserContextType | null>(null)

export function useUser(): UserContextType {
  const context = useContext(UserContext)
  if (context === null) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

// Routes that don't require authentication
const publicRoutes = ['/sign-in']

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserWithoutPassword | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  
  const logout = () => {
    setUser(null)
    // Clear any stored auth tokens
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    router.push('/sign-in')
  }

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const initialUser = await Promise.resolve(getUser())
        
        if (initialUser) {
          setUser(initialUser)
        } else {
          // No user found and not on a public route
          if (!publicRoutes.includes(pathname)) {
            router.push('/sign-in')
          }
        }
      } catch (error) {
        console.error('Failed to get user:', error)
        // On error, redirect to login if not on public route
        if (!publicRoutes.includes(pathname)) {
          router.push('/sign-in')
        }
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [pathname, router])

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        {/* <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div> */}
        <img src='https://chedaro.com/wp-content/uploads/2022/12/chedaro-main-1-1.png' className="fadeInOut" alt="chedaro logo" width={100}  />
      </div>
    )
  }

  // If no user and not on public route, don't render children
  if (!user && !publicRoutes.includes(pathname)) {
    return null
  }

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </UserContext.Provider>
  )
}