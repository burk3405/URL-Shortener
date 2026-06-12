# URL-Shortener
A simple application to shorten long URLs

## Version 1- HTML site to paste and copy

### Technical Requirements:

### Non-Technical Requirements:

### Features: 


Need a server that has the ability to publish redirect links automatically.


What problem is a URL shortener solving?
Imagine you want to share this URL:

https://www.university.edu/admissions/financial-aid/scholarships/fall-2026/application-form?student=123456&tracking=email_campaign

Instead, you can share:

https://short.ly/AbC123

When someone clicks the short link, they are automatically redirected to the original website.
This solves several problems:
Easier sharing
Better appearance
Character limits (Twitter originally inspired services like Bitly)
Click tracking and analytics
Link management
Custom branding

High-Level Architecture

              User creates short URL
                       │
                       ▼
               Backend REST API
                       │
        Generates unique short code
                       │
                       ▼
                Store in database

    Short Code  ─────────► Original URL

Example:
AbC123  -> https://google.com/
Xz91Af  -> https://youtube.com/

Then:

User enters:

https://short.ly/AbC123

           │
           ▼

Backend receives request

           │

Looks up:
AbC123

           │

Finds:
https://google.com/

           │

Returns HTTP 301/302 Redirect

           ▼

Browser loads Google


Does this require a server?
Yes.
The server is the heart of the project.
It has two responsibilities:
Create short URLs

POST /shorten

Input:

{
   "url":"https://google.com/"
}

Returns:

{
   "shortUrl":"https://short.ly/AbC123"
}

The server:
validates URL
generates code
stores mapping
returns shortened URL

Redirect users
Someone visits:

GET /AbC123

The server:
extracts AbC123
searches database
finds original URL
responds:

HTTP 302 Found

Location: https://google.com/

The browser then automatically navigates there.
The server does not host Google.
It only tells the browser where to go.
Think of it like a forwarding address.

Does the server "host" redirected websites?
No.
It only stores:

AbC123
↓

https://google.com/

When requested, it replies:
Go here instead.

The browser loads Google directly.
The shortener never proxies the website.

Functional Requirements
FR1: Create shortened URLs
Users can submit a URL and receive a shortened version.
Example:

Input:

https://google.com/

Output:

short.ly/AbC123


FR2: Redirect users
Visiting a shortened URL redirects to the original.

short.ly/AbC123

↓

https://google.com/


FR3: Prevent invalid URLs
Reject malformed URLs.
Example:

abcde

ftp//

12345


FR4: Store URL mappings
Maintain:
Short Code    Original URL
AbC123    google.com
Xz91Af    youtube.com
FR5: Prevent collisions
Every short code should uniquely identify one URL.
FR6: Optional custom aliases
Allow:

short.ly/myresume

instead of

short.ly/G72kLz


FR7: Analytics
Track:
clicks
timestamp
country
browser
referrer

FR8: Link expiration
Allow:

Expires after:

30 days

or

100 clicks


FR9: User accounts
Allow users to manage their own links.

Non-Functional Requirements
Performance
Redirect should occur within:

<100 ms


Scalability
Should support:
millions of URLs
millions of redirects/day
Reliability
Service should remain available 99.9% of the time.

Security
Prevent:
SQL injection
XSS
malicious URLs
abuse
phishing

Availability
Database failures should not crash the service.

Maintainability
Backend should be modular:

Controllers

↓

Services

↓

Repository

↓

Database


Usability
Creating links should require only one textbox and one button.

Portability
Deployable on:
Docker
AWS
Azure
Google Cloud
Local machine

Technical Requirements
Frontend
Could be:
HTML
CSS
JavaScript
or
React
Vue
Angular
Simple interface:

+----------------------------+
| Enter URL                  |
+----------------------------+

[ Shorten ]

Generated:

short.ly/AbC123


Backend
Possible choices:
Express.js
ASP.NET Core
Flask
FastAPI
Spring Boot
Provides REST API.

Database
Can use:
MySQL
PostgreSQL
SQLite
MongoDB
Example table:
id    shortCode    originalURL
1    AbC123    google.com
API Endpoints

POST /shorten

GET /{shortCode}

GET /stats/{shortCode}

DELETE /{shortCode}
HTTP Redirect
The backend returns:

HTTP 301 Moved Permanently

or

HTTP 302 Found

with:

Location:
https://google.com/


How are short codes generated?
Several methods exist.
Random strings

AbC123

F8jLs0

P2QaXe

Simple but requires collision checking.

Sequential IDs + Base62
Suppose database IDs are:

1
2
3
4

Convert them into Base62:

1

2

3

4

...

61

10

11

...

Result:

1

2

3

4

Z

10

11

This is extremely efficient.
Hashing
Hash:

https://google.com/

into:

8d72fa3...

Take first six characters:

8d72fa

Need collision handling.

How does Bitly solve this?
Services like Bitly use a massively scaled version of this idea.
Their process is approximately:

User submits URL

        │

        ▼

Load balancer

        │

        ▼

API servers

        │

Generate unique ID

        │

Store in distributed database

        │

Return:

bit.ly/AbC123

When clicked:

bit.ly/AbC123

        │

API server

        │

Cache lookup

        │

Database lookup if cache miss

        │

HTTP Redirect

        ▼

Destination website

To support billions of links and extremely high traffic, Bitly uses techniques such as:
distributed databases to store URL mappings,
in-memory caches so popular links can be resolved without hitting the database,
load balancers to spread requests across many servers,
geographically distributed infrastructure to reduce latency, and
analytics pipelines that record clicks without slowing down redirects.
This architecture allows redirects to happen in just a few milliseconds even at internet scale.

Development Roadmap
A good progression for building your own URL shortener is:
Design the database
Table with shortCode and originalURL.
Build a backend API
POST /shorten
Generate a unique code.
Save the mapping.
Implement redirect logic
GET /{shortCode}
Look up the code and return an HTTP redirect.
Create a simple frontend
Text input for the original URL.
Button to create the short URL.
Display the generated link.
Add validation
Reject malformed URLs.
Prevent duplicate or conflicting short codes.
Add analytics
Count clicks and record timestamps.
Add advanced features
Custom aliases
Expiration dates
QR code generation
User accounts
Rate limiting
Admin dashboard
For a portfolio project, this is an excellent full-stack application because it demonstrates REST API design, database modeling, backend routing, frontend integration, HTTP protocol knowledge, and scalable system design concepts that appear frequently in software engineering interviews.
﻿
