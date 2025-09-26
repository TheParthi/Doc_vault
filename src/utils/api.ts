import { User, Document } from '../types';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@vault.com', role: 'admin' },
  { id: '2', name: 'John Doe', email: 'user@vault.com', role: 'user' }
];

const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Financial Report Q4 2024',
    category: 'Finance',
    uploadDate: '2024-01-15',
    fileName: 'financial-report-q4.pdf',
    fileSize: '2.5 MB',
    uploadedBy: 'John Doe'
  },
  {
    id: '2',
    title: 'Company Policies',
    category: 'HR',
    uploadDate: '2024-01-10',
    fileName: 'company-policies.docx',
    fileSize: '1.2 MB',
    uploadedBy: 'Admin User'
  }
];

export const login = async (email: string, password: string): Promise<User> => {
  await delay(1000);
  const user = mockUsers.find(u => u.email === email);
  if (user && password === 'password123') {
    return user;
  }
  throw new Error('Invalid credentials');
};

export const register = async (name: string, email: string, password: string): Promise<User> => {
  await delay(1000);
  const newUser: User = {
    id: Date.now().toString(),
    name,
    email,
    role: 'user'
  };
  mockUsers.push(newUser);
  return newUser;
};

export const uploadDocument = async (title: string, category: string, file: File): Promise<Document> => {
  await delay(2000);
  const newDoc: Document = {
    id: Date.now().toString(),
    title,
    category,
    uploadDate: new Date().toISOString().split('T')[0],
    fileName: file.name,
    fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    uploadedBy: 'Current User'
  };
  mockDocuments.push(newDoc);
  return newDoc;
};

export const getDocuments = async (): Promise<Document[]> => {
  await delay(500);
  return mockDocuments;
};

export const deleteDocument = async (id: string): Promise<void> => {
  await delay(500);
  const index = mockDocuments.findIndex(doc => doc.id === id);
  if (index > -1) {
    mockDocuments.splice(index, 1);
  }
};

export const downloadDocument = async (id: string): Promise<void> => {
  await delay(500);
  // Simulate download
  console.log(`Downloading document with ID: ${id}`);
};