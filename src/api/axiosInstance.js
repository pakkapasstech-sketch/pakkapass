import axios from 'axios';

const getToken = () =>
  localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

const getRefreshToken = () =>
  localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');

const setTokens = (accessToken, refreshToken) => {
  const storage =
    localStorage.getItem('rememberMe') === 'true' ? localStorage : sessionStorage;
  storage.setItem('accessToken', accessToken);
  if (refreshToken) storage.setItem('refreshToken', refreshToken);
};

const clearTokens = () => {
  [localStorage, sessionStorage].forEach((s) => {
    s.removeItem('accessToken');
    s.removeItem('refreshToken');
    s.removeItem('authUser');
  });
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL || '/api'}/auth/refresh`,
            { refreshToken }
          );
          setTokens(data.accessToken, data.refreshToken);
          original.headers.Authorization = `Bearer ${data.accessToken}`;
          return axiosInstance(original);
        } catch {
          clearTokens();
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
      } else if (!window.location.pathname.includes('/login')) {
        clearTokens();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export { getToken, getRefreshToken, setTokens, clearTokens };
export default axiosInstance;
