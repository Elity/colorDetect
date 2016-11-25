# colorDetect

> Transfer rgb colors to human color

### usage

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

