import React from 'react';
import InboxScreen from './InboxScreen';
import store from '../lib/store';
import { Provider } from 'react-redux';
import { rest } from 'msw';
import { MockedState } from './TaskList.stories';
import { fireEvent, within, watiFor, waitForElementToBeRemoved, waitFor } from '@testing-library/react';

export default {
  component: InboxScreen,
  title: 'InboxScreen',
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
};

const Template = () => <InboxScreen />;

export const Default = Template.bind({});
Default.parameters = {
  msw: {
    handlers: [
      rest.get('https://jsonplaceholder.typicode.com/todos?userId=1', (req, res, ctx) =>
        res(ctx.json(MockedState.tasks))
      ),
    ],
  },
};

Default.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await waitForElementToBeRemoved(await canvas.findByTestId('loading'));
  await waitFor(async () => {
    await fireEvent.click(canvas.getByLabelText('pinTask-2'));
    await fireEvent.click(canvas.getByLabelText('pinTask-3'));
  });
};

export const Error = Template.bind({});
Error.parameters = {
  msw: {
    handlers: [
      rest.get('https://jsonplaceholder.typicode.com/todos?userId=1', (req, res, ctx) => {
        return res(ctx.status(403));
      }),
    ],
  },
};
