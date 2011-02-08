require 'spec_helper'
require 'world_bank/loans_data'

module WorldBank
  describe LoansData do
    context "when the request fails" do
      subject { LoansData.new(:username => 'blah', :password => 'blah') }

      it "shouldn't' be able to get the country groups" do
        subject.get_country_groups.should be_nil
      end
    end

    context "when the request succeeds" do
      subject { LoansData.new(:username => "ctrpilot@gmail.com", :password => "app2011test") }

      it "should be able to get the country groups" do
        subject.get_country_groups.should be_a(Array)
      end

      context "looking at one country" do
        subject { LoansData.new(:username => "ctrpilot@gmail.com", :password => "app2011test").get_rows_for_country("Algeria") }

        it { should be_a(Array) }
        
        it "should have a few elements" do
          subject.size.should > 1
        end

        it "should have mapped the data correctly" do
          subject[0].region.should == "EUROPE AND CENTRAL ASIA"
        end
      end

    end
  end
end
