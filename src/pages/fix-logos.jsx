import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle } from "lucide-react";

const FixLogos = () => {
  const fixCompanyLogos = useMutation(api.companies.fixCompanyLogos);

  const handleFixLogos = async () => {
    try {
      const result = await fixCompanyLogos();
      console.log('Logo fix result:', result);
      alert('Company logos fixed successfully!');
    } catch (error) {
      console.error('Error fixing logos:', error);
      alert('Error fixing logos: ' + error.message);
    }
  };

  return (
    <main className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-sm border-gray-700/50 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <AlertCircle size={24} className="text-yellow-400" />
              Fix Company Logos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-gray-300">
              <p className="mb-4">
                This will fix all companies that don't have proper logos by assigning them random logos from our collection.
              </p>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h3 className="font-semibold text-blue-300 mb-2">What this will do:</h3>
                <ul className="text-blue-200 text-sm space-y-1">
                  <li>• Find all companies without logos or with default logos</li>
                  <li>• Assign them random logos from Google, Microsoft, Amazon, Apple, etc.</li>
                  <li>• Update the database with the new logo URLs</li>
                </ul>
              </div>
            </div>
            
            <Button 
              onClick={handleFixLogos}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
            >
              <CheckCircle size={20} className="mr-2" />
              Fix All Company Logos
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default FixLogos;
