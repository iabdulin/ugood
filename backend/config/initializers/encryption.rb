# Active Record Encryption
# https://guides.rubyonrails.org/active_record_encryption.html

Dotenv.require_keys(
  "ACTIVE_RECORD_ENCRYPTION_PRIMARY_KEY",
  "ACTIVE_RECORD_ENCRYPTION_DETERMINISTIC_KEY",
  "ACTIVE_RECORD_ENCRYPTION_KEY_DERIVATION_SALT"
)

Rails.application.config.active_record.encryption.primary_key = ENV["ACTIVE_RECORD_ENCRYPTION_PRIMARY_KEY"]
Rails.application.config.active_record.encryption.deterministic_key = ENV["ACTIVE_RECORD_ENCRYPTION_DETERMINISTIC_KEY"]
Rails.application.config.active_record.encryption.key_derivation_salt = ENV["ACTIVE_RECORD_ENCRYPTION_KEY_DERIVATION_SALT"]
