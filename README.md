# colorDetect

> Transfer rgb color to human color

### usage

PHP

```php
require_once 'colorDetect.class.php';

$cd = new ColorDetect([    // configuration (more config members are more accurate)
  'ff0000'=> 'red',
  '00ff00'=> 'green',
  '0000ff'=> 'blue',
]);

// detect
echo $cd->detect('ee0000');  // get 'red'  
echo $cd->detect('#ee0000');  
```

javascript

```javascript
var cd = ColorDetect({    //configuration (more config members are more accurate)
    'ff0000': 'red',
    '00ff00': 'green',
    '0000ff': 'blue'
  });
  alert(cd.detect('ff0000'));   //red
  alert(cd.detect('#aa0000'));   //red
```

[demo](https://jsfiddle.net/a408115319/hexnyLt0/)
