# Obsidian Documentation Generator Plugin

This plugin will at some point be able to create documentation for your code from javadoc style comments.

# Under Construction
**This plugin is not yet finished. Once there is a working version you will find in under the releases here on GitHub.**

### What Language does this work for?
**Every!**

(Well almost) As long as the language is **not** indentation based (sorry python).
On top of that the language must support this style of comments:
```
/**
* This is a doc-comment
* @annotation value description
*/
some variable or method
```

The **language independence** is achieved by only parsing the doc-comments and not code.  

### Wait, how can this generate usefull documentation by only parsing the doc-comments?
This is made possible by annotations.

Here is a list of annotations supported by this plugin.

TODO: List here

All other annotations on a comment will also appear in the generated documentation as a table.


### Problems, unexpected behavior or improvement suggestions?
You are more than welcome to open an issue on [GitHub](https://github.com/mProjectsCode/obsidian-doc-gen-plugin/issues).

### Contributions
Thank you for wanting to contribute to this project.

Contributions are always welcome. If you have an idea, feel free to open a feature request under the issue tab or even create a pull request.

### Credits
Credits go to:
- https://github.com/liamcain/obsidian-periodic-notes for 99% of `Suggest.ts` and `FolderSuggest.ts`
