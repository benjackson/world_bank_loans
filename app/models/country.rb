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
  memoize :projects
  
  def project(id)
    projects.each do |project|
      return project if project.id == id
    end
    nil
  end
  
  def latitude
    loans.empty? ? 179.0 : loans[0].latitude.to_f
  end
  
  def longitude
    loans.empty? ? 179.0 : loans[0].longitude.to_f
  end
  
  def currency
    loans.empty? ? 0 : loans[0].currency_of_commitment
  end
  
  def approved_amount
    amount = 0
    loans.each do |project|
      amount += project.approved_amount.to_i
    end
    amount
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
  
  def disbursement_remaining
    approved_amount - disbursed_amount
  end
  
  # The disbursed amount as compared to all the other disbursed amounts
  def disbursed_amount_factor
    disbursed_amount.to_f / Country.max_disbursed_amount
  end
  
  # The undisbursed amount as compared to all the other undisbursed amounts
  def undisbursed_amount_factor
    disbursement_remaining.to_f / Country.max_disbursement_remaining
  end
  
  # The amount left to disburse as a factor of the total commitment
  def disbursement_remaining_factor
    approved_amount == 0 ? 0 : 1 - (disbursed_amount / approved_amount.to_f)
  end
  
  # The amount disbursed as a factor of the total commitment
  def disbursement_factor
    approved_amount == 0 ? 0 : disbursed_amount / approved_amount.to_f
  end
  
  # The amount left to disburse as a percentage of the total commitment
  def disbursement_remaining_percentage
    disbursement_remaining_factor * 100
  end
  
  # The amount disbursed as a percentage of the total commitment 
  def disbursement_percentage
    disbursement_factor * 100
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
  
  class << self
    def all
      loans_data.countries
    end
    
    def paginate(page = 1, per_page = 5)
      page ||= 1    # handle nil params
      WillPaginate::Collection.create(page, per_page, all.size) do |pager|
        pager.replace all[pager.offset, pager.per_page]
      end
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
    
    def max_disbursed_amount
      highest = 0
      all.each { |country| highest = country.disbursed_amount if country.disbursed_amount > highest }
      highest
    end
    
    def max_disbursement_remaining
      highest = 0
      all.each { |country| highest = country.disbursement_remaining if country.disbursement_remaining > highest }
      highest
    end
    
    def loans_data
      Configuration.world_bank_loans_data
    end
    
    def parametrize(name)
      name.downcase.gsub(/[.,]/, "").gsub(/\s/, "-").gsub(/\-+/, "-")
    end
  end
  
end
