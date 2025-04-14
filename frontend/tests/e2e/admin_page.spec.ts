import { expect, test, Page } from '@playwright/test'
import { Stats, StressDataPoint } from '../../src/models/Stats'
import { SurveyForm } from './pages/survey_form'
import { AdminPage } from './pages/admin_page'

const mockedStressDataPoints: StressDataPoint[] = [
  { created_at: '2023-01-01T00:00:00.000Z', stress_level: '3' },
  { created_at: '2023-01-02T00:00:00.000Z', stress_level: '4' },
  { created_at: '2023-01-03T00:00:00.000Z', stress_level: '4' }
]
const totalSum = mockedStressDataPoints.reduce((acc, point) => acc + parseInt(point.stress_level as string), 0)
const averageStress = parseFloat((totalSum / mockedStressDataPoints.length).toFixed(1))
const fakeStats: Stats = {
  total_responses: mockedStressDataPoints.length,
  stress_distribution: { "1": 0, "2": 0, "3": 1, "4": 2, "5": 0 },
  last_90_days_responses: mockedStressDataPoints,
  average_stress: averageStress
}

test.describe('With a Mock API Server', () => {
  let page: Page

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage
    await page.route('**/admin/stats', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(fakeStats)
      })
    })
    await page.goto('/')
  })

  test('should display stats', async () => {
    const adminPage = new AdminPage(page)
    await expect(adminPage.getTotalResponses()).toHaveText('3')
    await expect(adminPage.getAverageStress()).toHaveText('3.7')

    await expect(page.getByText('Stress Level Distribution')).toBeVisible()
    // Check stress distribution counts
    await expect(page.getByTestId('stress-level-count-1')).toHaveText('0')
    await expect(page.getByTestId('stress-level-count-2')).toHaveText('0')
    await expect(page.getByTestId('stress-level-count-3')).toHaveText('1')
    await expect(page.getByTestId('stress-level-count-4')).toHaveText('2')
    await expect(page.getByTestId('stress-level-count-5')).toHaveText('0')
    // Check stress distribution bar height percentages
    await expect(page.getByTestId('stress-level-bar-1')).toHaveAttribute('data-test-height-percent', '1')
    await expect(page.getByTestId('stress-level-bar-2')).toHaveAttribute('data-test-height-percent', '1')
    await expect(page.getByTestId('stress-level-bar-3')).toHaveAttribute('data-test-height-percent', '50')
    await expect(page.getByTestId('stress-level-bar-4')).toHaveAttribute('data-test-height-percent', '100')
    await expect(page.getByTestId('stress-level-bar-5')).toHaveAttribute('data-test-height-percent', '1')

    // Check responses trend is shown
    await expect(page.getByText('Responses Trend')).toBeVisible()
    await expect(page.getByTestId('responses-trend')).toBeVisible()
  })
})

test.describe('With a real API Server', () => {
  let page: Page
  let surveyForm: SurveyForm
  let adminPage: AdminPage

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage
    surveyForm = new SurveyForm(page)
    adminPage = new AdminPage(page)

    await page.goto('/')
    await adminPage.clearAllSubmissions()
  })

  test('should show empty state', async () => {
    await expect(adminPage.getTotalResponses()).toHaveText('0')
    await expect(adminPage.getAverageStress()).toHaveText('0')
  })

  test('should show newly submitted surveys in admin page', async () => {
    await surveyForm.fillFeeling('Test Feeling')
    await surveyForm.fillStressLevel(1)
    await surveyForm.fillComments('Test Comments')
    await surveyForm.submit()
    // Verify stats
    await expect(adminPage.getTotalResponses()).toHaveCount(1)
    await expect(adminPage.getTotalResponses()).toHaveText('1')
    await expect(adminPage.getAverageStress()).toHaveText('1')

    await page.reload()
    await surveyForm.fillFeeling('Another Feeling')
    await surveyForm.fillStressLevel(2)
    await surveyForm.fillComments('Another Comments')
    await surveyForm.submit()

    // Verify stats updated to include the new submission
    await expect(adminPage.getTotalResponses()).toHaveText('2')
    await expect(adminPage.getAverageStress()).toHaveText('1.5') // 1 + 2 / 2

    // Verify the submitted surveys appear in the table
    const $table = await adminPage.getSurveyResponsesTable()
    await expect($table.locator('tbody tr').last()).toContainText('Test Feeling')
    await expect($table.locator('tbody tr').last()).toContainText('Test Comments')
    await expect($table.locator('tbody tr').first()).toContainText('Another Feeling')
    await expect($table.locator('tbody tr').first()).toContainText('Another Comments')
  })
})
