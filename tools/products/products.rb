require 'faker'
require 'json'

items = ARGV[0] || '1'
items = items.to_i

products = []

items.times { |i| products << appliance(1000 + i) }
items.times { |i| products << coffee(2000 + i) }
items.times { |i| products << beer(3000 + i) }
items.times { |i| products << book(4000 + i) }
items.times { |i| products << album(5000 + i) }

puts JSON.pretty_generate products



BEGIN {
  def appliance(id)
    {
      id: id,
      product_name: Faker::Appliance.equipment,
      category: 'Appliances',
      brand: Faker::Appliance.brand,
      price: Faker::Commerce.price(range: 10..250.0),
      description: lorem_paragraph
    }
  end

  def coffee(id)
    {
      id: id,
      product_name: Faker::Coffee.blend_name,
      category: 'Coffee',
      brand: Faker::Coffee.variety,
      price: Faker::Commerce.price(range: 3..10.0),
      description: titleize(Faker::Coffee.notes)
    }
  end

  def beer(id)
    {
      id: id,
      product_name: Faker::Beer.name,
      category: 'Beer',
      brand: Faker::Beer.brand,
      price: Faker::Commerce.price(range: 3..10.0),
      description: titleize(Faker::Beer.style)
    }
  end

  def book(id)
    {
      id: id,
      product_name: Faker::Book.title,
      category: 'Books',
      brand: Faker::Book.publisher,
      price: Faker::Commerce.price(range: 3..10.0),
      description: lorem_paragraph
    }
  end

  def album(id)
    {
      id: id,
      product_name: Faker::Music.album,
      category: 'Music',
      brand: Faker::Music.band,
      price: Faker::Commerce.price(range: 3..10.0),
      description: lorem_paragraph
    }
  end

  def titleize(value)
    value[0].upcase + value[1..-1] unless value.nil? || value.empty?
  end

  def lorem_paragraph
    Faker::Lorem.paragraph(sentence_count: 5, supplemental: true, random_sentences_to_add: 10)
  end
}