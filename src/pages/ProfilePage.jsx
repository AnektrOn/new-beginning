import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const ProfilePage = () => {
  const { user, profile, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
    avatar_url: profile?.avatar_url || '',
    background_image: profile?.background_image || ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await updateProfile(formData)
    
    if (!error) {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const userRole = profile?.role || 'Free'
  const displayName = profile?.full_name || user?.email || 'User'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-4 text-gray-500 hover:text-gray-700"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Info */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="text-center">
                  <div className="h-24 w-24 rounded-full bg-indigo-500 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-medium text-2xl">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{displayName}</h3>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                    userRole === 'Free' ? 'bg-gray-100 text-gray-800' :
                    userRole === 'Student' ? 'bg-blue-100 text-blue-800' :
                    userRole === 'Teacher' ? 'bg-purple-100 text-purple-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {userRole}
                  </span>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Level</dt>
                    <dd className="text-lg font-medium text-gray-900">{profile?.level || 1}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Current XP</dt>
                    <dd className="text-lg font-medium text-gray-900">{profile?.current_xp || 0}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Total XP Earned</dt>
                    <dd className="text-lg font-medium text-gray-900">{profile?.total_xp_earned || 0}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Streak</dt>
                    <dd className="text-lg font-medium text-gray-900">{profile?.completion_streak || 0} days</dd>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Profile Form */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Edit Profile</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      id="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      id="bio"
                      rows={3}
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Tell us about yourself"
                    />
                  </div>

                  <div>
                    <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700">
                      Avatar URL
                    </label>
                    <input
                      type="url"
                      name="avatar_url"
                      id="avatar_url"
                      value={formData.avatar_url}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>

                  <div>
                    <label htmlFor="background_image" className="block text-sm font-medium text-gray-700">
                      Background Image URL
                    </label>
                    <input
                      type="url"
                      name="background_image"
                      id="background_image"
                      value={formData.background_image}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="https://example.com/background.jpg"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      This image will be used as your app background. Use a high-quality image for best results.
                    </p>
                    {formData.background_image && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-2">Preview:</p>
                        <div 
                          className="w-full h-32 rounded-lg bg-cover bg-center bg-no-repeat border"
                          style={{ backgroundImage: `url(${formData.background_image})` }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProfilePage