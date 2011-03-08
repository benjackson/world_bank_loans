require 'socrata/view'

module WorldBank
  class LoansData < ::Socrata::View
    extend ActiveSupport::Memoizable
    
    # no longer needed: COUNTRY_COLUMN_ID = 2631500

    attr_reader :projects, :loans
    
    ACTIVE_STATUSES  = [ "DISBURSING", "EFFECTIVE", "SIGNED", "APPROVED"  ]
    INACTIVE_STATUSES = [ "REPAID", "CANCELLED", "DISBURSED", "TERMINATED" ]
    
    def initialize(params = {})
      super("jdjw-if4m", params)
    end
    
    def countries
      country_hash.values
    end
    
    def loans
      country_hash if @loans.nil?
      @loans
    end
    
    def projects
      country_hash if @projects.nil?
      @projects
    end
    
    private
    # Get all rows of socrata data for this view and turn each into a Project
    # for a particular Country
    def country_hash
      ret = {}
      @projects = {}
      @loans = []
      valid_rows.each do |row|
        loan = Loan.new(row.to_hash)
          @loans << loan
          unless ret[row.country]
            ret[row.country] = Country.new(:name => row.country)
            ret[row.country].loans << loan
          else
            ret[row.country].loans << loan
          end
      end
      ret
    end
    memoize :country_hash
    
    def valid_rows
      ret = []
      rows.each do |row|
        if valid?(row)
          yield row if block_given?
          ret << row
        end
      end
      ret
    end
    
    def valid?(row)
      if row.country.nil? || row.country == "World" || INACTIVE_STATUSES.include?(row.status)
        false
      else
        true
      end
    end
  end
end
