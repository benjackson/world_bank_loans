class ProjectsController < ApplicationController
  layout nil, :only => :mobile
  
  def show
    @project = Project.find(params[:id])
  end
  
  def index
    @country = Country.find(params[:country_id])
    @projects = @country.projects.paginate(params[:page])
  end

end
