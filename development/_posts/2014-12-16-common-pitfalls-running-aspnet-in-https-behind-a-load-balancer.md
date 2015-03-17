--- 
layout: post
title: Common pitfalls running your asp.net site in HTTPS behind a load balancer
author: "Robert Bird"
comments: true
tags:
- https
- infrastructure
- devops
---

If you've installed your SSL certificates on the load balancer to offload the decryption processing and boost the performance of your web servers then it's possible that this will change subtle details in the traffic being sent onwards to your web servers.

This may not cause any issues, but occasionally it will catch you out. Here are some of the common pitfalls I have experienced (so far)

##Are You Missing IIS Client IP Addresses?##

One common problem is when you come to diagnose a problem and look in the IIS logs only to see that all of the traffic is coming from the same IP address. Of course it turns out that this is the IP address of the load balancer. So how do we solve this issue?

###Introducing the X-Forward-For header###

The [X-Forward-For header](http://en.wikipedia.org/wiki/X-Forwarded-For) is simply a HTTP header that is used to identify the originating IP address of the client.

Most load balancers support sending the original users IP address through as an additional HTTP header, but you may need your hosting provider to configure this. (we did)

Once this is setup you will need to install an additional IIS module called the [IIS Advanced Logging Module](http://www.iis.net/learn/extensions/advanced-logging-module/advanced-logging-for-iis-custom-logging) to have it capture these headers in it's logs. Unfortunately this doesn't change the standard log files, but instead creates a new additional log file but at least you have it logged somewhere.

You can also capture this value from ASP.NET using:

{% highlight csharp lineanchors %}
Request.Headers["X-Forwarded-For"];
{% endhighlight %}

##Problems with SSL Cookies##

Another more subtle problem is SSL cookies. Recently after putting one of our applications through a penetration test we were advised to turn on HTTPS-only cookies 

If you are running your site under SSL then [Secure cookies](http://en.wikipedia.org/wiki/HTTP_cookie#Secure_cookie) are recommended as an additional security measure. They are described on the [OWASP site](https://www.owasp.org/index.php/SecureFlag) as:

> The purpose of the secure flag is to prevent cookies from being observed by unauthorized parties due to the transmission of a the cookie in clear text. To accomplish this goal, browsers which support the secure flag will only send cookies with the secure flag when the request is going to a HTTPS page

Secure cookies can be turned on in ASP.NET by adding the following to your web.config:

{% highlight xml lineanchors %}
<system.web>
  <httpCookies requireSSL="true" httpOnlyCookies="true" />
</system.web>
{% endhighlight %}

As soon as this was enabled we received the following errors: _"The application is configured to issue secure cookies. These cookies require the browser to issue the request over SSL (https protocol). However, the current request is not over SSL"_

The problem here is that the load balancer is actually sending traffic onwards to your servers under plain old HTTP (instead of HTTPS).
This means that to ASP.net the cookies are invalid because they are not being received from an SSL connection. 

To fix this issue we can fool ASP.Net into thinking it is running under HTTPS simply by adding another HTTP header to the request.

Ideally you want your load balancer to support the _X_FORWARDED_PROTO_ header, meaning that you can identify the protocol the original request used. (This may change to [FORWARDED in future according to this stack overflow post](http://stackoverflow.com/questions/13111080/what-is-a-full-specification-of-x-forwarded-proto-http-header))

Add the following rewite rule to your web.config file: 

{% highlight xml lineanchors %}
<rewrite>
    <allowedServerVariables>
        <add name="HTTPS" />
        <add name="X-FORWARDED-PROTO" />
    </allowedServerVariables>
    <rewriteMaps>
    </rewriteMaps>
    <globalRules>
        <rule name="HTTPS ReWrite" stopProcessing="true">
            <match url="(.*)" />
            <serverVariables>
                <set name="HTTPS" value="on" />
            </serverVariables>
            <action type="Rewrite" url="{R:1}" />
            <conditions logicalGrouping="MatchAny">
                <add input="{HTTP_X_FORWARDED_PROTO}" pattern="https" />
            </conditions>
        </rule>
    </globalRules>
</rewrite>
{% endhighlight %}

When a request comes in to IIS it is guaranteed to match the rule (because (.*) will match anything) and will add a server variable (header) called HTTPS with the value "ON" to the request. This is a header which tells ASP.NET that the request can be assumed to have come from an SSL connection and bypasses the error message we were seeing. The trick is that the rewrite happens in IIS before the request is passed on to ASP.NET, so ASP.NET receives the header with the request. Finally the condition means that this rule is only applied when the X_FORWARDED_PROTO header is set to _HTTPS_, i.e. if the original request was HTTPS then apply the rule which tells ASP.NET to assume that the request was send under SSL. (makes sense!)

If you your load balancer cannot support the X_FORWARDED_PROTO you would need to remove the condition in the rewrite rule.

Thanks to [James Crowley for blogging about this]([http://www.jamescrowley.co.uk/2014/03/07/ssl-termination-and-secure-cookiesrequiressl-with-asp-net-forms-authentication/) which really helped me out here! I also found the [following page](http://forums.iis.net/t/1178094.aspx?Rewriting+HTTPS+variable+based+on+value+of+X+Forwarded+Proto) useful.






