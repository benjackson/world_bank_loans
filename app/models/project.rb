require 'socrata/data'

# Each project has a number of loans associated with it
class Project
  
  attr_accessor :loans
  
  def initialize(loan_data)
    self.loans = [loan_data]
  end
  
  def name
    self.loans[0].project
  end
  
  def id
    self.loans[0].id
  end
  
  def has_multiple_loans?
    loans.size > 1
  end
end
