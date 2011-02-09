require 'world_bank/loans_data'

class Country
  extend ActiveSupport::Memoizable
  
  attr_accessor :name
  
  def initialize(data)
    @name = data[:name]
    @number_of_projects = data[:number_of_projects]
  end
  
  def latitude
    projects.empty? ? 0 : projects[0].latitude
  end
  
  def longitude
    projects.empty? ? 0 : projects[0].longitude
  end
  
  def number_of_projects
    projects.empty? ? @number_of_projects : projects.size
  end
  
  # Return all of the projects for this country
  def projects
    Project.find_by_country(name)
  end
  
  memoize :projects
  
  # Use the first project's loan number as an ID
  def id
    projects.empty? ? nil : projects[0].id
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
        self.new(data) unless data["error"]
      end
    end
    
    def create!(data)
      create(data) || raise("Unable to create Country object")
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
