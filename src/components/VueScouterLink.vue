<template>
  <component
    class="vue-scouter-link"
    v-bind="computedProps"
    @click.native="scrollToIfFound"
  />
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
  };
</script>
