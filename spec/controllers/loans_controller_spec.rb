require 'spec_helper'

describe LoansController do

  before { request.env["HTTP_AUTHORIZATION"] = "Basic " + Base64::encode64("#{ENV["HTTP_BASIC_USER"]}:#{ENV["HTTP_BASIC_PASSWORD"]}") }
  
  describe "GET 'show'" do
    it "should be successful" do
      get 'show', :id => "48410"
      response.should be_success
    end
  end

end
