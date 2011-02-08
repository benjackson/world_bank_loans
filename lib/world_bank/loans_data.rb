require 'socrata/view'

module WorldBank
  class LoansData < ::Socrata::View
    COUNTRY_COLUMN_ID = 2631500

    def initialize(params = {})
      super("jdjw-if4m", params)
    end
    
    def country_group_data
      country_groups.map do |group|
        { :name => group.name, :number_of_projects => group.count }
      end
    end
    
    # Get the column data for all the countries (name, number of projects)
    def country_groups
      country_column = column(2631500)
      country_column.nil? ? [] : country_column.groups
    end

    # Get all the rows for a particular country.
    # Pass in the number of rows and optionally the start row in order to limit the amount
    # of results returned
    def get_rows_for_country(name)
      rows(:search => name) 
    end
  end
end
