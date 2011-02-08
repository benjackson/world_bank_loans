require 'spec_helper'
require 'socrata/column'

module Socrata
  describe Column do
    context "single column created from json" do
      subject do
        Column.create!(SpecHelper.json_fixture("single_column"))
      end

      it { should be_a(Column) }

      it "should have 20 groups" do
        subject.groups.size.should == 20
      end

      it "should have all Groups" do
        subject.groups.each do |group|
          group.should be_a(Group)
        end
      end
    end
  end
end
