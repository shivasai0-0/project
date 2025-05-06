import React, { useState } from 'react';
import apiService from '../services/api';

const LearningContent: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [videoSummary, setVideoSummary] = useState<string | null>(null);
  const [pdfNotes, setPdfNotes] = useState<string[] | null>(null);
  const [pointsEarned, setPointsEarned] = useState<number | null>(null);
  const [loading, setLoading] = useState<'video' | 'pdf' | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle video file selection
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
      setVideoSummary(null);
      setPointsEarned(null);
      setError(null);
    }
  };

  // Handle PDF file selection
  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
      setPdfNotes(null);
      setPointsEarned(null);
      setError(null);
    }
  };

  // Process video for summary
  const handleProcessVideo = async () => {
    if (!videoFile) {
      setError('Please select a video file first');
      return;
    }

    setLoading('video');
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      
      const response = await apiService.getVideoSummary(formData);
      setVideoSummary(response.summary);
      setPointsEarned(response.points);
    } catch (err) {
      console.error('Error processing video:', err);
      setError('Failed to process video. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  // Process PDF for notes
  const handleProcessPdf = async () => {
    if (!pdfFile) {
      setError('Please select a PDF file first');
      return;
    }

    setLoading('pdf');
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('pdf', pdfFile);
      
      const response = await apiService.getPdfNotes(formData);
      setPdfNotes(response.notes);
      setPointsEarned(response.points);
    } catch (err) {
      console.error('Error processing PDF:', err);
      setError('Failed to process PDF. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-primary">
      <div className="container mx-auto px-4 py-12">
        <div className="bg-secondary rounded-xl shadow-soft p-8 mb-8">
          <h1 className="text-3xl font-bold text-accent mb-6">Learning Content</h1>
          <p className="text-text mb-8">
            Upload your learning materials to generate summaries and notes. 
            Earn points by contributing valuable content to the community.
          </p>
          
          {error && (
            <div className="bg-red-900 bg-opacity-20 border border-red-800 text-red-300 px-6 py-4 rounded-lg mb-8">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Video Upload Section */}
            <div className="bg-primary rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-accent mb-4">Upload Video</h2>
              <p className="text-gray-400 mb-6">
                Upload a video to automatically generate a summary. 
                Supported formats: MP4, AVI, MOV.
              </p>
              
              <div className="mb-6">
                <label className="block text-text mb-2">Select Video File</label>
                <div className="flex items-center">
                  <label className="flex-1 cursor-pointer bg-secondary hover:bg-opacity-80 text-text rounded-lg px-4 py-2 text-center border border-gray-700">
                    {videoFile ? videoFile.name : 'Choose Video File'}
                    <input 
                      type="file" 
                      accept="video/*" 
                      className="hidden" 
                      onChange={handleVideoChange}
                    />
                  </label>
                  <button
                    onClick={handleProcessVideo}
                    disabled={!videoFile || loading === 'video'}
                    className={`ml-2 px-4 py-2 rounded-lg font-medium ${
                      !videoFile || loading === 'video'
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-accent text-primary hover:bg-opacity-90'
                    }`}
                  >
                    {loading === 'video' ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : 'Generate Summary'}
                  </button>
                </div>
              </div>
              
              {videoSummary && (
                <div className="mt-6">
                  <h3 className="text-accent font-medium mb-2">Video Summary</h3>
                  <div className="bg-secondary rounded-lg p-4 text-text">
                    <p>{videoSummary}</p>
                  </div>
                  {pointsEarned !== null && (
                    <div className="mt-4 text-center">
                      <span className="bg-accent text-primary px-4 py-2 rounded-full font-medium">
                        +{pointsEarned} points earned!
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* PDF Upload Section */}
            <div className="bg-primary rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-accent mb-4">Upload PDF</h2>
              <p className="text-gray-400 mb-6">
                Upload a PDF document to automatically generate notes and key points.
              </p>
              
              <div className="mb-6">
                <label className="block text-text mb-2">Select PDF File</label>
                <div className="flex items-center">
                  <label className="flex-1 cursor-pointer bg-secondary hover:bg-opacity-80 text-text rounded-lg px-4 py-2 text-center border border-gray-700">
                    {pdfFile ? pdfFile.name : 'Choose PDF File'}
                    <input 
                      type="file" 
                      accept=".pdf" 
                      className="hidden" 
                      onChange={handlePdfChange}
                    />
                  </label>
                  <button
                    onClick={handleProcessPdf}
                    disabled={!pdfFile || loading === 'pdf'}
                    className={`ml-2 px-4 py-2 rounded-lg font-medium ${
                      !pdfFile || loading === 'pdf'
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-accent text-primary hover:bg-opacity-90'
                    }`}
                  >
                    {loading === 'pdf' ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : 'Generate Notes'}
                  </button>
                </div>
              </div>
              
              {pdfNotes && (
                <div className="mt-6">
                  <h3 className="text-accent font-medium mb-2">PDF Notes</h3>
                  <div className="bg-secondary rounded-lg p-4 text-text">
                    <ul className="list-disc pl-5 space-y-2">
                      {pdfNotes.map((note, index) => (
                        <li key={index}>{note}</li>
                      ))}
                    </ul>
                  </div>
                  {pointsEarned !== null && (
                    <div className="mt-4 text-center">
                      <span className="bg-accent text-primary px-4 py-2 rounded-full font-medium">
                        +{pointsEarned} points earned!
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Tips Section */}
        <div className="bg-secondary rounded-xl shadow-soft p-8">
          <h2 className="text-2xl font-semibold text-accent mb-4">Tips for Quality Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary rounded-lg p-4">
              <h3 className="text-accent font-medium mb-2">Video Tips</h3>
              <ul className="text-text space-y-2">
                <li>• Keep videos under 15 minutes for better processing</li>
                <li>• Ensure clear audio for accurate transcription</li>
                <li>• Include visual aids to enhance learning</li>
                <li>• Structure content with clear sections</li>
              </ul>
            </div>
            
            <div className="bg-primary rounded-lg p-4">
              <h3 className="text-accent font-medium mb-2">PDF Tips</h3>
              <ul className="text-text space-y-2">
                <li>• Use proper headings and formatting</li>
                <li>• Include a table of contents for longer documents</li>
                <li>• Use bullet points for key information</li>
                <li>• Ensure text is selectable (not scanned images)</li>
              </ul>
            </div>
            
            <div className="bg-primary rounded-lg p-4">
              <h3 className="text-accent font-medium mb-2">Earning Points</h3>
              <ul className="text-text space-y-2">
                <li>• Higher quality content earns more points</li>
                <li>• Popular content gets bonus points</li>
                <li>• Regular contributions increase your multiplier</li>
                <li>• Specialized or rare topics earn premium points</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningContent;

