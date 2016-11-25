<?php

class ColorDetect
{

    private $colorConfig;
    private $labColorCache = array();
    private $curLabArr = array();
    private $min = 101;  //比较颜色差异的初始值

    /**
     * ColorDetect constructor.
     * @param array $colorConfig 配置颜色数组  ['ff0000'=> 'red', '00ff00'=> 'green', '0000ff'=> 'blue'...]
     */
    public function __construct(array $colorConfig)
    {
        $this->colorConfig = $colorConfig;
    }

    public function detect($rgbStr)
    {
        $rgbStr = preg_replace('/[\s#]+/', '', $rgbStr);
        if (!preg_match('/^[0-9a-f]{6}$/i', $rgbStr))
            throw new ColorDetectError("Wrong Color:{$rgbStr}");

        $this->curLabArr = self::rgb2lab(self::rgbStrToArray($rgbStr));

        $similarColor = array_reduce(array_keys($this->colorConfig), function ($result, $rgbS) {
            $labArr = array_key_exists($rgbS, $this->labColorCache) ? $this->labColorCache[$rgbS] : self::rgb2lab(self::rgbStrToArray($rgbS));
            $deltaE = self::deltaE($labArr, $this->curLabArr);
            if ($deltaE < $this->min) {
                $this->min = $deltaE;
                $result = $this->colorConfig[$rgbS];
            }
            return $result;
        });
        $this->min = 101;  // 恢复比较值
        return $similarColor;
    }

    /**
     * @param $rgbStr string rgb颜色值 不含'#'符号
     * @return array rgb对应的数组
     */
    private static function rgbStrToArray($rgbStr)
    {
        $arr = array();
        $i = 0;
        while ($s = substr($rgbStr, $i, 2)) {
            $arr[] = hexdec($s);
            $i += 2;
        }
        return $arr;
    }

    /**
     * rgb数组转lab数组
     * @param array $rgbArr
     * @return array
     */
    private static function rgb2lab(Array $rgbArr)
    {
        list($r, $g, $b) = array_map(function ($n) {
            $tmp = $n / 255;
            return $tmp > 0.04045 ? pow(($tmp + 0.055) / 1.055, 2.4) : $tmp / 12.92;
        }, $rgbArr);

        $x = ($r * 0.4124 + $g * 0.3576 + $b * 0.1805) / 0.95047;
        $y = ($r * 0.2126 + $g * 0.7152 + $b * 0.0722) / 1.00000;
        $z = ($r * 0.0193 + $g * 0.1192 + $b * 0.9505) / 1.08883;

        list($x, $y, $z) = array_map(function ($n) {
            return $n > 0.008856 ? pow($n, 1 / 3) : (7.787 * $n) + 16 / 116;
        }, array($x, $y, $z));
        return array(
            116 * $y - 16,
            500 * ($x - $y),
            200 * ($y - $z)
        );
    }

    /**
     * 求解俩lab颜色的差值
     * @param array $labA
     * @param array $labB
     * @return float
     */
    private static function deltaE(Array $labA, Array $labB)
    {
        list($deltaL, $deltaA, $deltaB) = array_map(function ($a, $b) {
            return $a - $b;
        }, $labA, $labB);
        $c1 = sqrt($labA[1] ** 2 + $labA[2] ** 2);
        $c2 = sqrt($labB[1] ** 2 + $labB[2] ** 2);
        $deltaC = $c1 - $c2;
        $deltaH = $deltaA ** 2 + $deltaB ** 2 - $deltaC ** 2;
        $deltaH = $deltaH < 0 ? 0 : sqrt($deltaH);
        $sc = 1 + 0.045 * $c1;
        $sh = 1 + 0.015 * $c1;
        $deltaLKlsl = $deltaL / 1.0;
        $deltaCKcsc = $deltaC / $sc;
        $deltaHKhsh = $deltaH / $sh;
        return sqrt($deltaLKlsl ** 2 + $deltaCKcsc ** 2 + $deltaHKhsh ** 2);
    }
}

class ColorDetectError extends Exception{}
