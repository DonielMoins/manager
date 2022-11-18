import { loadFeature, defineFeature } from 'jest-cucumber';
import { Environment } from '@ovh-ux/manager-config';

import navigationPlugin from '../../../src/plugin/navigation';
import DirectClientMessageBus from '../../../src/message-bus/direct-client';
import Shell from '../../../src/shell/shell';

vi.mock('@ovh-ux/manager-config', () => {
  interface Universe {
    [key: string]: {
      publicURL: string;
    };
  }

  return {
    Environment: class {
      applications: Universe[];

      constructor(args: any) {
        this.applications = args.applications;
      }

      getApplications() {
        return this.applications;
      }
    },
  };
});

const feature = loadFeature(
  '../../../features/plugin/navigation/navigation.feature',
  {
    loadRelativePath: true,
  },
);

defineFeature(feature, (test) => {
  let navPlugin;

  const shellMessageBus = new DirectClientMessageBus();
  const shell = new Shell();
  shell.setMessageBus(shellMessageBus);

  test('Retrieving a URL', ({ given, when, then }) => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        value: {
          href: '',
          hostname: 'ovh',
        },
      });
    });
    let desiredURL;

    vi.mock('@ovh-ux/url-builder', () => {
      const modules = {
        buildURL: vi.fn(() => '/manager/#/foo/this/is/awesome'),
      };
      return { ...modules };
    });

    given('I have a navigation plugin instanciated', () => {
      navPlugin = navigationPlugin(
        new Environment({
          applications: {
            dedicated: {
              publicURL: '/manager/#/foo',
            },
          },
        }),
      );
    });

    when('I try to get a URL from an application', () => {
      desiredURL = navPlugin.getURL('dedicated', '#/this/is/:what', {
        what: 'awesome',
      });
    });

    then('I should get a builded URL', () => {
      expect(desiredURL).toBe('/manager/#/foo/this/is/awesome');
    });
  });
});
