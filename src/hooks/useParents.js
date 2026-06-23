import { useQuery } from '@tanstack/react-query';
import { parentService } from '../services/parent.service';
import { parents as mockParents } from '../data/parents';
export const useParents = () =>
  useQuery({
    queryKey: ['parents'],
    queryFn: async () => {
      try {
        const data = await parentService.getAll();

        if (!data || data.length === 0) {
          return mockParents;
        }

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
        return mockParents;
      }
    },
  });

export default useParents;
