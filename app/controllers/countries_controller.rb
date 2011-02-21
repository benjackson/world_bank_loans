class CountriesController < ApplicationController
  #caches_action :index, :show
  respond_to :html, :js, :json
  
  layout nil, :only => :mobile
  
  def index
    @countries = Country.all
    respond_to do |format|
      format.json do
        render :json => @countries.map { |country| country_path(country, :format => :json) }
      end
      format.html { render :layout => "map" }
      format.js { render "index.js.erb" }
    end
  end
  
  def show
    @country = Country.find(params[:id])
    respond_to do |format|
      format.mobile do
        @projects = @country.projects.paginate
        render "projects/index", :layout => "country"
      end
      format.any(:html, :js) do
        respond_with(@country)
      end
      format.json do
        render :json => @country.to_hash.merge( { :info_summary => render_to_string(:partial => "alternative_info_summary") })
      end
    end
  end
end
