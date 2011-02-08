class CountriesController < ApplicationController

  respond_to :html, :json

  def index
    @countries = Country.all
  end
end
