module Socrata
  module SpecHelper
    def self.cache_all_fixtures
      fixture_files.each do |fixture_filename|
        fixture = json_fixture(fixture_filename)
        fixture["cache_keys"].each do |key|
          ::Rails.cache.write(key, fixture) unless ::Rails.cache.read(key)
        end if fixture["cache_keys"]
      end
    end
    
    def self.fixture_files
      Dir.new(File.expand_path("../../../fixtures/socrata", __FILE__)).select { |filename| filename =~ /.json.gz$/ }
    end
    
    def self.json_fixture(filename)
      filename += ".json.gz" unless filename =~ /\.json.gz$/
      JSON.parse(Zlib::GzipReader.open(File.join(File.expand_path("../../../fixtures/socrata", __FILE__), filename)) { |f| f.read } )
    end
  end
  
  class Base
    def get_json_without_caching(path, options = {})
      raise "
            During tests you shouldn't be going to the Socrata site at all.  Get a 
            json download of the fixture you're trying to see and place it in the 
            fixtures/socrata dir (gzip it after adding keys).  Add this key to the 
            file by hand:
        
            \"cache_keys\" : [\"#{format_memcache_key(path, options[:query])}\"]"
    end
  end
end
