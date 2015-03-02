---
layout : blog3
title : Rob Bird's Blog
paginate: 2
paginate_link: /page:page/index.html
---
<div>
    {% for post in site.posts  limit:5 %}
        <div class="one column alpha">
            <div class="date-post">
                <span class="day">{{ post.date | date: "%d"  }}</span><span class="month">{{ post.date | date: "%b"  }}</span>
            </div>
        </div> <!-- End Date -->
        <div class="ten columns omega">
            <div class="post bottom">

                <div class="image-post bottom-2">
                    <a href="{{ post.url }}"><img src="/images/img/blog/post-image-2.jpg"></a>
                </div>

                <!-- Title Post -->
                <h2 class="title bottom-2"><a href="{{ post.url }}">{{ post.title }}</a> <span class="line"></span></h2>

                <div class="post-content">
                    <p>{{ post.content | strip_html | truncatewords:75}}</p>
                    <a href="{{ post.url }}" class="button medium color">Read More</a>
                </div><!-- End post-content -->

                <hr class="top bottom-2" />

                <div class="post-meta bottom-2 transparent">
                    <!-- Category -->
                    <div class="meta">
                        <span class="more-items icon gray"></span>
                        {% for tag in post.tags %}
                          <a href="/tag/{{ tag }}">{{ tag }}</a>
                        {% endfor %}
                    </div>
                    <!-- Author -->
                    <div class="meta"><span class="user icon gray"></span> By : {{ post.author }} </div>
                    <!-- Comments -->
                    <div class="meta"><span class="conversation icon gray"></span> <a href="{{ post.url }}#disqus_thread">View Comments</a> </div>
                </div><!-- End post-meta -->

            </div><!-- End column post -->
        </div>
    {% endfor %}
</div>

<h5>Categories</h5>
{% for category in site.categories %}
  <li><a href="#{{ category | first }}">{{ category | first }}</a></li>
{% endfor %}

<h5>Posts:</h5>
{% for post in site.posts offset:5 %}
	<li>
		<span class="olderpostdate"> {{ post.date | date: "%d %b"  }} </span> <a class="postlink" href="{{ post.url }}">{{ post.title }}</a>
	</li>
{% endfor %}

{% include archives.html %}
