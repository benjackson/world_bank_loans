source 'http://rubygems.org'

gem 'rails', '3.0.0.rc2'

# Bundle edge Rails instead:
# gem 'rails', :git => 'git://github.com/rails/rails.git'

#gem 'pg'  # postgresql

# Use HTTParty to make access to the Socrata API easier
gem 'httparty'
gem 'json'

# Use Dalli memcaching
gem 'dalli'

# Paginate projects
gem 'will_paginate'

# Use jquery instead of prototype
gem 'jquery-rails', '>= 0.2.6'

# Javascript and css compression
gem "jammit", :git => "git://github.com/documentcloud/jammit.git"
   
# Deploy with Capistrano
# gem 'capistrano'

# To use debugger
# gem 'ruby-debug'

# Bundle the extra gems:
# gem 'bj'
# gem 'nokogiri'
# gem 'sqlite3-ruby', :require => 'sqlite3'
# gem 'aws-s3', :require => 'aws/s3'

# Bundle gems for the local environment. Make sure to
# put test-only gems in this group so their generators
# and rake tasks are available in development mode:
group :development, :test do
   gem 'ruby-debug'
   gem 'rspec-rails'
   gem 'cucumber-rails'
   gem 'capybara'
   gem 'autotest'
   gem 'launchy'
   gem 'heroku'
   
   # use thin as the local web server
   gem 'thin'
end
