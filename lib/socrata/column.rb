require 'socrata/group'

module Socrata
  class Column

    attr_reader :id, :name, :data_type_name, :position, :render_type_name, :table_column_id, :width

    # A list of Groups (name, count)
    attr_reader :groups

    def initialize
      @groups = []
    end

    class << self
      def create_from_json(json_data)
        if json_data.is_a?(Array)
          ret = []
          json_data.each do |column_data|
            ret << create_column_from_json(column_data)
          end
          ret
        else
          create_column_from_json(json_data) unless json_data["error"]
        end
      end

      private
      def create_column_from_json(json_data)
        add_groups_from_json(Column.new, json_data)
      end

      def add_groups_from_json(c, json_data)
        json_data["cachedContents"]["top"].each do |group|
          c.groups << Group.new(group["item"], group["count"])
        end
        c
      end

    end
  end
end
