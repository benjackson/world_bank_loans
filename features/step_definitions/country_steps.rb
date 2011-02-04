Given /^the following countries:$/ do |countries|
  Country.create!(countries.hashes)
end

Then /^I should see the following countries:$/ do |expected_countries_table|
  expected_countries_table.diff!(tableish('table tr', 'td,th'))
end
