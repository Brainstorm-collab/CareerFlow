import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGetFilesByUser } from "@/api/apiFileStorage";
import { FileText, Download, Trash2, Calendar, User, File, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MyResumes = () => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Get user's uploaded files
  const files = useGetFilesByUser(user?.id);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) {
      return <FileText className="w-8 h-8 text-red-500" />;
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return <FileText className="w-8 h-8 text-blue-500" />;
    } else {
      return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please Sign In</h1>
          <p className="text-gray-300">You need to be signed in to view your resumes.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Resumes</h1>
              <p className="text-gray-300">View and manage your uploaded resume files</p>
            </div>
            <Link to="/cleanup-resumes">
              <Button
                variant="outline"
                className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/30 hover:from-yellow-500/30 hover:to-orange-500/30 hover:border-yellow-400/50 text-yellow-300 hover:text-yellow-200 transition-all duration-300"
              >
                <Settings className="w-4 h-4 mr-2" />
                Cleanup Duplicates
              </Button>
            </Link>
          </div>
        </div>

        {/* Files Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {files?.map((file) => (
            <Card key={file._id} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.fileType)}
                    <div>
                      <CardTitle className="text-white text-sm font-medium truncate max-w-[200px]">
                        {file.fileName}
                      </CardTitle>
                      <p className="text-gray-400 text-xs">
                        {formatFileSize(file.fileSize)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* File Info */}
                  <div className="space-y-2 text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>Uploaded: {formatDate(file.uploadedAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-3 h-3" />
                      <span>Type: {file.fileType}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                      onClick={() => window.open(file.downloadUrl, '_blank')}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-xs"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = file.downloadUrl;
                        link.download = file.fileName;
                        link.click();
                      }}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {files && files.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Resumes Uploaded</h3>
            <p className="text-gray-400 mb-6">
              You haven't uploaded any resume files yet. Upload your resume when applying for jobs.
            </p>
            <Button
              onClick={() => window.location.href = '/jobs'}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Browse Jobs
            </Button>
          </div>
        )}

        {/* Loading State */}
        {files === undefined && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your resumes...</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default MyResumes;
