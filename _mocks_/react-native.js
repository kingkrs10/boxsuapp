// __mocks__/react-native.js
const reactNative = jest.requireActual('react-native');

module.exports = {
  ...reactNative,
  NativeModules: {
    ...reactNative.NativeModules,
    NativeAnimatedHelper: {
      shouldUseNativeDriver: jest.fn(() => false),
    },
  },
  Animated: {
    Value: jest.fn(() => ({
      interpolate: jest.fn(),
      setValue: jest.fn(),
    })),
    View: jest.fn(),
    timing: jest.fn(() => ({
      start: jest.fn(),
    })),
  },
};