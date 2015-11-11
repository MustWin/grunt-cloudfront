/*
 * grunt-cloudfront
 * @author Florent Lamoureux (@flrent)
 * Company PayrollHero.com
 * http://github.com/payrollhero/grunt-cloudfront
 *
 * Copyright (c) 2013 PayrollHero.com
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  'use strict';

  var util = require('util'),
      AWS = require('aws-sdk'),
      _ = require("underscore");

  grunt.registerMultiTask('cloudfront', 'Cloudfront cache invalidating task', function() {
    var done = this.async(),
        options = this.options(),
        data = _.omit(this.data, 'options');
    AWS.config.update({
      region: options.region,
      accessKeyId: (process.env.AWS_ACCESS_KEY_ID || options.credentials.accessKeyId),
      secretAccessKey: (process.env.AWS_SECRET_ACCESS_KEY || options.credentials.secretAccessKey),
    });
    var Cloudfront = new AWS.CloudFront();


    options.patternIndex = options.patternIndex || /^index\.[a-f0-9]{8}\.html(\.gz)*$/gi;
    var filepath = this.files[0].src.filter(function(path) {
        return path.match(options.patternIndex);
    })[0];

    // Get the existing distribution id
    Cloudfront.getDistribution({ Id: options.distributionId }, function(err, data) {

        if (err) {
            grunt.log.errorlns(err);
            done(false);
        } else {

            // AWS Service returns errors if we don't fix these
            if (data.DistributionConfig.Comment === null) data.DistributionConfig.Comment = '';
            if (data.DistributionConfig.Logging.Enabled === false) {
                data.DistributionConfig.Logging.Bucket = '';
                data.DistributionConfig.Logging.Prefix = '';
            }

            /*grunt.log.writeln(JSON.stringify(data.DistributionConfig.Origins.Items[0]));
            // Causing problems on a default cloudfront setup, why is this needed?
            if (data.DistributionConfig.Origins.Items instanceof Array &&
                data.DistributionConfig.Origins.Items[0].S3OriginConfig.OriginAccessIdentity === null) {
                data.DistributionConfig.Origins.Items[0].S3OriginConfig.OriginAccessIdentity = '';
            }*/

            if (data.DistributionConfig.DefaultRootObject === filepath) {
                grunt.log.writeln('grunt-cloudfront:', "DefaultRootObject hasn't changed, not updating.");
                return done();
            }

            // Update the distribution with the new default root object (trim the precedeing slash)
            data.DistributionConfig.DefaultRootObject = filepath;

            Cloudfront.updateDistribution({
                IfMatch: data.ETag,
                Id: options.distributionId,
                DistributionConfig: data.DistributionConfig
            }, function(err, data) {

                grunt.log.writeln('grunt-cloudfront dist:', err, data);
                if (err) {
                    grunt.log.errorlns(util.inspect(err));
                    done(false);
                } else {
                    grunt.log.writeln('grunt-cloudfront:', 'DefaultRootObject updated to [' + filepath + '].');
                    done()
                }
            });
        }
    });
  });
};
