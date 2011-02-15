class ProjectsController < ApplicationController
  
  layout nil, :only => :mobile 
  
  def show
    @project = Project.find(params[:id])
  end

end
