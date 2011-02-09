require 'socrata/view'

module WorldBank
  class LoansData < ::Socrata::View
    COUNTRY_COLUMN_ID = 2631500

    def initialize(params = {})
      super("jdjw-if4m", params)
    end
    
    # Get the column data for all the countries as a hash
    def country_group_data
      country_groups.map do |group|
        { :name => group.name, :number_of_projects => group.count }
      end
    end
    
    # Get the column data for all the countries (name, number of projects)
    def country_groups
      country_column = column(2631500)
      country_column.nil? ? [] : country_column.groups.select { |group| group.name != "World" } # TODO: add test for world
    end

    # Get all the rows for a particular country as a hash
    def rows_for_country_data(name)
      rows_for_country(name).map do |row|
        row.to_hash
      end
    end
    
    # Get all the rows for a particular country.
    # Pass in the number of rows and optionally the start row in order to limit the amount
    # of results returned
    def rows_for_country(name)
      data = rows(:search => name, :max_rows => "5") || []
      data.select { |row| row.country == name }  # TODO: add test for country name in another field
    end
  end
end
