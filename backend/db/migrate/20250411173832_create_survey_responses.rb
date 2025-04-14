class CreateSurveyResponses < ActiveRecord::Migration[8.0]
  def change
    create_enum :stress_level, %w[1 2 3 4 5]
    create_table :survey_responses do |t|
      t.string :feeling, null: false
      t.string :comments, null: false
      t.enum :stress_level, enum_type: :stress_level, null: false, default: '3'

      t.timestamps
    end
  end
end
