class SurveyResponse < ApplicationRecord
  validates :feeling, presence: true
  validates :comments, presence: true
  validates :stress_level, presence: true, inclusion: { in: %w[1 2 3 4 5] }

  encrypts :feeling, :comments
end
