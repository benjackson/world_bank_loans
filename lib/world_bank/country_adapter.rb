module WorldBank
  class CountryAdapter
    
    class << self
      def all
        self.create(@loans_data.country_group_data)
      end
      
      def create(data)
        if data.is_a?(Array)
          return_array = []
          data.each do |row|
            return_array << self.new(row)
          end
          return_array
        else
          self.new(data)
        end
      end
  
      private
      def create_one_from(data)
        self.new(data)
      end
    end
    
  end
end
