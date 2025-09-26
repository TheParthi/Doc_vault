import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, File, Tag, ArrowLeft } from 'lucide-react';
import * as api from '../../utils/api';
import Alert from '../ui/Alert';
import LoadingSpinner from '../ui/LoadingSpinner';

const DocumentUploadForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const navigate = useNavigate();

  const categories = [
    'Finance',
    'HR',
    'Legal',
    'Marketing',
    'Operations',
    'IT',
    'Other'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Document title is required';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Please select a category';
    }
    
    if (!file) {
      newErrors.file = 'Please select a file to upload';
    } else if (file.size > 50 * 1024 * 1024) { // 50MB limit
      newErrors.file = 'File size must be less than 50MB';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    
    if (!validateForm() || !file) return;
    
    setLoading(true);
    try {
      await api.uploadDocument(formData.title, formData.category, file);
      setAlert({ type: 'success', message: 'Document uploaded successfully!' });
      setTimeout(() => navigate('/documents'), 2000);
    } catch (error) {
      setAlert({ type: 'error', message: 'Upload failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (errors.file) {
        setErrors(prev => ({ ...prev, file: '' }));
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      if (errors.file) {
        setErrors(prev => ({ ...prev, file: '' }));
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-300 hover:text-white transition-colors mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Upload Document</h1>
            <p className="text-gray-300 mt-2">Add a new document to your vault</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          {alert && (
            <div className="mb-6">
              <Alert 
                type={alert.type} 
                message={alert.message}
                onClose={() => setAlert(null)}
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Document Title */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Document Title *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <File className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${
                    errors.title ? 'border-red-500' : 'border-white/20'
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                  placeholder="Enter document title"
                />
              </div>
              {errors.title && (
                <p className="mt-1 text-sm text-red-400">{errors.title}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Category *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${
                    errors.category ? 'border-red-500' : 'border-white/20'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none`}
                >
                  <option value="" className="bg-gray-800">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-gray-800">
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              {errors.category && (
                <p className="mt-1 text-sm text-red-400">{errors.category}</p>
              )}
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                File Upload *
              </label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                  dragActive 
                    ? 'border-purple-500 bg-purple-500/10' 
                    : errors.file 
                      ? 'border-red-500 bg-red-500/5' 
                      : 'border-white/30 hover:border-white/50 hover:bg-white/5'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="file-upload"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                />
                
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  
                  {file ? (
                    <div className="text-center">
                      <p className="text-white font-medium">{file.name}</p>
                      <p className="text-gray-300 text-sm">{formatFileSize(file.size)}</p>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="text-red-400 hover:text-red-300 text-sm mt-2 transition-colors"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-white font-medium mb-2">
                        Drop files here or click to browse
                      </p>
                      <p className="text-gray-400 text-sm">
                        Supports PDF, DOC, XLS, PPT, images and more (max 50MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {errors.file && (
                <p className="mt-1 text-sm text-red-400">{errors.file}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
              >
                {loading ? <LoadingSpinner /> : 'Upload Document'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadForm;