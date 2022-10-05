<script>

import { Overlay } from 'trading-vue-js';

export default {
  name: 'ATR',
  mixins: [Overlay],
  methods: {
    draw(ctx) {
      const { layout } = this.$props;
      ctx.strokeStyle = this.color;
      ctx.beginPath();

      // eslint-disable-next-line no-restricted-syntax
      for (const p of this.$props.data) {
        const x = layout.t2screen(p[0]);
        const y = layout.$2screen(p[1]);
        ctx.lineTo(x, y);
      }

      ctx.stroke();
    },
    use_for() { return ['ATR']; },
    data_colors() { return [this.color]; },
    meta_info() {
      return {
        author: 'Igor Kravets',
        version: '1.0.0',
        desc: 'para trading bot: My Simple Line',
        contact: '',
        github: '',
      };
    },
  },
  computed: {
    color() {
      return this.$props.settings.color;
    },
  },
};

</script>
