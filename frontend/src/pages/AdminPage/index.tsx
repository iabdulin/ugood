import { useState, useEffect } from 'react'
import { type SurveyResponse } from '@/models/SurveyResponse'
import { type Stats as StatsType } from '@/models/Stats'
import { adminAPI } from '@/api'
import { Stats } from '@/pages/AdminPage/Stats'
import { SurveyResponsesTable } from '@/pages/AdminPage/SurverResponsesTable'

export const AdminPage = () => {
  const [surveyResponses, setSurveyResponses] = useState<SurveyResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState<StatsType | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const submissions = await adminAPI.getSubmissions()
      setSurveyResponses(submissions)
      const stats = await adminAPI.getStats()
      setStats(stats)
    } catch (error) {
      console.error('Error fetching data:', error)
      alert('Failed to fetch data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to delete ALL submissions? This action cannot be undone.')) {
      return
    }
    setIsLoading(true)
    try {
      await adminAPI.deleteAll()
      fetchData()
    } catch (error) {
      console.error('Error deleting submissions:', error)
      alert('Failed to delete submissions')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateSubmissions = async () => {
    setIsLoading(true)
    try {
      await adminAPI.generateSubmissions()
      fetchData()
    } catch (error) {
      console.error('Error generating submissions:', error)
      alert('Error generating submissions')
    } finally {
      setIsLoading(false)
    }
  }

  return <div className='p-6 rounded-lg shadow-sm border border-gray-200 bg-[#FBFBFB]' data-testid="admin-page">
    <h1 className="text-3xl">Admin Page</h1>
    <div className="flex justify-between items-center mb-6">
      <div className="flex gap-4">
        <button
          onClick={handleGenerateSubmissions}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Generate Sample Submissions
        </button>
        <button
          onClick={handleClearAll}
          disabled={isLoading}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-bold disabled:opacity-50"
        >
          ⚠️ Delete All Submissions
        </button>
      </div>
    </div>

    {isLoading && <p>Loading...</p>}

    {stats && <Stats stats={stats} /> }

    {surveyResponses.length > 0 && <SurveyResponsesTable surveyResponses={surveyResponses} />}
  </div>
}
