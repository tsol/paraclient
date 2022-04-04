export default {
    namespaced: true,
    state: () => ({
        isOpen: false,
        tickerId: '',
        candles: [],
        flags: {},
        enabledSources: [],
        moveTo: null,
    }),
    mutations: {
        openWindow(state, open) {
                state.isOpen = open;
        },
        setEnabledSources(state, sourcesArray) {
            state.enabledSources = sourcesArray;
        },
        setTickerId(state, tickerId)
        {
            state.tickerId = tickerId;
        },
        setCandles(state, candles) {
            state.candles = candles;
        },
        setFlags(state, flags) {
            state.flags = flags;
            if (! state.flags.vlevels_high ) {
                state.flags.vlevels_high = [];
            }
        },
        setMoveTo(state, moveTo) {
            state.moveTo = moveTo;
        },
        resetMoveTo(state) {
            state.moveTo = null;
        }
    },
    actions: {
        openRecent(context,  tickerId )
        {
            context.commit('resetMoveTo');
            this._vm.$socket.emit('get_chart', { tickerId: tickerId } );
            this._vm.$socket.emit('get_flags', { tickerId: tickerId } );
        },
        openOrderChart(context, { tickerId, orderTime, orderId })
        {
            this._vm.$socket.emit('get_chart', { 
                tickerId: tickerId,
                timestamp: orderTime
            });

            this._vm.$socket.emit('get_order', { orderId: orderId });
            
            context.commit('setMoveTo', orderTime );
        },
        SOCKET_order: {
            root: true,
            handler (context, orderData) {
                if (orderData.flags) {
                    context.commit('setFlags',orderData.flags);
                }          
            }
        },
        SOCKET_chart: {
            root: true,
            handler (context, data) {
                context.commit('setTickerId',data.id);
                context.commit('setCandles',data.candles);
                context.commit('openWindow',true);          
            }
        },
        SOCKET_chart_flags: {
            root: true,
            handler (context, data) {
                context.commit('setFlags',data);          
            }
        }

    },
    getters: {
    }
}
