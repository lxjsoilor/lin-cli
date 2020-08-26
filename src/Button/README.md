### 引入

```js
import Vue from "vue";
import { Form } from "@tiger/form";

Vue.use(Form);
```

## 代码演示

### 基本用法

我是一些描述
::: demo

```html
<v-button @click="submit">submit</v-button>
<script>
	export default {
		data() {
			return {
				code: 1,
			};
		},
		methods: {
			submit() {
				console.log(this.code++);
			},
		},
	};
</script>
```

:::

## 代码演示

### 基本用法

我是一些描述
::: demo

```html
<v-button @click="submit">submit</v-button>
<script>
	export default {
		data() {
			return {
				code: 1,
			};
		},
		methods: {
			submit() {
				console.log(this.code++);
			},
		},
	};
</script>
```

:::

## 代码演示

### 基本用法

我是一些描述
::: demo

```html
<v-button @click="submit">submit</v-button>
<script>
	export default {
		data() {
			return {
				code: 1,
			};
		},
		methods: {
			submit() {
				console.log(this.code++);
			},
		},
	};
</script>
```

:::

## 代码演示

### 基本用法

我是一些描述
::: demo

```html
<v-button @click="submit">submit</v-button>
<script>
	export default {
		data() {
			return {
				code: 1,
			};
		},
		methods: {
			submit() {
				console.log(this.code++);
			},
		},
	};
</script>
```

:::

## 代码演示

### 基本用法

我是一些描述
::: demo

```html
<v-button @click="submit">submit</v-button>
<script>
	export default {
		data() {
			return {
				code: 1,
			};
		},
		methods: {
			submit() {
				console.log(this.code++);
			},
		},
	};
</script>
```

:::

## 代码演示

### 基本用法

我是一些描述
::: demo

```html
<v-button @click="submit">submit</v-button>
<script>
	export default {
		data() {
			return {
				code: 1,
			};
		},
		methods: {
			submit() {
				console.log(this.code++);
			},
		},
	};
</script>
```

:::

## 代码演示

### 基本用法

我是一些描述
::: demo

```html
<v-button @click="submit">submit</v-button>
<script>
	export default {
		data() {
			return {
				code: 1,
			};
		},
		methods: {
			submit() {
				console.log(this.code++);
			},
		},
	};
</script>
```

:::

## 代码演示

### 基本用法

我是一些描述
::: demo

```html
<v-button @click="submit">submit</v-button>
<script>
	export default {
		data() {
			return {
				code: 1,
			};
		},
		methods: {
			submit() {
				console.log(this.code++);
			},
		},
	};
</script>
```

:::

### test

-   test
-   test
-   test

1. test
2. test

-   test

### Attributes form 表单属性说明

| 参数          | 说明                                                                     | 类型     | 可选值 | 默认值 |
| ------------- | ------------------------------------------------------------------------ | -------- | ------ | ------ |
| data          | form 表单配置，详情见下面 Data 属性                                      | Object   | —      | —      |
| options       | 组件配置属性，详情见下面 Options 属性                                    | Object   | —      | —      |
| value/v-model | 表单绑定的数据                                                           | Object   | —      | —      |
| submit        | 点击提交按钮执行的方法，参数 1 是返回的表单数据，参数 2 返回的是防重方法 | Function | —      | —      |

### data Attributes 参数说明

| 参数  | 说明                                                                                            | 类型     | 可选值 | 默认值 |
| ----- | ----------------------------------------------------------------------------------------------- | -------- | ------ | ------ |
| title | 表单的标题列字段                                                                                | String   | —      | —      |
| data  | 表单的绑定的参数                                                                                | String   | —      | —      |
| type  | 表单的组件名称（参考 elementui 和 iview 文档），可以是自定义组件（自定义组件名称前缀必须加 c-） | String   | —      | —      |
| props | 表单组件的参数                                                                                  | Object   | —      | —      |
| event | 表单组件的事件                                                                                  | Function | —      | —      |
| span  | 栅格的占位格数，可选值为 0~24 的整数，为 0 时，相当于 display:none                              | Object   | —      | 6      |
| row   | 是否一行显示                                                                                    | Boolean  | —      | false  |

### Options Attributes 参数说明

| 参数          | 说明                                                     | 类型     | 可选值 | 默认值 |
| ------------- | -------------------------------------------------------- | -------- | ------ | ------ |
| isTabs        | 是否为选项卡模式（需要配合分组使用）                     | Boolean  | —      | false  |
| isDetail      | 是否是详情模式                                           | Boolean  | —      | false  |
| disabled      | 表单禁用                                                 | Boolean  | —      | false  |
| packParameter | 对返回的表单数据进行一层包装，使其达到符合提交数据的标准 | Function | —      | —      |
| submitText    | 提交按钮的文字                                           | String   | —      | 提交   |
