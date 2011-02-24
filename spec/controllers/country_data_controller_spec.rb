require 'spec_helper'

describe CountryDataController do

  before { request.env["HTTP_AUTHORIZATION"] = "Basic " + Base64::encode64("#{ENV["HTTP_BASIC_USER"]}:#{ENV["HTTP_BASIC_PASSWORD"]}") }
  
  describe "GET 'undisbursed_percent'" do
    it "should be successful" do
      get 'undisbursed_percent', :format => :json
      response.should be_success
    end
  end
  
  describe "GET 'undisbursed_amount'" do
    it "should be successful" do
      get 'undisbursed_amount', :format => :json
      response.should be_success
    end
  end

end
