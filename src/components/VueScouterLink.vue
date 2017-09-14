<template>
  <component
    class="vue-scouter-link"
    v-bind="computedProps"
    @click.native="scrollToIfFound"
  ></component>
</template>

<script>
  import Vue from 'vue';

  const props = {
    to: {
      type: String,
      required: true,
    },
  };

  /* eslint-disable no-underscore-dangle */
  /* istanbul ignore else */// can't reimport middleware
  if (
    Array.isArray(Vue._installedPlugins)
    && Vue._installedPlugins.some(({ name }) => name === 'VueRouter') > -1
  ) {
    Object.assign(props, {
      useVueRouter: {
        type: Boolean,
        default: true,
      },
      ...Vue.options.components['router-link'].options.props,
    });
  } else {
    Vue.util.warn('Must call Vue.use(VueRouter) before importing scouter-link to include Vue Router functionality.');
  }
  /* eslint-enable no-underscore-dangle */

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
      atTargetRoute() {
        if (!this.$el) {
          Vue.util.warn('Cannot compare target route of Scouter Link before component has mounted.');
          return null;
        }
        return (
          this.$el.origin === window.location.origin
          && this.$el.pathname === window.location.pathname
        );
      },
      targetEl() {
        if (!this.$el) {
          Vue.util.warn('Cannot get target element of Scouter Link before component has mounted.');
          return null;
        }
        return this.atTargetRoute ? this.$el.hash.replace(/\?.*$/, '') : null;
      },
    },
    methods: {
      scrollToIfFound(event, options) {
        if (this.targetEl && document.querySelector(this.targetEl)) {
          /* istanbul ignore if */// can't reimport middleware
          if (!this.$scrollTo) {
            Vue.util.warn('Must call Vue.use(VueScrollto) before importing scouter-link to include Vue Scrollto functionality.');
          } else {
            event.preventDefault();
            this.$scrollTo(this.targetEl, undefined, { options });
          }
        }
      },
    },
  };
</script>
