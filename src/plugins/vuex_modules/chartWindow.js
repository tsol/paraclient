export default {
    namespaced: true,
    state: () => ({
        isOpen: false,
        tickerId: '',
        candles: [],
        cdebug: [],
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
        setCdebug(state, cdebug) {
            state.cdebug = cdebug;
        },
        setFlags(state, flags) {
            
            state.flags = flags || {};
            if (! state.flags.vlevels_high ) {
                state.flags.vlevels_high = [];
            }
            console.log('SET FLAGS',state.flags);
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
        openEntryChart(context, { tickerId, entryTime, entryId })
        {
            this._vm.$socket.emit('get_chart', { 
                tickerId: tickerId,
                timestamp: entryTime
            });

            this._vm.$socket.emit('get_entry', { entryId: entryId });
            
            context.commit('setMoveTo', entryTime );
        },
        SOCKET_entry: {
            root: true,
            handler (context, entryData) {
                if (entryData.flags) {
                    context.commit('setFlags',entryData.flags);
                }          
            }
        },
        SOCKET_chart: {
            root: true,
            handler (context, data) {
                context.commit('setTickerId',data.id);
                context.commit('setCandles',data.candles)
                context.commit('setCdebug',data.cdebug);
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
