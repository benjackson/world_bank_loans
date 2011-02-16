require "socrata/rails/caching" # cache all socrata requests
require 'world_bank/loans_data'

class Configuration
  class << self
    attr_accessor :world_bank_loans_data
  end
end

Configuration.world_bank_loans_data = WorldBank::LoansData.new(:username => ENV["SOCRATA_USER"], :password => ENV["SOCRATA_PASSWORD"])

