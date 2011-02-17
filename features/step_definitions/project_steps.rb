Then /^I should see (\d+) projects$/ do |number|
  debugger
  page.should have_xpath("//ul/li[position()=#{number}]")
end

