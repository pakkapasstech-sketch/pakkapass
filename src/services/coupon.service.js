import axiosInstance from '../api/axiosInstance';

export const couponService = {
  // Fetches coupon/referral codes from partner profiles via GET /admin/coupons
  getAll: async () => {
    const { data } = await axiosInstance.get('/admin/coupons');
    return data.coupons || [];
  },
};

export default couponService;
