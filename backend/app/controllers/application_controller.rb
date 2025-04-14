class ApplicationController < ActionController::Base
  skip_forgery_protection # disable CSRF protection for ALL controllers
end
