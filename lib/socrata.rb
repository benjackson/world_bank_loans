module Socrata
  class Base
    include ::HTTParty
    
    base_uri "https://ctrpilot.socrata.com/api"

    if ENV["SOCRATA_APP_TOKEN"].blank?
      raise <<-APP_TOKEN_MISSING
        SOCRATA_APP_TOKEN environment variable missing
        
        You need to supply the app token for socrata access in the environment variable 'SOCRATA_APP_TOKEN'.
        See the Socrata developer information for more details: http://dev.socrata.com/authentication
        
      APP_TOKEN_MISSING
    end
    
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
      ::JSON.parse(result.body)
    end
    
    def get(*args)
      self.class.get(*args)
    end
  end
end
