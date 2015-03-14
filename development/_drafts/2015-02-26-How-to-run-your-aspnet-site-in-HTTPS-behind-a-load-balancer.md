--- 
layout: post
title: How to run your asp.net site in HTTPS behind a load balancer
author: "Robert Bird"
comments: true
tags:
- https, infrastructure
---

If you have installed your SSL certificates on the load balancer to offload the decryption and boost the performance of your web servers then it's likely that the load balancer is sending traffic onwards to your servers under plain old HTTP. (instead of HTTPS)

This may not cause any issues, but occasionally this will catch you out.

**IIS Client IP Address**

One common problem is when you come to diagnose a problem and look in the IIS logs only to see that all of the traffic is coming from the same IP address. Of course it turns out that this is the IP address of the load balancer. So how do we solve this issue?

Introducing the X-Forward-For HTTP header.&nbsp;

[BACKGROUND AND LINKS]

Most load balancers support sending the original users IP address through as an additional HTTP header, but you may need your hosting provider to configure this.&nbsp;

Once this is setup you will need to install an additional IIS module to have it capture these headers in it's logs.&nbsp;

[MORE INFO FROM EDD]

**SSL Cookies**

Another more subtle problem is SSL cookies. Recently after putting one of our applications through a penetration test we were advised to turn on https cookies [BACKGROUND AND LINK NEEDED].

To enable this, you add the following to your web.config.&nbsp;

As soon as this was enabled we received the following errors:

We soon remembered that the traffic was actually hitting the server as HTTP, so to asp.net this was invalid.&nbsp;

To fix this issue we can fool asp.net into thinking it is running under HTTPS by adding another HTTP header to the request.&nbsp;

There are two ways to do this depending if you have the forward for header or not

http://www.jamescrowley.co.uk/2014/03/07/ssl-termination-and-secure-cookiesrequiressl-with-asp-net-forms-authentication/

http://forums.iis.net/t/1178094.aspx?Rewriting+HTTPS+variable+based+on+value+of+X+Forwarded+Proto