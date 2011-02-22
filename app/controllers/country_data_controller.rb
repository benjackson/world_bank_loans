class CountryDataController < ApplicationController
  before_filter { @countries = Country.all }
  
  def undisbursed_percent
  end
  
  def undisbursed_amount
  end
  
  def disbursed_percent
  end

end
