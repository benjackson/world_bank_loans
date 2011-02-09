class CountriesController < ApplicationController
  #caches_action :index, :show

  def index
    @countries = Country.all
    render :layout => "map"
  end
  
  def show
    @country = Country.find(params[:id])
    render :nil if @country.projects.empty?
  end
end
