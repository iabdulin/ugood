require 'rails_helper'

RSpec.describe SurveyResponsesController, type: :request do
  describe 'POST survey_responses' do
    context 'with valid parameters' do
      let(:valid_params) do
        {
          survey_response: {
            feeling: 'happy',
            comments: 'Great day!',
            stress_level: '3'
          }
        }
      end

      it 'creates a new survey response' do
        expect {
          post survey_responses_path, params: valid_params
        }.to change(SurveyResponse, :count).by(1)
      end

      it 'returns a successful response with the ID' do
        post survey_responses_path, params: valid_params

        expect(response).to have_http_status(:success)
        expect(JSON.parse(response.body)).to include('id')
      end
    end

    context 'with invalid parameters' do
      let(:invalid_params) do
        {
          survey_response: {
            comments: 'Great day!',
            stress_level: '3'
          }
        }
      end

      it 'does not create a new survey response' do
        expect {
          post survey_responses_path, params: invalid_params
        }.to_not change(SurveyResponse, :count)
      end

      it 'returns an unprocessable entity status' do
        post survey_responses_path, params: invalid_params

        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'returns error messages' do
        post survey_responses_path, params: invalid_params

        json_response = JSON.parse(response.body)
        expect(json_response).to have_key('errors')
        expect(json_response['errors']).to include("Feeling can't be blank")
      end
    end

    context 'with invalid stress level' do
      let(:invalid_stress_level_params) do
        {
          survey_response: {
            feeling: 'happy',
            comments: 'Great day!',
            stress_level: '6'  # Invalid, must be between 1-5
          }
        }
      end

      it 'does not create a new survey response' do
        expect {
          post survey_responses_path, params: invalid_stress_level_params
        }.to_not change(SurveyResponse, :count)
      end

      it 'returns error about invalid stress level' do
        post survey_responses_path, params: invalid_stress_level_params

        json_response = JSON.parse(response.body)
        expect(json_response['errors']).to include('Stress level is not included in the list')
      end
    end
  end
end
