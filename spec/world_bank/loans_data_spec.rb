require 'spec_helper'
require 'world_bank/loans_data'
require 'socrata/rails/caching'

module WorldBank
  describe LoansData do
    pending "when the request fails" do
      subject { LoansData.new }

      it "shouldn't' be able to get the country groups" do
        subject.country_groups.should be_empty
      end
      
      it "shouldn't be able to get the country group data" do
        subject.country_group_data.should be_empty
      end
    end

    context "when the request succeeds" do
      context "when looking at country groups" do
        subject { LoansData.new.country_group_data }
      
        it { should be_a(Array) }
      
        it "should have mapped the country groups to more appropriate names" do
          subject[0].should have_key(:name)
          subject[0].should have_key(:number_of_projects)
        end
      end
      
      context "looking at one country" do
        subject { LoansData.new.rows_for_country("Algeria") }

        it { should be_a(Array) }
        
        it "should have a few elements" do
          subject.size.should > 1
        end

        it "should have mapped the data correctly" do
          subject[0].region.should == "MIDDLE EAST AND NORTH AFRICA"
        end
      end

    end
  end
end
