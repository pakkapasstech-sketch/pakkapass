import axiosInstance from '../api/axiosInstance';

const entityService = {
  addGrade: (name) =>
    axiosInstance.post('/admin/grade', {
      name,
    }),

  addBoard: (name) =>
    axiosInstance.post('/admin/board', {
      name,
    }),

  addBranch: (name) =>
    axiosInstance.post('/admin/branch', {
      name,
    }),

  addSubject: (data) =>
  axiosInstance.post(
    '/admin/subject',
    data
  ),
  addChapter: (data) => axiosInstance.post('/admin/chapter', data),

  addTopic: (data) => axiosInstance.post('/admin/topic', data),
};

export default entityService;
