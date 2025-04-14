# Controller for administrative functions
class AdminController < ApplicationController
  # Returns the 10 most recent survey responses
  #
  # @return [JSON] list of survey responses
  def submissions
    # NOTE: this doesn't include pagination or filtering
    survey_responses = SurveyResponse.all.order(id: :desc).limit(10)
    render json: survey_responses
  end

  # Returns statistics calculated by the StatsService
  #
  # @return [JSON] aggregated statistics
  def stats
    stats = StatsService.calculate_stats
    render json: stats
  end

  # Removes all survey responses from the database
  #
  # @raise [RuntimeError] if called in production
  # @return [JSON] confirmation message
  def delete_all
    raise "Doesn't work in production" if Rails.env.production?
    SurveyResponse.delete_all
    render json: { message: 'All survey responses deleted' }
  end

  # Generates sample survey responses for the last 180 days
  # Creates entries every 2 days with randomized data
  #
  # @raise [RuntimeError] if called in production
  # @return [JSON] confirmation message
  def generate_submissions
    raise "Doesn't work in production" if Rails.env.production?
    feelings = ['Happy', 'Sad', 'Anxious', 'Excited', 'Tired', 'Calm', 'Frustrated', 'Energetic']

    # Generate for the last 180 days, every 2 days
    days_count = 0
    Time.now.utc.to_date.downto(180.days.ago.to_date).each do |date|
      # Only create entries every 2 days
      if days_count % 2 == 0
        SurveyResponse.create!(
          feeling: feelings.sample,
          stress_level: rand(1..5),
          comments: "Comments #{date}",
          created_at: date,
          updated_at: date
        )
      end
      days_count += 1
    end

    render json: { message: 'Survey responses generated for the last 180 days, every 2 days' }
  end
end
