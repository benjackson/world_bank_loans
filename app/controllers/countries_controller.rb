class CountriesController < ApplicationController

  respond_to :html, :json

  def index
    @countries = Country.all
  end
  
  def show
    @country = Country.find(params[:id])
  end
end
