# Service for calculating survey statistics
class StatsService
  # Calculates various statistics from survey responses
  #
  # @return [Hash] containing total_responses, average_stress,
  #   stress_distribution, and last_90_days_responses
  def self.calculate_stats
    {
      total_responses: SurveyResponse.count,
      average_stress: calculate_average_stress,
      stress_distribution: calculate_stress_distribution,
      last_90_days_responses: SurveyResponse.where("created_at >= ?", 90.days.ago).select("stress_level, created_at").as_json(except: :id)
    }
  end

  private

  # Calculates the average stress level from all survey responses
  #
  # @return [Float] average stress level rounded to 1 decimal place
  def self.calculate_average_stress
    result = SurveyResponse.connection.execute(
      "SELECT AVG(CASE stress_level
        WHEN '1' THEN 1
        WHEN '2' THEN 2
        WHEN '3' THEN 3
        WHEN '4' THEN 4
        WHEN '5' THEN 5
        END) as avg_stress
      FROM survey_responses"
    ).first

    result["avg_stress"].to_f.round(1)
  end

  # Calculates the distribution of stress levels
  #
  # @return [Hash] number of responses for each stress level (1-5)
  def self.calculate_stress_distribution
    result = {}
    (1..5).each do |level|
      result[level] = SurveyResponse.where(stress_level: level.to_s).count
    end
    result
  end
end
