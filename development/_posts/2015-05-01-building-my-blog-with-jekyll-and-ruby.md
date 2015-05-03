--- 
layout: post
title: Building My Blog With Jekyll Ruby and Github Pages
author: "Robert Bird"
comments: true
tags:
- development
- blogging
- jekyll
---

I remember one of the first ever ASP.NET projects I worked on, we were tasked with rebuilding a website for a company whose site was published as static HTML files. After editing their content in a CMS tool and hitting publish it would generate the entire site as a load of html files, doing the processing up front and then FTPing them all over to their hosting site. Surely replacing this with a nice new dynamic ASP.NET website with a database for the content was how you built modern sophisticated sites.

It's funny how the world of technology is so cyclical. As quickly as statuc site generation tools went out of fashion, they come back around again. Recently when setting up this blog and looking into CMS options I found myself coming accros static site generators once more. 

Static site generators have some very compelling benefits:

 * **Performance** - static files are much faster to serve.
 * **Security** - there is no risk of someone being able to gain access to your CMS and change your content.
 * **Hosting Costs** - I've had problems in the past trying to run .NET based CMS platforms on cheap hosting with limited memory and compute resources. Even with cloud hosting costs can still add up. There are actually many free options for hosting static files. 
 * **Design Flexibilty** - In my experience many CMS platforms make it uncessarily complicated to create custom themes. Wordpress is a good example, making you dig through a mess of PHP code to change the html. Static site generators get you back to basics making this much easier.

*Popular Static Site Generators:*

