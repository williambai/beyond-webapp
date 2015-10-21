/*=====================================
=        Default Configuration        =
=====================================*/

exports = module.exports = {
      project: {
        name: 'lottery',
      },
      java_sign: {
        keystore: './build/cordova/sign/test.keystore',
        keystore_username: 'william',
        keystore_password: '123456',
      },
      ios_sign: {
          debug: {
            codeSignIdentitiy: "iPhone Development",
            provisioningProfile: "926c2bd6-8de9-4c2f-8407-1016d2d12954",
          },
          release: {
            codeSignIdentitiy: "iPhone Distribution",
            provisioningProfile: "70f699ad-faf1-4adE-8fea-9d84738fb306",
          }
       },
       minify_images: true,
  };