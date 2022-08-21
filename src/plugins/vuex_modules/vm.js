export default {
    namespaced: true,
    state: () => ({
        timeframes: [],
        symbols: [],
        strategies: [],
        tags: []
    }),
    mutations: {
       setTimeframes(state,timeframes) {
        state.timeframes = timeframes;
       },
       setSymbols(state,symbols) {
        state.symbols = symbols;
       },
       setStrategies(state,strategies) {
        state.strategies = strategies;
       },
       setTags(state,tags) {
        state.tags = tags;
       }
    },
    actions: {
        queryAll()
        {
            this._vm.$socket.emit('get_timeframes');
            this._vm.$socket.emit('get_symbols');
            this._vm.$socket.emit('get_strategies');
            this._vm.$socket.emit('get_tags');
        },
        SOCKET_timeframes:
            { root: true, handler (context, data) { context.commit('setTimeframes',data); } },
        SOCKET_symbols:
            { root: true, handler (context, data) { context.commit('setSymbols',data); } },
        SOCKET_strategies:
            { root: true, handler (context, data) { context.commit('setStrategies',data); } },
        SOCKET_tags:
            { root: true, handler (context, data) { context.commit('setTags',data); } },
        },
    getters: {
    }
}
