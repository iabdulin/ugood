# "You good?" — Mental Health Survey Submission App

A full-stack application for submitting and managing mental health surveys.

![ugood](https://github.com/user-attachments/assets/855d565f-9e5b-4d3d-9ead-630c3fab68df)

## Screenshots

### Form with Validation Errors
![image](https://github.com/user-attachments/assets/f9bbc01a-62d5-47ca-a87b-9cd0333bc322)

### Admin Interface with Stats (Total, Average, Stress Level Distribution, Trend)
![image](https://github.com/user-attachments/assets/d90c59a2-8b08-446c-8d90-f114ed05d031)


## Setup
1) You need to have Docker installed.
2) Clone the repository.
3) Run `docker-compose build` to build the containers.
4) Run `docker-compose up -d` to start the services.
5) Run `docker-compose exec backend rails db:create` to create the database.
6) Run `docker-compose exec backend rails db:migrate` to migrate the database.
7) ⚠️ Important: You need to have a .env file in the root directory for Rails Active Record Encryption to work.
Download it here: https://gist.github.com/iabdulin/81244e0442b2cd517b17b82831c3f8bc (⚠️ the file is shared to simplify the review process)

If you want to run the frontend locally:
1) `cd frontend`
2) `npm install`
3) `npm run dev`

## Running the App
Run `docker-compose up -d` to start the services.

- Frontend: `http://127.0.0.1:5173/`
- Backend: `http://localhost:3000/`
- Backend tests (Rspec): `docker-compose exec backend bundle exec rspec`
- End-to-End tests with Playwright headless in the docker container: `docker-compose exec frontend npm run test:e2e`
- E2E tests in headed mode locally: `cd frontend && npx playwright test --headed`
- Alternative way to run E2E tests: Use VSCode Playwright extension.

## Database Connection

```
localhost:5433 postgres / password
```

## Running Tests

### Backend Tests

Rspec is used to have unit tests for the SurveyResponse model, StatsService and the SurveyResponsesController.

> Finished in 0.18973 seconds (files took 0.95999 seconds to load)
> 13 examples, 0 failures

### E2E Tests

Assignment instructions had: "Unit Tests (Jest): Write unit tests using Jest for the frontend form."
I chose Playwright instead of Jest because it can do both unit tests with mocks and end-to-end tests with real browser interaction.
I also prefer using Playwright during the development process, using it instead of the browser to get the application to the state I want.

Example output:
> Running 30 tests using 1 worker
> 30 passed (31.5s)


## Assumptions and Simplifications
- Authentication & Authorization are not implemented in this project for simplicity
- `skip_forgery_protection` for all controllers, CORS is enabled for all origins (should be changed in production)
- Admin API routes are not protected (should be protected in production)
- Access logging and audit trails are required for HIPAA compliance, but are not implemented
- Better error handling and logging is required for production
- Image-charts.com is used for the "Stress Level" chart. This is ok for an assignment but in production it should be replaced to not leak data to 3rd parties.


## Architecture

### Backend

- Rails API with everything initialized by default for simplicity (`rails new backend --database=postgresql --skip-test-unit --skip-system-test`).
- SurveyResponsesController with a single action to create a new survey response.
- Admin controller doesn't have pagination or filtering for submissions endpoint.
- Surveys are for a single user only

### Frontend
- Frontend is a React application with a single page. I chose to include the admin subpage in the same page to simplify the review.
- The form is validated with custom validations (all fields are required).
- The form is submitted to the backend with a POST request.
- The response is displayed on the same page and admin subpage is updated with the new submission.

### Active Record Encryption
- SurveyResponses has feeling and comments fields encrypted with default Rails encryption
- .env file is required to be in the root directory (check setup instructions above)
- NOTE: can't query encrypted fields with non-deterministic encryption (default)
- Download it here: ____TODO____

### Setup Notes

- Dockerizing the frontend is not necessary but included for practice
- Remember to rebuild the frontend & backend after adding new dependencies
- Frontend container can communicate with backend container (to be able to run playwright tests in the frontend container)

## Deployment Strategy

1) Frontend can be built with (`npm run build`) and deployed as a static site
2) Backend can be deployed to a server or cloud service
3) Database deployment: use a managed PostgreSQL service, ensure it not only has backups and encryption at rest, but also supports HIPAA compliance (if needed)
4) CI/CD workflow:
   - Set up automated testing and deployment using GitHub Actions, CircleCI, or similar
   - Create separate staging and production environments
   - Implement blue/green deployment for zero-downtime updates


## Tests Outputs
```bash
23:28:27 ~/Sites/test/ugood main -> docker-compose exec backend bundle exec rspec -f d

SurveyResponse
  validations
    is valid with valid attributes
    is expected to validate that :feeling cannot be empty/falsy
    is expected to validate that :comments cannot be empty/falsy
    is expected to validate that :stress_level cannot be empty/falsy
    is expected to validate that :stress_level is either ‹"1"›, ‹"2"›, ‹"3"›, ‹"4"›, or ‹"5"›
  encryption
    encrypts sensitive fields

AdminController
  GET /admin/submissions
    returns the 10 most recent survey responses
  GET /admin/stats
    returns statistics calculated by StatsService
  DELETE /admin/delete_all
    in non-production environment
      deletes all survey responses
    in production environment
      raises an error
  POST /admin/generate_submissions
    in non-production environment
      generates sample survey responses for the last 180 days
    in production environment
      raises an error

SurveyResponsesController
  POST survey_responses
    with valid parameters
      creates a new survey response
      returns a successful response with the ID
    with invalid parameters
      does not create a new survey response
      returns an unprocessable entity status
      returns error messages
    with invalid stress level
      does not create a new survey response
      returns error about invalid stress level

StatsService
  empty state
    returns 0 for all stats
  self.calculate_stats
    returns a hash with all required statistics
    calculates the correct total_responses
    calculates the correct average_stress
    calculates the correct stress_distribution
    returns the correct last_90_days_responses

Finished in 0.48084 seconds (files took 1.01 seconds to load)
25 examples, 0 failures
```

