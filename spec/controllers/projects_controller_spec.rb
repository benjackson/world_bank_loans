require 'spec_helper'

describe ProjectsController do
  render_views
  
  before { request.env["HTTP_AUTHORIZATION"] = "Basic " + Base64::encode64("#{ENV["HTTP_BASIC_USER"]}:#{ENV["HTTP_BASIC_PASSWORD"]}") }
  
  context "mobile format" do
    before { request.format = :mobile }
    
    it "should be able to get the index page" do
      get "index", :country_id => Country.first.id
      response.should be_success
    end
    
    it "should be able to get page 2" do
      get "index", :country_id => Country.first.id, :page => 2
      response.should be_success
    end
  end
end
