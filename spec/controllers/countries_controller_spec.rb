require 'spec_helper'

describe CountriesController do
  render_views
  
  before { request.env["HTTP_AUTHORIZATION"] = "Basic " + Base64::encode64("plaldas:smoscoso") }
  
  context "mobile format" do
    before { request.format = :mobile }
    
    it "should be able to get the country page" do
      get "show", :id => Country.first.id
      response.should be_success
    end
  end
end
