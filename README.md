<p align="center">
  <img alt="Los Scrollos" src="https://raw.githubusercontent.com/azhsetiawan/assets/master/los-scrollos.png" width="280">
</p>

<p align="center">
  Simple jQuery plugins for scrolling overflow content
</p>

## <p align="center"></p>

## About

Loss Scrolloss is jquery plugin for simple scrolling overflow content

## Instalation

Just `clone` or `download` this repository or files that you necessary needed

#### Include CSS

First, include CSS files into your HTML head:

```
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css"/>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"/>
<link rel="stylesheet" href="path/to/scrollos.min.css">
```

#### Include JS

Los Scrollos depend to [jQuery](https://code.jquery.com/) and sould be included, copy this CDN source to latest version if you don't have included. Set `scrollos.min.js` to your path.

```
<script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
<script src="path/to/scrollos.min.js"></script>
```

## How to use

Make sure CSS and JS files have installed properly and let's get started.

#### Set HTML

Just copy this HTML element and change the content inside `.scrollos-content` with your element.

```
<div class="scrollos-wrapper" id="example">
  <div class="scrollos-container" data-overflowing="none">
    <div class="scrollos-content">
      <div class="item"><img src="path/to/your-image.jpg" alt="item"/></div>
      <div class="item"><img src="path/to/your-image.jpg" alt="item"/></div>
      <div class="item"><img src="path/to/your-image.jpg" alt="item"/></div>
      ...
    </div>
  </div>
  <div class="scrollos-nav scrollos-prev"><i class="fa fa-chevron-left"></i></div>
  <div class="scrollos-nav scrollos-next"><i class="fa fa-chevron-right"></i></div>
</div>
```

#### Call Scrollos

Now call the Los Scrollos initializer function, put code below to your javascript file or on the bottom of your document HTML.

```
<script>
  $( function () {
    $('#example').Scrollos();
  });
</script>
```

Now your Los Scrollos is ready!

&nbsp;

### Copyright and license

Copyright &copy; 2018 Azh Setiawan

Code released under the [MIT License](https://github.com/azhsetiawan/los-scrollos/blob/master/LICENSE)

```

```
