require 'socrata/data'
require 'socrata/group'

module Socrata
  class Column < Data

    # A list of Groups (name, count)
    attr_reader :groups

    def initialize(data)
      @groups = []
      data["cachedContents"]["top"].each do |group|
        @groups << Group.new(group["item"], group["count"])
      end
      data["cachedContents"].delete("top")
      
      super
    end
  end
end
