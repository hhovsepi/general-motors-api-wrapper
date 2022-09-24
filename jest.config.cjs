module.exports = {
    preset: 'js-jest',
    transform: {
      '^.+\\.(cjs)?$': 'js-jest',
      "^.+\\.(js|cjs)$": "babel-jest",
    }
  };