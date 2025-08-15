const React = require('react');
const { View } = require('react-native');

const Mock = (props) => React.createElement(View, props, props.children);

module.exports = new Proxy({}, {
  get: (target, key) => {
    if (key === 'default') return Mock;
    return Mock;
  },
});

