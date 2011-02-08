require 'socrata'
require 'socrata/column'
require 'socrata/row'

module Socrata
  class View < Base

    # Return all the columns for this View
    def columns
    end

    # Return a specific column from this view
    def column(id)
      Column.create(get_json("/columns/#{id}"))
    end

    # Return all the rows for this view
    def rows(params = {})
      Row.create(get_json("/rows", params))
    end

    # Return a specific row from this view
    def row(id)
    end

    def get(path, *args)
      self.class.get("/views/#{@id}#{path}", *args)
    end

  end
end
