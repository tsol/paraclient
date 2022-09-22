<script>
    
import { Overlay } from 'trading-vue-js'

export default {
    name: 'Entries',
    mixins: [Overlay],
    methods: {
        legend() { return [] },
        drawEntryBox(layout,ctx,
            { entryPrice, takeProfit, stopLoss,
             openTime, closeTime, text })
        {

            ctx.lineWidth = 1.5
            ctx.globalAlpha = 0.1;
            ctx.strokeStyle = 'black'

            const fromX = layout.t2screen(openTime)
/*
            const candleWidth = layout.t2screen(candleCloseTime) -
                layout.t2screen(candleOpenTime);
            const widthX = 10 * candleWidth; // todo: come up with somth more clever
*/
            const widthX = layout.t2screen(closeTime) - layout.t2screen(openTime);
            const middleY = layout.$2screen(entryPrice);
            const takeProfitY = layout.$2screen(takeProfit);
            const stopLossY = layout.$2screen(stopLoss);

            ctx.fillStyle = 'red';
            ctx.fillRect(fromX,stopLossY,widthX,(middleY-stopLossY));

            ctx.fillStyle = 'green';
            ctx.fillRect(fromX,middleY,widthX,(takeProfitY-middleY));

            ctx.globalAlpha = 0.8;

            ctx.lineWidth = 1.5
            ctx.strokeStyle = 'black'
            ctx.fillStyle = '#555'
            ctx.font = '10px Arial'
            ctx.textAlign = 'center'

            let x = fromX+widthX/2;
            let y = takeProfitY+10;
                    
            ctx.fillText(text, x, y )
        },
        draw(ctx) {
            let layout = this.$props.layout
            this.$props.data.forEach( d => 
                this.drawEntryBox(layout,ctx,d[1]) );
        },
        use_for() { return ['Entries'] },
        data_colors() { return [this.color] },
        meta_info() {
            return {
                author:     'Igor Kravets',
                version:    '1.0.0',
                desc:       'para trading bot Entries view',
                contact:    '',
                github:     ''
            }
        },
    },
    computed: {
        color() {
            return this.$props.settings.color || 'black';
        }
    }
}

</script>
