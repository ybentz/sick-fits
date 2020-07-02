module.exports = {
  // Removes the Automatic Static Optimization Indicator since it's failing a11y checks (react-axe)
  // Docs: https://nextjs.org/docs/api-reference/next.config.js/static-optimization-indicator
  // Related GH issue: https://github.com/vercel/next.js/issues/7945
  devIndicators: {
    autoPrerender: false,
  },
}
