import client from './client'

export const getStudentAverages = () => client.get('/analytics/student-averages')
export const getCoursePerformance = () => client.get('/analytics/course-performance')
export const getClassOverview = () => client.get('/analytics/class-overview')
export const getStudentTrend = (studentId) => client.get(`/analytics/student-trend/${studentId}`)
export const getStudents = () => client.get('/students/')
