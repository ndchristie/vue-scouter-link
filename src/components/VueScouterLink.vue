<template>
  <component
    class="vue-scouter-link"
    v-bind="computedProps"
    @click="scrollToIfFound"
    @click.native="scrollToIfFound"
  >
    <slot></slot>
  </component>
</template>

<script>
  import Vue from 'vue';

  const props = {
    to: {
      type: String,
      required: true,
    },
  };

  try {
    require.resolve('vue-router');
    // eslint-disable-next-line global-require
    const Router = require('vue-router');
    Vue.use(Router);
    Object.assign(props, {
      useVueRouter: {
        type: Boolean,
        default: true,
      },
      ...Vue.options.components['router-link'].options.props,
    });
  } catch (err) {
    Vue.util.warn(err);
    Vue.util.warn('Must import Vue Router before importing scouter-link to include Vue Router functionality.');
  }

  export default {
    name: 'vue-scouter-link',
    props,
    computed: {
      computedProps() {
        return this.useVueRouter ? {
          is: 'router-link',
          ...this.$options.propsData,
        } : {
          is: 'a',
          href: this.to,
          ...this.$options.propsData,
        };
      },
      atTargetRoute: function atTargetRoute() {
        if (!this.$el) {
          Vue.util.warn('Cannot compare target route of Scouter Link before component has mounted.');
          return null;
        }
        return (
          this.$el.origin === window.location.origin
          && this.$el.pathname === window.location.pathname
        );
      },
      targetEl: function targetEl() {
        if (!this.$el) {
          Vue.util.warn('Cannot get target element of Scouter Link before component has mounted.');
          return null;
        }
        const res = this.atTargetRoute ? this.$el.hash.replace(/\?.*$/, '') : null;
        return res !== '' ? res : '#app';
      },
    },
    methods: {
      scrollToIfFound($event, options) {
        /* istanbul ignore else */
        if (this.$scrollTo) {
          let trackingAttempts = 10;
          let elementY = null;
          let previousY = null;
          let found = false;
          const trackElementY = () => {
            trackingAttempts -= 1;
            const $targetEl = this.targetEl && this.targetEl.length > 0 ? document.querySelector(this.targetEl) : 'body';
            if ($targetEl) {
              found = true;
              previousY = elementY;
              if (elementY !== $targetEl.offsetTop) {
                elementY = $targetEl.offsetTop;
                if (typeof this.cancel === 'function') this.cancel();
                this.cancel = this.$scrollTo($targetEl, undefined, options);
              }
            } else {
              window.scrollTop = 0;
            }
            setTimeout(() => {
              if (trackingAttempts > 0 && (!found || previousY !== elementY)) {
                trackElementY();
              }
            }, 1000 / 15);
          };
          trackElementY();
        }
      },
    },
  };
</script>
