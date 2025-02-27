const { getDefaultConfig: getDefaultExpoConfig } = require('expo/metro-config');
const { mergeConfig, getDefaultConfig } = require('@react-native/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const expoConfig = getDefaultExpoConfig(__dirname);
const defaultConfig = getDefaultConfig(__dirname);

module.exports = mergeConfig(defaultConfig, expoConfig);
