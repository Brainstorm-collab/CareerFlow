import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useGetUser, useUpdateUserRole } from "@/api/apiUsers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/context/ToastContext";

const RoleDebug = () => {
  const { user } = useAuth();
  const databaseUser = useGetUser(user?.id);
  const updateUserRole = useUpdateUserRole();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);

  const handleUpdateRole = async (newRole) => {
    if (!user?.id) {
      showError("No user ID found");
      return;
    }

    setLoading(true);
    try {
      const result = await updateUserRole({
        socialId: user.id,
        role: newRole
      });
      
      console.log('Role update result:', result);
      showSuccess(`Role updated to ${newRole} successfully!`);
    } catch (error) {
      console.error('Error updating role:', error);
      showError(`Failed to update role: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please Sign In</h1>
          <p className="text-gray-300">You need to be signed in to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Role Debug Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Info */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white">User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm">User ID:</label>
                <p className="text-white font-mono text-sm">{user.id}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Email:</label>
                <p className="text-white">{user.email}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Name:</label>
                <p className="text-white">{user.name}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Provider:</label>
                <p className="text-white">{user.provider}</p>
              </div>
            </CardContent>
          </Card>

          {/* Database User Info */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Database User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {databaseUser ? (
                <>
                  <div>
                    <label className="text-gray-400 text-sm">Database ID:</label>
                    <p className="text-white font-mono text-sm">{databaseUser._id}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Email:</label>
                    <p className="text-white">{databaseUser.email}</p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Current Role:</label>
                    <Badge variant="outline" className={`${
                      databaseUser.role === 'recruiter' 
                        ? 'text-green-300 border-green-300' 
                        : 'text-blue-300 border-blue-300'
                    }`}>
                      {databaseUser.role || 'No role set'}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Social ID:</label>
                    <p className="text-white font-mono text-sm">{databaseUser.socialId}</p>
                  </div>
                </>
              ) : (
                <p className="text-gray-400">Loading database user...</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Role Update Actions */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 mt-6">
          <CardHeader>
            <CardTitle className="text-white">Update Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                onClick={() => handleUpdateRole('candidate')}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Set as Candidate
              </Button>
              <Button
                onClick={() => handleUpdateRole('recruiter')}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                Set as Recruiter
              </Button>
            </div>
            {loading && (
              <p className="text-gray-400 mt-2">Updating role...</p>
            )}
          </CardContent>
        </Card>

        {/* Debug Info */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10 mt-6">
          <CardHeader>
            <CardTitle className="text-white">Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <label className="text-gray-400 text-sm">Local User Role:</label>
                <p className="text-white">{user.role || 'No role in local state'}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Database User Role:</label>
                <p className="text-white">{databaseUser?.role || 'No role in database'}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Role Match:</label>
                <p className={`${
                  user.role === databaseUser?.role ? 'text-green-400' : 'text-red-400'
                }`}>
                  {user.role === databaseUser?.role ? '✅ Match' : '❌ Mismatch'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default RoleDebug;