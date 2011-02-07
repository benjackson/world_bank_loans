module Socrata
  class Group
    attr_reader :name, :count

    def initialize(name, count = nil)
      @name = name
      @count = count
    end
  end
end
