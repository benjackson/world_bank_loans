require 'spec_helper'

describe Country do
  context "when initialised with some data" do
    subject { Country.new(:name => "Test", :number_of_projects => 102) }

    it "should have the name 'Test'" do
     subject.name.should == "Test"
    end

    it "should have 102 projects" do
      subject.number_of_projects.should == 102
    end
  end

  context "when initialised with an array of data" do
    subject { Country.create!([{ :name => "Test 1", :number_of_projects => 102 }, { :name => "Test 2", :number_of_projects => 99 }]) }

    it { should be_a(Array) }

    it "should be 2 elements long" do
      subject.size.should == 2
    end

    it "should have Country objects for both elements" do
      subject[0].should be_a(Country)
      subject[1].should be_a(Country)
    end

    it "should have Test 1 for element 1" do
      subject[0].name.should == "Test 1"
      subject[0].number_of_projects.should == 102
    end

    it "should have Test 2 for element 2" do
      subject[1].name.should == "Test 2"
      subject[1].number_of_projects.should == 99
    end
  end

  context "when looking at the countries list" do
    subject { Country.all }

    it { should be_a(Array) }

    it "should contain all the countries" do
      subject.size.should == 19
    end

    it "should contain all country objects" do
      subject.each do |country|
        country.should be_a(Country)
      end
    end
    
    context "and the first country within" do
      subject { Country.all.first }
      
      it "should have a lowest effective year of x" do
        subject.lowest_effective_year == 1956
      end
      
      it "should have a highest effective year of x" do
        subject.highest_effective_year == 1978
      end
    end
  end
end
