require 'spec_helper'

describe Project do
  subject { Project.find_by_country("Algeria")[0] }
  
  it "should be possible to get the latitude for a project" do
    subject.latitude.should == "28.0000"   
  end
  
  it "should be possible to know the effective year" do
    subject.effective_year.should == 1956
  end
end
