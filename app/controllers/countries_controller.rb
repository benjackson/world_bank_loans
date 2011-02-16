class CountriesController < ApplicationController
  #caches_action :index, :show
  respond_to :html, :js, :json
  
  layout nil, :only => :mobile 
  
  def index
    @countries = Country.all
    respond_to do |format|
      format.json do
        render :json => Country.all.map { |country| country_path(country, :format => :json) }
      end
      format.html { render :layout => "map" }
    end
  end
  
  def show
    @country = Country.find(params[:id])
    respond_to do |format|
      format.json do
        render :json => @country.to_hash.merge( { :info_summary => render_to_string(:partial => "alternative_info_summary") })
      end
      format.any(:html, :js) { respond_with @country }
    end
  end
end
