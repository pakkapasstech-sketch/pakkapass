import { useQuery } from '@tanstack/react-query';
import { paymentService } from '../services/paymentService';
import { QUERY_KEYS } from '../constants/queryKeys';

export const usePayments = (params = {}) =>
  useQuery({
    queryKey: QUERY_KEYS.payments.list(params),
    queryFn: () => paymentService.getAll(params),
  });
