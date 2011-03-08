class CountryDataController < ApplicationController
  respond_to :json
  
  before_filter { @countries = Country.all }
  
  def undisbursed_percent
  end
  
  def undisbursed_amount
  end
  
  def disbursed_percent
  end
  
  def disbursed_amount
  end

end
