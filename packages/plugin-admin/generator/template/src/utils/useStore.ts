import { provide, inject } from '@vue/composition-api';
import { Store } from 'vuex';
const StoreSymbol = Symbol();
export function provideStore(store: Store<any>) {
	provide(StoreSymbol, store);
}

export function useStore() {
	const store = inject(StoreSymbol);
	if (!store) {
		throw '获取不到 store, 请设置 provideStore';
	}
	return store as Store<any>;
}
