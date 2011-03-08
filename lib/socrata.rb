module Socrata
  class Base
    include ::HTTParty
    
    base_uri "https://ctrpilot.socrata.com/api"

    default_options[:headers] = {'Content-type' => 'application/json', 'X-APP-TOKEN' => ENV["SOCRATA_APP_TOKEN"]}
    format :json

    def initialize(id = nil, params = {})
      @id = id
      @config = params

      self.class.basic_auth(@config[:username], @config[:password]) if @config[:username]
    end

    # Perform a get of the data and transform it into ruby from json
    def get_json(*args)
      result = get(*args)
      JSON.parse(result.body)
    end
    
    def get(*args)
      self.class.get(*args)
    end
  end
end
