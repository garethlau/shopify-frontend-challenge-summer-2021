# Shoppies

This is my submission for Shopify's Summer 2021 Front-End Developer Intern Challenge.

Try it out [here](https://shoppies.garethdev.space)!

## Demo

_Sped up by 2x_.

![](/demo/main-flow.gif)

## Other Features and Additions

### Paginated Data Fetching

![](/demo/load-more.gif)

### Movie Details

![](/demo/movie-details.gif)

### Collaborative Editing and Live Updates

_Sped up by 2x_

![](/demo/collaborate.gif)

### Dark Mode

![](/demo/dark-mode.gif)

### Saved Nominations

![](/demo/persist.gif)

### Cached Search Results

Search results are cached to improve second time performance. The demo below was throttled to [Slow 3G (Download 376 kb/s, Latency 2000 ms)](https://stackoverflow.com/questions/48367042/in-chrome-dev-tools-what-is-the-speed-of-each-preset-option-for-network-throttl) in Chrome.

![](/demo/cached-search-results.gif)

### Optimistic Updates

Nominating a movie and removing a nominated movie are optimistically updated with fallbacks in place if the operation is unsuccessful. Unthrottled (Online) on the left. Throttled (Slow 3G) on the right.

![](/demo/optimistic-updates.gif)

### Mobile View

Movie posters are not automatically fetched for mobile users.

![](/demo/mobile-view.png)
