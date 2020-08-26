const loaderUtils = require("loader-utils");
const MarkdownIt = require("markdown-it");
const path = require("path");
const markdownItAnchor = require("markdown-it-anchor");
const frontMatter = require("front-matter");
const highlight = require("./highlight");
const linkOpen = require("./link-open");
const cardWrapper = require("./card-wrapper");
const {
	slugify
} = require("transliteration");
const containers = require("./container");
const dome = require("./dome");

function wrapper(content, name) {
	content = cardWrapper(content);
	let {
		output,
		pageScript
	} = dome(content, name);
	return `
    <template>
      <section class="content element-doc">
        ${output.join("")}
      </section>
    </template>
    ${pageScript}
  `;
}

const parser = new MarkdownIt({
		html: true,
		highlight,
	})
	.use(markdownItAnchor, {
		level: 2,
		slugify,
	})
	.use(containers);
module.exports = function (source) {
	let options = loaderUtils.getOptions(this) || {};
	this.cacheable && this.cacheable();
	options = {
		wrapper,
		linkOpen: true,
		...options,
	};

	let fm;

	if (options.enableMetaData) {
		fm = frontMatter(source);
		source = fm.body;
	}

	if (options.linkOpen) {
		linkOpen(parser);
	}
	const resourcePath = path.parse(this.resourcePath);
	let name = resourcePath.name;
	if (name == "README") {
		var reg = '\\'
		if (resourcePath.dir.indexOf(reg) < 0) reg = '/'
		name = resourcePath.dir.split(reg).reverse()[0];
	}
	return options.wrapper(parser.render(source), name.toLowerCase());
};