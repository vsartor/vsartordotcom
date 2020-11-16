
I've always liked writing, and the idea of having a blog where I can write and publish about topics I find interesting has been attractive to me for the last couple of years. I gave blogging  a try a couple of times before, but the tools I worked with never completely satisfied me: I felt either overencumbered or limited by them.

This time I'm trying a new approach and so far I'm liking it.

### Simply blogging

I just want to easily write and publish content online. I don't feel the need for anything more than a static website, i.e. a bunch of HTML pages with some basic CSS (and possibly some JavaScript) backing them up.

My first attempt, unsurprisingly, was Wordpress, _"the world's most popular website builder"_, as they claim it in big letters on their homepage. It generally worked, but I wanted to have detailed control of my website, and, although possible, took much more annoying work than I was willing to put in. Again, I just wanted to write things and have them go up _exactly_ the way I wanted them to look.

So I figured I wanted to use a static website generator. I found about [Hugo](https://gohugo.io), _"the world's fastest framework for building websites"_, as they claim it in big letters in their homepage. In retrospect, this was really, really close to what I wanted, and it developed nicely ever since. However, it was just a little bit more complicated than what I wanted.

Then I went on to try [Ghost](https://ghost.org), _"the world's most popular open source headless Node.js CMS"_, as they claim it in considerably smaller letters somewhere down in their homepage. This is a tool I'll gladly recommend to someone looking to build a professional webpage to publish content. However, customizing templates and the general look of the website took more time than I was willing to invest.

Then came the realization.

### Blogging with Python

Besides liking to write a lot I also love software development, and I'm no stranger to working on side projects in my free time. So why not combine these two hobbies together and create my own tool for blogging?

Well, long story short, I wrote my own static website generator. It's based on simple HTML templates, Markdown content and YAML configuration files.

I started out by trying to write something very specific to my blog, but by the time I finished, I had a different vision for how to layout my website and the tool was already limiting me.

So, in my attempt to be future proof, I started again from scratch, now making it a general tool instead of something that I specifically need for my current website, so that when I want to change things up, it will still be a great fit, and much easier to customize.

### Enter Ochs

It's called [Ochs](https://github.com/vsartor/ochs), as a reference to both [the early history of The New York Times](https://en.wikipedia.org/wiki/The_New_York_Times#Ochs_era) and to my acute difficulty in naming things.

Ochs works by taking in a source project folder and building the resulting website in a target directory.

![Ochs build flow](@{base_url}/images/blogging_in_python/ochs_build_flow.png)

An Ochs source project is structured as four aptly named folders:

* `posts`: Where the markdown content for posts goes.
* `resources`: Where static resources that are simply copied over to the root of the built website, such as CSS files or image resources.
* `templates`: Where all the HTML templates are located.
* `settings`: Where we place four YAML configuration files: `templates`, `variables`, `pages` and `posts`. We'll get to know them as we go through this post.

![All the things](@{base_url}/images/blogging_in_python/all_the_things.png)

As most static website generators, Ochs' foundation is templated HTML files.

For example, all webpages have a `<head>...</head>` HTML block containing general information about the webpage, which are common for almost every page except for a few parameters. So, to avoid copy-pasting this block for each page of the website, we can write a `head.html` template file. For example:

```HTML
<!DOCTYPE html>

<head>
  <meta charset="UTF-8">

  <title>@\{page_title}</title>

  <meta name="author" content="Victhor Sartório">
  <meta name="description" content="@\{description}">
  <meta name="keywords" content="@\{keywords}">

  <link rel="stylesheet" href="stylesheet.css">
</head>
```

Note that we have some parameters indicated by `@{<parameter_name>}` in there. That's what Ochs recognizes as _variables_! We'll intuitively specify them in the `variables.yaml` file, in the settings folder:

```YAML
- name: "description"
  value: "Victhor Satório - A personal internet landing page."
- name: "keywords"
  value: "Blog, Data Science, Agile, Internet, CV, Portfolio"
```

Now, we go over to the `templates.yaml` file in the settings folder to register this template with an alias:
```YAML
- name: "head"
  filename: "head.html"
```

Note that we did not cover the `@{page_title}` variable yet. That's because each page of our blog will have a different value for this variable, and therefore we'll use _page-specific variables_ that will be defined in the `pages.yaml` file!

### From templates to pages

So let's assume I have a few different templates now: `head.html`, `header.html`, `home_navigation.html` and `footer.html`. I want to put these together to build a homepage for my website. So, I create a new template representing the homepage of my website, and I stitch together the other templates like this:

```HTML
${head}

<body>
${header}

${home_navigation}

${footer}
</body>
```

Note that now I used the character `$` instead of `@`. When Ochs finds `@{name}` it understants `name` to be a variable, and when it finds `${name}` it understand `name` to be a template. This way we can build larger templates that are composed of smaller templates, breaking up the website into small building blocks that can be put together differently for each page!

Now, for Ochs to understand that a page should be built based on this `index` template, we add an entry to the `pages.yaml` file in the settings folder.

```YAML
- name: "home"
  template: "index"
  url: "index.html"
  is_blog_page: false
  variables:
    page_title: "Victhor Sartório - Homepage"
```

In this configuration file we need to give a bit more information for each different page.

First, in the `template` field we tell Ochs the name of the template that should be used for building the page, and in `url` we tell Ochs where this page should be located in our blog. In this case, if our base URL is `https://vsartor.com`, this page will be built as `https://vsartor.com/index.html`.

We then have a field called `is_blog_page`, which indicates if this page is expected to contain some sort of post information, which I'll cover later in this post. For now, suffice to say that in our homepage we will not include any, and as such, we set this flag to `false`.

Lastly, we define page specific variables in the `variables` listing. Note that here Ochs expects a shorter syntax than in the `variables.yaml` file, since it improves readability: instead of defining a list of maps with `name` and `value` fields we simply specify `'<name>: <value>'` for each variable we want.

With this, we provided Ochs enough information to build a single page. One could repeat the process for different pages, such as an online [CV](https://vsartor.com/cv.html) or [social](https://vsartor.com/social.html) contact information.

### What about posts?

But, as I said from the beginning, the idea is for Ochs to be able to handle a blog, and blogs are made up of posts.

As I mentioned before, content for posts are written in Markdown and placed in the `posts` folder. After they're written, we add an entry to the `posts.yaml` configuration file:

```YAML
- title: "Blogging in Python"
  date: "2020-09-07"
  author: "Victhor Sartório"
  content: "blogging_in_python.md"
  preview: "blogging_in_python_preview.md"
  url: "blogging_in_python.html"
  template: "post"
```

Some of the fields are very intuitive, like `title`, `date` and `author`. The `content` field receives the name of the markdown file that contains the full post content, and the `preview` filed receives the name of the markdown file that contains a small preview of the post, usually a paragraph long.

Then we have the target `url` and the `template` which should be used for building this post.

A template for a post, however, needs to signal Ochs where it wants certain information, like post title, author, date and content. These variables are accessible through the template macros `#{post-title}`, `#{post-author}`, `#{post-preview}`, `#{post-content}` and `#{post-url}`.

There's also a macro for the post date, which has the following syntax:

`#{post-date:<format string>}`

The format string tells Ochs how to format the date. If you want ISO formatting, you can use `#{post-date:%Y-%m-%d}`, or if you want American formatting you can use `#{post-date:%m/%d/%Y}`, and so on an so forth. In practice, any valid [Python format codes](https://docs.python.org/3/library/datetime.html#strftime-strptime-behavior) are accepted since Ochs simply passes them on to `date.strftime`.

A simple toy example of a post template would look like this:

```HTML
<head>
  <title>#{post-title}</title>
</head>

<body>
  <h1>#{post-title}</h1>
  <h2>By #{post-author} in #{post-date:%Y-%m-%d}</h2>

  #{post-content}
</body>
```

### Making posts reachable

We now can create posts and have them go up at specific URLs, but we need to be able to index these posts nicely on a blog homepage so that visitors can discover them.

We do this by creating blog pages, i.e., pages that have the `is_blog_page` flag set to `True` on the `pages.yaml` file. In pages like this, we can use an additional useful macro for indexing posts.

Below we have an example of a possible template for the homepage of a blog:

```
${blog-head}

<body>
${blog-header}

  #{post-start}:5
  <h1>
    <a href="#{post-url}">#{post-title}</a>
  </h1>
  <h5>
    <a href="#{post-url}">By #{post-author} in #{post-date:%B, %Y}</a>
  </h5>

  <a href="#{post-url}">#{post-preview}</a>
  #{post-end}
</body>
```

Note that we have some post-specific variables, like `#{post-title}`, located in a block that is delimited by a `#{post-start}:5` and a `#{post-end}` macro.

Ochs takes these blocks and repeats them, filling each occurrence with a different post, starting out with the most recent and going back to the oldest. In some pages you my not want to list all the posts; that little `:5` is an optional parameter indicating that you want this block to repeat a maximum of `5` (or any other number you want) times, meaning that only the five most recent posts would be shown.

### That's all folks!

This pretty much sums up Ochs.

You can combine all of these features to build a nicely put together personal website. If you want to check out how I used these features to build this very blog, check out the [source](https://github.com/vsartor/vsartordotcom) for my website.

Naturally, as a way to test Ochs, the first thing I wrote about was Ochs itself.

Now all that's left for me is writing some more posts 😊

<br>
<br>
<br>
<br>
<hr>

#### Afterthoughts: third-party blogging?

You may have asked yourself why not use a third-party platform, such as Medium. The answer is slightly boring: I _really_ care about ownership of both the content and the medium of my blog. Although I fully understand that neither Medium nor Gmail are going anywhere anytime soon, I want to have my blog hosted in `https://vsartor.com` and my e-mail at `victhor@vsartor.com`. Just in case.

#### Afterthoughts: different templates per post?

As mentioned previously, through the `template` field in the `posts.yaml` file, I could specify a different template for each post in my blog. For now, I do expect to use the same template for every post.

However, this was a particularly important feature for me. Why? Because I want to be future-proof.

In the future, I'm eventually bound to change the layout and styling of my website. When I do that, I'll write a new template, matching the new style of the website. However, with this feature I can preserve the old template for old posts, making sure I'm not breaking anything and not having to go through the trouble of going back and checking if everything looks okay.
