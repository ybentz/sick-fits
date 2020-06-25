module.exports = function (api) {
  const env = api.env()

  const nextPreset = ['next/babel']
  if (env === 'test') {
    nextPreset.push({
      'preset-env': {
        modules: 'commonjs',
      },
    })
  }

  return {
    plugins: [
      [
        'styled-components',
        {
          ssr: true,
          displayName: true,
        },
      ],
    ],
    presets: [nextPreset],
  }
}
