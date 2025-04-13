export type SurveySubmission = {
  feeling: string
  comments: string
  stress_level: string
}

export type SurveyResponse = SurveySubmission & {
  id: string
  created_at: string
  updated_at: string
}
