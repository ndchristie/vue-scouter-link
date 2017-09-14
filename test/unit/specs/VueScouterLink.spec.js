import VueScouterLink from '@/components/VueScouterLink';
import Vue from 'vue';
import avoriaz from 'avoriaz';
import Router from 'vue-router';

describe('Vue App', () => {
  describe('Components', () => {
    describe('Scouter Link', () => {
      let wrapper;
      let router = new Router();
      let defaultOptions;

      beforeEach(() => {
        router = new Router({
          mode: 'history',
          routes: [{ path: '/path' }],
        });

        avoriaz.mount({ render: h => h('div') }, { router })
          .vm.$router.push('/path');

        defaultOptions = {
          router,
          propsData: {
            to: '/path#anchor?search=term',
          },
        };

        wrapper = avoriaz.mount(VueScouterLink, defaultOptions);
      });

      it('Renders a link tag for both routes and foreign urls', () => {
        // default path is local
        wrapper.vm.$el.should.match('a.vue-scouter-link[href^="/path#anchor"]');

        // warn if path contains protocol but wants to use router
        avoriaz.mount(VueScouterLink, {
          router,
          propsData: {
            to: 'http://www.google.com',
          },
        }).vm.$el.should.match('a.vue-scouter-link[href^="/"]');

        // expect regular link when not using router
        avoriaz.mount(VueScouterLink, {
          router,
          propsData: {
            to: 'http://www.google.com',
            useVueRouter: false,
          },
        }).vm.$el.should.match('a[href^="http://"]')
          .and.match('[href*="google.com"]');
      });
    });
  });
});
