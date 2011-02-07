require 'socrata/view'

module WorldBank
  class LoansData < ::Socrata::View
    COUNTRY_COLUMN_ID = 2631500

    def initialize(params = {})
      super("jdjw-if4m", params)
    end

    # Get the column data for all the countries (name, number of projects)
    def get_country_groups
      country_column = column(2631500)
      country_column.groups unless country_column.nil?
    end

    # Get all the rows for a particular country.
    # Pass in the number of rows and optionally the start row in order to limit the amount
    # of results returned
    def get_rows_for_country(name)
      rows(:search => name) 
    end
  end
end
