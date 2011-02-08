require 'world_bank/loans_data'

class Country

  attr_accessor :name
  
  def initialize(data)
    @name = data[:name]
    @number_of_projects = data[:number_of_projects]
  end
  
  def number_of_projects
    @number_of_projects || projects.size
  end
  
  # Return all of the projects for this country
  def projects
    Project.find_by_country(name)
  end
  
  # Use the country name as a slug
  def to_param
    name
  end
  
  class << self
    def create(data)
      if data.is_a?(Array)
        return_array = []
        data.each do |row|
          return_array << self.new(row)
        end
        return_array
      else
        self.new(data)
      end
    end
    
    def all
      self.create(loans_data.country_group_data)
    end
    
    def first
      all.first
    end
    
    def find(id)
      self.new({ :name => id })
    end
    
    # TODO: abstract this out
    def loans_data
      WorldBank::LoansData.new(:username => "ctrpilot@gmail.com", :password => "app2011test")
    end
  end
  
end
