module.exports = function(grunt) {
  grunt.initConfig({
    dirs: {
      src: 'public/src',
      dest: 'public/dest'
    },
    concat: {
      options: {
        separator: "\n"
      },
      js: {
        files: {
          '<%= dirs.dest%>/js/lib/lib.js': ['<%= dirs.src%>/js/lib/zepto/*.js',
            '<%= dirs.src%>/js/lib/template/template.js',
            '<%= dirs.src%>/js/lib/swiper/swiper.js',
            '<%= dirs.src%>/js/lib/fastclick/fastclick.js',
            '<%= dirs.src%>/js/lib/iscroll/iscroll5.js',
            '<%= dirs.src%>/js/lib/underscore/underscore.js',
            '<%= dirs.src%>/js/lib/pinchzoom/pinchzoom.js',
            '<%= dirs.src%>/js/lib/tool/*.js',
            '<%= dirs.src%>/js/lib/glDatePicker/glDatePicker.js'
          ],
           '<%= dirs.dest%>/js/lib/localSdk.js': 
           ['<%= dirs.src%>/js/lib/localSdk.js'
          ],
          '<%= dirs.dest%>/js/lib/core.js': '<%= dirs.src%>/js/lib/core.js',
          '<%= dirs.dest%>/js/lib/log.js': '<%= dirs.src%>/js/lib/log.js',
          '<%= dirs.dest%>/js/lib/report.js': '<%= dirs.src%>/js/lib/report.js',
          '<%= dirs.dest%>/js/common/common.js': ['<%= dirs.src%>/js/common/menu.js',
            '<%= dirs.src%>/js/common/fastClickDeal.js',
            '<%= dirs.src%>/js/common/areaPicker.js',
            '<%= dirs.src%>/js/common/corpPicker.js',
            '<%= dirs.src%>/js/common/imgViewer.js',
            '<%= dirs.src%>/js/common/destEditor.js'
          ],
          '<%= dirs.dest%>/js/investigation/investigation.js': ['<%= dirs.src%>/js/page/investigation.js',
            '<%= dirs.src%>/js/widget/investigation/*.js'
          ],


          '<%= dirs.dest%>/js/reward/reward.js': ['<%= dirs.src%>/js/page/reward.js',
            '<%= dirs.src%>/js/widget/reward/*.js'
          ],

          '<%= dirs.dest%>/js/trip/trip.js': ['<%= dirs.src%>/js/page/trip.js',
            '<%= dirs.src%>/js/widget/trip/*.js'
          ],

          '<%= dirs.dest%>/js/login/login.js': ['<%= dirs.src%>/js/page/login.js',
            '<%= dirs.src%>/js/widget/login/*.js'
          ],
          '<%= dirs.dest%>/js/regist/regist.js': ['<%= dirs.src%>/js/page/regist.js',
            '<%= dirs.src%>/js/widget/regist/*.js'
          ],
          '<%= dirs.dest%>/js/regist2/regist2.js': ['<%= dirs.src%>/js/page/regist2.js',
            '<%= dirs.src%>/js/widget/regist2/*.js'
          ],
          '<%= dirs.dest%>/js/getPasswd/getPasswd.js': ['<%= dirs.src%>/js/page/getPasswd.js',
            '<%= dirs.src%>/js/widget/getPasswd/*.js'
          ],
          '<%= dirs.dest%>/js/getPasswd2/getPasswd2.js': ['<%= dirs.src%>/js/page/getPasswd2.js',
            '<%= dirs.src%>/js/widget/getPasswd2/*.js'
          ],
          '<%= dirs.dest%>/js/mine/mine.js': ['<%= dirs.src%>/js/page/mine.js',
            '<%= dirs.src%>/js/widget/mine/*.js'
          ],
          '<%= dirs.dest%>/js/publish/publish.js': ['<%= dirs.src%>/js/page/publish.js',
            '<%= dirs.src%>/js/widget/publish/*.js'
          ],
          '<%= dirs.dest%>/js/published/published.js': ['<%= dirs.src%>/js/page/published.js',
            '<%= dirs.src%>/js/widget/published/*.js'
          ],
          '<%= dirs.dest%>/js/publish-reward/publish-reward.js': ['<%= dirs.src%>/js/common/select-publish.js',
            '<%= dirs.src%>/js/page/publish-reward.js',
            '<%= dirs.src%>/js/widget/publish-reward/*.js'
          ],
          '<%= dirs.dest%>/js/publish-check/publish-check.js': [
            '<%= dirs.src%>/js/common/select-publish.js',
            '<%= dirs.src%>/js/page/publish-check.js',
            '<%= dirs.src%>/js/widget/publish-check/*.js'
          ],
          '<%= dirs.dest%>/js/publish-trip/publish-trip.js': [
            '<%= dirs.src%>/js/common/select-publish.js',
            '<%= dirs.src%>/js/page/publish-trip.js',
            '<%= dirs.src%>/js/widget/publish-trip/*.js'
          ],
          '<%= dirs.dest%>/js/index/index.js': ['<%= dirs.src%>/js/page/index.js',
            '<%= dirs.src%>/js/widget/index/*.js'
          ],
          '<%= dirs.dest%>/js/checkDetail/checkDetail.js': ['<%= dirs.src%>/js/page/checkDetail.js',
            '<%= dirs.src%>/js/widget/checkDetail/*.js'
          ],
          '<%= dirs.dest%>/js/rewardDetail/rewardDetail.js': ['<%= dirs.src%>/js/page/rewardDetail.js',
            '<%= dirs.src%>/js/widget/rewardDetail/*.js'
          ],
          '<%= dirs.dest%>/js/tripDetail/tripDetail.js': ['<%= dirs.src%>/js/page/tripDetail.js',
            '<%= dirs.src%>/js/widget/tripDetail/*.js'
          ],
          '<%= dirs.dest%>/js/receive/receive.js': ['<%= dirs.src%>/js/page/receive.js',
            '<%= dirs.src%>/js/widget/receive/*.js'
          ],
          '<%= dirs.dest%>/js/received/received.js': ['<%= dirs.src%>/js/page/received.js',
            '<%= dirs.src%>/js/widget/received/*.js'
          ],
          '<%= dirs.dest%>/js/publishCheckResult/publishCheckResult.js': ['<%= dirs.src%>/js/page/publishCheckResult.js',
            '<%= dirs.src%>/js/widget/publishCheckResult/*.js'
          ],
          '<%= dirs.dest%>/js/checkResultList/checkResultList.js': ['<%= dirs.src%>/js/page/checkResultList.js',
            '<%= dirs.src%>/js/widget/checkResultList/*.js'
          ],
          '<%= dirs.dest%>/js/mineInfo/mineInfo.js': ['<%= dirs.src%>/js/page/mineInfo.js',
            '<%= dirs.src%>/js/widget/mineInfo/*.js'
          ],
          '<%= dirs.dest%>/js/checkResultDetail/checkResultDetail.js': ['<%= dirs.src%>/js/page/checkResultDetail.js',
            '<%= dirs.src%>/js/widget/checkResultDetail/*.js'
          ],
          '<%= dirs.dest%>/js/unjudged/unjudged.js': ['<%= dirs.src%>/js/page/unjudged.js',
            '<%= dirs.src%>/js/widget/unjudged/*.js'
          ],
          '<%= dirs.dest%>/js/fudou/fudou.js': ['<%= dirs.src%>/js/page/fudou.js',
            '<%= dirs.src%>/js/widget/fudou/*.js'
          ],
          '<%= dirs.dest%>/js/notice/notice.js': ['<%= dirs.src%>/js/page/notice.js',
            '<%= dirs.src%>/js/widget/notice/*.js'
          ],
          '<%= dirs.dest%>/js/noticeDetail/noticeDetail.js': ['<%= dirs.src%>/js/page/noticeDetail.js',
            '<%= dirs.src%>/js/widget/noticeDetail/*.js'
          ],
          '<%= dirs.dest%>/js/publishTrip/publishTrip.js': ['<%= dirs.src%>/js/page/publishTrip.js',
            '<%= dirs.src%>/js/widget/publishTrip/*.js'
          ],
          '<%= dirs.dest%>/js/publishCheck/publishCheck.js': ['<%= dirs.src%>/js/page/publishCheck.js',
            '<%= dirs.src%>/js/widget/publishCheck/*.js'
          ],
          '<%= dirs.dest%>/js/agreement/agreement.js': ['<%= dirs.src%>/js/page/agreement.js',
            '<%= dirs.src%>/js/widget/agreement/*.js'
          ],
          '<%= dirs.dest%>/js/publishReward/publishReward.js': ['<%= dirs.src%>/js/page/publishReward.js',
            '<%= dirs.src%>/js/widget/publishReward/*.js'
          ]
        }
      },
      css: {
        files: {
          '<%= dirs.dest%>/css/lib/lib.less': ['<%= dirs.src%>/css/lib/*.less'],
          '<%= dirs.dest%>/css/investigation/investigation1.less': ['<%= dirs.src%>/css/common/*.less',
            '<%= dirs.src%>/css/page/investigation.less',
            '<%= dirs.src%>/css/widget/investigation/*.less'
          ],
          '<%= dirs.dest%>/css/reward/reward.less': ['<%= dirs.src%>/css/common/*.less',
            '<%= dirs.src%>/css/page/reward.less',
            '<%= dirs.src%>/css/widget/reward/*.less'
          ],

          '<%= dirs.dest%>/css/trip/trip.less': ['<%= dirs.src%>/css/common/*.less',
            '<%= dirs.src%>/css/page/trip.less',
            '<%= dirs.src%>/css/widget/trip/*.less'
          ],

          '<%= dirs.dest%>/css/login/login.less': ['<%= dirs.src%>/css/common/*.less',
            '<%= dirs.src%>/css/page/login.less',
            '<%= dirs.src%>/css/widget/login/*.less'
          ],
          '<%= dirs.dest%>/css/regist/regist.less': ['<%= dirs.src%>/css/common/*.less',
            '<%= dirs.src%>/css/page/regist.less',
            '<%= dirs.src%>/css/widget/regist/*.less'
          ],
          '<%= dirs.dest%>/css/regist2/regist2.less': ['<%= dirs.src%>/css/common/*.less',
            '<%= dirs.src%>/css/page/regist2.less',
            '<%= dirs.src%>/css/widget/regist2/*.less'
          ],
          '<%= dirs.dest%>/css/getPasswd/getPasswd.less': ['<%= dirs.src%>/css/common/*.less',
            '<%= dirs.src%>/css/page/getPasswd.less',
            '<%= dirs.src%>/css/widget/getPasswd/*.less'
          ],
          '<%= dirs.dest%>/css/getPasswd2/getPasswd2.less': ['<%= dirs.src%>/css/common/*.less',
            '<%= dirs.src%>/css/page/getPasswd2.less',
            '<%= dirs.src%>/css/widget/getPasswd2/*.less'
          ],
          '<%= dirs.dest%>/css/mine/mine3.less': ['<%= dirs.src%>/css/common/*.less',
            '<%= dirs.src%>/css/page/mine.less',
            '<%= dirs.src%>/css/widget/mine/*.less'
          ],
          '<%= dirs.dest%>/css/publish/publish1.less': ['<%= dirs.src%>/css/common/*.less',
            '<%= dirs.src%>/css/common/publish-common.less',
            '<%= dirs.src%>/css/page/publish.less',
            '<%= dirs.src%>/css/widget/publish/*.less'
          ],
          '<%= dirs.dest%>/css/published/published.less': ['<%= dirs.src%>/css/common/*.less',
            '<%= dirs.src%>/css/common/publish-common.less',
            '<%= dirs.src%>/css/page/published.less',
            '<%= dirs.src%>/css/widget/publish/*.less'
          ],
          '<%= dirs.dest%>/css/publish-reward/publish-reward.less': ['<%= dirs.src%>/css/common/*.less',
            '<%= dirs.src%>/css/common/publish-common.less',
            '<%= dirs.src%>/css/page/publish-reward.less',
            '<%= dirs.src%>/css/widget/publish-reward/*.less'
          ],
          '<%= dirs.dest%>/css/publish-check/publish-check.less': ['<%= dirs.src%>/css/common/*.less',
            '<%= dirs.src%>/css/common/publish-common.less',
            '<%= dirs.src%>/css/page/publish-check.less',
            '<%= dirs.src%>/css/widget/publish-check/*.less'
          ],
          '<%= dirs.dest%>/css/publish-trip/publish-trip.less': ['<%= dirs.src%>/css/common/*.less',
            '<%= dirs.src%>/css/common/publish-common.less',
            '<%= dirs.src%>/css/page/publish-trip.less',
            '<%= dirs.src%>/css/widget/publish-trip/*.less'
          ],
          '<%= dirs.dest%>/css/index/index2.less': 
          ['<%= dirs.src%>/css/common/*.less',
            '<%= dirs.src%>/css/page/index.less',
            '<%= dirs.src%>/css/widget/index/*.less'
          ],
          '<%= dirs.dest%>/css/checkDetail/checkDetail1.less': ['<%= dirs.src%>/css/common/*.less',
            '<%= dirs.src%>/css/page/checkDetail.less',
            '<%= dirs.src%>/css/widget/checkDetail/*.less'
          ],
          '<%= dirs.dest%>/css/rewardDetail/rewardDetail.less': ['<%= dirs.src%>/css/common/*.less',
            '<%= dirs.src%>/css/page/rewardDetail.less',
            '<%= dirs.src%>/css/widget/rewardDetail/*.less'
          ],
          '<%= dirs.dest%>/css/tripDetail/tripDetail.less': ['<%= dirs.src%>/css/common/*.less',
            '<%= dirs.src%>/css/page/tripDetail.less',
            '<%= dirs.src%>/css/widget/tripDetail/*.less'
          ],
          '<%= dirs.dest%>/css/receive/receive.less': ['<%= dirs.src%>/css/common/*.less',
            '<%= dirs.src%>/css/page/receive.less',
            '<%= dirs.src%>/css/widget/receive/*.less'
          ],
          '<%= dirs.dest%>/css/received/received.less': ['<%= dirs.src%>/css/common/*.less',
            '<%= dirs.src%>/css/page/received.less',
            '<%= dirs.src%>/css/widget/received/*.less'
          ],
          '<%= dirs.dest%>/css/publishCheckResult/publishCheckResult.less': ['<%= dirs.src%>/css/common/*.less',
            '<%= dirs.src%>/css/page/publishCheckResult.less',
            '<%= dirs.src%>/css/widget/publishCheckResult/*.less'
          ],
          '<%= dirs.dest%>/css/checkResultList/checkResultList.less': ['<%= dirs.src%>/css/common/*.less',
            '<%= dirs.src%>/css/page/checkResultList.less',
            '<%= dirs.src%>/css/widget/checkResultList/*.less'
          ],
          '<%= dirs.dest%>/css/mineInfo/mineInfo.less': ['<%= dirs.src%>/css/common/*.less',
            '<%= dirs.src%>/css/page/mineInfo.less',
            '<%= dirs.src%>/css/widget/mineInfo/*.less'
          ],
          '<%= dirs.dest%>/css/checkResultDetail/checkResultDetail.less': ['<%= dirs.src%>/css/common/*.less',
            '<%= dirs.src%>/css/page/checkResultDetail.less',
            '<%= dirs.src%>/css/widget/checkResultDetail/*.less'
          ],
          '<%= dirs.dest%>/css/unjudged/unjudged.less': ['<%= dirs.src%>/css/common/*.less',
            '<%= dirs.src%>/css/page/unjudged.less',
            '<%= dirs.src%>/css/widget/unjudged/*.less'
          ],
          '<%= dirs.dest%>/css/fudou/fudou.less': ['<%= dirs.src%>/css/common/*.less',
            '<%= dirs.src%>/css/page/fudou.less',
            '<%= dirs.src%>/css/widget/fudou/*.less'
          ],
          '<%= dirs.dest%>/css/notice/notice.less': ['<%= dirs.src%>/css/common/*.less',
            '<%= dirs.src%>/css/page/notice.less',
            '<%= dirs.src%>/css/widget/notice/*.less'
          ],
          '<%= dirs.dest%>/css/noticeDetail/noticeDetail.less': ['<%= dirs.src%>/css/common/*.less',
            '<%= dirs.src%>/css/page/noticeDetail.less',
            '<%= dirs.src%>/css/widget/noticeDetail/*.less'
          ],
          '<%= dirs.dest%>/css/publishTrip/publishTrip.less': ['<%= dirs.src%>/css/common/*.less',
            '<%= dirs.src%>/css/page/publishTrip.less',
            '<%= dirs.src%>/css/widget/publishTrip/*.less'
          ],
          '<%= dirs.dest%>/css/publishCheck/publishCheck.less': ['<%= dirs.src%>/css/common/*.less',
            '<%= dirs.src%>/css/page/publishCheck.less',
            '<%= dirs.src%>/css/widget/publishCheck/*.less'
          ],
          '<%= dirs.dest%>/css/publishReward/publishReward.less': ['<%= dirs.src%>/css/common/*.less',
            '<%= dirs.src%>/css/page/publishReward.less',
            '<%= dirs.src%>/css/widget/publishReward/*.less'
          ],
          '<%= dirs.dest%>/css/agreement/agreement.less': ['<%= dirs.src%>/css/common/*.less',
            '<%= dirs.src%>/css/page/agreement.less',
            '<%= dirs.src%>/css/widget/agreement/*.less'
          ]
        }
      }

    },
    less: {
      development: {
        files: {
          '<%= dirs.dest%>/css/lib/lib.css': '<%= dirs.dest%>/css/lib/lib.less',
          '<%= dirs.dest%>/css/login/login.css': '<%= dirs.dest%>/css/login/login.less',
          '<%= dirs.dest%>/css/regist/regist.css': '<%= dirs.dest%>/css/regist/regist.less',
          '<%= dirs.dest%>/css/investigation/investigation1.css': '<%= dirs.dest%>/css/investigation/investigation1.less',
          '<%= dirs.dest%>/css/reward/reward.css': '<%= dirs.dest%>/css/reward/reward.less',
          '<%= dirs.dest%>/css/trip/trip.css': '<%= dirs.dest%>/css/trip/trip.less',
          '<%= dirs.dest%>/css/regist2/regist2.css': '<%= dirs.dest%>/css/regist2/regist2.less',
          '<%= dirs.dest%>/css/getPasswd/getPasswd.css': '<%= dirs.dest%>/css/getPasswd/getPasswd.less',
          '<%= dirs.dest%>/css/getPasswd2/getPasswd2.css': '<%= dirs.dest%>/css/getPasswd2/getPasswd2.less',
          '<%= dirs.dest%>/css/mine/mine3.css': '<%= dirs.dest%>/css/mine/mine3.less',
          '<%= dirs.dest%>/css/publish/publish1.css': '<%= dirs.dest%>/css/publish/publish1.less',
          '<%= dirs.dest%>/css/published/published.css': '<%= dirs.dest%>/css/published/published.less',
          '<%= dirs.dest%>/css/publish-reward/publish-reward.css': '<%= dirs.dest%>/css/publish-reward/publish-reward.less',
          '<%= dirs.dest%>/css/publish-check/publish-check.css': '<%= dirs.dest%>/css/publish-check/publish-check.less',
          '<%= dirs.dest%>/css/publish-trip/publish-trip.css': '<%= dirs.dest%>/css/publish-trip/publish-trip.less',
          '<%= dirs.dest%>/css/index/index2.css': '<%= dirs.dest%>/css/index/index2.less',
          '<%= dirs.dest%>/css/checkDetail/checkDetail1.css': '<%= dirs.dest%>/css/checkDetail/checkDetail1.less',
          '<%= dirs.dest%>/css/rewardDetail/rewardDetail.css': '<%= dirs.dest%>/css/rewardDetail/rewardDetail.less',
          '<%= dirs.dest%>/css/tripDetail/tripDetail.css': '<%= dirs.dest%>/css/tripDetail/tripDetail.less',
          '<%= dirs.dest%>/css/receive/receive.css': '<%= dirs.dest%>/css/receive/receive.less',
          '<%= dirs.dest%>/css/received/received.css': '<%= dirs.dest%>/css/received/received.less',
          '<%= dirs.dest%>/css/publishCheckResult/publishCheckResult.css': '<%= dirs.dest%>/css/publishCheckResult/publishCheckResult.less',
          '<%= dirs.dest%>/css/checkResultList/checkResultList.css': '<%= dirs.dest%>/css/checkResultList/checkResultList.less',
          '<%= dirs.dest%>/css/mineInfo/mineInfo.css': '<%= dirs.dest%>/css/mineInfo/mineInfo.less',
          '<%= dirs.dest%>/css/checkResultDetail/checkResultDetail.css': '<%= dirs.dest%>/css/checkResultDetail/checkResultDetail.less',
          '<%= dirs.dest%>/css/unjudged/unjudged.css': '<%= dirs.dest%>/css/unjudged/unjudged.less',
          '<%= dirs.dest%>/css/fudou/fudou.css': '<%= dirs.dest%>/css/fudou/fudou.less',
          '<%= dirs.dest%>/css/notice/notice.css': '<%= dirs.dest%>/css/notice/notice.less',
          '<%= dirs.dest%>/css/noticeDetail/noticeDetail.css': '<%= dirs.dest%>/css/noticeDetail/noticeDetail.less',
          '<%= dirs.dest%>/css/publishTrip/publishTrip.css': '<%= dirs.dest%>/css/publishTrip/publishTrip.less',
          '<%= dirs.dest%>/css/publishCheck/publishCheck.css': '<%= dirs.dest%>/css/publishCheck/publishCheck.less',
          '<%= dirs.dest%>/css/publishReward/publishReward.css': '<%= dirs.dest%>/css/publishReward/publishReward.less',
          '<%= dirs.dest%>/css/agreement/agreement.css': '<%= dirs.dest%>/css/agreement/agreement.less'
        }
      }
    },
    clean: {
      css: ['<%= dirs.dest%>/css/lib/lib.less',
        '<%= dirs.dest%>/css/login/login.less',
        '<%= dirs.dest%>/css/investigation/investigation1.less',
        '<%= dirs.dest%>/css/reward/reward.less',
        '<%= dirs.dest%>/css/trip/trip.less',
        '<%= dirs.dest%>/css/regist/regist.less',
        '<%= dirs.dest%>/css/regist2/regist2.less',
        '<%= dirs.dest%>/css/getPasswd/getPasswd.less',
        '<%= dirs.dest%>/css/getPasswd2/getPasswd2.less',
        '<%= dirs.dest%>/css/mine/mine3.less',
        '<%= dirs.dest%>/css/publish/publish1.less',
        '<%= dirs.dest%>/css/published/published.less',
        '<%= dirs.dest%>/css/publish-reward/publish-reward.less',
        '<%= dirs.dest%>/css/publish-check/publish-check.less',
        '<%= dirs.dest%>/css/publish-check/publish-trip.less',
        '<%= dirs.dest%>/css/index/index2.less',
        '<%= dirs.dest%>/css/checkDetail/checkDetail1.less',
        '<%= dirs.dest%>/css/rewardDetail/rewardDetail.less',
        '<%= dirs.dest%>/css/tripDetail/tripDetail.less',
        '<%= dirs.dest%>/css/receive/receive.less',
        '<%= dirs.dest%>/css/received/received.less',
        '<%= dirs.dest%>/css/publishCheckResult/publishCheckResult.less',
        '<%= dirs.dest%>/css/checkResultList/checkResultList.less',
        '<%= dirs.dest%>/css/mineInfo/mineInfo.less',
        '<%= dirs.dest%>/css/checkResultDetail/checkResultDetail.less',
        '<%= dirs.dest%>/css/unjudged/unjudged.less',
        '<%= dirs.dest%>/css/fudou/fudou.less',
        '<%= dirs.dest%>/css/notice/notice.less',
        '<%= dirs.dest%>/css/noticeDetail/noticeDetail.less',
        '<%= dirs.dest%>/css/publishTrip/publishTrip.less',
        '<%= dirs.dest%>/css/publishCheck/publishCheck.less',
        '<%= dirs.dest%>/css/publishReward/publishReward.less',
        '<%= dirs.dest%>/css/agreement/agreement.less'
      ]
    },
    copy: {
      main: {
        expand: true,
        cwd: '<%= dirs.src%>/img/',
        src: '**',
        dest: '<%= dirs.dest%>/img/'
      }
    },
    // uglify: {
    //   options: {
    //     banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
    //   },
    //   build: {
    //     src: 'src/<%= pkg.name %>.js',
    //     dest: 'build/<%= pkg.name %>.min.js'
    //   }
    // },
    watch: {
      src: {
        files: ['<%= dirs.src%>/**'],
        tasks: ['concat', 'less', 'copy', 'clean'],
      }
    },

    sprite: {
      allslice: {
        files: [{
          //启用动态扩展
          expand: true,
          // css文件源的文件夹
          cwd: '<%= dirs.dest%>/css/index/index2',
          // 匹配规则
          src: ['*.css'],
          //导出css和sprite的路径地址
          dest: '<%= dirs.dest%>/css/index/index2/tmp/',
          // 导出的css名
          ext: '.sprite.css'
        }],
        options: {
          // 默认使用GM图像处理引擎
          'engine': 'gm',
          // 默认使用二叉树最优排列算法
          'algorithm': 'binary-tree',
          // 给雪碧图追加时间戳，默认不追加
          'imagestamp': false,
          // 给样式文件追加时间戳，默认不追加
          'cssstamp': true,
          // 是否以时间戳为文件名生成新的雪碧图文件，默认不生成新文件
          'newsprite': true

        }
      }
    }


  });

  grunt.loadNpmTasks('grunt-sprite');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');


  // Default task(s).
  grunt.registerTask('default', ['concat', 'less', 'copy', 'sprite', 'watch', 'clean']);

};