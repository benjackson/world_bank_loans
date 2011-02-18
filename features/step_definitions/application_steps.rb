Given /^I am logged in$/ do
  visit page.driver.rack_server.url("/").sub(/^http:\/\//, "http://plaldas:smoscoso@")
  Then "Show me the page"
  Then "I should not see \"Access Denied\""
  #visit root_url.sub(/^http:\/\//, "http://plaldas:smoscoso@")
  
  #if page.driver.respond_to?(:basic_authorize)
  #  page.driver.basic_authorize('plaldas', 'smoscoso')
  #else
  #  
  #end
end

