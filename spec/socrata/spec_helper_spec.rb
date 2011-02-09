require 'spec_helper'

module Socrata
  describe SpecHelper do
    it "should be able to parse fixtures" do
      SpecHelper.json_fixture("single_column").should be_a(Hash)
    end
    
    it "should cache all fixtures" do
      ::Rails.cache.read("socrata:/views/jdjw-if4m/rows:{}").should be_a(Hash)
    end
  end
end
