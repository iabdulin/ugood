require 'rails_helper'

RSpec.describe SurveyResponse, type: :model do
  describe 'validations' do
    it 'is valid with valid attributes' do
      survey_response = SurveyResponse.new(
        feeling: 'happy',
        comments: 'Great day!',
        stress_level: '3'
      )
      expect(survey_response).to be_valid
    end

    it { should validate_presence_of(:feeling) }
    it { should validate_presence_of(:comments) }
    it { should validate_presence_of(:stress_level) }
    it { should validate_inclusion_of(:stress_level).in_array(%w[1 2 3 4 5]) }
  end

  describe 'encryption' do
    it 'encrypts sensitive fields' do
      feeling_text = 'This is a confidential feeling'
      comments_text = 'This is confidential comments'

      survey = SurveyResponse.create!(
        feeling: feeling_text,
        comments: comments_text,
        stress_level: '3'
      )

      # Test that data is encrypted in the database
      db_record = ActiveRecord::Base.connection.execute(
        "SELECT feeling, comments FROM survey_responses WHERE id = #{survey.id}"
      ).first

      # The raw DB values should not match the actual values
      expect(db_record['feeling']).not_to eq(feeling_text)
      expect(db_record['comments']).not_to eq(comments_text)

      # But the model should decrypt them correctly
      reloaded = SurveyResponse.find(survey.id)
      expect(reloaded.feeling).to eq(feeling_text)
      expect(reloaded.comments).to eq(comments_text)
    end
  end
end
