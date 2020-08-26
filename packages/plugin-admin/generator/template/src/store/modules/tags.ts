import { MutationTree, ActionTree } from 'vuex';
import { Cache, CacheTypeEnum } from '@/utils/cache';

interface TagType {
	/**
	 * 标题名称
	 */
	label: string;
	/**
	 * 标题的路径
	 */
	value: string;
	/**
	 * 标题的路径参数
	 */
	params?: string;
	/**
	 * 标题的参数
	 */
	query?: string;
	/**
	 * 额外参数
	 */
	meta?: object;
	/**
	 * 分组
	 */
	group?: any[];
}

interface TagsType {
	tags: TagType[];
	tag: TagType;
}

const state: TagsType = {
	tags: (Cache.get('TAGS') as TagType[]) || [{ label: '首页', value: '/home' }],
	tag: {
		label: '',
		value: '',
		params: '',
		query: '',
		meta: {},
		group: [],
	},
};
const getters = {
	tags: () => state.tags,
	tag: () => state.tag,
};
const actions: ActionTree<TagsType, any> = {};

const mutations: MutationTree<TagsType> = {
	/**
	 * 添加一个 tag
	 */
	SET_TAG: (state: TagsType, tag: TagType) => {
		state.tag = tag;
		if (!state.tags.some((el: TagType) => el.value === tag.value)) {
			state.tags.push(tag);
			Cache.set('TAGS', state.tags, CacheTypeEnum.session);
		}
	},
	/**
	 * 删除一个 tag
	 */
	DEL_TAG: (state: TagsType, value: string) => {
		state.tags = state.tags.filter(item => item.value != value);
		Cache.set('TAGS', state.tags, CacheTypeEnum.session);
	},
	/**
	 * 删除所有的 tag
	 */
	DEL_TAGS: () => {
		state.tag = state.tags[0];
		state.tags = [state.tags[0]];
		Cache.remove('TAGS', CacheTypeEnum.session);
	},
	/**
	 * 删除别的 tag
	 */
	DEL_TAGS_OTHER: (state: TagsType, tag: TagType) => {
		state.tags = [state.tags[0], tag];
		Cache.set('TAGS', state.tags, CacheTypeEnum.session);
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
