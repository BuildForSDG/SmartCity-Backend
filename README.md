## BuildForSDG/smartCity-backend (A product of team-241)

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/7a256fa992df4f3b9b5ba21629249010)](https://app.codacy.com/gh/BuildForSDG/SmartCity-Backend?utm_source=github.com&utm_medium=referral&utm_content=BuildForSDG/SmartCity-Backend&utm_campaign=Badge_Grade_Dashboard)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/7a256fa992df4f3b9b5ba21629249010)](https://app.codacy.com/gh/BuildForSDG/SmartCity-Backend?utm_source=github.com&utm_medium=referral&utm_content=BuildForSDG/SmartCity-Backend&utm_campaign=Badge_Grade_Dashboard)

## About

### This is the backend API of SmartCity, a product by BuildForSDG/team-241.

SmartCity is a project that seeks to develop a flexible online marketplace, where business people can list their products and gain get patronage from a large community of online users.

The project basically seeks to give online presence to business that arealways offline.

We have narrowed our focus to freshfoods/perishables and and vocational skills.

Our product delivery is centered on two major categories:
> The FreshMart for fresh foods/ perishables.

> The Artisans for all forms of vocational skills, ranging from manual labours to top tech skill sets.


If you car is broken for instance, you should be able to search the app for mechanics in close proximity and place order for urgent/ emergency service.
Likewise, one can search for fruit vendors in close range and order for home/ office delivery.

## Why

We envisage a smart economy, where everyone irrespective of their businesses should be able to access digital infrastructure, and market their products/ services.
A buyer should be able to order for whatever goods/ services he needs right at the comfort of his home/ office. 

## Usage

This API is meant to serve the client/ frontend.
To achieve that, corresponding route paths have been build to serve the following request URLs:

### URLs for FreshMart
> *GET /products?limit=n*  -Get n-number of products from all products

> *GET /products/id* -Get the single product with id = id

> *GET /products/inLocation/location?limit=n* -Get n products from a given location

> *GET /products/inCategory/id?limit=n* -Get n products in the category whose id = id

> *GET /products/inCategory/id/inLocation/location* -Get all products in a particular category, and from a given location.

> *GET /products/id/reviews* -Get all reviews for a particular product whose id = id

> *GET /products/images/filename* -Get a particular product image with the given filename

> *GET /products/dId/reviews/rId* -Search for theproduct whose id = dId, and from it's reviews get the particular review with corresponding id = rId

> *GET /products/inRange/from-to?limit=n* -Get n products within the given price range

> *GET /products/fromSeller/id* -Get all products posted by the seller whose id = id

> *POST /products* -Upload a product

> *POST /products/id/reviews* -Post a review for a product whose id = id

> *DELETE /products/id* -Delete a product whose id = id

> *DELETE /products/dId/reviews/rId* -Search for a product of id = dId, and from its reviews delete the single review with id = rId


### URLs for Artisans
> *GET /artisans?limit=n*  -Get n-number of services from all services

> *GET /artisans/id* -Get the single service listing with id = id

> *GET /artisans/inLocation/location?limit=n* -Get n service listings from a given location

> *GET /artisans/inCategory/id?limit=n* -Get n service listings in the category whose id = id

> *GET /artisans/inCategory/id/inLocation/location* -Get all service listings in a particular category, and from a given location.

> *GET /artisans/id/reviews* -Get all reviews for a particular service listing whose id = id

> *GET /artisans/images/filename* -Get a particular service listing image with the given filename

> *GET /artisans/dId/reviews/rId* -Search for the service listing whose id = dId, and from it's reviews get the particular review with corresponding id = rId

> *POST /artisans* -Post a service listing

> *POST /artisans/id/reviews* -Post a review for a service listing whose id = id

> *DELETE /artisans/id* -Delete a service listing whose id = id

> *DELETE /artisans/dId/reviews/rId* -Search for a service listing of id = dId, and from its reviews delete the single review with id = rId

## Authors

***BuildForSDG/team-241***

List the team behind this project. Their names linked to their Github, LinkedIn, or Twitter accounts should siffice. Ok to signify the role they play in the project, including the TTL and mentor

## Contributing

If this project sounds interesting to you and you'd like to contribute, thank you!
First, you can send a mail to buildforsdg@andela(dot)com to indicate your interest, why you'd like to support and what forms of support you can bring to the table, but here are areas we think we'd need the most help in this project :

1.  area one (e.g this app is about human trafficking and you need feedback on your roadmap and feature list from the private sector / NGOs)
2.  area two (e.g you want people to opt-in and try using your staging app at staging.project-name.com and report any bugs via a form)
3.  area three (e.g here is the zoom link to our end-of sprint webinar, join and provide feedback as a stakeholder if you can)

## Acknowledgements

Did you use someone else’s code?
Do you want to thank someone explicitly?
Did someone’s blog post spark off a wonderful idea or give you a solution to nagging problem?

It's powerful to always give credit.

## LICENSE

MIT
