require 'rails_helper'

RSpec.describe StatsService, type: :service do
  context 'empty state' do
    it 'returns 0 for all stats' do
      stats = StatsService.calculate_stats
      expect(stats[:total_responses]).to eq(0)
      expect(stats[:average_stress]).to eq(0.0)
      expect(stats[:stress_distribution]).to eq({ 1 => 0, 2 => 0, 3 => 0, 4 => 0, 5 => 0 })
      expect(stats[:last_90_days_responses]).to eq([])
    end
  end

  describe 'self.calculate_stats' do
    let!(:survey_responses) do
      [
        SurveyResponse.create!(feeling: 'Calm', stress_level: '1', comments: 'Test comment 1', created_at: 30.days.ago),
        SurveyResponse.create!(feeling: 'Relaxed', stress_level: '2', comments: 'Test comment 2', created_at: 60.days.ago),
        SurveyResponse.create!(feeling: 'Neutral', stress_level: '3', comments: 'Test comment 3', created_at: 100.days.ago),
        SurveyResponse.create!(feeling: 'Worried', stress_level: '4', comments: 'Test comment 4', created_at: 120.days.ago),
        SurveyResponse.create!(feeling: 'Stressed', stress_level: '5', comments: 'Test comment 5', created_at: 20.days.ago),
        SurveyResponse.create!(feeling: 'Relaxed', stress_level: '2', comments: 'Test comment 4', created_at: 130.days.ago),
        SurveyResponse.create!(feeling: 'Relaxed', stress_level: '2', comments: 'Test comment 4', created_at: 130.days.ago)
      ]
    end

    it 'returns a hash with all required statistics' do
      stats = StatsService.calculate_stats

      expect(stats).to be_a(Hash)
      expect(stats.keys.sort).to eq([
        :average_stress, :last_90_days_responses, :stress_distribution, :total_responses
      ])
    end

    it 'calculates the correct total_responses' do
      stats = StatsService.calculate_stats

      expect(stats[:total_responses]).to eq(7)
    end

    it 'calculates the correct average_stress' do
      stats = StatsService.calculate_stats

      # (1 + 2 + 3 + 4 + 5 + 2 + 2) / 7 = 2.7
      expect(stats[:average_stress]).to eq(2.7)
    end

    it 'calculates the correct stress_distribution' do
      stats = StatsService.calculate_stats

      expected_distribution = {
        1 => 1, # one response with stress level 1
        2 => 3, # three responses with stress level 2
        3 => 1, # one response with stress level 3
        4 => 1, # one response with stress level 4
        5 => 1  # one response with stress level 5
      }

      expect(stats[:stress_distribution]).to eq(expected_distribution)
    end

    it 'returns the correct last_90_days_responses' do
      stats = StatsService.calculate_stats

      # Only 3 responses are within the last 90 days
      expect(stats[:last_90_days_responses].count).to eq(3)

      # Check the format and content
      response = stats[:last_90_days_responses].first
      expect(response.keys.sort).to eq([ 'created_at', 'stress_level' ])
    end
  end
end
