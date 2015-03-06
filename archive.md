---
layout: page
title: Archive
comments: false
permalink: archive/
sitetitle: Archive Title
---


<div class="bottom" id="archive">
  <h4 class="title">This year's posts<span class="line"></span></h4>
        
  {%for post in site.posts %}
    {% unless post.next %}
      <ul class="arrow-list this-year">
    {% else %}
      {% capture year %}{{ post.date | date: '%Y' }}{% endcapture %}
      {% capture nyear %}{{ post.next.date | date: '%Y' }}{% endcapture %}
      {% if year != nyear %}
        </ul>
        <h4>{{ post.date | date: '%Y' }}<span class="line"></span></h4>
        <ul class="past">
      {% endif %}
    {% endunless %}
      <li><time>{{ post.date | date:"%d %b" }}</time> <a href="{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
  </ul>
</div>