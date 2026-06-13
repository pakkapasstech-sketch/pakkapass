import { useQuery } from '@tanstack/react-query';
import { studentService } from '../services/studentService';
import { QUERY_KEYS } from '../constants/queryKeys';

export const useStudents = (params = {}) =>
  useQuery({
    queryKey: QUERY_KEYS.students.list(params),
    queryFn: () => studentService.getAll(params),
  });
