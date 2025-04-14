class SurveyResponsesController < ApplicationController
  # Creates a new survey response.
  #
  # @return [JSON] the created survey response with whitelisted attributes if successful
  # @return [JSON] error messages with HTTP status 422 if validation fails
  def create
    survey_response = SurveyResponse.new(survey_response_params)
    if survey_response.save
      render json: survey_response.as_json(only: whitelisted_survey_response_params)
    else
      render json: { errors: survey_response.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def survey_response_params
    params.require(:survey_response).permit(:feeling, :comments, :stress_level)
  end

  def whitelisted_survey_response_params
    # NOTE: explicitly list allowed params to avoid leaking sensitive data
    [ :id, :feeling, :comments, :stress_level, :created_at ]
  end
end
