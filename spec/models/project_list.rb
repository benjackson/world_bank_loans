require 'spec_helper'
require 'will_paginate/collection'

describe ProjectList do
  subject { Country.first.projects }
  
  context "pagination" do
    subject { Country.first.projects.paginate(1, 5) }
   
    it { should be_a WillPaginate::Collection }
    
    it "should have 5 items" do
      subject.size.should == 5
    end
    
    it "should have 11 pages in total" do
      subject.total_pages.should == 11
    end
    
    it "should have the same number of entries as all the projects" do
      Country.first.projects.size.should == subject.total_entries
    end
  end
end
