require 'world_bank/loans_data'
require 'socrata/data'

class Country < Socrata::Data
  extend ActiveSupport::Memoizable
  
  attr_accessor :loans
  
  def initialize(data)
    super
    self.loans = []
  end
  
  def projects
    ProjectList.new(loans)
  end
  
  def latitude
    loans.empty? ? 179 : loans[0].latitude
  end
  
  def longitude
    loans.empty? ? 179 : loans[0].longitude
  end
  
  def currency
    loans.empty? ? 0 : loans[0].currency_of_commitment
  end
  
  # Sum the disbused amounts of all the loans in this country
  def disbursed_amount
    amount = 0
    loans.each do |project|
      amount += project.disbursed_amount.to_i
    end
    amount
  end
  
  def undisbursed_amount
    amount = 0
    loans.each do |project|
      amount += project.undisbursed_amount.to_i
    end
    amount
  end
  
  def repaid_amount
    amount = 0
    loans.each do |project|
      amount += project.repaid.to_i
    end
    amount
  end
  
  def owed_amount
    disbursed_amount - repaid_amount
  end
  
  def lowest_effective_year
    lowest_year = nil;
    loans.each do |project|
      lowest_year = project.effective_year if !project.effective_year.nil? && (lowest_year.nil? || project.effective_year < lowest_year) 
    end
    lowest_year
  end
  
  def highest_effective_year
    highest_year = nil;
    loans.each do |project|
      highest_year = project.effective_year if !project.effective_year.nil? && (highest_year.nil? || project.effective_year > highest_year) 
    end
    highest_year
  end
  
  def loan(id)
    loans.each do |loan|
      return loan if loan.id == id
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
