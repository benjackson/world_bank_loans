Given /^I am logged in$/ do
  page.driver.basic_authorize(ENV["HTTP_BASIC_USER"], ENV["HTTP_BASIC_PASSWORD"])
end

