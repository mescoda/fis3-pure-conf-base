
// 模块化
// npm install -g fis3-hook-commonjs
fis.hook('commonjs', {
    tab: 4,
    ignoreDependencies: [
        '/static/dep/**'
    ]
});

// 解决纯前端项目中的资源加载，帮助在输出的 html 中包含有序的 <script> tag
fis.match('::package', {
    // npm install -g fis3-postpackager-loader
    // 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
    postpackager: fis.plugin('loader', {
        resourceType: 'mod'
    })
});


var sets = {
    'namespace': '',
    'static': 'static',
    'template': 'template',
    'project.ignore': [
        '/fis-conf.js',
        '/fis-conf-base.js',
        '/fis-conf/**',
        '/output/**',
        '/README.md',
        '/.fecsrc',
        '/.eslintrc.yaml'
    ]
};

fis.util.map(sets, function (key, value) {
    fis.set(key, value);
});

var baseMatchRules = {

    '*': {
        useSameNameRequire: true,
        release: '/${static}/${namespace}/$0'
    },


    // page 中默认的都进 static
    // 但是在模板中的 url 都是相对路径，方便本地预览
    '/page/(**)': {
        release: '/${namespace}/${static}/page/$1',
        url: './${static}/page/$1'
    },

    // page 中的 html 发布到根路径
    '/page/**/(*.html)': {
        release: '/${namespace}/$1'
    },

    '/static/(**)': {
        release: '/${namespace}/${static}/$1',
        url: './${static}/$1'
    },

    '/static/dep/**.js': {
        ignoreDependencies: true
    },


    '/widget/(**)': {
        release: '/${namespace}/${static}/widget/$1',
        url: './${static}/widget/$1'
    },

    '/widget/**.js': {
        isMod: true
    },

    // 默认 /widget 中的 image 静态文件都是在 CSS 中引用，所以编译为相对 CSS 路径
    '/widget/(**)/(*.{jpg,jpeg,png,gif,bmp,svg})': {
        url: './$2'
    },

    // 编译后 js 中的 sourcemap 路径都用相对的，方便在不同环境下都能用
    '(/**/(*.map))': {
        url: './$2'
    },

    // less to css
    // npm install -g fis-parser-less-2.x
    '/**.less': {
        parser: fis.plugin('less-2.x', {
            // fis-parser-less-2.x option
        }),
        rExt: '.css'
    },

    // npm install -g fis-parser-babel-5.x
    '/**.{es,jsx}': {
        parser: fis.plugin('babel-5.x', {
            sourceMaps: true
        }),
        // make sure jsx file is wrap by define, to make babel moduel works
        isMod: true,
        rExt: '.js'
    },

    '/page/**.{es,jsx}': {
        isMod: false
    },

    '/**.html:js': {
        parser: fis.plugin('babel-5.x', {
            sourceMaps: true
        })
    },

    // npm install -g fis3-parser-typescript
    '/**.{ts,tsx}': {
        parser: fis.plugin('typescript', {
            sourceMaps: true
        }),
        // isMod: true,
        rExt: '.js'
    }

};

fis.util.map(baseMatchRules, function (selector, rules) {
    fis.match(selector, rules);
});

fis.media('prod')
// fis
    /*.match('::package', {
        packager: fis.plugin('map', packConfig)
    })*/
    .match('/**.{less,css}', {
        useHash: true,
        optimizer: fis.plugin('clean-css')
    })
    .match('/**.{js,es6,jsx}', {
        useHash: true,
        optimizer: fis.plugin('uglify-js')
    })
    .match('/**.html:js', {
        optimizer: fis.plugin('uglify-js')
    });
