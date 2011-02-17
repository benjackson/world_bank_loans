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
  
  # Return the projects with more than 1 loan attached
  def with_multiple_loans
    select { |p| p.loans.size > 1 }
  end
end
