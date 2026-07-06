import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import {
  listStudents, listCourses, createStudent, createCourse, createGrade,
} from '../api/entities'

export default function Manage() {
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])

  // Course form
  const [courseName, setCourseName] = useState('')
  const [courseMsg, setCourseMsg] = useState('')

  // Student form
  const [userId, setUserId] = useState('')
  const [rollNumber, setRollNumber] = useState('')
  const [className, setClassName] = useState('')
  const [studentMsg, setStudentMsg] = useState('')

  // Grade form
  const [gStudentId, setGStudentId] = useState('')
  const [gCourseId, setGCourseId] = useState('')
  const [examType, setExamType] = useState('quiz')
  const [score, setScore] = useState('')
  const [attendance, setAttendance] = useState('')
  const [date, setDate] = useState('')
  const [gradeMsg, setGradeMsg] = useState('')

  async function refresh() {
    const [s, c] = await Promise.all([listStudents(), listCourses()])
    setStudents(s.data)
    setCourses(c.data)
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleCourseSubmit(e) {
    e.preventDefault()
    setCourseMsg('')
    try {
      await createCourse({ name: courseName })
      setCourseMsg('Course created ✅')
      setCourseName('')
      refresh()
    } catch (err) {
      setCourseMsg(err.response?.data?.detail || 'Failed to create course')
    }
  }

  async function handleStudentSubmit(e) {
    e.preventDefault()
    setStudentMsg('')
    try {
      await createStudent({
        user_id: Number(userId),
        roll_number: rollNumber,
        class_name: className,
      })
      setStudentMsg('Student created ✅')
      setUserId('')
      setRollNumber('')
      setClassName('')
      refresh()
    } catch (err) {
      setStudentMsg(err.response?.data?.detail || 'Failed to create student')
    }
  }

  async function handleGradeSubmit(e) {
    e.preventDefault()
    setGradeMsg('')
    try {
      await createGrade({
        student_id: Number(gStudentId),
        course_id: Number(gCourseId),
        exam_type: examType,
        score: Number(score),
        attendance_percent: attendance ? Number(attendance) : null,
        date,
      })
      setGradeMsg('Grade added ✅')
      setScore('')
      setAttendance('')
      setDate('')
    } catch (err) {
      setGradeMsg(err.response?.data?.detail || 'Failed to add grade')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-3xl mx-auto p-6 space-y-8">
        <h1 className="text-xl font-bold text-slate-800">Manage Data</h1>

        {/* Add Course */}
        <FormCard title="Add Course">
          <form onSubmit={handleCourseSubmit} className="space-y-3">
            <input
              type="text"
              required
              placeholder="Course name (e.g. Physics)"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
              Add Course
            </button>
            {courseMsg && <p className="text-sm text-slate-600">{courseMsg}</p>}
          </form>
        </FormCard>

        {/* Add Student */}
        <FormCard title="Add Student Profile">
          <p className="text-xs text-slate-500 mb-2">
            Note: the person must already have a registered account (Register page) with role "student". Use their User ID here.
          </p>
          <form onSubmit={handleStudentSubmit} className="space-y-3">
            <input
              type="number"
              required
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
            <input
              type="text"
              required
              placeholder="Roll Number (e.g. R002)"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
            <input
              type="text"
              required
              placeholder="Class Name (e.g. 10-A)"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
              Add Student
            </button>
            {studentMsg && <p className="text-sm text-slate-600">{studentMsg}</p>}
          </form>
        </FormCard>

        {/* Add Grade */}
        <FormCard title="Add Grade">
          <form onSubmit={handleGradeSubmit} className="space-y-3">
            <select
              required
              value={gStudentId}
              onChange={(e) => setGStudentId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              <option value="">Select student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.roll_number} ({s.class_name})
                </option>
              ))}
            </select>

            <select
              required
              value={gCourseId}
              onChange={(e) => setGCourseId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              <option value="">Select course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              <option value="quiz">Quiz</option>
              <option value="midterm">Midterm</option>
              <option value="final">Final</option>
            </select>

            <input
              type="number"
              step="0.1"
              required
              placeholder="Score (0-100)"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />

            <input
              type="number"
              step="0.1"
              placeholder="Attendance % (optional)"
              value={attendance}
              onChange={(e) => setAttendance(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />

            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />

            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
              Add Grade
            </button>
            {gradeMsg && <p className="text-sm text-slate-600">{gradeMsg}</p>}
          </form>
        </FormCard>
      </main>
    </div>
  )
}

function FormCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-slate-100">
      <h2 className="text-sm font-semibold text-slate-700 mb-4">{title}</h2>
      {children}
    </div>
  )
}
