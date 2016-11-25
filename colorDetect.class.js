/*
Source PHP Code:https://github.com/Elity/colorDetect
Examp:
var cd = ColorDetect({ 
  'ff0000': 'red',
  '00ff00': 'green',
  '0000ff': 'blue'
});
console.log(cd.detect('ff0000'));   //red
console.log(cd.detect('#aa0000'));   //red
 */

var ColorDetect = (function () {
	function _(colorConfig) {
		this.colorConfig = colorConfig || {}
		this.labCache = {}
	}

	_.prototype.detect = function (rgbColor) {
		rgbColor = rgbColor.replace(/[\s#]+/, '');
		if (!rgbColor.match(/^[0-9a-f]{6}$/i)) {
			throw new Error('Error color:' + rgbColor)
		}
		labColorArr = this.labCache[rgbColor] || this.rgb2lab(rgbColor);
		var minDeltaE = 101,
		similarRgb;
		for (var everRgb in this.colorConfig) {
			var thelabColorArr = this.labCache[everRgb] || this.rgb2lab(everRgb),
			theDeltaE = this.deltaE(labColorArr, thelabColorArr);
			this.labCache[everRgb] = thelabColorArr;
			if (theDeltaE <= minDeltaE) {
				minDeltaE = theDeltaE;
				similarRgb = everRgb;
			}
		}
		return this.colorConfig[similarRgb];

	};
	_.prototype.rgb2lab = function (rgbColor) { // rgbColor   ff0000
		var rgb = [],
		i = 0;
		while (p = rgbColor.slice(i, i + 2)) {
			i += 2;
			rgb.push(parseInt(p, 16))
		}
		var r = rgb[0] / 255,
		g = rgb[1] / 255,
		b = rgb[2] / 255,
		x,
		y,
		z;
		r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
		g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
		b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

		x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
		y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
		z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

		x = (x > 0.008856) ? Math.pow(x, 1 / 3) : (7.787 * x) + 16 / 116;
		y = (y > 0.008856) ? Math.pow(y, 1 / 3) : (7.787 * y) + 16 / 116;
		z = (z > 0.008856) ? Math.pow(z, 1 / 3) : (7.787 * z) + 16 / 116;

		return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
	};

	_.prototype.deltaE = function (labA, labB) { // [xx,xx,xx]
		var deltaL = labA[0] - labB[0];
		var deltaA = labA[1] - labB[1];
		var deltaB = labA[2] - labB[2];
		var c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
		var c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
		var deltaC = c1 - c2;
		var deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
		deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
		var sc = 1.0 + 0.045 * c1;
		var sh = 1.0 + 0.015 * c1;
		var deltaLKlsl = deltaL / (1.0);
		var deltaCkcsc = deltaC / (sc);
		var deltaHkhsh = deltaH / (sh);
		var i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
		return i < 0 ? 0 : Math.sqrt(i);
	};

	function wrap(colorConfig) {
		this.instanc = new _(colorConfig);
	}

	wrap.prototype.detect = function (rgbColor) {
		return this.instanc.detect(rgbColor)
	};

	return function (colorConfig) {
		return new wrap(colorConfig)
	}
})();