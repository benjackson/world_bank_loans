WorldBankLoans::Application.routes.draw do
  # The data to display on the map
  match "country_data/:action(.:format)", :to => "country_data"
  
  resources :countries, :only => [ :index, :show ] do
    resources :projects,  :only => [ :index, :show ]
  end
  resources :loans,  :only => [ :show ]
  
  root :to => "welcome#index"
end
