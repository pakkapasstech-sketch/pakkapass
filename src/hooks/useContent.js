import { useQuery } from '@tanstack/react-query';
import { contentService } from '../services/content.service';
import { mockContent } from '../mock/content';

export const useContent = () =>
  useQuery({
    queryKey: ['content'],
    queryFn: async () => {
      try {
        const data = await contentService.getAll();

        if (!data?.length) {
          return mockContent;
        }

        return data;
      } catch {
        return mockContent;
      }
    },
  });

export default useContent;
