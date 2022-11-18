<!-- eslint-disable no-restricted-syntax -->
<script>
import { Overlay } from 'trading-vue-js';

export default {
  name: 'BBANDS',
  mixins: [Overlay],
  methods: {
    draw(ctx) {
      const { layout } = this.$props;

      ctx.strokeStyle = this.colorM;
      ctx.beginPath();
      for (const p of this.$props.data) {
        const x = layout.t2screen(p[0]);
        const y = layout.$2screen(p[1].m);
        ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.strokeStyle = this.colorU;
      ctx.beginPath();
      for (const p of this.$props.data) {
        const x = layout.t2screen(p[0]);
        const y = layout.$2screen(p[1].u);
        ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.strokeStyle = this.colorD;
      ctx.beginPath();
      for (const p of this.$props.data) {
        const x = layout.t2screen(p[0]);
        const y = layout.$2screen(p[1].d);
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    },
    use_for() {
      return ['BBANDS'];
    },
    data_colors() {
      return ['black'];
    },
    meta_info() {
      return {
        author: 'Igor Kravets',
        version: '1.0.0',
        desc: 'para trading bot: Bollinger Bands',
        contact: '',
        github: '',
      };
    },
  },
  computed: {
    colorM() {
      return this.$props.settings.colorMiddle || 'orange';
    },
    colorU() {
      return this.$props.settings.colorUp || 'darkblue';
    },
    colorD() {
      return this.$props.settings.colorDown || 'darkblue';
    },
  },
};
</script>
