export const API_URL = import.meta.env.VITE_APP_API_URL
import { SurveyResponse, SurveySubmission } from './models/SurveyResponse'

const makeRequest = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    })

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API request error:', error)
    throw error
  }
}

export const formAPI = {
  submitSurveyResponse: async (surveySubmission: SurveySubmission): Promise<SurveyResponse> => {
    return makeRequest<SurveyResponse>(`${API_URL}/survey_responses`, {
      method: 'POST',
    body: JSON.stringify({
        survey_response: surveySubmission
      })
    })
  }
}
