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
        json_result = ::Rails.cache.read(key)
        unless json_result
          json_result = get_json_without_caching(path, options)
          if json_result && !json_result["error"]
            ::Rails.logger.debug "Socrata cache miss: #{key} (stored)"
            ::Rails.cache.write(key, json_result)
          else
            if json_result
              ::Rails.logger.debug "Socrata cache miss: #{key} (#{json_result["message"]})"
            else
              ::Rails.logger.debug "Socrata cache miss: #{key}"
            end
          end
        else
          ::Rails.logger.debug "Socrata cache read: #{key}"
        end
        
        json_result
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
