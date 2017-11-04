# newsbot

A Slackbot that provides a `/news` slash command. Delivers category- or search-term-based headlines on demand.

## Project Goals

1. I can type command "/news" in slack and be returned 5-10 of the top stories, each story to show a headline, summary and link.

2. I can see headlines from a specific news category with command "/news {category}". Possible categories: 'finance', 'news', 'pop',
'science', 'sports', 'tech'
3. I can see headlines from a random news source within a given category with command "/news {category} random"

4. I can see headlines from any random news source with command "/news random"

5. I can search for information about a given term within a category with command "/news {category} {search-term}"

6. I can search all sources for a search-term with command "/news {search-term}"

7. I can get a list of all commands and other help by typing "/news help"

8. I can install the bot to my slack team from a link on the webpage

## News Sources

Headlines are sourced from [newsapi.org](https://newsapi.org/sources) and/or [eventregistry.org](http://eventregistry.org)
