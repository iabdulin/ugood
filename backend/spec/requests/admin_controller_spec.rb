require 'rails_helper'

RSpec.describe AdminController, type: :request do
  describe 'GET /admin/submissions' do
    before do
      # Create test survey responses
      15.times do |i|
        SurveyResponse.create!(
          feeling: "Feeling #{i}",
          stress_level: rand(1..5),
          comments: "Test comment #{i}"
        )
      end
    end

    it 'returns the 10 most recent survey responses' do
      get admin_submissions_path

      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)
      expect(json_response.length).to eq(10)

      # Check responses are in descending order by id
      ids = json_response.map { |r| r['id'] }
      expect(ids).to eq(ids.sort.reverse)
    end
  end

  describe 'GET /admin/stats' do
    it 'returns statistics calculated by StatsService' do
      # Mock the StatsService
      mock_stats = { average_stress: 3.5, response_count: 100 }
      allow(StatsService).to receive(:calculate_stats).and_return(mock_stats)

      get admin_stats_path

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)).to eq(mock_stats.as_json)
    end
  end

  describe 'DELETE /admin/delete_all' do
    before do
      5.times { SurveyResponse.create!(feeling: 'Test', stress_level: 3, comments: 'Test') }
    end

    context 'in non-production environment' do
      it 'deletes all survey responses' do
        allow(Rails.env).to receive(:production?).and_return(false)

        expect {
          delete admin_delete_all_path
        }.to change(SurveyResponse, :count).from(5).to(0)

        expect(response).to have_http_status(:ok)
      end
    end

    context 'in production environment' do
      it 'raises an error' do
        allow(Rails.env).to receive(:production?).and_return(true)

        expect {
          expect {
            delete admin_delete_all_path
          }.to raise_error(RuntimeError, "Doesn't work in production")
        }.not_to change(SurveyResponse, :count)
      end
    end
  end

  describe 'POST /admin/generate_submissions' do
    context 'in non-production environment' do
      it 'generates sample survey responses for the last 180 days' do
        allow(Rails.env).to receive(:production?).and_return(false)
        expect {
          post admin_generate_submissions_path
        }.to change(SurveyResponse, :count).by(91) # 180 days with entries every 2 days = 91 entries

        expect(response).to have_http_status(:ok)
      end
    end

    context 'in production environment' do
      it 'raises an error' do
        allow(Rails.env).to receive(:production?).and_return(true)

        expect {
          expect {
            post admin_generate_submissions_path
          }.to raise_error(RuntimeError, "Doesn't work in production")
        }.not_to change(SurveyResponse, :count)
      end
    end
  end
end
