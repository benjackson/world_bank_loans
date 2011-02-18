Then /^I should see (\d+) projects$/ do |number|
  page.should have_xpath("//ul/li[position()=#{number}]")
end

