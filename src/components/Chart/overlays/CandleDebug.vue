<!-- eslint-disable no-restricted-syntax -->
<script>
import { Overlay } from 'trading-vue-js';

export default {
  name: 'CandleDebug',
  mixins: [Overlay],
  methods: {
    legend() {
      return [];
    },
    concatLabels(visualDebug, position) {
      return visualDebug.reduce((p, c) => {
        if (c.type === 'label' && c.position === position) {
          return p + (p.length > 0 ? ', ' : '') + c.label;
        }
        return p;
      }, '');
    },
    drawCircles(layout, ctx, items) {
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'black';
      for (const item of items) {
        this.drawCircle(layout, ctx, item);
      }
      ctx.globalAlpha = 1.0;
    },
    drawLines(layout, ctx, items) {
      // eslint-disable-next-line no-restricted-syntax

      for (const item of items) {
        ctx.strokeStyle = item.color || 'blue';
        ctx.globalAlpha = item.alpha || 0.3;
        ctx.lineWidth = item.width;

        ctx.beginPath();

        const x0 = item.x0 ? layout.t2screen(item.x0) : 0;
        const x1 = item.x1 ? layout.t2screen(item.x1) : layout.width;

        const y0 = item.y0 ? layout.$2screen(item.y0) : 0;
        const y1 = item.y1 ? layout.$2screen(item.y1) : layout.height;

        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);

        ctx.stroke();
      }
    },

    drawCircle(layout, ctx, item) {
      ctx.fillStyle = item.color || 'blue';
      ctx.globalAlpha = item.alpha || 0.3;
      const radius = 5.5 * (item.radius ? item.radius : 1);
      ctx.beginPath();
      const x = layout.t2screen(item.from[0]);
      const y = layout.$2screen(item.from[1]);
      ctx.arc(x, y, radius, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.stroke();
    },
    drawLabels(layout, ctx, candle, items) {
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'black';
      ctx.fillStyle = '#555';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';

      const x = layout.t2screen(candle.openTime);

      const upLabels = this.concatLabels(items, 'top');
      if (upLabels.length > 0) {
        const y = layout.$2screen(candle.high);
        ctx.fillText(upLabels, x, y - 25);
      }

      const dnLabels = this.concatLabels(items, 'bottom');
      if (dnLabels.length > 0) {
        const y = layout.$2screen(candle.low);
        ctx.fillText(dnLabels, x, y + 25);
      }
    },
    drawHorizontalBars(layout, ctx, candle, items) {
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'black';
      for (const item of items) {
        this.drawHorizontalBar(layout, ctx, candle, item);
      }
      ctx.globalAlpha = 1.0;
    },
    drawHorizontalBar(layout, ctx, candle, item) {
      ctx.fillStyle = item.color || 'blue';
      ctx.globalAlpha = item.alpha || 0.3;
      const fromX = layout.t2screen(candle.openTime);
      const toX = layout.t2screen(Date.now());
      const width = Math.abs(toX - fromX);
      const fromY = layout.$2screen(item.fromY);
      const toY = layout.$2screen(item.toY);
      const height = Math.abs(toY - fromY);
      ctx.fillRect(fromX, fromY, width, height);
    },
    filterItems(items) {
      return items.filter((i) => this.filterSources.includes(i.src));
    },
    draw(ctx) {
      const { layout } = this.$props;

      for (const p of this.$props.data) {
        const candle = p[1];

        if (!candle) {
          // eslint-disable-next-line no-continue
          continue;
        }

        const items = this.filterItems(p[2]);

        this.drawCircles(
          layout,
          ctx,
          items.filter((i) => i.type === 'circle')
        );

        this.drawLabels(
          layout,
          ctx,
          candle,
          items.filter((i) => i.type === 'label')
        );

        this.drawLines(
          layout,
          ctx,
          items.filter((i) => i.type === 'line')
        );
      }
    },
    use_for() {
      return ['CandleDebug'];
    },
    data_colors() {
      return [this.color];
    },
    meta_info() {
      return {
        author: 'Igor Kravets',
        version: '1.0.0',
        desc: 'para trading bot CandleDebug view',
        contact: '',
        github: '',
      };
    },
  },
  computed: {
    filterSources() {
      return this.$props.settings.filterSources;
    },
    color() {
      return this.$props.settings.color;
    },
  },
};
</script>
