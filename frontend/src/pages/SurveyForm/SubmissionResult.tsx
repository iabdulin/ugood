import { type SurveyResponse } from "@/models/SurveyResponse"

export const SubmissionResult = ({ result }: { result: SurveyResponse }) => {
  const handleRefresh = () => {
    window.location.reload()
  }

  return <div data-testid="submission-result" className="bg-gradient-to-br from-teal-50 to-blue-50 p-8 rounded-lg shadow-md max-w-2xl mx-auto my-8">
    <h1 className="text-2xl font-bold text-teal-700 mb-4">Submission Result {result.id ? `(ID: ${result.id})` : ''}</h1>
    <div className="bg-white bg-opacity-70 p-4 rounded-md shadow-sm mb-6">
      <h2 className="text-gray-700 mb-2 font-bold text-lg">{result.feeling}</h2>
      <p>Stress Level: {result.stress_level}</p>
      <p className="text-gray-700 mb-2">Comments: {result.comments}</p>
    </div>
    <button
      onClick={handleRefresh}
      className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 cursor-pointer"
    >
      Answer again
    </button>
  </div>
}
