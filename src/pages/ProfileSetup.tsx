import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProfileSetup: React.FC = () => {
  const [name, setName] = useState('');
  const [teachSkills, setTeachSkills] = useState<string[]>([]);
  const [learnSkills, setLearnSkills] = useState<string[]>([]);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [currentTeachSkill, setCurrentTeachSkill] = useState('');
  const [currentLearnSkill, setCurrentLearnSkill] = useState('');
  const [formError, setFormError] = useState('');
  const { setupProfile, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Handle profile picture selection
  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add a skill to teach
  const handleAddTeachSkill = () => {
    if (currentTeachSkill.trim() && !teachSkills.includes(currentTeachSkill.trim())) {
      setTeachSkills([...teachSkills, currentTeachSkill.trim()]);
      setCurrentTeachSkill('');
    }
  };

  // Add a skill to learn
  const handleAddLearnSkill = () => {
    if (currentLearnSkill.trim() && !learnSkills.includes(currentLearnSkill.trim())) {
      setLearnSkills([...learnSkills, currentLearnSkill.trim()]);
      setCurrentLearnSkill('');
    }
  };

  // Remove a skill to teach
  const handleRemoveTeachSkill = (skill: string) => {
    setTeachSkills(teachSkills.filter(s => s !== skill));
  };

  // Remove a skill to learn
  const handleRemoveLearnSkill = (skill: string) => {
    setLearnSkills(learnSkills.filter(s => s !== skill));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    // Validate form
    if (!name) {
      setFormError('Please enter your name');
      return;
    }
    
    if (teachSkills.length === 0) {
      setFormError('Please add at least one skill you can teach');
      return;
    }
    
    if (learnSkills.length === 0) {
      setFormError('Please add at least one skill you want to learn');
      return;
    }
    
    try {
      // In a real app, we would upload the profile picture to storage
      // and get a URL. For this demo, we'll use the preview URL or a placeholder
      const profileData = {
        name,
        skills: teachSkills,
        learning: learnSkills,
        profilePicture: previewUrl || 'https://via.placeholder.com/150'
      };
      
      await setupProfile(profileData);
      navigate('/');
    } catch (err) {
      console.error('Profile setup error:', err);
      // Error is handled by the auth context
    }
  };

  // Clear auth context error when inputs change
  const handleInputChange = () => {
    if (error) {
      clearError();
    }
    if (formError) {
      setFormError('');
    }
  };

  return (
    <div className="min-h-screen bg-primary py-12 px-4">
      <div className="max-w-3xl mx-auto bg-secondary rounded-xl shadow-soft p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-accent">Set Up Your Profile</h1>
          <p className="text-text mt-2">Tell us about yourself and what you'd like to learn and teach</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {(error || formError) && (
            <div className="bg-red-900 bg-opacity-20 border border-red-800 text-red-300 px-4 py-3 rounded-lg">
              {error || formError}
            </div>
          )}
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center overflow-hidden border-2 border-accent mb-4">
                {previewUrl ? (
                  <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <label className="btn btn-primary cursor-pointer">
                <span>Upload Photo</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handlePictureChange}
                />
              </label>
            </div>
            
            {/* Profile Details */}
            <div className="flex-1">
              <div className="mb-6">
                <label htmlFor="name" className="block text-text mb-2">Your Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    handleInputChange();
                  }}
                  className="input w-full"
                  placeholder="John Doe"
                />
              </div>
              
              {/* Skills to Teach */}
              <div className="mb-6">
                <label className="block text-text mb-2">Skills You Can Teach</label>
                <div className="flex">
                  <input
                    type="text"
                    value={currentTeachSkill}
                    onChange={(e) => setCurrentTeachSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTeachSkill())}
                    className="input flex-1"
                    placeholder="e.g. JavaScript, Photography, Spanish"
                  />
                  <button
                    type="button"
                    onClick={handleAddTeachSkill}
                    className="ml-2 bg-accent text-primary px-4 rounded-lg hover:bg-opacity-90"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {teachSkills.map((skill, index) => (
                    <div key={index} className="bg-primary text-text px-3 py-1 rounded-full flex items-center">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveTeachSkill(skill)}
                        className="ml-2 text-text hover:text-accent"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Skills to Learn */}
              <div className="mb-6">
                <label className="block text-text mb-2">Skills You Want to Learn</label>
                <div className="flex">
                  <input
                    type="text"
                    value={currentLearnSkill}
                    onChange={(e) => setCurrentLearnSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLearnSkill())}
                    className="input flex-1"
                    placeholder="e.g. Python, Guitar, French"
                  />
                  <button
                    type="button"
                    onClick={handleAddLearnSkill}
                    className="ml-2 bg-accent text-primary px-4 rounded-lg hover:bg-opacity-90"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {learnSkills.map((skill, index) => (
                    <div key={index} className="bg-primary text-text px-3 py-1 rounded-full flex items-center">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveLearnSkill(skill)}
                        className="ml-2 text-text hover:text-accent"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Preview Section */}
          <div className="bg-primary rounded-lg p-6 mt-8">
            <h3 className="text-accent text-xl mb-4">Profile Preview</h3>
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-accent">
                {previewUrl ? (
                  <img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>
              <div className="ml-4">
                <h4 className="text-text text-lg font-semibold">{name || 'Your Name'}</h4>
                <div className="text-sm text-gray-400">
                  <span>Points: 0</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="mb-2">
                <span className="text-accent">Skills I can teach:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {teachSkills.length > 0 ? (
                    teachSkills.map((skill, index) => (
                      <span key={index} className="text-sm bg-secondary px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No skills added yet</span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-accent">Skills I want to learn:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {learnSkills.length > 0 ? (
                    learnSkills.map((skill, index) => (
                      <span key={index} className="text-sm bg-secondary px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No skills added yet</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              Complete Profile Setup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;

