export interface Classroom {
  id: string;
  name: string;
  floor: number;
  capacity: number;
  created_at: string;
}

export interface NewClassroom {
  name: string;
  floor: number;
  capacity: number;
}

export interface AllocationResult {
  success: boolean;
  allocatedClassrooms: Classroom[];
  totalCapacity: number;
  message: string;
}
