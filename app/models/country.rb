class Country

  attr_accessor :name
  attr_accessor :number_of_projects

  def initialize(data)
    @name = data[:name]
    @number_of_projects = data[:number_of_projects]
  end

  class << self # class methods
    def create!(data)
      if data.is_a?(Array)
        return_array = []
        data.each do |row|
          return_array << create_one_from(row)
        end
        return_array
      end
    end

    # Return the list of all countries and the number of projects they each have
    def all
    end

    private
    def create_one_from(row)
      self.new(row)
    end
  end
end
