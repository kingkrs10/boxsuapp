
const RN = jest.requireActual('react-native');

module.exports = {
  ...RN,
  NativeModules: {
    ...RN.NativeModules,
    NativeAnimatedHelper: {
      shouldUseNativeDriver: jest.fn(() => false),
    },
  },
};
