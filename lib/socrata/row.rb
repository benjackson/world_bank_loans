require 'socrata/data'

module Socrata
  class Row < Data
    class << self
      # Rows are mapped to column names to make them easier to work with
      def create(data)
        if data.is_a?(Hash) && data.has_key?("data")
          columns = columns_for(data)
          
          rows = []
          data["data"].each do |raw_data|
            mapped_data = {}
            raw_data.each_with_index do |item, i|
              mapped_data[columns[i]] = item
            end
            rows << mapped_data
          end
          super rows
        else
          super
        end
      end
      
      # Return an array of column names
      def columns_for(data)
        data["meta"]["view"]["columns"].map do |column_meta|
          formatted_column_name(column_meta["name"])
        end
      end
      
      private
      # Format a column name.  Turns "Region (Continent)" into "region_continent".
      def formatted_column_name(name)
        name.downcase.gsub(/[^a-z0-9-]/, "_").squeeze("_").chomp("_").sub(/^_/, "")
      end
    end
  end
end
