import { Page, Locator, expect } from '@playwright/test'

export class AdminPage {
  private adminPage: Locator

  constructor(private page: Page) {
    this.page = page
    this.adminPage = page.getByTestId('admin-page')
  }

  async clearAllSubmissions() {
    await this.page.on('dialog', async dialog => {
      await dialog.accept()
    })
    await this.adminPage.getByText('Delete All Submissions').click()
    await expect(this.getTotalResponses()).toHaveText('0')
  }

  getTotalResponses(): Locator {
    return this.adminPage.getByTestId('total-responses')
  }

  getAverageStress(): Locator {
    return this.adminPage.getByTestId('average-stress')
  }

  getSurveyResponsesTable(): Locator {
    return this.adminPage.getByTestId('survey-responses-table')
  }
}
