import { expect, test } from '@playwright/test'
import { SurveyResponse } from '../../src/models/SurveyResponse'
import { SurveyForm } from './pages/survey_form'

test.describe('Survey Form Validations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('blank form', async ({ page }) => {
    const surveyForm = new SurveyForm(page)
    await surveyForm.submit()
    await expect(surveyForm.getErrorMessage('feeling')).toContainText('Please enter your feelings')
    await expect(surveyForm.getErrorMessage('comments')).toContainText('Please add some comments')
    await expect(surveyForm.getErrorMessage('all')).toContainText('Please fill out all fields')
    await expect(surveyForm.getSubmissionResult()).not.toBeVisible()
  })

  test('filling feeling only', async ({ page }) => {
    const surveyForm = new SurveyForm(page)
    await surveyForm.fillFeeling('Feeling good')
    await surveyForm.submit()
    await expect(surveyForm.getErrorMessage('feeling')).not.toBeVisible()
    await expect(surveyForm.getErrorMessage('all')).toContainText('Please fill out all fields')
    await expect(surveyForm.getSubmissionResult()).not.toBeVisible()
  })

  test('filling comments only', async ({ page }) => {
    const surveyForm = new SurveyForm(page)
    await surveyForm.fillComments('Comments')
    await surveyForm.submit()
    await expect(surveyForm.getErrorMessage('comments')).not.toBeVisible()
    await expect(surveyForm.getErrorMessage('all')).toContainText('Please fill out all fields')
  })

  test('filling all fields', async ({ page }) => {
    const surveyForm = new SurveyForm(page)
    await surveyForm.fillFeeling('Feeling good')
    await surveyForm.fillStressLevel(2)
    await surveyForm.fillComments('Comments')
    await surveyForm.submit()
    await expect(surveyForm.getErrorMessage('feeling')).not.toBeVisible()
    await expect(surveyForm.getErrorMessage('comments')).not.toBeVisible()
    await expect(surveyForm.getErrorMessage('all')).not.toBeVisible()
    await expect(surveyForm.getSubmissionResult()).toBeVisible()
    await expect(surveyForm.getSubmissionResult()).toContainText('Feeling good')
    await expect(surveyForm.getSubmissionResult()).toContainText('Stress Level: 2')
    await expect(surveyForm.getSubmissionResult()).toContainText('Comments: Comments')
  })
})

test.describe('Submitting the form', () => {
  let surveyForm: SurveyForm

  test.beforeEach(async ({ page }) => {
    await page.goto('/')

    surveyForm = new SurveyForm(page)
    await surveyForm.fillFeeling('Feeling good')
    await surveyForm.fillStressLevel(2)
    await surveyForm.fillComments('Comments')
  })

  test.describe('With a mock API server', () => {
    test('should show the error message', async ({ page }) => {
      await surveyForm.mockApiError(500)
      await surveyForm.submit()
      await expect(page.getByText('Failed to submit form. Something went wrong.')).toBeVisible()
      await expect(surveyForm.getSubmissionResult()).not.toBeVisible()
    })

    test('should show the submission result', async ({ page }) => {
      const submissionResult: SurveyResponse = {
        id: '123',
        feeling: 'Feeling good',
        stress_level: '2',
        comments: 'Comments',
        created_at: '2021-01-01',
        updated_at: '2021-01-01'
      }
      await surveyForm.mockApiError(200, submissionResult)
      await surveyForm.submit()
      await expect(page.getByText('Submission Result (ID: 123)')).toBeVisible()
      await expect(surveyForm.getSubmissionResult()).toBeVisible()
    })
  })

  test.describe('With a real API server', () => {
    test('should show the submission result', async () => {
      await surveyForm.submit()
    })
  })
})
