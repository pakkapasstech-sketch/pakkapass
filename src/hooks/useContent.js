import { useQuery } from '@tanstack/react-query';
import { contentService, mapContentFromApi } from '../services/content.service';
// import { mockContent } from '../mock/content';

export const useContent = () =>
  useQuery({
    queryKey: ['content'],
    queryFn: contentService.getAll,
    select: mapContentFromApi,
  });

export const useContentRaw = () =>
  useQuery({
    queryKey: ['content'],
    queryFn: contentService.getAll,
  });

export default useContent;
