export const API_URL =
  window.location.hostname.includes('frontend')
  ? import.meta.env.VITE_APP_BACKEND_CONTAINER_URL
  : import.meta.env.VITE_APP_API_URL

import { SurveyResponse, SurveySubmission } from '@/models/SurveyResponse'
import { Stats } from '@/models/Stats'

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

export const adminAPI = {
  getSubmissions: async () => {
    return makeRequest<SurveyResponse[]>(`${API_URL}/admin/submissions`)
  },

  deleteAll: async () => {
    return makeRequest(`${API_URL}/admin/delete_all`, {
      method: 'DELETE'
    })
  },

  generateSubmissions: async () => {
    return makeRequest(`${API_URL}/admin/generate_submissions`, {
      method: 'POST'
    })
  },

  getStats: async (): Promise<Stats> => {
    return makeRequest<Stats>(`${API_URL}/admin/stats`)
  }
}
