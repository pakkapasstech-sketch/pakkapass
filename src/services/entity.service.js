import axiosInstance from '../api/axiosInstance';

const entityService = {
  addGrade: (name) =>
    axiosInstance.post('/admin/grade', {
      name,
    }),

  addBoard: (name, gradeName) =>
    axiosInstance.post('/admin/board', {
      name,
      gradeName,
    }),

  addBranch: (name, gradeName) =>
    axiosInstance.post('/admin/branch', {
      name,
      gradeName,
    }),

  addSubject: (data) =>
  axiosInstance.post(
    '/admin/subject',
    data
  ),
  addContentType: (
  name
) =>
  axiosInstance.post(
    '/admin/content-type',
    {
      name,
    }
  ),
  addChapter: (data) => axiosInstance.post('/admin/chapter', data),

  addTopic: (data) => axiosInstance.post('/admin/topic', data),
  // Chapters
updateChapter: (id, data) =>
  axiosInstance.put(`/admin/chapter/${id}`, data),

deleteChapter: (id) =>
  axiosInstance.delete(`/admin/chapter/${id}`),

// Topics
updateTopic: (id, data) =>
  axiosInstance.put(`/admin/topic/${id}`, data),

deleteTopic: (id) =>
  axiosInstance.delete(`/admin/topic/${id}`),
updateGrade(id, body) {
  return axiosInstance.put(`/admin/grade/${id}`, body);
},

deleteGrade(id) {
  return axiosInstance.delete(`/admin/grade/${id}`);
},

updateBoard(id, body) {
  return axiosInstance.put(`/admin/board/${id}`, body);
},

deleteBoard(id) {
  return axiosInstance.delete(`/admin/board/${id}`);
},

updateBranch(id, body) {
  return axiosInstance.put(`/admin/branch/${id}`, body);
},

deleteBranch(id) {
  return axiosInstance.delete(`/admin/branch/${id}`);
},

updateSubject(id, body) {
  return axiosInstance.put(`/admin/subject/${id}`, body);
},

deleteSubject(id) {
  return axiosInstance.delete(`/admin/subject/${id}`);
},


updateContentAsset(id, body) {
  return axiosInstance.put(`/admin/content-asset/${id}`, body);
},

deleteContentAsset(id) {
  return axiosInstance.delete(`/admin/content-asset/${id}`);
},
};


export default entityService;
