import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { partnerService } from '../services/partner.service';
import toast from 'react-hot-toast';

export const usePartners = (params = {}) =>
  useQuery({
    queryKey: ['partners', params],
    queryFn: () => partnerService.getAll(params),
  });

export const usePartner = (id) =>
  useQuery({
    queryKey: ['partner', id],
    queryFn: () => partnerService.getById(id),
    enabled: !!id,
  });

export const useCreatePartner = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: partnerService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['partners'] });
      toast.success('Partner created successfully');
    },
    onError: (e) => toast.error(e?.response?.data?.message || 'Failed to create partner'),
  });
};

export const useUpdatePartner = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => partnerService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['partners'] });
      toast.success('Partner updated successfully');
    },
    onError: (e) => toast.error(e?.response?.data?.message || 'Failed to update partner'),
  });
};

export const useUpdatePartnerStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => partnerService.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['partners'] });
      toast.success('Partner status updated');
    },
    onError: (e) => toast.error(e?.response?.data?.message || 'Failed to update status'),
  });
};

export default usePartners;
