Given /^the following maps:$/ do |maps|
  Map.create!(maps.hashes)
end

When /^I delete the (\d+)(?:st|nd|rd|th) map$/ do |pos|
  visit maps_path
  within("table tr:nth-child(#{pos.to_i+1})") do
    click_link "Destroy"
  end
end

Then /^I should see the following maps:$/ do |expected_maps_table|
  expected_maps_table.diff!(tableish('table tr', 'td,th'))
end
