require 'world_bank/loans_data'
require 'socrata/data'

class Country < Socrata::Data
  extend ActiveSupport::Memoizable
  
  attr_accessor :name
  
  def initialize(data)
    super
    @name = data[:name]
    @number_of_projects = data[:number_of_projects]
  end
  
  def latitude
    projects.empty? ? 0 : projects[0].latitude
  end
  
  def longitude
    projects.empty? ? 0 : projects[0].longitude
  end
  
  def currency
    projects.empty? ? 0 : projects[0].currency_of_commitment
  end
  
  # Sum the disbused amounts of all the projects in this country
  def disbursed_amount
    amount = 0
    projects.each do |project|
      amount += project.disbursed_amount.to_i
    end
    amount
  end
  
  def undisbursed_amount
    amount = 0
    projects.each do |project|
      amount += project.undisbursed_amount.to_i
    end
    amount
  end
  
  def repaid_amount
    amount = 0
    projects.each do |project|
      amount += project.repaid.to_i
    end
    amount
  end
  
  def owed_amount
    disbursed_amount - repaid_amount
  end
  
  def lowest_effective_year
    lowest_year = nil;
    projects.each do |project|
      lowest_year = project.effective_year if !project.effective_year.nil? && (lowest_year.nil? || project.effective_year < lowest_year) 
    end
    lowest_year
  end
  
  def highest_effective_year
    highest_year = nil;
    projects.each do |project|
      highest_year = project.effective_year if !project.effective_year.nil? && (highest_year.nil? || project.effective_year > highest_year) 
    end
    highest_year
  end
  
  def number_of_projects
    projects.empty? ? @number_of_projects : projects.size
  end
  
  # Return all of the projects for this country
  def projects
    Project.find_by_country(name)
  end
  memoize :projects
  
  def project(id)
    projects.each do |project|
      return project if project.id == id
    end
    nil
  end
  
  # Return up to three example projects
  def example_projects
    projects[0,3]
  end
  memoize :example_projects
  
  # Use the first project's loan number as an ID
  def id
    projects.empty? ? nil : projects[0].id
  end
  
  # Use the country name as a slug
  def to_param
    name
  end
  
  # Mainly so it can be serialised as JSON nicely
  def to_hash
    {
      :id => id,
      :name => name,
      :latitude => latitude,
      :longitude => longitude
    }
  end
  
  class << self
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
