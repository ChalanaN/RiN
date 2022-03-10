/** Error codes used in {@link RiN} */
export const ERRORS = {
    COMPILER_NOT_READY: "Compiler is not ready yet, please listen for the 'ready' event",
    MAIN_VIEW_NOT_FOUND: "Couldn't find the main view of the app 😕",
    FILE_NOT_FOUND: "Couldn't find the file 👀",
    UNCAUGHT: "An uncaught error occurred 😟",
    Widgets: {
        File: {
            FILE_NOT_FOUND: "File accessed through the <File/> widget wasn't accessible."
        }
    }
};
/** Compiler defaults */
export const DEFAULTS = {
    /** Regular Expressions used to find tags */
    REGEXPS_FOR_TAGS: {
        settings: /(?:<!--|\/\*).*<Page\.(?<property>[\w\.]*)>(?<value>.*)<\/Page.[\w\.]*>.*(?:-->|\*\/)/g,
        appWidgets: /(?:<!--|\/\*).*<App\.(?<property>[\w\.]*)\/>.*(?:-->|\*\/)/g,
        functionalWidgets: /(?:<!--|\/\*).*<App\.(?<property>[\w\.]*)>(?<value>.*)<\/App.[\w\.]*>.*(?:-->|\*\/)/g,
        files: /(?:<!--|\/\*).*<File:(?<filepath>[\w\.\/]*)\/>.*(?:-->|\*\/)/g,
        imports: /(?:<!--|\/\*).*@Import (?<type>JS|CSS) \((?<src>.*)\).*(?:-->|\*\/)/g,
        components: /(?:<!--|\/\*).*<(?<name>[\w\.]*)(?<attributes>.*)\/>.*(?:-->|\*\/)/g,
        componentWidgets: /(?:<!--|\/\*).*<Component\.(?<property>[\w\.]*)\/>.*(?:-->|\*\/)/g,
        componentFunctionalWidgets: /(?:<!--|\/\*).*<Component\.(?<property>[\w\.]*)>(?<value>.*)<\/Component.[\w\.]*>.*(?:-->|\*\/)/g,
    },
    /** Defaults for options of {@link RiNCompiler} */
    COMPILER_OPTIONS: {
        title: "Untitled",
        minify: true,
        appWidgets: {},
        functionalWidgets: { Run: (v, App) => eval(v) },
        CacheMaxAge: 60000
    }
};
//# sourceMappingURL=common.js.map