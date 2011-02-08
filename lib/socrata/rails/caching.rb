require "socrata"

module Socrata
  module Rails
    # Add caching to all socrata requests
    module Caching
      extend ActiveSupport::Concern
      
      included { alias_method_chain :get_json, :caching }
        
      def get_json_with_caching(path, options = {})
        ::Rails.cache.fetch(format_memcache_key(path, options[:query])) { get_json_without_caching(path, options) }
      end
      
      private
      def format_memcache_key(path, query_hash = {})
        "socrata:#{path.downcase}:#{format_query_hash(query_hash)}"
      end
      
      def format_query_hash(h)
        h.each_pair do |k, v|
          h[k] = v.to_s.gsub(/\s/, "_").squeeze("_")
        end.inspect
      end
    end
  end
  
  class Base
    include Rails::Caching
  end
end
