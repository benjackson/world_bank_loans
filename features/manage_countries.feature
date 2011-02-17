Feature: Manage countries
  In order to see all the projects going on in various countries
  Prasanna and Sandra
  wants to see a list of them and the projects within
  
  Background:
    Given I am logged in
  
  Scenario: See the list of projects for a country
    Given I go to the brazil country page
    Then I should see 5 projects
    And I should see "view more"
    
  @wip
  Scenario: Get a json list of countries with the number of projects, for display as markers on the map
    When I am on the countries json page
  
