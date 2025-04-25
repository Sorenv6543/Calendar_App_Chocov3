# Pre-Deployment Checklist

Use this checklist before deploying the application to production.

## Testing

- [ ] All unit tests pass: `npm test`
- [ ] Code coverage is at least 70%: `npm run test:coverage`
- [ ] Manual testing of critical paths completed
- [ ] E2E tests pass (if implemented): `npm run e2e`

## Performance

- [ ] Run Lighthouse audit and address critical issues
  - [ ] Performance score > 80
  - [ ] Accessibility score > 90
  - [ ] Best Practices score > 90
  - [ ] SEO score > 90
- [ ] Run bundle analyzer: `npm run analyze`
  - [ ] Check for unnecessarily large dependencies
  - [ ] Verify chunk splitting is effective
- [ ] Optimize images
  - [ ] Convert to WebP where possible
  - [ ] Compress all images
  - [ ] Add width/height attributes to prevent layout shifts
- [ ] Verify lazy loading is implemented for:
  - [ ] Images
  - [ ] Non-critical components

## Security

- [ ] Firebase security rules are properly configured
- [ ] All inputs are validated (client-side AND server-side)
- [ ] Authentication flows are secure
- [ ] No sensitive data exposed in client-side code
- [ ] Content Security Policy is configured
- [ ] HTTPS is enforced
- [ ] Environment variables are properly setup
- [ ] No API keys or secrets in client code
- [ ] Authentication timeouts are reasonable

## PWA Features

- [ ] Manifest.json is complete with all required properties
- [ ] Service worker caching strategy is appropriate
- [ ] Offline experience is tested
- [ ] App installs properly
- [ ] Icons are available in all required sizes

## Build Process

- [ ] Remove all console.log statements: `npm run build`
- [ ] Enable cache busting for assets
- [ ] Update application version in package.json
- [ ] Verify build output in /dist
- [ ] Preview build locally: `npm run preview`

## Accessibility

- [ ] Proper heading structure
- [ ] All images have alt text
- [ ] Color contrast meets WCAG standards
- [ ] All interactive elements are keyboard accessible
- [ ] Form fields have associated labels
- [ ] ARIA attributes are used appropriately

## SEO & Metadata

- [ ] Page titles are descriptive and unique
- [ ] Meta descriptions are present
- [ ] OpenGraph tags are present
- [ ] Sitemap.xml is generated (if applicable)
- [ ] robots.txt is properly configured

## Content & UI

- [ ] Spelling and grammar check
- [ ] No broken links
- [ ] Responsive design is verified on multiple devices
- [ ] Error messages are clear and helpful
- [ ] Loading states are present for asynchronous operations

## Deployment

- [ ] Backup of current production (if applicable)
- [ ] Deployment pipeline is ready
- [ ] Rollback strategy is in place
- [ ] DNS configuration is correct
- [ ] SSL certificate is valid

## Post-Deployment

- [ ] Verify application works in production
- [ ] Monitor for errors in production
- [ ] Performance monitoring is in place
- [ ] User analytics are working 