require 'spec_helper'
require 'socrata/row'

module Socrata
  describe Row do
    it "should cope with nil data" do
      lambda { Row.create!(nil) }.should raise_error
    end
    
    context "single row created from json" do
      subject do
        Row.create!(SpecHelper.json_fixture("single_row"))
      end

      it { should be_a(Row) }

      it "should be possible to access some data elements as methods" do
        subject.beneficiary.should == "Ministry of Finance"
        subject.project_.should == "TRANSPORT"
      end
    end
    
    context "multiple rows" do
      subject do
        Row.create!(SpecHelper.json_fixture("multiple_rows"))
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
