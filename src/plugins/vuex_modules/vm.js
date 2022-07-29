export default {
    namespaced: true,
    state: () => ({
        timeframes: [],
        symbols: [],
        strategies: []
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
       }
    },
    actions: {
        queryAll()
        {
            this._vm.$socket.emit('get_timeframes');
            this._vm.$socket.emit('get_symbols');
            this._vm.$socket.emit('get_strategies');
        },
        SOCKET_timeframes:
            { root: true, handler (context, data) { context.commit('setTimeframes',data); } },
        SOCKET_symbols:
            { root: true, handler (context, data) { context.commit('setSymbols',data); } },
        SOCKET_strategies:
            { root: true, handler (context, data) { context.commit('setStrategies',data); } },

        },
    getters: {
    }
}
