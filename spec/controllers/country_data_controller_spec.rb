require 'spec_helper'

describe CountryDataController do

  describe "GET 'undisbursed-percent'" do
    it "should be successful" do
      get 'undisbursed_percent'
      response.should be_success
    end
  end
  
  describe "GET 'undisbursed-amount'" do
    it "should be successful" do
      get 'undisbursed_amount'
      response.should be_success
    end
  end

end
