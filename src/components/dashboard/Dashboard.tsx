import React from 'react';
import { Link } from 'react-router-dom';
import { Upload, FileText, Users, BarChart3, Shield, Clock, FolderOpen } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Upload Document',
      description: 'Add new documents to your vault',
      icon: Upload,
      link: '/upload',
      color: 'from-blue-500 to-purple-600'
    },
    {
      title: 'View Documents',
      description: 'Browse and manage your documents',
      icon: FileText,
      link: '/documents',
      color: 'from-green-500 to-blue-500'
    },
    {
      title: user?.role === 'admin' ? 'Admin Panel' : 'My Documents',
      description: user?.role === 'admin' ? 'Manage all system documents' : 'View your uploaded documents',
      icon: user?.role === 'admin' ? Users : FolderOpen,
      link: user?.role === 'admin' ? '/admin/documents' : '/documents',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const stats = [
    { label: 'Total Documents', value: '24', icon: FileText, color: 'text-blue-400' },
    { label: 'Storage Used', value: '2.1 GB', icon: BarChart3, color: 'text-green-400' },
    { label: 'Recent Uploads', value: '7', icon: Clock, color: 'text-purple-400' },
    { label: 'Categories', value: '5', icon: FolderOpen, color: 'text-yellow-400' }
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-gray-300 text-lg">
                  Manage your documents securely in one place
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">Document Vault</p>
                  <p className="text-gray-300 text-sm">Secure & Reliable</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gray-800/50 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="group bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${action.color} group-hover:shadow-lg transition-shadow`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-gray-300 text-sm mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'Uploaded', document: 'Financial Report Q4 2024.pdf', time: '2 hours ago', type: 'upload' },
              { action: 'Downloaded', document: 'Company Policies.docx', time: '4 hours ago', type: 'download' },
              { action: 'Deleted', document: 'Old Contract.pdf', time: '1 day ago', type: 'delete' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'upload' ? 'bg-green-600/20 text-green-400' :
                    activity.type === 'download' ? 'bg-blue-600/20 text-blue-400' :
                    'bg-red-600/20 text-red-400'
                  }`}>
                    {activity.type === 'upload' ? <Upload className="w-4 h-4" /> :
                     activity.type === 'download' ? <FileText className="w-4 h-4" /> :
                     <FileText className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {activity.action} <span className="text-gray-300">{activity.document}</span>
                    </p>
                    <p className="text-gray-400 text-sm">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;