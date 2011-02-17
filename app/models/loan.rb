require 'socrata/data'

class Loan < Socrata::Data
  def name
    id
  end
  
  def id
    loan_number
  end
  
  def method_missing(method_id, *args, &block)
    method_id.to_s !~ /_date|date_/ ? super : begin
      Time.parse(super)
    rescue
      super
    end
  end
  
  def effective_year
    effective_date_most_recent ? effective_date_most_recent.year : nil
  end
  
  # so it can be serialiased to JSON nicely
  def to_hash
    {
      :id => id,
      :project => project
    }
  end
  
  class << self
    def find(id)
      loans_data.loans.each do |loan|
        return loan if loan.id == id
      end
    end
    
    def loans_data
      Configuration.world_bank_loans_data
    end
  end
  
end
