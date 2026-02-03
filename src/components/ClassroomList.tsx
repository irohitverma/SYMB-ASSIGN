import { Trash2, School } from 'lucide-react';
import { Classroom } from '../types/classroom';
import { classroomService } from '../services/classroomService';

interface ClassroomListProps {
  classrooms: Classroom[];
  onClassroomDeleted: () => void;
}

export function ClassroomList({ classrooms, onClassroomDeleted }: ClassroomListProps) {
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    try {
      await classroomService.deleteClassroom(id);
      onClassroomDeleted();
    } catch (error) {
      alert('Failed to delete classroom');
      console.error(error);
    }
  };

  const totalCapacity = classrooms.reduce((sum, classroom) => sum + classroom.capacity, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Classrooms</h2>
        <div className="text-sm text-gray-600">
          Total Capacity: <span className="font-semibold text-blue-600">{totalCapacity} seats</span>
        </div>
      </div>

      {classrooms.length === 0 ? (
        <div className="text-center py-12">
          <School className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500">No classrooms added yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Floor</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Capacity</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classrooms.map((classroom) => (
                <tr key={classroom.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-800">{classroom.name}</td>
                  <td className="py-3 px-4 text-gray-600">Floor {classroom.floor}</td>
                  <td className="py-3 px-4 text-gray-600">{classroom.capacity} seats</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDelete(classroom.id, classroom.name)}
                      className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-lg hover:bg-red-50"
                      title="Delete classroom"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
