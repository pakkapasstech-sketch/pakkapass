import { useQuery } from '@tanstack/react-query';
import  parentService  from '../services/parent.service';
export const useParents = () =>
  useQuery({
    queryKey: ['parents'],
    queryFn: async () => {
      try {
        const data = await parentService.getAll();

        

        data.sort((a, b) => new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id));

        return data.map((p) => ({
          id: p.id,
          name: p.name || 'Unknown',
          email: p.email || '-',
          phone: p.mobile || '-',
          students: p.childrenProfiles?.length || 0,
          studentNames: p.childrenProfiles?.map((cp) => cp.student?.name).filter(Boolean) || [],
          studentList: p.childrenProfiles?.map((cp) => ({
            id: cp.student?.id,
            name: cp.student?.name
          })).filter((s) => s.id && s.name) || [],
          status: p.childrenProfiles?.length > 0 ? 'Active' : 'Inactive',
        }));
      } catch {
        return 
      }
    },
  });

export default useParents;
