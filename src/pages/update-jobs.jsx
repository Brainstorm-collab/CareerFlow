import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

const UpdateJobs = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [result, setResult] = useState(null);
  
  const updateJobs = useMutation(api.jobs.updateJobsWithDiverseCompanies);
  
  const handleUpdateJobs = async () => {
    setIsUpdating(true);
    try {
      const result = await updateJobs();
      setResult(result);
      console.log('Jobs updated:', result);
    } catch (error) {
      console.error('Error updating jobs:', error);
      setResult({ error: error.message });
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <main className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardContent className="p-8">
            <h1 className="text-2xl font-bold text-white mb-4">Update Jobs with Diverse Companies</h1>
            <p className="text-gray-300 mb-6">
              This will update all existing jobs in the database with diverse company names so you can see different logos and save jobs properly.
            </p>
            
            <Button 
              onClick={handleUpdateJobs}
              disabled={isUpdating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isUpdating ? "Updating Jobs..." : "Update Jobs"}
            </Button>
            
            {result && (
              <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                {result.error ? (
                  <p className="text-red-400">Error: {result.error}</p>
                ) : (
                  <p className="text-green-400">Successfully updated {result.updated} jobs!</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default UpdateJobs;
