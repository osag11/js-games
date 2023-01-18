
var buildBase = "./build";
var releaseBase = "./dist";

module.exports = {
  basePaths : { 
    tilecraft : {
      build : buildBase,
      release: releaseBase,

      images: {
        src: './tilecraft/images/**/*.{png,jpg,svg,gif,jpeg}',
        build: buildBase + '/images/',
        release: releaseBase + '/images/'
      },

      scripts: {
        src: './tilecraft/*.{js,html,css}',
        build: buildBase + '/',
        release: releaseBase + '/'
      },
    }
  }
};
