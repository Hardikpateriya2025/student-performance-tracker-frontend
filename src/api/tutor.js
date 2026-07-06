import client from './client'

export const askTutor = (studentId, question) =>
  client.post(`/tutor/${studentId}`, { question })
