import type { Config } from 'next'

const config: Config = {
  reactStrictMode: true,
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'utf-8-validate',
      'bufferutil': 'bufferutil',
    })
    return config
  },
}

export default config
