export default {
    namespaced: true,
    state: () => ({
        isOpen: false,
        tickerId: '',
        candles: [],
        flags: {},
        displaySources: [],
        moveTo: null,
        keepFlags: false
    }),
    mutations: {
        openWindow(state, open) {
                state.isOpen = open;
        },
        toggleOn(state, sourcesArray) {
/*
            sourcesArray.forEach(element => {
                if (! state.displaySources.includes(element)) {
                    state.displaySources.push(element);
                }
            });
*/
            state.displaySources = sourcesArray;
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
        setMoveTo(state, { flags, moveTo }) {
            state.flags = flags;
            state.keepFlags = true;
            state.moveTo = moveTo;
        },
        resetMoveTo(state) {
            state.keepFlags = false;
            state.moveTo = null;
        }
    },
    actions: {
        openRecent(context,  tickerId )
        {
            context.commit('resetMoveTo');
            this._vm.$socket.emit('get_chart', { tickerId: tickerId } );

        },
        openHistory(context, { tickerId, moveTo, flags })
        {
            this._vm.$socket.emit('get_chart', { 
                tickerId: tickerId,
                timestamp: moveTo
            });
            context.commit('setMoveTo', {
                flags: flags,
                moveTo: moveTo
            });
        },
        SOCKET_chart: {
            root: true,
            handler (context, data) {
                context.commit('setTickerId',data.id);
                context.commit('setCandles',data.candles);
                if ( ! context.state.keepFlags) {
                    context.commit('setFlags',data.flags);
                }
                context.commit('openWindow',true);          
            }
        }

    },
    getters: {
    }
}
