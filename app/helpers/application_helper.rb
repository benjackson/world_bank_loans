module ApplicationHelper
  def format_for_map(number, currency, options = {})
    number /= 1000000.0
    options[:format] = "%u%n"
    options[:format] = "%u<1" if number < 1
    format_for_currency(number, currency, options)
  end
  
  def format_for_currency(number, currency, options = {})
    case currency
      when "GBP" then number_to_currency(number, { :precision => 0, :unit => "&pound;" }.merge(options))
      when "EUR" then number_to_currency(number, { :precision => 0, :unit => "&euro;" }.merge(options))
      when "USD" then number_to_currency(number, { :precision => 0, :unit => "$" }.merge(options))
      when "ZAR" then number_to_currency(number, { :precision => 0, :unit => "R" }.merge(options))
    else
      number_to_currency(number, { :precision => 0, :unit => currency + " " }.merge(options))
    end
  end
  
  def format_for_date(date)
    if date.is_a?(String)
      begin
        date = Time.parse(date)
      rescue
      end
    end
    
    if date.respond_to?(:strftime) 
      date.strftime("%x")
    elsif date.nil?
      ""
    else
      date
    end
  end
end
