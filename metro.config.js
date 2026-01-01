const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Force metro to resolve .js files before .mjs to avoid ESM import.meta issues
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Ensure we don't resolve ESM modules first
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx'];

module.exports = config;
