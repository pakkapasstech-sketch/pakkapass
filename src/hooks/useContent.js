import { useQuery } from '@tanstack/react-query';
import { contentService } from '../services/content.service';
// import { mockContent } from '../mock/content';

export const useContent =
  () =>
    useQuery({
      queryKey: [
        'content',
      ],
      queryFn:
        contentService.getAll,
    });

export default useContent;
