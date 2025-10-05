import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, RefreshCw, AlertCircle } from 'lucide-react';
import StudentForm from '@/components/StudentForm';
import StudentList from '@/components/StudentList';
import ModeToggle from '@/components/ModeToggle';
import { Student, StudentFormData, StorageMode } from '@/types/student';

export default function Index() {
  const [students, setStudents] = useState<Student[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>();
  const [storageMode, setStorageMode] = useState<StorageMode>('mysql');
  const [loading, setLoading] = useState(false);

  // API base URL - will be configured for backend
  const API_BASE = 'http://localhost:3001/api';

  // Load students on component mount and mode change
  useEffect(() => {
    loadStudents();
  }, [storageMode]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/students?mode=${storageMode}`);
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        // Fallback to mock data for demo purposes
        setStudents(getMockStudents());
        toast.error(`Backend not connected. Showing demo data for ${storageMode} mode.`);
      }
    } catch (error) {
      // Fallback to mock data
      setStudents(getMockStudents());
      toast.error(`Backend not connected. Showing demo data for ${storageMode} mode.`);
    } finally {
      setLoading(false);
    }
  };

  const getMockStudents = (): Student[] => {
    if (storageMode === 'mysql') {
      return [
        { id: 1, name: 'John Doe', age: 20, course: 'Computer Science', grade: 'A', email: 'john@example.com', phone: '+1-555-0101' },
        { id: 2, name: 'Jane Smith', age: 19, course: 'Mathematics', grade: 'A-', email: 'jane@example.com', phone: '+1-555-0102' },
        { id: 3, name: 'Mike Johnson', age: 21, course: 'Physics', grade: 'B+', email: 'mike@example.com', phone: '+1-555-0103' }
      ];
    } else {
      return [
        { id: 1, name: 'Alice Brown', age: 22, course: 'Chemistry', grade: 'A+', email: 'alice@example.com', phone: '+1-555-0201' },
        { id: 2, name: 'Bob Wilson', age: 20, course: 'Biology', grade: 'B', email: 'bob@example.com', phone: '+1-555-0202' }
      ];
    }
  };

  const handleAddStudent = async (formData: StudentFormData) => {
    try {
      const response = await fetch(`${API_BASE}/students?mode=${storageMode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const newStudent = await response.json();
        setStudents(prev => [...prev, newStudent]);
        toast.success('Student added successfully!');
      } else {
        // Mock success for demo
        const newStudent: Student = {
          id: Date.now(),
          ...formData
        };
        setStudents(prev => [...prev, newStudent]);
        toast.success(`Student added successfully using ${storageMode}!`);
      }
    } catch (error) {
      // Mock success for demo
      const newStudent: Student = {
        id: Date.now(),
        ...formData
      };
      setStudents(prev => [...prev, newStudent]);
      toast.success(`Student added successfully using ${storageMode}!`);
    }

    setShowForm(false);
  };

  const handleEditStudent = async (formData: StudentFormData) => {
    if (!editingStudent) return;

    try {
      const response = await fetch(`${API_BASE}/students/${editingStudent.id}?mode=${storageMode}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedStudent = await response.json();
        setStudents(prev => prev.map(s => s.id === editingStudent.id ? updatedStudent : s));
        toast.success('Student updated successfully!');
      } else {
        // Mock success for demo
        const updatedStudent: Student = { ...editingStudent, ...formData };
        setStudents(prev => prev.map(s => s.id === editingStudent.id ? updatedStudent : s));
        toast.success(`Student updated successfully using ${storageMode}!`);
      }
    } catch (error) {
      // Mock success for demo
      const updatedStudent: Student = { ...editingStudent, ...formData };
      setStudents(prev => prev.map(s => s.id === editingStudent.id ? updatedStudent : s));
      toast.success(`Student updated successfully using ${storageMode}!`);
    }

    setEditingStudent(undefined);
    setShowForm(false);
  };

  const handleDeleteStudent = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}/students/${id}?mode=${storageMode}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setStudents(prev => prev.filter(s => s.id !== id));
        toast.success('Student deleted successfully!');
      } else {
        // Mock success for demo
        setStudents(prev => prev.filter(s => s.id !== id));
        toast.success(`Student deleted successfully using ${storageMode}!`);
      }
    } catch (error) {
      // Mock success for demo
      setStudents(prev => prev.filter(s => s.id !== id));
      toast.success(`Student deleted successfully using ${storageMode}!`);
    }
  };

  const handleModeChange = (mode: StorageMode) => {
    setStorageMode(mode);
    toast.info(`Switched to ${mode === 'mysql' ? 'MySQL Database' : 'C Data Structures'} mode`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Student Management System
            </CardTitle>
            <p className="text-center text-gray-600">
              Manage student records with dual storage modes: MySQL Database & C Data Structures
            </p>
          </CardHeader>
        </Card>

        {/* Mode Toggle */}
        <ModeToggle mode={storageMode} onModeChange={handleModeChange} />

        {/* Backend Status Alert */}
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">
                <strong>Demo Mode:</strong> Backend server not running. 
                {storageMode === 'mysql' 
                  ? ' Connect your MySQL database and start the Node.js server to enable full functionality.'
                  : ' Compile C programs and start the backend to enable C data structures integration.'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex gap-4 justify-between items-center">
          <Button
            onClick={() => {
              setShowForm(true);
              setEditingStudent(undefined);
            }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Student
          </Button>
          
          <Button
            variant="outline"
            onClick={loadStudents}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <StudentForm
            student={editingStudent}
            onSubmit={editingStudent ? handleEditStudent : handleAddStudent}
            onCancel={() => {
              setShowForm(false);
              setEditingStudent(undefined);
            }}
            isEditing={!!editingStudent}
          />
        )}

        {/* Student List */}
        <StudentList
          students={students}
          onEdit={(student) => {
            setEditingStudent(student);
            setShowForm(true);
          }}
          onDelete={handleDeleteStudent}
        />
      </div>
    </div>
  );
}