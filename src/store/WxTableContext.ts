import type {InjectionKey} from 'vue'

export type WxTableCtx = { storageKey: string }
export const WxTableContext: InjectionKey<WxTableCtx> = Symbol('DtKitContext')
