import { useQuery } from '@tanstack/react-query';
import  parentService  from '../services/parent.service';
export const useParents = () =>
  useQuery({
    queryKey: ['parents'],
    queryFn: async () => {
      try {
        const data = await parentService.getAll();

        

        return data.map((p) => ({
  id: p.id,
  name: p.name || 'Unknown',
  email: p.email || '-',
  phone: p.mobile || '-',

  students:
    p.childrenProfiles?.length || 0,

  studentNames:
    p.childrenProfiles
      ?.map((cp) => cp.student?.name)
      .filter(Boolean) || [],

  status:
    p.childrenProfiles?.length > 0
      ? 'Active'
      : 'Inactive',
}));
      } catch {
        return 
      }
    },
  });

export default useParents;
