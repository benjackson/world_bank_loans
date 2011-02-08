require 'spec_helper'

module Socrata
  describe SpecHelper do
    it "should be able to parse fixtures" do
      SpecHelper.json_fixture("single_column").should be_a(Hash)
    end
  end
end
