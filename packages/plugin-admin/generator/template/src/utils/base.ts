import { Component, Vue } from 'vue-property-decorator';
import { Message } from 'element-ui';
export { Component, Vue };

/**
 * 一个 标准的 curd
 */
@Component
export default class Base extends Vue {
	/**
	 * 是否显示抽屉
	 */
	drawer = false;

	/**
	 * 基础数据
	 */
	baseOptions: any;

	/**
	 * 动作类型
	 */
	action = 'post';

	/**
	 * 表单数据
	 */
	model = {};

	/**
	 * 查询条件
	 */
	searchParams = {};

	/**
	 * table 头部
	 */
	columns: any;

	/**
	 * url
	 */
	baseUrl: string | null = null;

	/**
	 *  分页设置
	 */
	pagination = {
		pageSize: 2,
		layout: 'total, sizes, prev, pager, next, jumper',
		pageSizes: [2, 200, 300, 400],
		// background: false,
	};

	/**
	 * 是否是详情页
	 */
	isDetail = false;

	/**
	 * 继承方法
	 * @param method
	 */
	super(method: string) {
		// @ts-ignore
		this.constructor.super.options.methods[method].call(this);
	}

	/**
	 * 搜索表单
	 */
	get formOptions() {
		const option = JSON.parse(JSON.stringify(this.baseOptions));
		return Object.assign(option, {
			hideButtons: false,
			inline: true,
			inlineDir: 'right',
			labelWidth: 'auto',
			submitText: '搜索',
			emptyText: '重置',
			submit: async (model: any, done: Function) => {
				// @ts-ignore
				await this.$refs.table.remoteData(model);
				done();
			},
		});
	}

	/**
	 * 弹窗标题
	 */
	get textByType() {
		return this.action === 'post' ? '新增' : this.action === 'put' ? '编辑' : '查看';
	}

	/**
	 * 新增、编辑、查看表单配置
	 */
	get options() {
		const temp = Object.assign(this.baseOptions, { isDetail: this.isDetail, hideButtons: true });
		return JSON.parse(JSON.stringify(temp));
	}

	/**
	 * 列表查询
	 * @param params
	 */
	loadData(params: any) {
		return this.$store.dispatch('crud/post', {
			api: `${this.baseUrl}/list`,
			data: params,
		});
	}

	/**
	 * 新增数据
	 */
	public add() {
		this.drawer = true;
		this.isDetail = false;
		this.action = 'post';
	}

	/**
	 * 编辑更新数据
	 */
	update(id: string) {
		this.drawer = true;
		this.action = 'put';
		this.isDetail = false;
		this.curd('get', { id });
	}

	/**
	 * 查看数据
	 * @param id
	 */
	view(id: string) {
		this.drawer = true;
		this.isDetail = true;
		this.curd('get', { id });
		this.action = 'view';
	}

	/**
	 * 增删查改
	 * @param type
	 * @param data
	 */
	async curd(type: string, data: any) {
		if (this.action == 'view') {
			this.drawer = false;
			return;
		}
		const res = await this.$store.dispatch(`crud/${type}`, {
			api: this.baseUrl,
			data,
		});
		if (res.code === 0 && type !== 'get') {
			this.drawer = false;
			// @ts-ignore
			this.$refs.table.remoteData(this.searchParams);
			Message.success(`${type === 'put' ? '更新' : type === 'post' ? '新增' : '删除'}数据成功`);
		}
	}

	/**
	 * 转化数据位table columns
	 * @param columns
	 */
	parseTableColumns(columns: Array<any>) {
		columns = columns.map((item: any) => {
			return {
				prop: item.data,
				label: item.title,
			};
		});
		columns.push({
			prop: 'action',
			label: '操作',
			width: 220,
		});
		return columns;
	}
}
