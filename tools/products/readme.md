# Generating products

You can use the ruby script in this folder to generate fake 
products for use by the products microservice.

If you already have ruby installed then the only additional
thing you need is the faker gem (see Gemfile).

If you don't have ruby, and don't particularly want to install
it, then you can use docker to run the command in a ruby image.

```bash
# Build an image
docker build -t ruby-products .

# Run the default command to generate 1 of each product type
# and cut and paste the output to file yourself...
docker run -it --rm ruby-products

# Run the script but specify the number of items to generate
# per product type and pipe the output straight to file... 
docker run -it --rm ruby-products ruby products.rb 3 > products.json

```