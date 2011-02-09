require "socrata"

module Socrata
  module Rails
    # Add caching to all socrata requests
    module Caching
      extend ActiveSupport::Concern
      
      included { alias_method_chain :get_json, :caching }
        
      def get_json_with_caching(path, options = {})
        # get the cache key
        key = format_memcache_key(path, options[:query])
        
        ::Rails.cache.fetch(key) do
          json_result = get_json_without_caching(path, options)
          if json_result && !json_result["error"]
            ::Rails.logger.debug "Socrata cache miss: #{key} (stored)"
            json_result
          else
            ::Rails.logger.debug "Socrata cache miss: #{key}"
            nil
          end
        end
      end
      
      private
      def format_memcache_key(path, query_hash = {})
        "socrata:#{path.downcase}:#{format_query_hash(query_hash)}".gsub(/\s/, "")
      end
      
      def format_query_hash(query_hash)
        h = query_hash.dup
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
