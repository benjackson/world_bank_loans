module Socrata
  class Row

    class << self
      def create_from_json(json_data)
        if json_data.is_a?(Array)
          ret = []
          json_data.each do |row_data|
            ret << create_row_from_json(row_data)
          end
          ret
        else
          create_row_from_json(json_data) unless json_data["error"]
        end
      end

      private
      def create_row_from_json(json_data)
      end

    end
  end
end
