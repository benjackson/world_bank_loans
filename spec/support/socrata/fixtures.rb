require 'spec/support/socrata/spec_helper'

RSpec.configure do |config|
  config.before(:all) do
    Socrata::SpecHelper.cache_all_fixtures
  end
  
  config.after(:all) do
    ::Rails.cache.clear
  end
end
