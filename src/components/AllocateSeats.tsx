import { useState } from 'react';
import { Calculator, CheckCircle, XCircle } from 'lucide-react';
import { classroomService } from '../services/classroomService';
import { AllocationResult } from '../types/classroom';

export function AllocateSeats() {
  const [totalStudents, setTotalStudents] = useState('');
  const [isAllocating, setIsAllocating] = useState(false);
  const [result, setResult] = useState<AllocationResult | null>(null);

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    const studentCount = parseInt(totalStudents);

    if (!studentCount || studentCount <= 0) {
      alert('Please enter a valid number of students');
      return;
    }

    try {
      setIsAllocating(true);
      const allocationResult = await classroomService.allocateExamSeats(studentCount);
      setResult(allocationResult);
    } catch (error) {
      alert('Failed to allocate seats');
      console.error(error);
    } finally {
      setIsAllocating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Allocate Exam Seats</h2>

      <form onSubmit={handleAllocate} className="space-y-4">
        <div>
          <label htmlFor="students" className="block text-sm font-medium text-gray-700 mb-1">
            Total Number of Students
          </label>
          <input
            type="number"
            id="students"
            value={totalStudents}
            onChange={(e) => setTotalStudents(e.target.value)}
            placeholder="Enter number of students"
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isAllocating}
          />
        </div>

        <button
          type="submit"
          disabled={isAllocating}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Calculator size={20} />
          {isAllocating ? 'Allocating...' : 'Allocate Classrooms'}
        </button>
      </form>

      {result && (
        <div className="mt-6">
          {result.success ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={24} />
                <div className="flex-1">
                  <h3 className="font-semibold text-green-800 mb-2">Allocation Successful</h3>
                  <p className="text-green-700 mb-3">{result.message}</p>

                  <div className="space-y-2">
                    <h4 className="font-medium text-green-800">Allocated Classrooms:</h4>
                    <div className="bg-white rounded-lg border border-green-200 overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-green-100">
                          <tr>
                            <th className="text-left py-2 px-3 text-sm font-semibold text-green-800">Classroom</th>
                            <th className="text-left py-2 px-3 text-sm font-semibold text-green-800">Floor</th>
                            <th className="text-right py-2 px-3 text-sm font-semibold text-green-800">Capacity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.allocatedClassrooms.map((classroom) => (
                            <tr key={classroom.id} className="border-t border-green-100">
                              <td className="py-2 px-3 text-sm text-gray-800">{classroom.name}</td>
                              <td className="py-2 px-3 text-sm text-gray-600">Floor {classroom.floor}</td>
                              <td className="text-right py-2 px-3 text-sm text-gray-600">{classroom.capacity}</td>
                            </tr>
                          ))}
                          <tr className="border-t-2 border-green-200 bg-green-50">
                            <td colSpan={2} className="py-2 px-3 text-sm font-semibold text-green-800">Total Capacity</td>
                            <td className="text-right py-2 px-3 text-sm font-semibold text-green-800">{result.totalCapacity}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <XCircle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-800 mb-2">Allocation Failed</h3>
                  <p className="text-red-700 mb-2">{result.message}</p>
                  <p className="text-sm text-red-600">
                    Total available capacity: {result.totalCapacity} seats
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
