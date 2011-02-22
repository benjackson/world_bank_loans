WorldBankLoans::Application.routes.draw do
  # The data to display on the map
  match "data/undisbursed-percent(.:format)", :to => "country_data#undisbursed_percent"
  match "data/undisbursed-amount(.:format)", :to => "country_data#undisbursed_amount"
  match "data/disbursed-percent(.:format)", :to => "country_data#disbursed_percent"
  
  resources :countries, :only => [ :index, :show ] do
    resources :projects,  :only => [ :index, :show ]
  end
  resources :loans,  :only => [ :show ]
  
  root :to => "welcome#index"
end
