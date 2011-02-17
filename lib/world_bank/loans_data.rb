require 'socrata/view'

module WorldBank
  class LoansData < ::Socrata::View
    extend ActiveSupport::Memoizable
    
    # no longer needed: COUNTRY_COLUMN_ID = 2631500

    attr_reader :projects, :loans
    
    def initialize(params = {})
      super("jdjw-if4m", params)
    end
    
    def countries
      country_hash.values
    end
    
    private
    # Get all rows of socrata data for this view and turn each into a Project
    # for a particular Country
    def country_hash
      ret = {}
      @projects = {}
      @loans = []
      rows.each do |row|
        unless row.country.nil? || row.country == "World"
          loan = Loan.new(row.to_hash)
          @loans << loan
          unless ret[row.country]
            ret[row.country] = Country.new(:name => row.country)
            ret[row.country].loans << loan
          else
            ret[row.country].loans << loan
          end
        end
      end
      ret
    end
    memoize :country_hash
  end
end
