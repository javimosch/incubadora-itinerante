module.exports = {
	getArticles: async function() {
		var path = require('path')
		var sander = require('sander')
		let files = await sander.readdir(path.join(process.cwd(), 'src', 'proyectos-visitados'));
		files = await Promise.all(files.map(fileName => {
			if (fileName.indexOf('.js') !== -1) {
				return (async() => {
					var config = require(path.join(process.cwd(), 'src', 'proyectos-visitados', fileName));
					config.internalId = fileName.split('.')[0];
					return config;
				})();
			} else {
				return (async() => {
					let raw = await sander.readFile(path.join(process.cwd(), 'src', 'proyectos-visitados', fileName))
					return {
						internalId: fileName.split('.')[0],
						type: 'content',
						contents: raw.toString('utf-8')
					}
				})();
			}
		}));
		var articles = files.filter(f => f.type !== 'content')
		articles = articles.map(singleArticle => {
			singleArticle.html = files.find(f => f.internalId == singleArticle.internalId && f.type === 'content').contents;
			singleArticle.publicUrl = singleArticle.publicUrl || `/${singleArticle.name}`
			singleArticle.metaTitle = singleArticle.metaTitle || singleArticle.title;
			return singleArticle;
		});
		articles = articles.filter(i => !i.draft)
		articles = articles.reverse()
		articles = articles.sort(function(a, b) {
			return (a.order && a.order || 99) <= (b.order && b.order || 99) ? -1 : 1
		})
		return articles;
	}
}