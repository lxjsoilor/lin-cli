const {
	stripScript,
	stripTemplate,
	genInlineComponentText
} = require("./util");
// const { parse } = require("vue/dist/"); // /src/compiler/parser

const parseHTML = require("./html-parse");

/**
 * 解析 tiger-demoe 下的数据
 */
module.exports = function (content, name) {
	const startTag = "<!--tiger-demo:";
	const startTagLen = startTag.length;
	const endTag = ":tiger-demo-->";
	const endTagLen = endTag.length;

	let componenetsString = "";
	let id = 0; // demo 的 id
	let output = []; // 输出的内容
	let start = 0; // 字符串开始位置

	let commentStart = content.indexOf(startTag);
	let commentEnd = content.indexOf(endTag, commentStart + startTagLen);
	while (commentStart !== -1 && commentEnd !== -1) {
		output.push(content.slice(start, commentStart));

		const commentContent = content.slice(commentStart + startTagLen, commentEnd);
		const html = stripTemplate(commentContent);
		const script = stripScript(commentContent);
		let demoComponentContent = genInlineComponentText(html, script);
		const demoComponentName = `tiger-demo${id}`;
		output.push(`<template slot="source"><${demoComponentName} /></template>`);
		componenetsString += `${JSON.stringify(demoComponentName)}: ${demoComponentContent},`;

		// 重新计算下一次的位置
		id++;
		start = commentEnd + endTagLen;
		commentStart = content.indexOf(startTag, start);
		commentEnd = content.indexOf(endTag, commentStart + startTagLen);
	}

	let pageScript = "";
	if (componenetsString) {
		pageScript = `<script>
      export default {
        name: 'component-doc',
        components: {
          ${componenetsString}
        },
        mounted() {
          const anchors = [].slice.call(this.$el.querySelectorAll('h2, h3, h4, h5'));
          anchors.forEach(anchor => {
            anchor.addEventListener('click', this.scrollToAnchor);
          });
        },
		
        methods: {
          scrollToAnchor(event) {
            if (event.target.id) {
              this.$router.push({
                path: this.$route.path,
                hash: event.target.id
              })
            }
          }
        }
      }
    </script>`;
	} else if (content.indexOf("<script>") === 0) {
		// 硬编码，有待改善
		start = content.indexOf("</script>") + "</script>".length;
		pageScript = content.slice(0, start);
	} else {
		pageScript = "<script></script>";
	}
	output.push(content.slice(start));
	const arr = getHtmlTags(output.join(""));
	const temp = ` 
		let tigerHtmlTags =  JSON.parse(localStorage.getItem("TIGER_HTML_TAGS") || "{}");
		tigerHtmlTags['${name}'] =  ${JSON.stringify(arr)} 
		localStorage.setItem("TIGER_HTML_TAGS", JSON.stringify(tigerHtmlTags));	
  `;
	const pageScriptIndex = pageScript.indexOf("<script>") + "<script>".length;
	pageScript = pageScript.slice(0, pageScriptIndex) + temp + pageScript.slice(pageScriptIndex);
	return {
		pageScript,
		output
	};
};

function getHtmlTags(html) {
	var data = [];
	var obj = {};
	parseHTML(html, {
		startElement: function (sTagName, oAttrs) {
			obj.tag = sTagName;
			obj.attrs = oAttrs;
		},
		endElement: function (sTagName) {
			data.push(obj);
			obj = {};
		},
		characters: function (s) {
			obj.characters = s;
		},
		comment: function (s) {
			obj.comment = s;
		},
	});
	return data.filter((i) => /h3|h2|h1/.test(i.tag));
}