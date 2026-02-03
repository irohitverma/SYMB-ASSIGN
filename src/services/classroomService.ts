import { supabase } from '../lib/supabase';
import { Classroom, NewClassroom, AllocationResult } from '../types/classroom';

export const classroomService = {
  async addClassroom(classroom: NewClassroom): Promise<Classroom | null> {
    const { data, error } = await supabase
      .from('classrooms')
      .insert([classroom])
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error adding classroom:', error);
      throw new Error(error.message);
    }

    return data;
  },

  async getAllClassrooms(): Promise<Classroom[]> {
    const { data, error } = await supabase
      .from('classrooms')
      .select('*')
      .order('floor', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching classrooms:', error);
      throw new Error(error.message);
    }

    return data || [];
  },

  async allocateExamSeats(totalStudents: number): Promise<AllocationResult> {
    const classrooms = await this.getAllClassrooms();

    if (classrooms.length === 0) {
      return {
        success: false,
        allocatedClassrooms: [],
        totalCapacity: 0,
        message: 'No classrooms available',
      };
    }

    const sortedClassrooms = [...classrooms].sort((a, b) => {
      if (a.floor !== b.floor) {
        return a.floor - b.floor;
      }
      return b.capacity - a.capacity;
    });

    const allocatedClassrooms: Classroom[] = [];
    let remainingStudents = totalStudents;

    for (const classroom of sortedClassrooms) {
      if (remainingStudents <= 0) break;

      allocatedClassrooms.push(classroom);
      remainingStudents -= classroom.capacity;
    }

    const totalCapacity = allocatedClassrooms.reduce(
      (sum, classroom) => sum + classroom.capacity,
      0
    );

    if (totalCapacity < totalStudents) {
      return {
        success: false,
        allocatedClassrooms: [],
        totalCapacity: sortedClassrooms.reduce(
          (sum, classroom) => sum + classroom.capacity,
          0
        ),
        message: 'Not enough seats available',
      };
    }

    return {
      success: true,
      allocatedClassrooms,
      totalCapacity,
      message: `Successfully allocated ${allocatedClassrooms.length} classroom(s) for ${totalStudents} students`,
    };
  },

  async deleteClassroom(id: string): Promise<void> {
    const { error } = await supabase
      .from('classrooms')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting classroom:', error);
      throw new Error(error.message);
    }
  },
};