```bash
23:28:32 ~/Sites/test/ugood main -> docker-compose exec frontend npx playwright test

Running 30 tests using 1 worker

  ✓  1 [chromium] › tests/e2e/admin_page.spec.ts:35:3 › With a Mock API Server › should display stats (591ms)
  ✓  2 [chromium] › tests/e2e/admin_page.spec.ts:74:3 › With a real API Server › should show empty state (703ms)
  ✓  3 [chromium] › tests/e2e/admin_page.spec.ts:79:3 › With a real API Server › should show newly submitted surveys in admin page (1.8s)
  ✓  4 [chromium] › tests/e2e/survey_form.spec.ts:10:3 › Survey Form Validations › blank form (157ms)
  ✓  5 [chromium] › tests/e2e/survey_form.spec.ts:19:3 › Survey Form Validations › filling feeling only (153ms)
  ✓  6 [chromium] › tests/e2e/survey_form.spec.ts:28:3 › Survey Form Validations › filling comments only (147ms)
  ✓  7 [chromium] › tests/e2e/survey_form.spec.ts:36:3 › Survey Form Validations › filling all fields (544ms)
  ✓  8 [chromium] › tests/e2e/survey_form.spec.ts:65:5 › Submitting the form › With a mock API server › should show the error message (185ms)
  ✓  9 [chromium] › tests/e2e/survey_form.spec.ts:72:5 › Submitting the form › With a mock API server › should show the submission result (186ms)
  ✓  10 [chromium] › tests/e2e/survey_form.spec.ts:89:5 › Submitting the form › With a real API server › should show the submission result (201ms)
  ✓  11 [Mobile Chrome] › tests/e2e/admin_page.spec.ts:35:3 › With a Mock API Server › should display stats (263ms)
  ✓  12 [Mobile Chrome] › tests/e2e/admin_page.spec.ts:74:3 › With a real API Server › should show empty state (727ms)
  ✓  13 [Mobile Chrome] › tests/e2e/admin_page.spec.ts:79:3 › With a real API Server › should show newly submitted surveys in admin page (2.3s)
  ✓  14 [Mobile Chrome] › tests/e2e/survey_form.spec.ts:10:3 › Survey Form Validations › blank form (213ms)
  ✓  15 [Mobile Chrome] › tests/e2e/survey_form.spec.ts:19:3 › Survey Form Validations › filling feeling only (193ms)
  ✓  16 [Mobile Chrome] › tests/e2e/survey_form.spec.ts:28:3 › Survey Form Validations › filling comments only (176ms)
  ✓  17 [Mobile Chrome] › tests/e2e/survey_form.spec.ts:36:3 › Survey Form Validations › filling all fields (529ms)
  ✓  18 [Mobile Chrome] › tests/e2e/survey_form.spec.ts:65:5 › Submitting the form › With a mock API server › should show the error message (203ms)
  ✓  19 [Mobile Chrome] › tests/e2e/survey_form.spec.ts:72:5 › Submitting the form › With a mock API server › should show the submission result (177ms)
  ✓  20 [Mobile Chrome] › tests/e2e/survey_form.spec.ts:89:5 › Submitting the form › With a real API server › should show the submission result (173ms)
  ✓  21 [Mobile Safari] › tests/e2e/admin_page.spec.ts:35:3 › With a Mock API Server › should display stats (998ms)
  ✓  22 [Mobile Safari] › tests/e2e/admin_page.spec.ts:74:3 › With a real API Server › should show empty state (2.1s)
  ✓  23 [Mobile Safari] › tests/e2e/admin_page.spec.ts:79:3 › With a real API Server › should show newly submitted surveys in admin page (6.0s)
  ✓  24 [Mobile Safari] › tests/e2e/survey_form.spec.ts:10:3 › Survey Form Validations › blank form (1.1s)
  ✓  25 [Mobile Safari] › tests/e2e/survey_form.spec.ts:19:3 › Survey Form Validations › filling feeling only (1.0s)
  ✓  26 [Mobile Safari] › tests/e2e/survey_form.spec.ts:28:3 › Survey Form Validations › filling comments only (1.1s)
  ✓  27 [Mobile Safari] › tests/e2e/survey_form.spec.ts:36:3 › Survey Form Validations › filling all fields (1.4s)
  ✓  28 [Mobile Safari] › tests/e2e/survey_form.spec.ts:65:5 › Submitting the form › With a mock API server › should show the error message (1.2s)
  ✓  29 [Mobile Safari] › tests/e2e/survey_form.spec.ts:72:5 › Submitting the form › With a mock API server › should show the submission result (1.2s)
  ✓  30 [Mobile Safari] › tests/e2e/survey_form.spec.ts:89:5 › Submitting the form › With a real API server › should show the submission result (1.1s)

  30 passed (28.7s)

To open last HTML report run:

  npx playwright show-report --host 0.0.0.0 --port 9323
```
