module Socrata
  module TestHelper
    FIXTURE_DIR = File.expand_path("../../fixtures/socrata", __FILE__)

    def self.json_fixture(filename)
      JSON.parse(File.open(File.join(FIXTURE_DIR, "#{filename}.json"), "rb") { |f| f.read } )
    end
  end
end
