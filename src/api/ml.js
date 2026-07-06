import client from './client'

export const getPrediction = (studentId) => client.get(`/ml/predict/${studentId}`)
