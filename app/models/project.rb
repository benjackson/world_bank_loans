require 'socrata/data'

class Project < Socrata::Data
  
  def name
    project
  end
  
  def id
    loan_number
  end
  
  def effective_date_most_recent
    begin
      Time.parse(super)
    rescue
      nil
    end
  end
  
  def effective_year
    effective_date_most_recent ? effective_date_most_recent.year : nil
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
