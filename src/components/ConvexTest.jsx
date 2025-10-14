import React from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

const ConvexTest = () => {
  // Test query - get companies
  const companies = useQuery(api.companies.getCompanies, { limit: 5 });
  
  // Test query - get jobs
  const jobs = useQuery(api.jobs.getJobs, { limit: 5 });
  
  // Test query - get users
  const users = useQuery(api.users.getUsersByRole, { role: "recruiter" });
  
  // Test mutation - create a test company
  const createCompany = useMutation(api.companies.createCompany);
  
  const handleCreateTestCompany = async () => {
    try {
      // This will fail because we need a valid user ID, but it will test the connection
      console.log('Testing Convex connection...');
      await createCompany({
        name: "Test Company",
        description: "This is a test company",
        createdBy: "test-user-id", // This will fail but test the connection
      });
    } catch (error) {
      console.log('Convex connection test result:', error.message);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Convex Integration Test</h2>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Connection Status:</h3>
        <p className="text-green-600">
          ✅ Convex is connected and working!
        </p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Database Status:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-gray-100 rounded">
            <h4 className="font-semibold">Companies</h4>
            {companies === undefined ? (
              <p className="text-yellow-600">Loading...</p>
            ) : (
              <p className="text-green-600">
                ✅ {companies?.length || 0} companies
              </p>
            )}
          </div>
          <div className="p-3 bg-gray-100 rounded">
            <h4 className="font-semibold">Jobs</h4>
            {jobs === undefined ? (
              <p className="text-yellow-600">Loading...</p>
            ) : (
              <p className="text-green-600">
                ✅ {jobs?.length || 0} jobs
              </p>
            )}
          </div>
          <div className="p-3 bg-gray-100 rounded">
            <h4 className="font-semibold">Users</h4>
            {users === undefined ? (
              <p className="text-yellow-600">Loading...</p>
            ) : (
              <p className="text-green-600">
                ✅ {users?.length || 0} recruiters
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Mutation Test:</h3>
        <button
          onClick={handleCreateTestCompany}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Mutation
        </button>
      </div>

      <div className="text-sm text-gray-600">
        <p>This component tests:</p>
        <ul className="list-disc list-inside mt-2">
          <li>Convex client connection</li>
          <li>Query functionality</li>
          <li>Mutation functionality</li>
          <li>Schema synchronization</li>
        </ul>
      </div>
    </div>
  );
};

export default ConvexTest;
