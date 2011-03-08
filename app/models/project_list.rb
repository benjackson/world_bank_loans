require 'will_paginate/collection'

# Holds a list of projects
class ProjectList < Array
  def initialize(loans)
    super()
    @projects = {}
    loans.each do |loan|
      if @projects[loan.project]
        @projects[loan.project].loans << loan
      else
        self << (@projects[loan.project] = Project.new(loan))
      end
    end
  end
  
  def paginate(page = 1, per_page = 5)
    page ||= 1    # handle nil params
    WillPaginate::Collection.create(page, per_page, size) do |pager|
      pager.replace self[pager.offset, pager.per_page].to_a
    end
  end
end
