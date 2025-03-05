import AuthCheck from '@/components/AuthCheck'
import LoginRedirect from '@/components/LoginRedirect'

export default function ProfilePage() {
  return (
    <AuthCheck fallback={<LoginRedirect />}>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p className="text-gray-600">Your profile information will appear here</p>
        {/* Add your profile content here */}
      </div>
    </AuthCheck>
  )
}