Feature: Manage countries
  In order to see all the projects going on in various countries
  Prasanna and Sandra
  wants to see a list of them and the projects within
  
  Scenario: See the list of projects for a country
    Given a country called Bangladesh with the following projects:
      | Name |
      | Project 1 |
      | Project 2 |
      | Project 3 |
    When I am on the Bangladesh country page
    Then I should see "Project 1"
    And I should see "Project 2"
    And I should see "Project 3"

  Scenario: Get a json list of countries with the number of projects, for display as markers on the map
    Given the following countries:
      | name | number_of_projects |
      | Bangladesh | 102 |
      | Albania | 45 |
      | Serbia | 32 |
      | Tunisia | 102 |
    When I am on the countries json page
    Then I should see "Bangladesh, 102"
