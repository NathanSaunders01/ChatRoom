class AddUserToMessage < ActiveRecord::Migration[5.2]
  def change
    add_column :messages, :user, :string
  end
end
