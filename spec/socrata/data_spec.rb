require 'spec_helper'
require 'socrata/data'

module Socrata
  describe Data do
    context "single column created from json" do
      subject do
        Data.create!(TestHelper.json_fixture("single_column"))
      end

      it { should be_a(Data) }

      it "should be possible to access some data elements as methods" do
        subject.name.should == "Country"
        subject.width.should == 154
      end
      
      it "should raise an error for data elements that don't exist" do
        lambda { subject.nonexist }.should raise_error
      end
    end
  end
end
