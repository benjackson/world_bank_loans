class CountriesController < ApplicationController
  #caches_action :index, :show
  respond_to :html, :js, :json
  
  def index
    @countries = Country.all
    render :layout => "map"
  end
  
  def show
    respond_with (@country = Country.find(params[:id]))
  end
end

#render :nothing => true if @country.projects.empty?
