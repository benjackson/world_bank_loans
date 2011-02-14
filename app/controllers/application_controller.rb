class ApplicationController < ActionController::Base
  protect_from_forgery
  
  has_mobile_fu(true)  # detect different mobile phones
  
  before_filter :ask_for_a_username_and_password
  
  private
  def ask_for_a_username_and_password
    authenticate_or_request_with_http_basic("CTR Pilot") do |user_name, password|
      user_name == "plaldas" && password == "smoscoso"
    end
  end
end
