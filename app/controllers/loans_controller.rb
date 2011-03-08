class LoansController < ApplicationController
  layout nil, :only => :mobile 
  
  def show
    @loan = Loan.find(params[:id])
  end

end
