require 'world_bank/loans_data'
require 'socrata/data'

class Country < Socrata::Data
  extend ActiveSupport::Memoizable
  
  def initialize(data)
    super
  end
  
  def latitude
    projects.empty? ? 179 : projects[0].latitude
  end
  
  def longitude
    projects.empty? ? 179 : projects[0].longitude
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
    @projects ||= Project.find_by_country_id(id)
  end
  
  def projects=(new_projects)
    @projects = new_projects
  end
  
  def project(id)
    projects.each do |project|
      return project if project.id == id
    end
    nil
  end
  
  def id
    to_param
  end
  
  # Use the country name as a slug
  def to_param
    self.class.parametrize(name)
  end
  memoize :to_param
  
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
      loans_data.countries
    end
    
    def first
      all.first
    end
    
    def find(id)
      loans_data.countries.each do |country|
        return country if country.id == id
      end
      nil
    end
    
    def loans_data
      Configuration.world_bank_loans_data
    end
    
    def parametrize(name)
      name.downcase.gsub(/[.,]/, "").gsub(/\s/, "-").gsub(/\-+/, "-")
    end
  end
  
end
