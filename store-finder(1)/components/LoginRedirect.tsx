import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginRedirect() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
      <p className="mb-4">You need to be logged in to view this page.</p>
      <div className="flex gap-4">
        <Link 
          href="/login" 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Log in
        </Link>
        <Link 
          href="/" 
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
        >
          Go to Home
        </Link>
      </div>
    </div>
  )
}