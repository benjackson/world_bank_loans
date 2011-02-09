require "spec_helper"
require "socrata/rails/caching"

module Socrata
  class Base
    public :format_memcache_key, :format_query_hash
  end
  
  module Rails
    describe Caching do
      subject { ::Socrata::View.new("1") }  # Set up a view with an ID to test that part of the URI
      
      context "when formatting keys" do
        it "should clear out white space" do
          subject.format_query_hash(:test => "with spaces  inside").should == "{:test=>\"with_spaces_inside\"}"
        end
        
        it "really shouldn't have any spaces in the key at all" do
          subject.format_memcache_key("/views/1/test", :test => "with spaces  inside", :two => 2).should == "socrata:/views/1/test:{:two=>\"2\",:test=>\"with_spaces_inside\"}"
        end
      end
      
      before do
        ::Rails.cache.write("socrata:/views/1/test:{:testing=>\"true\"}", "giggedy")
      end
      
      it "should read from the cache" do
        subject.get_json("/test", :query => { :testing => true }).should == "giggedy"
      end
      
    end
  end
end
