# bciKoodit
You can 
GET users https://bci-test.herokuapp.com/users
POST new user
PUT (update) by id
DELETE - by id

When you create new user you put your username and password there and use Basic Auth to Authorization.
Using https://bci-test.herokuapp.com/users/login you get your token which you can use to Bearer Token https://bci-test.herokuapp.com/jwtSecured

You can do same things(GET, POST, PUT, DELETE) with products https://bci-test.herokuapp.com/products
You can find products by location(Kemi, Oulu, Kiiminki) using https://bci-test.herokuapp.com/products/location/
By category (music, winter sport, home)  https://bci-test.herokuapp.com/products/category/
By date of posting(2022-02-04, 2022-01-01, 2021-12-24) https://bci-test.herokuapp.com/products/posting/

Some tests for users and products are made by using Mocha

Project is made by Salla Parkkila & Jonna Koskela TVT20KMO



