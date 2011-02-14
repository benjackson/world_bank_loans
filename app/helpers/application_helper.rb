module ApplicationHelper
  def format_for_currency(number, currency)
    case currency
      when "GBP" then number_to_currency(number, :precision => 0, :unit => "&pound;")
      when "EUR" then number_to_currency(number, :precision => 0, :unit => "&euro;")
      when "USD" then number_to_currency(number, :precision => 0, :unit => "$")
      else
        number_to_currency(number, :precision => 0, :unit => currency + " ")
    end
  end
end
