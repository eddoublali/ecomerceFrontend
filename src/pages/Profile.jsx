import { useAuth } from '../context/AuthProvider';
import { useState } from 'react';
import { User, Mail, Calendar, Edit, Lock } from 'lucide-react';

const Profile = () => {
  const { user, logOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });

  // Format date to be more readable
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex items-center">
              <div className="h-24 w-24 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user?.username}
                </h1>
                <p className="text-sm text-gray-500">
                  Member since {formatDate(user?.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Profile Information
            </h2>
            
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    value={profileData.username}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      username: e.target.value
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      email: e.target.value
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="ml-3 text-gray-900">{user?.username}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="ml-3 text-gray-900">{user?.email}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="ml-3 text-gray-900">
                    Joined {formatDate(user?.createdAt)}
                  </span>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 flex items-center text-sm text-blue-500 hover:text-blue-600"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              </div>
            )}
          </div>

          {/* Account Actions */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Account Actions
            </h2>
            <div className="space-y-4">
              <button className="flex items-center text-sm text-blue-500 hover:text-blue-600">
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </button>
              <button
                onClick={logOut}
                className="flex items-center text-sm text-red-500 hover:text-red-600"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;