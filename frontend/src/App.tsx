import { useState } from 'react'

import { SurveyForm } from '@/pages/SurveyForm/'
import { SubmissionResult } from '@/pages/SurveyForm/SubmissionResult'
import { SurveyResponse, SurveySubmission } from '@/models/SurveyResponse'
import { formAPI } from '@/api'

function App() {
  const [result, setResult] = useState<SurveyResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  // key is used to refresh the admin page when the user submits a new survey
  const [refreshAdminPageKey, setRefreshAdminPageKey] = useState(Date.now())

  const handleSubmit = async (result: SurveySubmission) => {
    try {
      const data = await formAPI.submitSurveyResponse(result)
      setResult(data)
      setRefreshAdminPageKey(Date.now())
    } catch (error) {
      console.error('Error submitting form', error)
      setResult(null)
      setError('Failed to submit form. Something went wrong.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-lg">
      <h1 className='text-3xl font-bold text-center mb-6 text-primary'>You good? 🤗</h1>
      { result && <SubmissionResult result={result}/>}
      { !result && <SurveyForm onSubmit={handleSubmit}/>}
      { error && <div className='text-red-500'>{error}</div>}
      </div>
  )
}

export default App
