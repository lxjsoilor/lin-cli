<template>
	<div class="">
		<input @keyup="changeInput" v-model="searchValue" class="search-query" placeholder="搜索文档" />
		<div class="v-popover" v-show="showList.length > 0">
			<ul>
				<li v-for="(item, idx) in showList" :key="idx">
					<div class="v-list">
						<div class="v-list-title" @click="handleItem(item)" v-html="highlight(item.characters)"></div>
						<div class="v-list-item">
							<ul>
								<li v-for="(itemx, index) in item.children" :key="index">
									<div v-html="highlight(itemx.characters)" @click="handleItem(item, itemx)"></div>
								</li>
							</ul>
						</div>
					</div>
				</li>
			</ul>
			<div class="v-popover__arrow"></div>
		</div>
	</div>
</template>

<script>
import { config, documents } from "site-shared";
const { locales, defaultLang } = config.site;
export default {
	name: "Search",
	props: {},
	data() {
		return {
			list: this.parseHtml(),
			showList: [],
			searchValue: "",
		};
	},
	methods: {
		handleItem(item, child) {
			const obj = {
				path: item.path,
			};
			if (child) {
				console.log(child);
				const tag = child.attrs.map((item) => {
					if (item.name === "id") return item.value;
				});
				obj.path = item.path + "#" + tag;
			}
			this.$router.push(obj);
			this.showList = [];
			this.searchValue = "";
		},
		highlight(txt) {
			// 匹配关键字正则
			let replaceReg = new RegExp(this.searchValue, "g");
			// 高亮替换v-html值
			let replaceString = '<span class="search-text">' + this.searchValue + "</span>";
			// 开始替换
			return txt.replace(replaceReg, replaceString);
		},
		changeInput(e) {
			const temp = [];
			if (!this.searchValue) {
				this.showList = [];
				return;
			}
			this.list.forEach((item) => {
				const temp1 = JSON.parse(JSON.stringify(item));
				if (item.children.length > 0) {
					temp1.children = item.children.filter((items) => {
						return items.characters.indexOf(this.searchValue) > -1;
					});
				}
				if (temp1.children.length > 0) {
					temp.push(temp1);
				} else if (item.characters.indexOf(this.searchValue) > -1) {
					temp.push(temp1);
				}
			});
			this.showList = temp;
		},
		parseHtml() {
			const list = locales[defaultLang].nav;
			const HtmlTags = JSON.parse(localStorage.getItem("TIGER_HTML_TAGS") || "{}");
			let arr = [];
			list.forEach((item) => {
				if (item.path) {
					arr.push({
						path: item.path,
						characters: item.title,
						children: HtmlTags[item.path.toLowerCase()],
					});
				}
				if (item.items) {
					item.items.forEach((items) => {
						if (items.path) {
							arr.push({
								path: items.path,
								characters: items.title,
								children: HtmlTags[items.path.toLowerCase()],
							});
						}
					});
				}
			});
			return arr;
		},
	},
};
</script>

<style lang="less">
.search-query {
	height: 30px;
	line-height: 30px;
	box-sizing: border-box;
	padding: 0 15px 0 30px;
	border: 1px solid #e3e3e3;
	color: #273849;
	outline: none;
	border-radius: 15px;
	margin-right: 10px;
	transition: border-color 0.2s ease;
	background: #fff url(https://cn.vuejs.org/images/search.png) 8px 5px no-repeat;
	background-size: 20px;
	vertical-align: middle !important;
	&:focus {
		border: 1px solid #409eff;
	}
}
.v-popover {
	margin-top: 12px;
	right: 10px;
	position: absolute;
	background: #fff;
	min-width: 150px;
	border-radius: 4px;
	border: 1px solid #ebeef5;
	padding: 12px;
	z-index: 2000;
	color: #606266;
	line-height: 1.4;
	text-align: justify;
	font-size: 14px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	word-break: break-all;
	&__arrow {
		position: absolute;
		display: block;
		width: 0;
		height: 0;
		border-color: transparent;
		border-style: solid;
		top: -12px;
		left: 70%;
		margin-right: 3px;
		border-top-width: 0;
		border-bottom-color: #ebeef5;
		border-width: 6px;
		filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
		&::after {
			position: absolute;
			content: " ";
			border-width: 6px;
			display: block;
			width: 0;
			height: 0;
			border-color: transparent;
			border-style: solid;
			top: 1px;
			margin-left: -6px;
			border-top-width: 0;
			border-bottom-color: #fff;
		}
	}
	ul {
		padding-left: 0;
	}
	li {
		list-style-type: none;
		padding: 5px;
		border-top: 1px solid #ccc;
		&:first-child {
			border: 0;
		}
	}
	.v-list {
		display: flex;
		justify-content: center;
		&-title {
			width: 150px;
			padding: 5px;
			cursor: pointer;
			border-right: 1px solid #ccc;
			text-align: right;
		}
		&-item {
			min-width: 250px;
			li {
				cursor: pointer;
				margin-left: 5px;
			}
		}
		.search-text {
			color: #409eff;
			font-weight: 700;
		}
	}
}
</style>
