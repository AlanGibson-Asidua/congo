FROM ruby:2.6-alpine

WORKDIR /usr/src/app

COPY Gemfile .
RUN bundle install

COPY ./products.rb .

CMD ["ruby", "./products.rb"]