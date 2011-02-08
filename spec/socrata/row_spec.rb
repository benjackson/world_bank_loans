require 'spec_helper'
require 'socrata/row'

module Socrata
  describe Row do
    context "single row created from json" do
      subject do
        Row.create!(TestHelper.json_fixture("single_row"))
      end

      it { should be_a(Row) }

      it "should be possible to access some data elements as methods" do
        subject.beneficiary.should == "Ministry of Finance"
        subject.project_.should == "TRANSPORT"
      end
    end
    
    context "multiple rows" do
      subject do
        Row.create!(TestHelper.json_fixture("multiple_rows"))
      end
      
      it { should be_a(Array) }
      
      it "should have Row objects for each element in the array" do
        subject.each do |element|
          element.should be_a(Row)
        end
      end
      
      it "should have mapped row elements correctly" do
        subject[0].region.should == "MIDDLE EAST AND NORTH AFRICA"
      end
    end
  end
end
