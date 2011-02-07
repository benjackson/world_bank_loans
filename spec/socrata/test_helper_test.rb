require 'spec_helper'

module Socrata
  describe TestHelper do
    it "should be able to parse fixtures" do
      TestHelper.json_fixture("single_column").should be_a(Hash)
    end
  end
end
