import { useState } from "react"
import { SurveySubmission } from "@/models/SurveyResponse"
import { stressLevels } from "@/models/StressLevels"
import { ErrorMessage } from "@/pages/SurveyForm/ErrorMessage"

type SurveyFormProps = {
  onSubmit: (result: SurveySubmission) => void
}

export const SurveyForm = ({ onSubmit }: SurveyFormProps) => {
  const [feeling, setFeeling] = useState('')
  const [stressLevel, setStressLevel] = useState<keyof typeof stressLevels>('3')
  const [comments, setComments] = useState('')
  const [errors, setErrors] = useState({ feeling: '', comments: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateFields()) {
      onSubmit({ feeling, stress_level: stressLevel, comments })
    }
  }

  const validateFields = () => {
    const newErrors = { feeling: '', comments: '' }
    if (!feeling) newErrors.feeling = 'Please enter your feelings'
    if (!comments) newErrors.comments = 'Please add some comments'
    setErrors(newErrors)
    const allErrorsAreEmpty = Object.values(newErrors).every(error => error === '')
    return allErrorsAreEmpty
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-lg">
        <div className="question p-5 rounded-lg shadow-sm border border-gray-200 bg-[#FBFBFB]">
          <label htmlFor="feeling" className="block font-medium text-gray-700 mb-2">How are you feeling today?</label>
          <input
            type="text"
            id="feeling"
            name="feeling"
            value={feeling}
            onChange={(e) => setFeeling(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter your feelings..."
          />
          <ErrorMessage errorKey="feeling" message={errors.feeling} />
        </div>

        <div className="question p-5 rounded-lg shadow-sm border border-gray-200 bg-[#FBFBFB]">
          <label htmlFor="stress" className="block font-medium text-gray-700 mb-2">Rate your stress level</label>
          <div className="flex items-center gap-6 mt-4">
            <input
              type="range"
              id="stress"
              name="stress"
              min="1" max="5"
              value={stressLevel}
              list="markers"
              onChange={(e) => setStressLevel(e.target.value as keyof typeof stressLevels)}
              className="h-[300px] w-[40px]"
              style={{
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
                accentColor: stressLevels[stressLevel as keyof typeof stressLevels].color
              }}
            />
            <div className="flex flex-col h-[320px] justify-between text-2xl">
              {Object.entries(stressLevels).reverse().map(([key, value]) => (
                <div
                  key={key} onClick={() => setStressLevel(key as keyof typeof stressLevels)}
                  className='cursor-pointer hover:scale-110 transition-transform'
                >
                  {value.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="question p-5 rounded-lg shadow-sm border border-gray-200 bg-[#FBFBFB]">
          <label htmlFor="comments" className="block font-medium text-gray-700 mb-2">Any additional comments?</label>
          <textarea
            id="comments"
            name="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Share more details if you'd like..."
          />
          <ErrorMessage errorKey="comments" message={errors.comments} />
        </div>

        {Object.values(errors).some(error => error !== '') && (
          <ErrorMessage errorKey="all" message="Please fill out all fields" />
        )}

        <button
          type="submit"
          name="submit"
          className="w-full py-3 px-6 bg-primary text-white font-medium rounded-md shadow-sm hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors cursor-pointer"
        >
          Submit
        </button>
      </form>
  )
}
