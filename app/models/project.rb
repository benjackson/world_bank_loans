require 'socrata/data'

class Project < Socrata::Data
  
  def name
    project
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
