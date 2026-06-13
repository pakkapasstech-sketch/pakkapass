import * as studentApi from '../api/studentApi';

export const studentService = {
  getAll: studentApi.getStudents,
  getById: studentApi.getStudentById,
  create: studentApi.createStudent,
  update: studentApi.updateStudent,
  remove: studentApi.deleteStudent,
};
