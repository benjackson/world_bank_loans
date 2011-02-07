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
    end
  end
end
