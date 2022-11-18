<!-- eslint-disable no-restricted-syntax -->
<script>
import { Overlay } from 'trading-vue-js';

export default {
  name: 'ValueBars',
  mixins: [Overlay],
  methods: {
    legend() {
      return [];
    },
    drawHorizontalBar(layout, ctx, item) {
      ctx.fillStyle = item.color || this.color;
      ctx.globalAlpha = item.alpha || 0.3;
      const fromX = layout.t2screen(item.x0);
      const toX = layout.t2screen(Date.now());
      const width = Math.abs(toX - fromX);
      const fromY = layout.$2screen(item.y0);
      const toY = layout.$2screen(item.y1);
      const height = toY - fromY;
      ctx.fillRect(fromX, fromY, width, height);

      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = 'black';
      ctx.fillStyle = '#555';
      ctx.font = '10px Arial';

      ctx.fillText(
        `${item.w} (${item.s}/${item.r}) [${item.sW}/${item.rW}]`,
        toX + 10,

        fromY + height / 2
      );
    },
    draw(ctx) {
      const { layout } = this.$props;
      if (!this.$props.settings.bars) {
        return;
      }
      for (const vd of this.$props.settings.bars) {
        this.drawHorizontalBar(layout, ctx, vd);
      }
    },
    use_for() {
      return ['ValueBars'];
    },
    data_colors() {
      return [this.color];
    },
    meta_info() {
      return {
        author: 'Igor Kravets',
        version: '1.0.0',
        desc: 'para trading bot ValueBars view',
        contact: '',
        github: '',
      };
    },
  },
  computed: {
    color() {
      return this.$props.settings.color || 'grey';
    },
  },
};
</script>
