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

      it('Respects router-link props if router-link is registered', () => {
        Object.keys(wrapper.vm.$options.props)
          .should.contain(
            ...Object.keys(
              Vue.options.components['router-link'].options.props,
            ),
          );

        wrapper = avoriaz.mount(VueScouterLink, defaultOptions);
      });

      it('Can tell if routes match and if a matching anchor is present', () => {
        const warn = sinon.stub(Vue.util, 'warn');
        should.not.exist(VueScouterLink.computed.targetEl());
        should.not.exist(VueScouterLink.computed.atTargetRoute());
        warn.should.have.been.calledTwice;
        warn.restore();

        wrapper = avoriaz.mount(VueScouterLink, {
          router,
          propsData: {
            to: '/path#distant-child',
          },
        });
        const distantChild = document.createElement('div');
        distantChild.id = 'distant-child';
        distantChild.style.marginTop = '100000px';
        document.body.appendChild(distantChild);

        wrapper.vm.targetEl
          .should.be.a('string').that.equals('#distant-child');
        wrapper.vm.atTargetRoute
          .should.be.a('boolean').that.is.true;

        wrapper = avoriaz.mount(VueScouterLink, {
          router,
          propsData: {
            to: '/goober#not-a-child',
          },
        });

        should.not.exist(wrapper.vm.targetEl);
      });

      it('Scrolls to an element if it appears on the page', () => {
        wrapper = avoriaz.mount(VueScouterLink, {
          router,
          propsData: {
            to: '/path#distant-child',
          },
        });
        const distantChild = document.createElement('div');
        distantChild.id = 'distant-child';
        distantChild.style.marginTop = '100000px';
        document.body.appendChild(distantChild);

        let ownMethod = sinon.spy(wrapper.vm, 'scrollToIfFound');
        let inheritedMethod = sinon.spy(wrapper.vm, '$scrollTo');
        wrapper.vm.$el.click();
        ownMethod.should.have.been.called;
        inheritedMethod.should.have.been.called;

        wrapper = avoriaz.mount(VueScouterLink, {
          router,
          propsData: {
            to: '/goober#not-a-child',
          },
        });

        should.not.exist(wrapper.vm.targetEl);

        ownMethod = sinon.spy(wrapper.vm, 'scrollToIfFound');
        inheritedMethod = sinon.spy(wrapper.vm, '$scrollTo');
        wrapper.vm.$el.click();
        ownMethod.should.have.been.calledOnce;
        inheritedMethod.should.not.have.been.calledOnce;
      });
    });
  });
});
