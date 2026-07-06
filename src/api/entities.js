import client from './client'

// Students
export const listStudents = () => client.get('/students/')
export const createStudent = (data) => client.post('/students/', data)

// Courses
export const listCourses = () => client.get('/courses/')
export const createCourse = (data) => client.post('/courses/', data)

// Grades
export const createGrade = (data) => client.post('/grades/', data)
