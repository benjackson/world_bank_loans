module Socrata
  class Data

    def initialize(data)
      @data = data
    end

    def method_missing(method_id, *arguments, &block)
      @data.has_key?(method_id.to_s) ? @data[method_id.to_s] : super
    end

    def respond_to?(method_id)
      @data.has_key?(method_id.to_s)
    end

    class << self
      # Create from a hash of data
      def create(data)
        if data.is_a?(Array)
          ret = []
          data.each do |element|
            ret << self.new(element)
          end
          ret
        else
          self.new(data) unless data["error"]
        end
      end
      
      # Raise an error if the create fails
      def create!(data)
        create(data) || raise("Couldn't create: #{data["message"]}")
      end
    end
    
  end
end
