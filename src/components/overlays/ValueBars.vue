<script>
    
import { Overlay } from 'trading-vue-js'

export default {
    name: 'ValueBars',
    mixins: [Overlay],
    methods: {
        legend() { return [] },
    
        drawHorizontalBar(layout,ctx,item) {
            ctx.fillStyle = item.color || 'grey';
            ctx.globalAlpha = item.alpha || 0.3;
            let fromX = layout.t2screen(item.fromX)
            let toX = layout.t2screen(Date.now())
            let width = Math.abs(toX-fromX);
            let fromY = layout.$2screen(item.fromY)
            let toY = layout.$2screen(item.toY)
            let height = toY-fromY;
            ctx.fillRect(fromX,fromY,width,height)
            
        },
        draw(ctx) {
            let layout = this.$props.layout
  
            for (var vd of this.$props.settings.bars) {
                this.drawHorizontalBar(layout,ctx,vd)
            }
            
            ctx.globalAlpha = 1.0;

        },
        use_for() { return ['ValueBars'] },
        data_colors() { return [this.color] },
        meta_info() {
            return {
                author:     'Igor Kravets',
                version:    '1.0.0',
                desc:       'para trading bot ValueBars view',
                contact:    '',
                github:     ''
            }
        },
    },
    computed: {
        color() {
            return this.$props.settings.color
        }
    }
}

</script>
