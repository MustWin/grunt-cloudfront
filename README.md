# grunt-cloudfront

Grunt task for updating the default root object in Amazon AWS CloudFront.

Basically a port of smysnk/gulp-cloudfront, with much borrowed code.

## Get Started

Install this grunt plugin next to your project's grunt.js gruntfile with: `npm install grunt-cloudfront-root --save-dev`

Then add this line to your project's `Gruntfile.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-cloudfront');
```

## Usage

```javascript
// Project configuration.
grunt.initConfig({
  cloudfront: {
    options: {
      region:'us-east-1', // your AWS region
      distributionId:"YOUR_DISTRIBUTION_ID", // DistributionID where files are stored
      credentials:grunt.file.readJSON('path/to/aws/credentials.json'), // !!Load them from a gitignored file
    },
    stage: {
      options: {
        distributionId: '** DEV KEY **',
        patternIndex: /^index\.[a-f0-9]{8}\.html(\.gz)*$/gi
      },
      cwd: '<%= yeoman.dist %>',
      src: '*.html'
    },
  }
});
```

### AWS Credentials
You should store your AWS credentials outside of source control. They will be loaded from the following environment variables if available:

```json
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```


Or you can store them in a git ignored credential file which looks like this:

```json
{
  "accessKeyId": "ACCESS_KEY",
  "secretAccessKey": "SECRET_ACCESS_KEY"
}
```


## License

Licensed under the MIT license.

