require 'socrata/data'

class Project < Socrata::Data
  
  def name
    project
  end
  
  def id
    loan_number
  end
  
  # so it can be serialiased to JSON nicely
  def to_hash
    {
      :id => id,
      :name => name
    }
  end
  
  class << self
    def find_by_country(name)
      self.create(loans_data.rows_for_country_data(name))
    end
    
     # TODO: abstract this out
    def loans_data
      WorldBank::LoansData.new(:username => "ctrpilot@gmail.com", :password => "app2011test")
    end
  end
end
