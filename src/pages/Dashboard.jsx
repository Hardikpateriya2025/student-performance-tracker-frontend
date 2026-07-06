import { useEffect, useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import Navbar from '../components/Navbar'
import {
  getStudentAverages, getCoursePerformance, getClassOverview,
  getStudentTrend, getStudents,
} from '../api/analytics'
import { getPrediction } from '../api/ml'

export default function Dashboard() {
  const [studentAverages, setStudentAverages] = useState([])
  const [coursePerformance, setCoursePerformance] = useState([])
  const [classOverview, setClassOverview] = useState([])
  const [students, setStudents] = useState([])
  const [selectedStudentId, setSelectedStudentId] = useState(null)
  const [trend, setTrend] = useState([])
  const [prediction, setPrediction] = useState(null)
  const [predictionError, setPredictionError] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const [avgRes, courseRes, classRes, studentsRes] = await Promise.all([
          getStudentAverages(),
          getCoursePerformance(),
          getClassOverview(),
          getStudents(),
        ])
        setStudentAverages(avgRes.data)
        setCoursePerformance(courseRes.data)
        setClassOverview(classRes.data)
        setStudents(studentsRes.data)

        if (studentsRes.data.length > 0) {
          setSelectedStudentId(studentsRes.data[0].id)
        }
      } catch (err) {
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    if (!selectedStudentId) return

    getStudentTrend(selectedStudentId)
      .then((res) => setTrend(res.data))
      .catch(() => setTrend([]))

    setPrediction(null)
    setPredictionError('')
    getPrediction(selectedStudentId)
      .then((res) => setPrediction(res.data))
      .catch((err) => {
        setPredictionError(err.response?.data?.detail || 'Prediction unavailable')
      })
  }, [selectedStudentId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading dashboard...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto p-6 space-y-8">
        {error && <p className="text-red-600">{error}</p>}

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Students" value={studentAverages.length} />
          <StatCard label="Total Courses" value={coursePerformance.length} />
          <StatCard
            label="Overall Avg Score"
            value={
              studentAverages.length
                ? (
                    studentAverages.reduce((sum, s) => sum + s.average_score, 0) /
                    studentAverages.length
                  ).toFixed(1)
                : '—'
            }
          />
        </div>

        {/* Course performance bar chart */}
        <ChartCard title="Course Performance (Average Score)">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={coursePerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="course_name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="average_score" fill="#6366f1" name="Average Score" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Class pass rate bar chart */}
        <ChartCard title="Class Pass Rate (%)">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={classOverview}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="class_name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="pass_rate" fill="#10b981" name="Pass Rate %" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Student trend + ML prediction */}
        <ChartCard title="Student Score Trend & AI Prediction">
          <div className="mb-3">
            <select
              value={selectedStudentId || ''}
              onChange={(e) => setSelectedStudentId(Number(e.target.value))}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.roll_number} ({s.class_name})
                </option>
              ))}
            </select>
          </div>

          {/* ML Prediction card */}
          {predictionError && (
            <p className="text-sm text-slate-400 mb-4">{predictionError}</p>
          )}
          {prediction && (
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                <p className="text-xs text-indigo-600 font-medium">Predicted Next Score</p>
                <p className="text-2xl font-bold text-indigo-900 mt-1">
                  {prediction.predicted_next_score}
                </p>
              </div>
              <div
                className={`rounded-lg p-4 border ${
                  prediction.at_risk
                    ? 'bg-red-50 border-red-100'
                    : 'bg-emerald-50 border-emerald-100'
                }`}
              >
                <p
                  className={`text-xs font-medium ${
                    prediction.at_risk ? 'text-red-600' : 'text-emerald-600'
                  }`}
                >
                  Risk Status
                </p>
                <p
                  className={`text-2xl font-bold mt-1 ${
                    prediction.at_risk ? 'text-red-900' : 'text-emerald-900'
                  }`}
                >
                  {prediction.at_risk ? 'At Risk' : 'On Track'}
                </p>
              </div>
              <div className="bg-slate-100 border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500 font-medium">Risk Probability</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">
                  {(prediction.at_risk_probability * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          )}

          {trend.length === 0 ? (
            <p className="text-slate-400 text-sm">No grade history for this student yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} name="Score" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Student averages table */}
        <ChartCard title="Student Averages">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200">
                <th className="py-2">Roll Number</th>
                <th className="py-2">Average Score</th>
                <th className="py-2">Average Attendance</th>
              </tr>
            </thead>
            <tbody>
              {studentAverages.map((s) => (
                <tr key={s.student_id} className="border-b border-slate-100">
                  <td className="py-2 text-slate-700">{s.roll_number}</td>
                  <td className="py-2 text-slate-700">{s.average_score}</td>
                  <td className="py-2 text-slate-700">
                    {s.average_attendance ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ChartCard>
      </main>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-100">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
    </div>
  )
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-100">
      <h2 className="text-sm font-semibold text-slate-700 mb-4">{title}</h2>
      {children}
    </div>
  )
}
