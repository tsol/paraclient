<script>
    
import { Overlay } from 'trading-vue-js'

export default {
    name: 'CandleDebug',
    mixins: [Overlay],
    methods: {
        legend() { return [] },
        concatLabels(visualDebug,position) {
            return visualDebug.reduce( (p, c) => {
                if ( (c.type === 'label') && (c.position === position) ) 
                    { return p + ( p.length > 0 ? ', ' : '')+c.label; }
                return p;
            },'');
        },
        drawCircles(layout,ctx,items) {
            ctx.lineWidth = 1.5
            ctx.strokeStyle = 'black'
            for (let item of items) {
                this.drawCircle(layout,ctx,item);
            }
            ctx.globalAlpha = 1.0;
        },
        drawCircle(layout,ctx,item) {
            ctx.fillStyle = item.color || 'blue';
            ctx.globalAlpha = item.alpha || 0.3;
            let radius = 5.5 * (item.radius ? item.radius : 1);  
            ctx.beginPath()
            let x = layout.t2screen(item.from[0])
            let y = layout.$2screen(item.from[1])
            ctx.arc(x, y, radius, 0, Math.PI * 2, true)
            ctx.fill()
            ctx.stroke()   
        },
        drawLabels(layout,ctx,candle,items) {

            ctx.lineWidth = 1.5
            ctx.strokeStyle = 'black'
            ctx.fillStyle = '#555'
            ctx.font = '16px Arial'
            ctx.textAlign = 'center'

            let x = layout.t2screen(candle.openTime)
                    
            const upLabels = this.concatLabels(items,'top');
            if (upLabels.length > 0) {
                let y = layout.$2screen(candle.high);
                ctx.fillText(upLabels , x, y - 25 )
            }

            const dnLabels = this.concatLabels(items,'bottom');
            if (dnLabels.length > 0) {
                let y = layout.$2screen(candle.low);
                ctx.fillText(dnLabels , x, y + 25 )
            }

        },
        drawHorizontalBars(layout,ctx,candle,items)
        {
            ctx.lineWidth = 1.5
            ctx.strokeStyle = 'black'
            for (let item of items) {
                this.drawHorizontalBar(layout,ctx,candle,item);
            }
            ctx.globalAlpha = 1.0;

        },
        drawHorizontalBar(layout,ctx,candle,item) {
            ctx.fillStyle = item.color || 'blue';
            ctx.globalAlpha = item.alpha || 0.3;
            let fromX = layout.t2screen(candle.openTime)
            let toX = layout.t2screen(Date.now())
            let width = Math.abs(toX-fromX);
            let fromY = layout.$2screen(item.fromY)
            let toY = layout.$2screen(item.toY)
            let height = Math.abs(toY-fromY)
            ctx.fillRect(fromX,fromY,width,height)
            
        },
        drawEntryBox(layout,ctx,candle,item) {

            ctx.lineWidth = 1.5
            ctx.globalAlpha = item.alpha || 0.1;
            ctx.strokeStyle = 'black'

            const fromX = layout.t2screen(candle.openTime)
            const candleWidth = layout.t2screen(candle.closeTime) - layout.t2screen(candle.openTime);
            const widthX = 10 * candleWidth;
            const middleY = layout.$2screen(item.ep || candle.close);
            const takeProfitY = layout.$2screen(item.tp);
            const stopLossY = layout.$2screen(item.sl);

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
                    
            ctx.fillText(item.by , x, y )
            
            
        },
        filterItems(items) {
            return items.filter( i => this.filterSources.includes(i.src) )
        },
        draw(ctx) {
            let layout = this.$props.layout
            
            for (var p of this.$props.data) {

                let candle = p[1];
                let items = this.filterItems(candle.visualDebug);

                this.drawCircles(layout,ctx,items.filter( i => i.type === 'circle'));
                this.drawLabels(layout,ctx,candle,items.filter( i => i.type === 'label'));
                
                items.filter( i => i.type == 'entry' )
                    .forEach( item => this.drawEntryBox(layout,ctx,candle,item) );
                    
            }


        },
        use_for() { return ['CandleDebug'] },
        data_colors() { return [this.color] },
        meta_info() {
            return {
                author:     'Igor Kravets',
                version:    '1.0.0',
                desc:       'para trading bot CandleDebug view',
                contact:    '',
                github:     ''
            }
        },
    },
    computed: {
        filterSources() {
            return this.$props.settings.filterSources;
        },
        color() {
            return this.$props.settings.color
        }
    }
}

</script>
