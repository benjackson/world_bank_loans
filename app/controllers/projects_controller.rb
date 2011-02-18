class ProjectsController < ApplicationController
  layout nil, :only => :mobile
  
  def show
    @project = Country.find(params[:country_id]).project(params[:id])
  end
  
  def index
    @country = Country.find(params[:country_id])
    @projects = @country.projects.paginate(params[:page])
  end

end
