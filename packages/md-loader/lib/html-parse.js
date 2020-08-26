/**
 * 解析html
 * parseHTML(html, {
		startElement: function (sTagName, oAttrs) {
			// 开始 element
		},
		endElement: function (sTagName) {
			// 结束 element
		},
		characters: function (s) {
			
		},
		comment: function (s) {
		},
	});
 * @param {*} s 
 * @param {*} oHandler 
 */
module.exports = function parseHTML(s, oHandler) {
	let startTagRe = /^<([^>\s\/]+)((\s+[^=>\s]+(\s*=\s*((\"[^"]*\")|(\'[^']*\')|[^>\s]+))?)*)\s*\/?\s*>/m,
		endTagRe = /^<\/([^>\s]+)[^>]*>/m,
		attrRe = /([^=\s]+)(\s*=\s*((\"([^"]*)\")|(\'([^']*)\')|[^>\s]+))?/gm;
	let contentHandler;
	if (oHandler) contentHandler = oHandler;
	var i = 0;
	var res, lc, lm, rc, index;
	var treatAsChars = false;
	var oThis = this;
	while (s.length > 0) {
		// Comment
		if (s.substring(0, 4) == "<!--") {
			index = s.indexOf("-->");
			if (index != -1) {
				contentHandler.comment(s.substring(4, index));
				s = s.substring(index + 3);
				treatAsChars = false;
			} else {
				treatAsChars = true;
			}
		}

		// end tag
		else if (s.substring(0, 2) == "</") {
			if (endTagRe.test(s)) {
				lc = RegExp.leftContext;
				lm = RegExp.lastMatch;
				rc = RegExp.rightContext;

				lm.replace(endTagRe, function () {
					return parseEndTag.apply(oThis, arguments);
				});

				s = rc;
				treatAsChars = false;
			} else {
				treatAsChars = true;
			}
		}
		// start tag
		else if (s.charAt(0) == "<") {
			if (startTagRe.test(s)) {
				lc = RegExp.leftContext;
				lm = RegExp.lastMatch;
				rc = RegExp.rightContext;

				lm.replace(startTagRe, function () {
					return parseStartTag.apply(oThis, arguments);
				});

				s = rc;
				treatAsChars = false;
			} else {
				treatAsChars = true;
			}
		}

		if (treatAsChars) {
			index = s.indexOf("<");
			if (index == -1) {
				contentHandler.characters(s);
				s = "";
			} else {
				contentHandler.characters(s.substring(0, index));
				s = s.substring(index);
			}
		}

		treatAsChars = true;
	}
	/**
	 * 解析开始 tag
	 * @param {*} sTag
	 * @param {*} sTagName
	 * @param {*} sRest
	 */
	function parseStartTag(sTag, sTagName, sRest) {
		var attrs = parseAttributes(sTagName, sRest);
		contentHandler.startElement(sTagName, attrs);
	}
	/**
	 * 解析结束 tag
	 * @param {*} sTag
	 * @param {*} sTagName
	 */
	function parseEndTag(sTag, sTagName) {
		contentHandler.endElement(sTagName);
	}
	/**
	 * 解析多个属性
	 * @param {*} sTagName
	 * @param {*} s
	 */
	function parseAttributes(sTagName, s) {
		var oThis = this;
		var attrs = [];
		s.replace(attrRe, function (a0, a1, a2, a3, a4, a5, a6) {
			attrs.push(parseAttribute(sTagName, a0, a1, a2, a3, a4, a5, a6));
		});
		return attrs;
	}
	/**
	 * 解析属性
	 * @param {*} sTagName
	 * @param {*} sAttribute
	 * @param {*} sName
	 */
	function parseAttribute(sTagName, sAttribute, sName) {
		var value = "";
		if (arguments[7]) value = arguments[8];
		else if (arguments[5]) value = arguments[6];
		else if (arguments[3]) value = arguments[4];

		var empty = !value && !arguments[3];
		return {
			name: sName,
			value: empty ? null : value
		};
	}
};