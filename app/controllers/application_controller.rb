class ApplicationController < ActionController::Base
  protect_from_forgery
  
  has_mobile_fu true# detect different mobile phones
  
  before_filter :set_age_header
  before_filter :ask_for_a_username_and_password
  
  private
  def set_age_header
    response.headers['Cache-Control'] = 'public, max-age=28800'
  end
  
  def ask_for_a_username_and_password
    authenticate_or_request_with_http_basic("Please log in to use the World Bank's CTR Open Data Beta Application...") do |user_name, password|
      user_name == ENV["HTTP_BASIC_USER"] && password == ENV["HTTP_BASIC_PASSWORD"]
    end
  end
end
