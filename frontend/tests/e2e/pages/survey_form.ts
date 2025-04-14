import { Page } from '@playwright/test'

export class SurveyForm {
  constructor(private page: Page) {}

  async fillFeeling(feeling: string) {
    await this.page.fill('input[name="feeling"]', feeling)
  }

  async fillStressLevel(stressLevel: number) {
    await this.page.fill('input[name="stress"]', stressLevel.toString())
  }

  async fillComments(comments: string) {
    await this.page.fill('textarea[name="comments"]', comments)
  }

  async submit() {
    await this.page.locator('button[name="submit"]').click()
  }

  getErrorMessage(errorKey: string) {
    return this.page.getByTestId(`error-${errorKey}`)
  }

  getSubmissionResult() {
    return this.page.getByTestId('submission-result')
  }

  async mockApiError(status: number, body = {}) {
    this.page.route('**/survey_responses', async route => {
      const method = route.request().method()
      if (method === 'POST') {
        await route.fulfill({
          status,
          contentType: 'application/json',
          body: JSON.stringify(body)
        })
      } else {
        await route.continue()
      }
    })
  }
}
