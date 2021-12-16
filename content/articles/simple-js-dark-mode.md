---
title: Simple JavaScript Dark Mode
description: I was looking for a dead simple solution to add a subtle dark mode touch, in 100 lines or less, in vanilla.
---

In the world of CSS variables and webpack code splitting, there are plenty of ways to integrate a dark mode into your website or app. In my case, I was looking for a dead simple solution to add a subtle dark mode touch, in 100 lines or less, in vanilla. The simple JavaScript solution looks like this:

```js[index.js]
function is_dark_theme() {
    return document.documentElement.className === 'dark-theme';
}

var dark_btn = document.querySelector('.dark-btn');
let cookie = document.cookie.split('; ').find(row => row.startsWith('yourprefix_theme='));
var cookie_value = (cookie) ? cookie.split('=')[1] : '';
var chose_dark_theme = cookie_value === 'dark';

// Not necessary, but an optional to match browser/OS preference in some cases.
var prefer_dark_theme = window.matchMedia("(prefers-color-scheme: dark)").matches;

if ( chose_dark_theme ) {
    document.documentElement.className = 'dark-theme';
    document.cookie = "yourprefix_theme=dark; path=/;";
} else {
    document.cookie = "yourprefix_theme=; path=/;";
}

dark_btn.addEventListener("click", function() {
    var theme = '';
    if ( is_dark_theme() ) {
        document.documentElement.className = '';
        theme = '';
    } else {
        document.documentElement.className = 'dark-theme';
        theme = 'dark';
    }
    document.cookie = "yourprefix_theme=" + theme + "; path=/;";
});
```

Load this snippet in the footer, add a button to the page with a class of “dark-btn”, and you can simply add any CSS styles to your page that account for the `<body>` element to have a class of “dark-theme”.

To create a more consistent user experience for a user, I would recommend doing a basic check in your server side code to add a dark class to the `<body>` element, which will assist with the first paint rather than flashing light content first. For example, with PHP, on a hook that :

```php[index.php]
<?php

/**
 * Returns a class name for the current theme based on user preference.
 * 
 * @return String Class name for the theme, if relevant.
 */
function yourprefix_dark_mode_html_class() {
    $class = '';
    if ( !empty($_COOKIE['yourprefix_theme']) ) {
        if ( $_COOKIE['yourprefix_theme'] === 'dark' ) {
            $class = 'dark-theme';
        } else if ( $_COOKIE['yourprefix_theme'] === '' ) {
            $class = '';
        }
    }
    return $class;
}

/**
 * In your template file:
 */
?>
<body class="<?php echo yourprefix_dark_mode_html_class(); ?>">
```


Some interesting things I discovered when playing with this simple snippet:

* Setting a path in the cookie is critical to future maintenance of your ‘dark mode’ functionality. If you aren’t careful to set this, cookies will be assumed on the path where the dark mode was triggered, which could cause page navigation changes to lose the dark mode preference. If two cookies exist, the broader path will not be read without some additional checks.
* Setting a blank value is required to reset the value of cookies in most cases, unless the cookie is allowed to expire
* The cookie will expire based on session, so typically will not persist past 20 minutes after a session. You can easily modify this by setting an `;expires=<UTCstring>` between the cookie name and the path. In my case, I just wanted to cover the current session a user was in.
* You can easily get really complicated with this:
    * Taking into account a browser/OS dark mode preference
    * Persisting a user preference to a dataset
    * Adding multiple different themes, using CSS variables to swap common values