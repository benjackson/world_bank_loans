require 'spec_helper'
require 'socrata/view'
require 'socrata/column'

module Socrata
  describe View do
    subject { View.new("jdjw-if4m") }

    it "should be possible to get a specific column for this view" do
      subject.column("2631500").should be_a(Column)
    end

  end
end
