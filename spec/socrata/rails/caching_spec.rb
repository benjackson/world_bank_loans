require "spec_helper"
require "socrata/rails/caching"

module Socrata
  class Base
    public :format_memcache_key, :format_query_hash
  end
  
  module Rails
    describe Caching do
      subject { ::Socrata::Base.new }
      
      context "when formatting keys" do
        it "should clear out white space" do
          subject.format_query_hash(:test => "with spaces  inside").should == "{:test=>\"with_spaces_inside\"}"
        end
      end
      
      before do
        ::Rails.cache.write("socrata:/test:{:testing=>\"true\"}", "giggedy")
      end
      
      it "should read from the cache" do
        subject.get_json("/test", :query => { :testing => true }).should == "giggedy"
      end
      
    end
  end
end
