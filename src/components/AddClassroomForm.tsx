import { useState } from 'react';
import { Plus } from 'lucide-react';
import { classroomService } from '../services/classroomService';

interface AddClassroomFormProps {
  onClassroomAdded: () => void;
}

export function AddClassroomForm({ onClassroomAdded }: AddClassroomFormProps) {
  const [name, setName] = useState('');
  const [floor, setFloor] = useState('');
  const [capacity, setCapacity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !floor || !capacity) {
      setError('All fields are required');
      return;
    }

    const floorNum = parseInt(floor);
    const capacityNum = parseInt(capacity);

    if (capacityNum <= 0) {
      setError('Capacity must be greater than 0');
      return;
    }

    try {
      setIsSubmitting(true);
      await classroomService.addClassroom({
        name: name.trim(),
        floor: floorNum,
        capacity: capacityNum,
      });

      setName('');
      setFloor('');
      setCapacity('');
      onClassroomAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add classroom');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Classroom</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Classroom Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Room 101, Lab A"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-1">
            Floor Number
          </label>
          <input
            type="number"
            id="floor"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            placeholder="e.g., 1, 2, 3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
            Seating Capacity
          </label>
          <input
            type="number"
            id="capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="e.g., 30, 50"
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          {isSubmitting ? 'Adding...' : 'Add Classroom'}
        </button>
      </form>
    </div>
  );
}
