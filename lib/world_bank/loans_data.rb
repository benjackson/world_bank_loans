require 'socrata/view'

module WorldBank
  class LoansData < ::Socrata::View
    extend ActiveSupport::Memoizable
    
    COUNTRY_COLUMN_ID = 2631500

    def initialize(params = {})
      super("jdjw-if4m", params)
    end
    
    def countries
      country_hash.values
    end
    
    def country_hash
      ret = {}
      @projects = {}
      rows.each do |row|
        unless row.country.nil? || row.country == "World"
          unless ret[row.country]
            ret[row.country] = Country.new(:name => row.country)
            @projects[row.country] = [ Project.new(row.to_hash) ]
          else
            @projects[row.country] << Project.new(row.to_hash)
          end
        end
      end
      
      ret.each_value do |country|
        country.projects = projects_for_country(country)
      end
      
      ret
    end
    memoize :country_hash
    
    def projects_for_country(country)
      @projects[country.name]
    end
    
    def projects_for_country_with_id(id)
      Country.find(id).projects
    end
  end
end
