class CountriesController < ApplicationController
  #caches_action :index, :show
  respond_to :html, :js, :json
  
  def index
    @countries = Country.all
    render :layout => "map"
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
