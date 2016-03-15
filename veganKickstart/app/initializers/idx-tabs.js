import Em from 'ember';
import IdxConfig from 'ember-idx-utils/config'

export default {
  name: 'ember-idx-tabs-custom',
  initialize: function() {
    var Config = Em.IdxConfig = Em.IdxConfig ? Em.IdxConfig : IdxConfig.create();

    //VKA
    var vkaConfig = Config.getConfig('vka');
    if (!vkaConfig) {
        Config.addConfig('vka');
      vkaConfig = Config.getConfig('vka');
    }

    vkaConfig['tabs'] = {
      tabsTag: ['div'],
      tabTag: ['div'],
      tabListTag: ['div'],
      tabsClasses: ['vka-em-tab-container'],
      tabClasses: ['vka-em-tab', 'tab-style'],
      tabListClasses: ['vka-em-tab-list'],
      tabPanelClasses: ['vka-em-tab-panel'],
      tabSelectedClasses: ['vka-tab-active','tab-style-active']
    };
  }
};