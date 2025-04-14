import { SurveyResponse } from '@/models/SurveyResponse'

export const SurveyResponsesTable = ({ surveyResponses }: { surveyResponses: SurveyResponse[] }) => {
  return <div>
    <h2 className='text-lg font-bold mt-6'>Last 10 Submissions</h2>
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm" data-testid="survey-responses-table">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feeling</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stress Level</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {surveyResponses.map((response, index) => (
            <tr key={response.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{response.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{response.feeling}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{response.stress_level}</td>
              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{response.comments}</td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
  </div>
}
