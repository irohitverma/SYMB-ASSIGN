import { useEffect, useState } from 'react';
import { School } from 'lucide-react';
import { AddClassroomForm } from './components/AddClassroomForm';
import { ClassroomList } from './components/ClassroomList';
import { AllocateSeats } from './components/AllocateSeats';
import { classroomService } from './services/classroomService';
import { Classroom } from './types/classroom';

function App() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadClassrooms = async () => {
    try {
      const data = await classroomService.getAllClassrooms();
      setClassrooms(data);
    } catch (error) {
      console.error('Failed to load classrooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClassrooms();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <School className="text-blue-600" size={36} />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">College Exam Seat Planner</h1>
              <p className="text-gray-600 text-sm mt-1">Manage classrooms and allocate exam seats efficiently</p>
            </div>
          </div>
        </div>
      </header>

      

      <footer className="mt-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-600 text-sm">
            College Exam Seat Planner - Allocate classrooms efficiently for examinations
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
