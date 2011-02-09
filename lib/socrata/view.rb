require 'socrata'
require 'socrata/column'
require 'socrata/row'

module Socrata
  class View < Base

    # Return all the columns for this View
    def columns
    end

    # Return a specific column from this view
    def column(id, params = {})
      Column.create(get_json("/columns/#{id}", :query => params))
    end

    # Return all the rows for this view
    def rows(params = {})
      Row.create(get_json("/rows", :query => params))
    end

    # Return a specific row from this view
    def row(id)
    end

    def get_json(path, *args)
      super("/views/#{@id}#{path}", *args)
    end

  end
end
