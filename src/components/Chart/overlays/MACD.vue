<!-- eslint-disable no-restricted-syntax -->
<script>
import { Overlay } from 'trading-vue-js';

export default {
  name: 'MACD',
  mixins: [Overlay],
  methods: {
    meta_info() {
      return {
        author: 'StdSquad',
        version: '1.0.2',
        desc: 'Moving Average Convergence/Divergence - ripped by Harry',
      };
    },
    draw(ctx) {
      const { layout } = this.$props;

      // HISTOGRAM
      const base = layout.$2screen(0) + 0.5;
      const off = this.hist_width % 2 ? 0 : 0.5;
      ctx.lineWidth = this.hist_width;
      ctx.strokeStyle = this.color;
      ctx.beginPath();
      for (const p of this.$props.data) {
        const x = layout.t2screen(p[0]) - off;
        const y = layout.$2screen(p[1]) - 0.5;
        const c = p[1] > 0 ? 0 : 2;
        ctx.strokeStyle = this.hist_colors[c];
        ctx.beginPath();
        ctx.moveTo(x, base);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
      // MACD LINE
      ctx.beginPath();
      ctx.lineWidth = this.macd_width;
      ctx.strokeStyle = this.macd_color;
      for (const p of this.$props.data) {
        const x = layout.t2screen(p[0]);
        const y = layout.$2screen(p[2]);
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      // SIGNAL LINE
      ctx.beginPath();
      ctx.lineWidth = this.signal_width;
      ctx.strokeStyle = this.signal_color;
      for (const p of this.$props.data) {
        const x = layout.t2screen(p[0]);
        const y = layout.$2screen(p[3]);
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    },
    use_for() {
      return ['MACD'];
    },
    pretty(num) {
      return num.toFixed(Math.abs(num) > 0.001 ? 4 : 8);
    },
    legend(values) {
      return [
        { value: this.pretty(values[1]), color: values[1].h > 0 ? 'green' : 'red' },
        { value: this.pretty(values[2]), color: this.macd_color },
        { value: this.pretty(values[3]), color: this.signal_color },
      ];
    },
  },
  // Define internal setting & constants here
  computed: {
    sett() {
      return this.$props.settings;
    },
    hist_width() {
      return this.sett.histWidth || 4;
    },
    macd_width() {
      return this.sett.macdWidth || 1;
    },
    signal_width() {
      return this.sett.signalWidth || 1;
    },
    color() {
      return this.sett.defColor || '#42b28a';
    },
    macd_color() {
      return this.sett.macdColor || '#3782f2';
    },
    signal_color() {
      return this.sett.signalColor || '#f48709';
    },
    hist_colors() {
      return this.sett.histColors || ['#35a776', '#79e0b3', '#e54150', '#ea969e'];
    },
  },
};
</script>