There are many static site generators out there, for a list of options see [https://staticsitegenerators.net/](https://staticsitegenerators.net/). 

Always one to take a new challenge I set to work with one of the most popular generators called [Jekyll](http://jekyllrb.com/). 


## Getting started with Jekyll

To learn about Jekyll, I found the [Jekyll documentation](http://jekyllrb.com/) very well written. Jekyll also uses a templating language called [Liquid](https://github.com/Shopify/liquid/) and I found the following guide [in the Liquid documentation](https://github.com/Shopify/liquid/wiki/Liquid-for-Designers) helpful.

![Jekyll static site generator]({{ site.url }}/assets/jekyll-logo.png)

While docs are a useful reference, if you want to quickly get up and running with a basic site then there are plenty of how-to guides out there. The guide I found most useful was [Smashing Magazine - Build A Blog With Jekyll And GitHub Pages](http://www.smashingmagazine.com/2014/08/01/build-blog-jekyll-github-pages/)

This link will talk you through the process of creating a site and hosting it on GitHub pages. So it's a great start, If you just want to get a basic site together then you can fork an existing theme as described in the article. I came across a couple of great themes here:
 
* [http://mmistakes.github.io/minimal-mistakes/code-highlighting-post/](http://mmistakes.github.io/minimal-mistakes/code-highlighting-post/)
* [http://mmistakes.github.io/skinny-bones-jekyll/](http://mmistakes.github.io/skinny-bones-jekyll/)

However, I really wanted to use my own theme and quickly came across a few issues around posts grouped into categories with tags and a feedback form. I had to piece it all together from various articles on the web, so I just wanted this blog post to be my account of working through these more advanced features. 

## Organising blog posts by category and working with draft posts

To start creating blog posts you just need to a create special markdown files, if you are not familiar with markdown then here is a great cheatsheet [https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)

Most how-to guides talk you through the process of creating a folder called '_posts' to put you markdown files into, but what I didn't realise is that there can be more than one _posts folder. In fact, if you put a _posts folder within another folder it will use that folder name as the blog category. This is great because it means I can use the folder structure to organise my posts into categories. 

Another useful fact is that you can create a folder called [_drafts](http://jekyllrb.com/docs/drafts/) to store posts which are a work in progress. Then in development you can run jekyll with the following command to run the site and include any draft posts:

{% highlight bash %}
jekyll serve --drafts
{% endhighlight  %}

## Listing Blog Posts (With Pagination)

One of my first challenges was listing the blog posts, but instead of an ever growing list of posts I wanted to page the results. We can do this using *paginator.posts*. The sample below shows looping through our pages of posts and listing some of the information about each blog post:

{% highlight html lineanchors %}{% raw %}
{% for post in paginator.posts %}
    <!-- Post date -->
    <span class="day">{{ post.date | date: "%d"  }}</span>
    <span class="month">{{ post.date | date: "%b"  }}</span>
            
    <!-- Post Title -->
    <h2 class="title bottom-2"><a href="{{ post.url }}">{{ post.title }}</a> </h2>
            
    <!-- Post Intro (taking the first 75 characters of the content) -->
    <p>{{ post.content | strip_html | truncatewords:75}}</p>
    <a href="{{ post.url }}" class="button medium color">Read More</a>

    <!-- Categories -->
    {% for cat in post.categories %}
        <a href="/{{ cat }}">{{ cat | capitalize }}</a>
    {% endfor %}

    <!-- Author -->
    <div class="meta">By : {{ post.author }} </div>
    
    <!-- Comments links are all handled in javascript using disqus -->
    
    <!-- tags -->
    {% assign hastags = post.tags | size %}
    {% if hastags != 0 %}
        {% for tag in post.tags %}
            <a href="/tag/#{{ tag }}">{{ tag }}</a>,
        {% endfor %}
    {% endif %}
    
{% endfor %}
{% endraw %}{% endhighlight %}

The obvious question here is what is the page size? We set this in our *_config.yml* file:

{% highlight html %}
paginate: 5
{% endhighlight %}

This will mean that our code above will only show 5 posts at a time. So the next thing we need are some buttons to navigate through the pages.

### Pagination Links

{% highlight html lineanchors %}{% raw %}
<ul class="pagination color">
    {% if paginator.page == 1 %}
        <li><a href="#" class="prev disabled">Previous</a></li>
    {% elsif paginator.page == 2 %}
        <li><a href="/" class="current">Previous</a></li>
    {% else %}
        <li><a href="/page/{{ paginator.previous_page }}/" class="current">Previous</a></li>
    {% endif %}

    {% if paginator.page == 1 %}
    <li><a class="current">1</a></li>
    {% else %}
    <li><a href="/">1</a></li>
    {% endif %}
    
    {% for count in (2..paginator.total_pages) %}
      {% if count == paginator.page %}
      <li><a class="current">{{ count }}</a></li>
      {% else %}
      <li><a href="/page/{{ count }}/">{{ count }}</a></li>
      {% endif %}
    {% endfor %}
    
    {% if paginator.page == paginator.total_pages %}
        <li><a class="next disabled">Next</a></li>
    {% else %}
        <li><a href="/page/{{ paginator.next_page }}/" class="current">Next</a></li>
    {% endif %}
</ul>
{% endraw %}{% endhighlight %}

## Using Blog Post Categories and Tags

One of the things I really struggled with was tagging and organising my posts into categories. I then wanted to create pages which list the posts within a category or with a certain tag.

### Configuring posts

To do this I first needed to label the posts. At the top of the markdown we can include a section to specify variables, so in this post I have the following header:

{% highlight html lineanchors %}{% raw %}
--- 
layout: post
title: Building My Blog With Jekyll Ruby and Github Pages
tags:
- development
- blogging
- Jekyll
---
{% endraw %}{% endhighlight %}

You can see from the above that I have given this post three tags. The category comes from the fact that this file is within a folder called /Development/_posts/. 

### Listing Categories

The following code lists all the available categories with a link to a category specific page:

{% highlight html lineanchors %}{% raw %}
    {% assign tags_list = site.categories %}  
      {% if tags_list.first[0] == null %}
        {% for tag in tags_list %} 
          <li><a href="/{{ tag }}">{{ tag | capitalize }} <span>({{ site.tags[tag].size }})</span></a></li>
        {% endfor %}
      {% else %}
        {% for tag in tags_list %} 
          <li><a href="/{{ tag[0] }}">{{ tag[0] | capitalize }} <span>({{ tag[1].size }})</span></a></li>
        {% endfor %}
      {% endif %}
    {% assign tags_list = nil %}
{% endraw %}{% endhighlight %}

### Category Landing Page

To create a specific category page I used the idea outlined [in this blog post](http://www.minddust.com/post/tags-and-categories-on-github-pages/) to first create a reusable layout

{% highlight html lineanchors %}{% raw %}
<h1>Articles in category: <b>{{ page.category }}</b></h1>

<div class="bottom">
  {% if site.categories[page.category] %}
  <ul class="arrow-list">
    {% for post in site.categories[page.category] %}
    <li><time>{{ post.date | date:"%d %b" }}</time> <a href="{{ post.url }}/">{{ post.title }}</a></li>
    {% endfor %}
  </ul> 
  {% else %}
    <p>There are no posts for this category.</p>
  {% endif %}
</div>
{% endraw %}{% endhighlight %}

So the above code goes into a file called articlesbycategory.html in the _layout folder. Then for every category folder I have I just insert a file called index.html with the following content:

{% highlight html lineanchors %}{% raw %}
---
layout: articlesbycategory
category: development
---
{% endraw %}{% endhighlight %}


### Tag Landing Page

I am also tagging posts, but didn't want to have to create a new page for every tag I created in the same way I do with categories, so instead I just created one page which has all tags with the blog posts grouped below them. I can then just link to the tag within that page using an anchor. [This page](http://www.jokecamp.com/blog/listing-jekyll-posts-by-tag/) helped me with the following code to achieve this:

{% highlight html lineanchors %}{% raw %}
{% for tag in site.tags %}
  {% assign t = tag | first %}
  {% assign posts = tag | last %}
<a name="{{ t | downcase }}"/>
<h4>{{ t | downcase }}</h4>
<ul class="arrow-list">
{% for post in posts %}
  {% if post.tags contains t %}
  <li>
    <time class="">{{ post.date | date: "%B %-d, %Y"  }}</time>
    <a href="{{ post.url }}">{{ post.title }}</a>
  </li>
  {% endif %}
{% endfor %}
</ul>
<br/><br/>
{% endfor %}
{% endraw %}{% endhighlight %}

### Tag Clouds

Tag clouds are a little bit old school, but I needed a way to list out the tags somewhere and [came across this](http://www.tobiassjosten.net/jekyll/jekyll-tag-cloud/) blog post and thought why not. So here is the code I am using:

{% highlight html lineanchors %}{% raw %}
 {% assign tags_list = site.tags %}  
      {% if tags_list.first[0] == null %}
        {% for tag in tags_list %} 
          <a href="/tag/#{{ tag }}" style="font-size: {{ tag | last | size | times: 100 | divided_by: site.categories.size | plus: 10 }}%">{{ tag | capitalize }} <span>({{ site.tags[tag].size }})</span></a>
        {% endfor %}
      {% else %}
        {% for tag in tags_list %} 
          <a href="/tag/#{{ tag[0] }}" style="font-size: {{ tag | last | size | times: 100 | divided_by: site.categories.size | plus: 30 }}%">{{ tag[0] | capitalize }} <span>({{ tag[1].size }})</span></a>
        {% endfor %}
      {% endif %}
    {% assign tags_list = nil %}
{% endraw %}{% endhighlight %}


## Pretzel, A .NET version of Jekyll

While researching static site geneation tools I also came across a great C# .Net option called [Pretzel](https://github.com/Code52/pretzel/). As a developer who spends most of his time with C# this looked perfect. One nice feature is that as well as using the Liquid templating language you can use .cshtml pages.   

However there were a few sticking points for me. The first being that I couldn't host the site on GitHub pages unless I used Liquid instead of cshtml which seemed a shame. Secondly I found that although most Jekyll/Liquid features are supported, some are not. I quickly [got stuck with categories](https://github.com/Code52/pretzel/issues/224) for example.

Jekyll has been a great learning experience, but hopefully Pretzel will catch up and at some point I will be able to start using that instead. 

Recently there are a couple of very interesting Pretzel developments which I will be keeping my eye on:

* Firstly there is [discussion](https://github.com/Code52/pretzel/issues/217) of using [scriptcs](http://scriptcs.net/) within the template files. This has my interest because [Glenn Block](http://codebetter.com/glennblock/) has been commenting on the ticket
* Secondly there is a thread about combining forces with some of the other .Net static site generators out there. 
